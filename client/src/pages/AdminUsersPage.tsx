import {
  useEffect,
  useState
} from "react";

import PageHeader
  from "../components/layout/PageHeader";

import {
  adminUsersService,
  type AdminUserRow,
  type AuditRow
} from "../services/admin-users.service";

import type {
  UserRole
} from "../types/user";

import "../styles/admin-users.css";

const AdminUsersPage = () => {
  const [users, setUsers] =
    useState<
      AdminUserRow[]
    >([]);

  const [roles, setRoles] =
    useState<
      UserRole[]
    >([]);

  const [audit, setAudit] =
    useState<
      AuditRow[]
    >([]);

  const [form, setForm] =
    useState({
      fullName: "",
      username: "",
      phone: "",
      role:
        "GESTIONNAIRE" as
          UserRole
    });

  const [temporaryPassword,
    setTemporaryPassword] =
      useState("");

  const [message, setMessage] =
    useState("");

  const load = async () => {
    const [u, a] =
      await Promise.all([
        adminUsersService.list(),
        adminUsersService.audit()
      ]);

    setUsers(u.users);
    setRoles(u.roles);
    setAudit(a.logs);
  };

  useEffect(() => {
    void load();
  }, []);

  const createUser =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();

      try {
        const result =
          await adminUsersService
            .create(form);

        setTemporaryPassword(
          result.temporaryPassword
        );

        setMessage(
          "Utilisateur créé. Communiquez le mot de passe temporaire directement à l'utilisateur."
        );

        setForm({
          fullName: "",
          username: "",
          phone: "",
          role:
            "GESTIONNAIRE"
        });

        await load();
      } catch (err) {
        setMessage(
          err instanceof Error
            ? err.message
            : "Création impossible."
        );
      }
    };

  const saveUser =
    async (
      row: AdminUserRow
    ) => {
      try {
        await adminUsersService
          .update(
            row.id,
            {
              fullName:
                row.fullName,
              phone:
                row.phone || "",
              role: row.role,
              active:
                row.active
            }
          );

        setMessage(
          "Utilisateur mis à jour."
        );

        await load();
      } catch (err) {
        setMessage(
          err instanceof Error
            ? err.message
            : "Mise à jour impossible."
        );
      }
    };

  const patchLocal = (
    id: number,
    patch:
      Partial<AdminUserRow>
  ) => {
    setUsers(
      users.map(
        (row) =>
          row.id === id
            ? {
                ...row,
                ...patch
              }
            : row
      )
    );
  };

  const resetPassword =
    async (id: number) => {
      if (
        !window.confirm(
          "Réinitialiser le mot de passe de cet utilisateur ?"
        )
      ) {
        return;
      }

      const result =
        await adminUsersService
          .resetPassword(id);

      setTemporaryPassword(
        result.temporaryPassword
      );

      setMessage(
        "Mot de passe temporaire généré."
      );

      await load();
    };

  return (
    <>
      <PageHeader
        title="Gestion des utilisateurs"
        description="Création, rôles, activation, sécurité et journal des comptes."
      />

      {message && (
        <div className="admin-users-message">
          {message}
        </div>
      )}

      {temporaryPassword && (
        <div className="admin-users-temp">
          <strong>
            Mot de passe temporaire
          </strong>

          <code>
            {temporaryPassword}
          </code>

          <span>
            Il doit être changé à la prochaine connexion.
          </span>
        </div>
      )}

      <div className="dashboard-grid-two">
        <form
          className="card admin-users-form"
          onSubmit={createUser}
        >
          <h3>
            Nouvel utilisateur
          </h3>

          <label>
            Nom complet
          </label>
          <input
            required
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName:
                  e.target.value
              })
            }
          />

          <label>
            Identifiant
          </label>
          <input
            required
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username:
                  e.target.value
              })
            }
          />

          <label>
            Téléphone
          </label>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value
              })
            }
          />

          <label>
            Rôle
          </label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value as
                    UserRole
              })
            }
          >
            {roles.map(
              (role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              )
            )}
          </select>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Créer
          </button>
        </form>

        <div className="card">
          <h3>
            Règles de sécurité
          </h3>

          <ul>
            <li>
              Aucun mot de passe n'est stocké en clair.
            </li>
            <li>
              Un nouveau compte créé par ADMIN reçoit un mot de passe temporaire.
            </li>
            <li>
              Le changement de mot de passe est obligatoire.
            </li>
            <li>
              Le dernier ADMIN actif ne peut pas être désactivé.
            </li>
            <li>
              Un ADMIN ne peut pas désactiver son propre compte.
            </li>
          </ul>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: 16
        }}
      >
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Actif</th>
                <th>Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(
                (row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        value={row.fullName}
                        onChange={(e) =>
                          patchLocal(
                            row.id,
                            {
                              fullName:
                                e.target.value
                            }
                          )
                        }
                      />
                      <small>
                        {row.username}
                      </small>
                    </td>

                    <td>
                      <select
                        value={row.role}
                        onChange={(e) =>
                          patchLocal(
                            row.id,
                            {
                              role:
                                e.target.value as
                                  UserRole
                            }
                          )
                        }
                      >
                        {roles.map(
                          (role) => (
                            <option
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <select
                        value={row.active}
                        onChange={(e) =>
                          patchLocal(
                            row.id,
                            {
                              active:
                                Number(
                                  e.target.value
                                )
                            }
                          )
                        }
                      >
                        <option value={1}>
                          Oui
                        </option>
                        <option value={0}>
                          Non
                        </option>
                      </select>
                    </td>

                    <td>
                      {row.lastLoginAt ||
                        "Jamais"}
                      {row.lockedUntil && (
                        <div>
                          Verrouillé jusqu'à {
                            row.lockedUntil
                          }
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="admin-users-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            saveUser(row)
                          }
                        >
                          Enregistrer
                        </button>

                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            resetPassword(
                              row.id
                            )
                          }
                        >
                          Réinitialiser MDP
                        </button>

                        {row.lockedUntil && (
                          <button
                            type="button"
                            className="btn"
                            onClick={async () => {
                              await adminUsersService
                                .unlock(row.id);
                              await load();
                            }}
                          >
                            Déverrouiller
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: 16
        }}
      >
        <h3>
          Journal des comptes
        </h3>

        <div className="admin-users-audit">
          {audit.map(
            (row) => (
              <div key={row.id}>
                <strong>
                  {row.action}
                </strong>
                <span>
                  {row.createdAt}
                  {row.actorName
                    ? ` — par ${row.actorName}`
                    : ""}
                  {row.targetName
                    ? ` — cible ${row.targetName}`
                    : ""}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUsersPage;
