import { BadgeCheck, CalendarDays, ClipboardCheck, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/v02-public.css";

const steps = [
  ["1. Créer un compte", "Demandez votre accès Producteur ou Point focal depuis la page d’inscription."],
  ["2. Préparer la demande", "Décrivez le produit, la quantité, la période et les caractéristiques techniques ou sanitaires."],
  ["3. Proposer la logistique", "Indiquez le mode de collecte, la plage de date souhaitée et le point d’envoi."],
  ["4. Soumettre la précommande", "L’administration ou le gestionnaire reçoit votre précommande d’approvisionnement."],
  ["5. Attendre la validation", "Après contrôle, la demande est validée, replanifiée ou mise en attente."],
] as const;

export default function PublicProducerGuidePage() {
  return <div className="v04-site">
    <header className="v04-header"><Link to="/">← Accueil</Link><strong>Tantsaha Miombona · Guide producteurs</strong><Link to="/login">Connexion</Link></header>
    <main className="v04-wrap">
      <section className="v04-hero">
        <div className="v04-hero-copy"><p className="v04-kicker">Approvisionnement</p><h1>Un guide plus clair pour les producteurs et les points focaux</h1><p>La page adopte le même langage visuel que l’accueil et le catalogue pour offrir une expérience cohérente sur toute l’application.</p><div className="v04-actions"><Link className="v04-primary" to="/register">Demander un compte</Link><Link to="/login">Se connecter</Link></div><div className="v04-points"><span><BadgeCheck size={15} /> Précommandes expliquées</span><span><BadgeCheck size={15} /> Illustrations cohérentes</span><span><BadgeCheck size={15} /> Accès métiers</span></div></div>
        <div className="v04-hero-media"><img src="/assets/illustrations/producer_delivery_guide.png" alt="Illustration de la préparation des précommandes" /></div>
      </section>

      <section className="v04-feature-row"><article className="v04-feature-card"><Users size={18} /><strong>Coordination</strong><p>Le point focal consolide les demandes et les disponibilités du terrain.</p></article><article className="v04-feature-card"><CalendarDays size={18} /><strong>Fenêtre d’envoi</strong><p>Une période et un planning sont proposés pour la collecte ou la livraison.</p></article><article className="v04-feature-card"><ClipboardCheck size={18} /><strong>Conformité</strong><p>Les caractéristiques techniques et sanitaires doivent être précisées.</p></article><article className="v04-feature-card"><Truck size={18} /><strong>Acheminement</strong><p>La logistique doit être connue avant la validation finale.</p></article></section>

      <section className="v04-guide-grid">{steps.map(([title, body]) => <article key={title} className="v04-guide-card"><h3>{title}</h3><p>{body}</p></article>)}</section>
    </main>
    <footer className="v04-footer">Guide producteurs harmonisé avec le nouveau design global.</footer>
  </div>;
}
