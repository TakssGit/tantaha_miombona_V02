import Tm29ContactSection from '../components/tm29/Tm29ContactSection';
import Tm29PresentationExpansion from '../components/tm29/Tm29PresentationExpansion';
import { ArrowRight, BadgeCheck, Factory, Leaf, ShieldCheck, ShoppingBasket, Sprout, Tractor, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicCatalogSection from "../components/public/PublicCatalogSection";
import "../styles/public-home.css";

function MetricCard({ value, label }: { value: string; label: string }) {
  return <div className="tm-metric-card"><strong>{value}</strong><span>{label}</span></div>;
}

function ProcessCard({ imageClass, icon, title, text }: { imageClass: string; icon: React.ReactNode; title: string; text: string }) {
  return <article className="tm-process-card"><div className={`tm-process-image ${imageClass}`} /><div className="tm-chip-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>;
}

export default function HomePage() {
  return (
    <div className="tm-public-site">
      <header className="tm-topbar">
        <div className="tm-container tm-topbar-inner">
          <div className="tm-brand"><div className="tm-brand-mark"><Leaf size={18} /></div><div><strong>Tantsaha Miombona</strong><span>Transformation & commerce local</span></div></div>
          <nav className="tm-main-nav"><a href="#presentation">Présentation</a><a href="#processus">Processus</a><a href="#produits">Produits</a><a href="#qualite">Qualité</a></nav>
          <div className="tm-topbar-actions"><Link className="tm-btn tm-btn-ghost" to="/login">Connexion</Link><Link className="tm-btn tm-btn-primary" to="/register">Créer un compte</Link></div>
        </div>
      </header>

      <main>
        <section className="tm-hero-section">
          <div className="tm-container tm-hero-grid">
            <div className="tm-hero-copy">
              <div className="tm-badge-pill"><Sprout size={14} /> Plateforme agricole et commerciale</div>
              <h1>Des produits locaux transformés, stockés et revendus avec une image plus professionnelle.</h1>
              <p>Tantsaha Miombona connecte producteurs, points focaux, unité de transformation et distributeurs dans un parcours clair, visuel et prêt pour un usage professionnel.</p>
              <div className="tm-hero-actions"><Link className="tm-btn tm-btn-primary" to="/catalogue">Voir le catalogue <ArrowRight size={16} /></Link><Link className="tm-btn tm-btn-light" to="/producteurs">Guide producteurs</Link></div>
              <div className="tm-inline-features"><span><BadgeCheck size={15} /> Visuels plus réalistes</span><span><ShieldCheck size={15} /> Accès par rôle</span><span><Truck size={15} /> Logistique suivie</span></div>
            </div>
            <div className="tm-hero-visual tm-hero-bg-main"><div className="tm-floating-info"><Factory size={18} /><div><strong>Unité de transformation</strong><span>Réception, transformation, conditionnement</span></div></div></div>
          </div>
        </section>
      <Tm29PresentationExpansion />
    

        <section className="tm-metrics-section">
          <div className="tm-container tm-metrics-grid">
            <MetricCard value="01" label="Catalogue public illustré" />
            <MetricCard value="02" label="Portail producteurs & points focaux" />
            <MetricCard value="03" label="Précommandes et commandes" />
            <MetricCard value="04" label="Qualité, lots et traçabilité" />
          </div>
        </section>

        <section id="presentation" className="tm-content-section">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Présentation</span><h2>Une plateforme organisée comme un vrai site professionnel</h2><p>Le design général suit un thème e-commerce moderne : grande image d’accueil, cartes produits, blocs visuels et sections métier lisibles.</p></div>
            <div className="tm-feature-grid">
              <article className="tm-feature-card"><div className="tm-card-icon"><Tractor size={22} /></div><h3>Valoriser la production</h3><p>Prévisions, coordination terrain et préparation de l’approvisionnement.</p></article>
              <article className="tm-feature-card"><div className="tm-card-icon"><Users size={22} /></div><h3>Coordonner les acteurs</h3><p>Producteurs, points focaux, administration et opérateurs suivent un flux commun.</p></article>
              <article className="tm-feature-card"><div className="tm-card-icon"><ShoppingBasket size={22} /></div><h3>Présenter les produits</h3><p>Catalogue, images, illustration de marque et parcours d’inscription plus propre.</p></article>
            </div>
          </div>
        </section>

        <section id="processus" className="tm-content-section tm-section-soft">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Processus métier</span><h2>Du producteur au produit fini</h2><p>Des cartes visuelles structurent l’ensemble des grandes étapes de la chaîne de valeur.</p></div>
            <div className="tm-process-grid">
              <ProcessCard imageClass="tm-bg-producer" icon={<Tractor size={18} />} title="Production" text="Prévisions de production, périodes et quantités attendues." />
              <ProcessCard imageClass="tm-bg-pointfocal" icon={<Users size={18} />} title="Point focal" text="Coordination des demandes et regroupement des volumes terrain." />
              <ProcessCard imageClass="tm-bg-collecte" icon={<Truck size={18} />} title="Collecte" text="Collecte et transport vers l’unité selon le planning défini." />
              <ProcessCard imageClass="tm-bg-transform" icon={<Factory size={18} />} title="Transformation" text="Réception, contrôle, transformation et mise en stock." />
            </div>
          </div>
        </section>

        <PublicCatalogSection />

        <section id="qualite" className="tm-content-section">
          <div className="tm-container tm-quality-layout">
            <div className="tm-quality-copy">
              <div className="tm-section-heading tm-section-heading-left"><span>Qualité</span><h2>Un visuel dédié aux contrôles et à la traçabilité</h2><p>La page montre mieux le rôle du contrôle qualité, des lots et de l’historique de transformation.</p></div>
              <div className="tm-check-list"><div><BadgeCheck size={14} /> Contrôle visuel et sanitaire</div><div><BadgeCheck size={14} /> Suivi de lot</div><div><BadgeCheck size={14} /> Historique de transformation</div><div><BadgeCheck size={14} /> Disponibilité commerciale</div></div>
            </div>
            <div className="tm-hero-visual tm-hero-bg-quality"><div className="tm-floating-info"><ShieldCheck size={18} /><div><strong>Qualité & traçabilité</strong><span>Conformité, fiches et suivi de lot</span></div></div></div>
          </div>
        </section>
      
      <Tm29ContactSection />
    </main>
    </div>
  );
}
