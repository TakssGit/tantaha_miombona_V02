import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { platformRequest } from "../services/platform-api";

type Registration = {
  id: number;
  username: string;
  fullName: string;
  phone: string | null;
  requestedRole: string;
  approvalStatus: string;
  active: number;
  createdAt: string;
};

const RegistrationAdminPage = () => {
  const [rows, setRows] = useState<Registration[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    const result = await platformRequest<{ success: boolean; registrations: Registration[] }>(
      "/admin/registrations",
      { authenticated: true }
    );
    setRows(result.registrations);
  };

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."));
  }, []);

  const action = async (id: number, mode: "approve" | "reject") => {
    await platformRequest(`/admin/registrations/${id}/${mode}`, {
      method: "PATCH",
      authenticated: true
    });
    await load();
  };

  return (
    <>
      <PageHeader title="Demandes de compte" description="Validation des inscriptions Producteur et Distributeur." />
      {error && <div className="card">{error}</div>}
      <div className="card">
        <table style={{ width: "100%" }}>
          <thead>
            <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.fullName}</td>
                <td>{row.username}</td>
                <td>{row.requestedRole}</td>
                <td>{row.approvalStatus}</td>
                <td>
                  {row.approvalStatus === "PENDING" && (
                    <>
                      <button type="button" onClick={() => action(row.id, "approve")}>Approuver</button>
                      <button type="button" onClick={() => action(row.id, "reject")}>Rejeter</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RegistrationAdminPage;
