import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { agriService, type ForecastRow } from "../services/agri.service";

const ForecastAdminPage = () => {
  const [rows, setRows] = useState<ForecastRow[]>([]);
  const load = async () => setRows((await agriService.allForecasts()).forecasts);
  useEffect(() => { void load(); }, []);

  return (
    <>
      <PageHeader title="Prévisions de récolte" description="Planification des volumes annoncés." />
      <div className="card">
        {rows.map((row) => (
          <div key={row.id} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>
            <strong>{row.code}</strong> — {row.producerName} — {row.estimatedQuantityKg} kg — {row.expectedHarvestDate} — {row.status}
            {row.status === "PENDING" && (
              <span style={{ marginLeft: 12 }}>
                <button onClick={async () => { await agriService.setForecastStatus(row.id, "VALIDATED"); await load(); }}>Valider</button>
                <button onClick={async () => { await agriService.setForecastStatus(row.id, "REJECTED"); await load(); }}>Rejeter</button>
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ForecastAdminPage;
