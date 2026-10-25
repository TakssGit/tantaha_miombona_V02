import {
  platformRequest
} from "./platform-api";

import type {
  UserRole
} from "../types/user";

export type AdminUserRow = {
  id: number;
  username: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  active: number;
  approvalStatus: string;
  mustChangePassword: number;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string | null;
};

export type AuditRow = {
  id: number;
  action: string;
  details: string | null;
  createdAt: string;
  actorName: string | null;
  targetName: string | null;
};

export const adminUsersService = {
  list() {
    return platformRequest<{
      success: boolean;
      users: AdminUserRow[];
      roles: UserRole[];
    }>(
      "/admin/users",
      {
        authenticated: true
      }
    );
  },

  create(payload: {
    fullName: string;
    username: string;
    phone: string;
    role: UserRole;
  }) {
    return platformRequest<{
      success: boolean;
      message: string;
      userId: number;
      temporaryPassword:
        string;
    }>(
      "/admin/users",
      {
        method: "POST",
        authenticated: true,
        body: payload
      }
    );
  },

  update(
    id: number,
    payload: {
      fullName: string;
      phone: string;
      role: UserRole;
      active: number;
    }
  ) {
    return platformRequest(
      `/admin/users/${id}`,
      {
        method: "PATCH",
        authenticated: true,
        body: payload
      }
    );
  },

  resetPassword(id: number) {
    return platformRequest<{
      success: boolean;
      message: string;
      temporaryPassword:
        string;
    }>(
      `/admin/users/${id}/reset-password`,
      {
        method: "POST",
        authenticated: true
      }
    );
  },

  unlock(id: number) {
    return platformRequest(
      `/admin/users/${id}/unlock`,
      {
        method: "POST",
        authenticated: true
      }
    );
  },

  audit() {
    return platformRequest<{
      success: boolean;
      logs: AuditRow[];
    }>(
      "/admin/users/audit",
      {
        authenticated: true
      }
    );
  }
};
