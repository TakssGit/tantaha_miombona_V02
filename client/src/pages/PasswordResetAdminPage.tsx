import {
  useEffect,
  useState
} from "react";

import PageHeader
  from "../components/layout/PageHeader";

import {
  securityService,
  type PasswordResetRow
} from "../services/security.service";

import "../styles/security-account.css";

const PasswordResetAdminPage =
  () => {
    const [rows, setRows] =
      useState<
        PasswordResetRow[]
      >([]);

    const [temporaryPassword,
      setTemporaryPassword] =
        useState("");

    const [message, setMessage] =
      useState("");

    const load = async () => {
      const result =
        await securityService
          .resetRequests();

      setRows(result.requests);
    };

    useEffect(() => {
      void load();
    }, []);

    const approve =
      async (id: number) => {
        const result =
          await securityService
            .approveReset(id);

        setTemporaryPassword(
          result.temporaryPassword
        );

        setMessage(
          "Communiquez ce mot de passe temporaire directement à l'utilisateur. Il ne sera affiché qu'ici."
        );

        await load();
      };

    const reject =
      async (id: number) => {
        await securityService
          .rejectReset(id);

        await load();
      };

    return (
      <>
        <PageHeader
          title="Réinitialisations de mot de passe"
          description="Traitement local et sécurisé des demandes de récupération."
        />

        {temporaryPassword && (
          <div className="security-temp-box">
            <strong>
              Mot de passe temporaire
            </strong>

            <code>
              {temporaryPassword}
            </code>

            <span>
              {message}
            </span>
          </div>
        )}

        <div className="card">
          <table className="security-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (row) => (
                  <tr key={row.id}>
                    <td>
                      {row.fullName}
                      <br />
                      <small>
                        {row.username}
                      </small>
                    </td>

                    <td>
                      {row.role}
                    </td>

                    <td>
                      {row.requestedAt}
                    </td>

                    <td>
                      {row.status}
                    </td>

                    <td>
                      {row.status ===
                        "PENDING" && (
                        <div className="security-actions">
                          <button
                            type="button"
                            className="security-btn security-btn-primary"
                            onClick={() =>
                              approve(row.id)
                            }
                          >
                            Réinitialiser
                          </button>

                          <button
                            type="button"
                            className="security-btn"
                            onClick={() =>
                              reject(row.id)
                            }
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

export default PasswordResetAdminPage;
