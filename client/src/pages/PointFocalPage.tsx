import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { agriService, type ForecastRow, type ProducerMini } from "../services/agri.service";

const PointFocalPage = () => {
  const [producers, setProducers] = useState<ProducerMini[]>([]);
  const [forecasts, setForecasts] = useState<ForecastRow[]>([]);
  const [message, setMessage] = useState("");
  const [producerForm, setProducerForm] = useState({
    fullName: "", phone: "", commune: "", fokontany: "", cooperative: "Tantsaha Miombona"
  });
  const [forecastForm, setForecastForm] = useState({ producerId: "", quantity: "", date: "", notes: "" });

  const load = async () => {
    const [p, f] = await Promise.all([agriService.pointFocalProducers(), agriService.pointFocalForecasts()]);
    setProducers(p.producers);
    setForecasts(f.forecasts);
  };

  useEffect(() => { void load(); }, []);

  const addProducer = async (e: React.FormEvent) => {
    e.preventDefault();
    await agriService.createPointFocalProducer(producerForm);
    setProducerForm({ fullName: "", phone: "", commune: "", fokontany: "", cooperative: "Tantsaha Miombona" });
    setMessage("Producteur ajouté.");
    await load();
  };

  const addForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    await agriService.addPointFocalForecast({
      producerId: Number(forecastForm.producerId),
      estimatedQuantityKg: Number(forecastForm.quantity),
      expectedHarvestDate: forecastForm.date,
      notes: forecastForm.notes
    });
    setForecastForm({ producerId: "", quantity: "", date: "", notes: "" });
    setMessage("Prévision ajoutée.");
    await load();
  };

  return (
    <>
      <PageHeader title="Espace point focal" description="Gestion des producteurs rattachés et de leurs prévisions." />
      {message && <div className="card">{message}</div>}

      <div className="dashboard-grid-two">
        <form className="card" onSubmit={addProducer}>
          <h3>Nouveau producteur</h3>
          <input required placeholder="Nom complet" value={producerForm.fullName} onChange={(e) => setProducerForm({ ...producerForm, fullName: e.target.value })} />
          <input placeholder="Téléphone" value={producerForm.phone} onChange={(e) => setProducerForm({ ...producerForm, phone: e.target.value })} />
          <input required placeholder="Commune" value={producerForm.commune} onChange={(e) => setProducerForm({ ...producerForm, commune: e.target.value })} />
          <input placeholder="Fokontany" value={producerForm.fokontany} onChange={(e) => setProducerForm({ ...producerForm, fokontany: e.target.value })} />
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>

        <form className="card" onSubmit={addForecast}>
          <h3>Prévision producteur</h3>
          <select required value={forecastForm.producerId} onChange={(e) => setForecastForm({ ...forecastForm, producerId: e.target.value })}>
            <option value="">Sélectionner</option>
            {producers.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.fullName}</option>)}
          </select>
          <input required type="number" min="1" placeholder="Quantité kg" value={forecastForm.quantity} onChange={(e) => setForecastForm({ ...forecastForm, quantity: e.target.value })} />
          <input required type="date" value={forecastForm.date} onChange={(e) => setForecastForm({ ...forecastForm, date: e.target.value })} />
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Prévisions enregistrées</h3>
        {forecasts.map((row) => (
          <div key={row.id}>{row.producerName} — {row.estimatedQuantityKg} kg — {row.expectedHarvestDate} — {row.status}</div>
        ))}
      </div>
    </>
  );
};

export default PointFocalPage;
