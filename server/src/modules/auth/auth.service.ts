import db
  from "../../database/database.js";

import {
  comparePassword
} from "../../utils/password.js";

import {
  createToken
} from "../../utils/jwt.js";

interface UserRow {
  id: number;
  username: string;
  fullName: string;
  passwordHash: string;
  role: string;
  active: number;
  approvalStatus: string;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  mustChangePassword: number;
}

const logSecurityEvent = (
  userId: number | null,
  username: string,
  eventType: string,
  details?: string
) => {
  db.prepare(`
    INSERT INTO security_events (
      user_id,
      username,
      event_type,
      details
    )
    VALUES (?, ?, ?, ?)
  `).run(
    userId,
    username,
    eventType,
    details || null
  );
};

export const login = async (
  username: string,
  password: string
) => {
  const user =
    db.prepare(`
      SELECT
        u.id,
        u.username,
        u.full_name AS fullName,
        u.password_hash AS passwordHash,
        r.code AS role,
        u.active,
        COALESCE(
          u.approval_status,
          'APPROVED'
        ) AS approvalStatus,
        COALESCE(
          u.failed_login_attempts,
          0
        ) AS failedLoginAttempts,
        u.locked_until AS lockedUntil,
        COALESCE(
          u.must_change_password,
          0
        ) AS mustChangePassword
      FROM users u
      INNER JOIN roles r
        ON r.id = u.role_id
      WHERE LOWER(u.username)
        = LOWER(?)
    `).get(
      username
    ) as
      | UserRow
      | undefined;

  if (!user) {
    logSecurityEvent(
      null,
      username,
      "LOGIN_FAILED",
      "Unknown username"
    );
    return null;
  }

  if (
    user.active !== 1 ||
    user.approvalStatus !==
      "APPROVED"
  ) {
    logSecurityEvent(
      user.id,
      user.username,
      "LOGIN_BLOCKED",
      "Inactive or unapproved account"
    );
    return null;
  }

  if (user.lockedUntil) {
    const lockedUntil =
      new Date(
        user.lockedUntil
      ).getTime();

    if (
      Number.isFinite(
        lockedUntil
      ) &&
      lockedUntil > Date.now()
    ) {
      logSecurityEvent(
        user.id,
        user.username,
        "LOGIN_LOCKED",
        "Account temporarily locked"
      );
      return null;
    }
  }

  const valid =
    await comparePassword(
      password,
      user.passwordHash
    );

  if (!valid) {
    const attempts =
      user.failedLoginAttempts +
      1;

    const shouldLock =
      attempts >= 5;

    const lockedUntil =
      shouldLock
        ? new Date(
            Date.now() +
              15 * 60 * 1000
          ).toISOString()
        : null;

    db.prepare(`
      UPDATE users
      SET
        failed_login_attempts = ?,
        locked_until = ?
      WHERE id = ?
    `).run(
      attempts,
      lockedUntil,
      user.id
    );

    logSecurityEvent(
      user.id,
      user.username,
      shouldLock
        ? "ACCOUNT_LOCKED"
        : "LOGIN_FAILED",
      `Attempts: ${attempts}`
    );

    return null;
  }

  db.prepare(`
    UPDATE users
    SET
      failed_login_attempts = 0,
      locked_until = NULL,
      last_login_at =
        CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(user.id);

  const mustChangePassword =
    user.mustChangePassword === 1;

  const token =
    createToken({
      id: user.id,
      username:
        user.username,
      fullName:
        user.fullName,
      role:
        user.role,
      mustChangePassword
    });

  logSecurityEvent(
    user.id,
    user.username,
    "LOGIN_SUCCESS"
  );

  return {
    token,
    user: {
      id: String(user.id),
      username:
        user.username,
      fullName:
        user.fullName,
      role:
        user.role,
      active: true,
      mustChangePassword
    }
  };
};
