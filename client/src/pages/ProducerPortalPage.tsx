import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { agriService, type ForecastRow, type ProducerMini } from "../services/agri.service";

const ProducerPortalPage = () => {
  const [producer, setProducer] = useState<ProducerMini | null>(null);
  const [forecasts, setForecasts] = useState<ForecastRow[]>([]);
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [p, f] = await Promise.all([agriService.producerMe(), agriService.producerForecasts()]);
    setProducer(p.producer);
    setForecasts(f.forecasts);
  };

  useEffect(() => {
    void load().catch((err) => setMessage(err instanceof Error ? err.message : "Chargement impossible."));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await agriService.addProducerForecast({
      estimatedQuantityKg: Number(quantity),
      expectedHarvestDate: date,
      notes
    });
    setQuantity(""); setDate(""); setNotes("");
    setMessage("Prévision enregistrée.");
    await load();
  };

  return (
    <>
      <PageHeader title="Mon espace producteur" description="Prévisions de récolte et suivi de mes déclarations." />
      {message && <div className="card">{message}</div>}
      {producer && <div className="card"><strong>{producer.code} — {producer.fullName}</strong><div>{producer.commune}</div></div>}

      <div className="dashboard-grid-two" style={{ marginTop: 16 }}>
        <form className="card" onSubmit={submit}>
          <h3>Nouvelle prévision</h3>
          <label>Quantité estimée (kg)</label>
          <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <label>Date prévue</label>
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <label>Observation</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </form>

        <div className="card">
          <h3>Mes prévisions</h3>
          {forecasts.map((row) => (
            <div key={row.id} style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
              <strong>{row.code}</strong>
              <div>{row.estimatedQuantityKg} kg — {row.expectedHarvestDate}</div>
              <small>{row.status}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProducerPortalPage;
