import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Leaf, LockKeyhole, Phone, ShieldCheck, Store, Tractor, UserRound, Users } from "lucide-react";
import { platformRequest } from "../services/platform-api";
import "../styles/v02-registration.css";

type RegistrationForm = {
  fullName: string;
  username: string;
  phone: string;
  role: "PRODUCTEUR" | "DISTRIBUTEUR";
  password: string;
  confirmPassword: string;
};

const blank: RegistrationForm = { fullName: "", username: "", phone: "", role: "PRODUCTEUR", password: "", confirmPassword: "" };

function RoleCard({ active, icon, title, text, onClick }: { active: boolean; icon: React.ReactNode; title: string; text: string; onClick: () => void; }) {
  return <button type="button" className={`reg-role-card${active ? " active" : ""}`} onClick={onClick}><div className="reg-role-icon">{icon}</div><strong>{title}</strong><span>{text}</span></button>;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegistrationForm>(blank);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const change = (key: keyof RegistrationForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.password !== form.confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (form.password.length < 8) { setError("Choisissez un mot de passe d’au moins 8 caractères."); return; }
    setLoading(true);
    try {
      const result = await platformRequest<{ success: boolean; message: string }>("/auth/register", { method: "POST", body: { fullName: form.fullName, username: form.username, phone: form.phone, role: form.role, password: form.password } });
      setMessage(result.message || "Votre demande a été envoyée avec succès.");
      setForm(blank);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="reg-page">
    <header className="reg-topbar">
      <Link to="/" className="reg-brand"><span><Leaf size={17} /></span><div><strong>Tantsaha Miombona</strong><small>Créer votre espace</small></div></Link>
      <div className="reg-topbar-actions"><Link to="/catalogue">Catalogue</Link><Link className="reg-login-link" to="/login">Déjà inscrit ? Se connecter</Link></div>
    </header>

    <section className="reg-shell">
      <aside className="reg-visual-panel">
        <div className="reg-visual-tag"><ShieldCheck size={16} /> Inscription sécurisée et validée</div>
        <h1>Créer un compte professionnel</h1>
        <p>Rejoignez la plateforme pour proposer vos produits ou commander les produits finis disponibles. Les demandes sont validées par l’administration.</p>
        <div className="reg-visual-highlights"><span><CheckCircle2 size={16} /> Suivi de la demande</span><span><CheckCircle2 size={16} /> Accès adapté au rôle</span><span><CheckCircle2 size={16} /> Design cohérent avec le site</span></div>
        <img src="/assets/illustrations/inscription_acteurs.png" alt="Illustration de la création de compte" />
        <div className="reg-stat-row"><div><strong>2</strong><span>types de compte publics</span></div><div><strong>100%</strong><span>responsive</span></div><div><strong>1</strong><span>validation admin</span></div></div>
      </aside>

      <section className="reg-form-panel">
        <div className="reg-heading"><p>Bienvenue</p><h2>Créer un compte</h2><span>Choisissez votre profil puis complétez les informations demandées.</span></div>

        <div className="reg-role-grid">
          <RoleCard active={form.role === "PRODUCTEUR"} icon={<Tractor size={18} />} title="Producteur" text="Pour proposer une précommande d’approvisionnement." onClick={() => change("role", "PRODUCTEUR")} />
          <RoleCard active={form.role === "DISTRIBUTEUR"} icon={<Store size={18} />} title="Distributeur" text="Pour consulter le catalogue et demander des commandes." onClick={() => change("role", "DISTRIBUTEUR")} />
        </div>

        {message && <div className="reg-alert success" role="status"><CheckCircle2 size={17} /> {message}</div>}
        {error && <div className="reg-alert error" role="alert">{error}</div>}

        <form className="reg-form" onSubmit={submit}>
          <label><span><UserRound size={14} /> Nom complet</span><input required autoComplete="name" value={form.fullName} onChange={(e) => change("fullName", e.target.value)} placeholder="Votre nom complet" /></label>
          <label><span><UserRound size={14} /> Identifiant</span><input required autoComplete="username" value={form.username} onChange={(e) => change("username", e.target.value)} placeholder="Ex. jean.randria" /></label>
          <label><span><Phone size={14} /> Téléphone</span><input autoComplete="tel" value={form.phone} onChange={(e) => change("phone", e.target.value)} placeholder="Ex. +261 ..." /></label>
          <label><span><Users size={14} /> Type de compte</span><select value={form.role} onChange={(e) => change("role", e.target.value as RegistrationForm["role"])}><option value="PRODUCTEUR">Producteur</option><option value="DISTRIBUTEUR">Distributeur</option></select></label>
          <label><span><LockKeyhole size={14} /> Mot de passe</span><input required type="password" autoComplete="new-password" value={form.password} onChange={(e) => change("password", e.target.value)} placeholder="Au moins 8 caractères" /></label>
          <label><span><LockKeyhole size={14} /> Confirmer le mot de passe</span><input required type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => change("confirmPassword", e.target.value)} placeholder="Retapez le mot de passe" /></label>
          <div className="reg-note">Les comptes Producteur et Distributeur doivent être validés par un administrateur avant activation.</div>
          <button disabled={loading} type="submit">{loading ? "Envoi en cours..." : "Créer ma demande"} <ArrowRight size={16} /></button>
        </form>
        <div className="reg-bottom-links"><Link to="/login">Déjà inscrit ? Se connecter</Link><Link to="/catalogue">Découvrir le catalogue</Link></div>
      </section>
    </section>
  </main>;
}
