import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { agriService, type ProducerMini } from "../services/agri.service";

type Data = {
  users: Array<{ id: number; username: string; fullName: string; producerId: number | null }>;
  producers: ProducerMini[];
  pointFocals: Array<{ id: number; fullName: string }>;
};

const ProducerAccessAdminPage = () => {
  const [data, setData] = useState<Data | null>(null);
  const [userId, setUserId] = useState("");
  const [producerId, setProducerId] = useState("");
  const [pointFocalUserId, setPointFocalUserId] = useState("");
  const [pfProducerId, setPfProducerId] = useState("");

  const load = async () => setData(await agriService.adminAccessData());
  useEffect(() => { void load(); }, []);
  if (!data) return <div>Chargement...</div>;

  return (
    <>
      <PageHeader title="Accès producteurs" description="Lier comptes producteurs et affecter les producteurs aux points focaux." />
      <div className="dashboard-grid-two">
        <div className="card">
          <h3>Lier un compte Producteur</h3>
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Compte</option>
            {data.users.map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.username}</option>)}
          </select>
          <select value={producerId} onChange={(e) => setProducerId(e.target.value)}>
            <option value="">Producteur</option>
            {data.producers.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.fullName}</option>)}
          </select>
          <button onClick={async () => { await agriService.linkProducerUser(Number(userId), Number(producerId)); await load(); }}>Lier</button>
        </div>

        <div className="card">
          <h3>Affecter à un point focal</h3>
          <select value={pointFocalUserId} onChange={(e) => setPointFocalUserId(e.target.value)}>
            <option value="">Point focal</option>
            {data.pointFocals.map((pf) => <option key={pf.id} value={pf.id}>{pf.fullName}</option>)}
          </select>
          <select value={pfProducerId} onChange={(e) => setPfProducerId(e.target.value)}>
            <option value="">Producteur</option>
            {data.producers.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.fullName}</option>)}
          </select>
          <button onClick={() => agriService.assignPointFocal(Number(pointFocalUserId), Number(pfProducerId))}>Affecter</button>
        </div>
      </div>
    </>
  );
};

export default ProducerAccessAdminPage;
