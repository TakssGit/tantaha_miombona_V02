import Tm29PresentationExpansion from "../components/tm29/Tm29PresentationExpansion";
import { ArrowRight, BadgeCheck, Factory, Globe2, Handshake, Leaf, ShoppingBasket, Smartphone, Sprout, Store, Tractor, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/public-home.css";

function AboutCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="tm-about-card"><div className="tm-card-icon tm-card-icon-strong">{icon}</div><h3>{title}</h3><p>{text}</p></article>;
}

function StepItem({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="tm-about-step-item"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>;
}

export default function AboutPage() {
  return (
    <div className="tm-public-site tm-about-page">
      <header className="tm-topbar">
        <div className="tm-container tm-topbar-inner">
          <div className="tm-brand">
            <div className="tm-brand-mark tm-brand-mark-image"><img src="/assets/images/tm29/tomato-logo.svg" alt="Tantsaha Miombona" /></div>
            <div><strong>Tantsaha Miombona</strong><span>Transformation & commerce local</span></div>
          </div>
          <nav className="tm-main-nav">
            <Link to="/">Accueil</Link>
            <a href="#mission">Mission</a>
            <a href="#adhesion">Adhésion</a>
            <a href="#interaction">Utilisation</a>
            <Link to="/catalogue">Catalogue</Link>
          </nav>
          <div className="tm-topbar-actions"><Link className="tm-btn tm-btn-ghost" to="/login">Connexion</Link><Link className="tm-btn tm-btn-primary" to="/register">Créer un compte</Link></div>
        </div>
      </header>

      <main>
        <section className="tm-about-hero">
          <div className="tm-container tm-about-hero-grid">
            <div className="tm-about-hero-copy">
              <span className="tm-badge-pill"><Sprout size={14} /> À propos de l’établissement</span>
              <h1>Une plateforme pensée pour présenter la filière tomate, ses avantages et ses opportunités.</h1>
              <p>Tantsaha Miombona est un espace numérique qui relie la production, la collecte, la transformation et la distribution afin de mieux structurer les échanges, valoriser les produits locaux et faciliter l’adhésion des membres.</p>
              <div className="tm-hero-actions"><Link className="tm-btn tm-btn-primary" to="/catalogue">Voir le catalogue <ArrowRight size={16} /></Link><Link className="tm-btn tm-btn-light" to="/register">Devenir membre</Link></div>
              <div className="tm-about-pill-row"><span><BadgeCheck size={14} /> Établissement mieux présenté</span><span><BadgeCheck size={14} /> Processus expliqué</span><span><BadgeCheck size={14} /> Adhésion simplifiée</span></div>
            </div>
            <div className="tm-about-hero-media">
              <div className="tm-about-hero-photo"><img src="/assets/images/producteurs_champ_tomate.png" alt="Productrice dans un champ de tomates" /></div>
              <div className="tm-about-hero-mini-grid">
                <div className="tm-about-mini-card"><Tractor size={18} /><div><strong>Production</strong><span>Organisation terrain</span></div></div>
                <div className="tm-about-mini-card"><Factory size={18} /><div><strong>Transformation</strong><span>Valeur ajoutée locale</span></div></div>
                <div className="tm-about-mini-card"><ShoppingBasket size={18} /><div><strong>Distribution</strong><span>Accès au marché</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="mission" className="tm-content-section">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Pourquoi Tantsaha Miombona</span><h2>La page de référence pour présenter l’établissement</h2><p>Cette page rassemble les informations essentielles pour comprendre le rôle de la plateforme, ses avantages et les possibilités de participation.</p></div>
            <div className="tm-about-card-grid">
              <AboutCard icon={<Leaf size={24} />} title="Valoriser les producteurs" text="Mieux présenter les récoltes, les périodes de disponibilité et les opportunités de mise en relation avec les acheteurs." />
              <AboutCard icon={<Users size={24} />} title="Mieux coordonner les acteurs" text="Faciliter la circulation d’information entre producteurs, points focaux, collecteurs, transformateurs et distributeurs." />
              <AboutCard icon={<Store size={24} />} title="Renforcer la visibilité commerciale" text="Montrer les produits transformés dans un catalogue plus clair et plus professionnel pour le public." />
              <AboutCard icon={<Handshake size={24} />} title="Créer de la confiance" text="Mettre en avant les étapes métier, la qualité, la traçabilité et les moyens de contact officiels." />
            </div>
          </div>
        </section>

        <Tm29PresentationExpansion />

        <section id="adhesion" className="tm-content-section tm-section-soft">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Adhésion</span><h2>Comment devenir membre</h2><p>La plateforme distingue les besoins des producteurs et des distributeurs afin de proposer un parcours d’inscription plus clair.</p></div>
            <div className="tm-about-join-grid">
              <article className="tm-about-join-card">
                <div className="tm-card-icon tm-card-icon-strong"><Tractor size={24} /></div>
                <h3>Devenir producteur membre</h3>
                <ul className="tm-about-list">
                  <li>Créer un compte producteur depuis l’application.</li>
                  <li>Renseigner votre identité, votre zone et vos moyens de contact.</li>
                  <li>Déclarer vos parcelles, vos prévisions et vos périodes de disponibilité.</li>
                  <li>Attendre la validation de l’espace de gestion, puis utiliser le portail producteur.</li>
                </ul>
                <Link className="tm-inline-link" to="/register">Créer un compte producteur <ArrowRight size={15} /></Link>
              </article>
              <article className="tm-about-join-card">
                <div className="tm-card-icon tm-card-icon-strong"><ShoppingBasket size={24} /></div>
                <h3>Devenir distributeur membre</h3>
                <ul className="tm-about-list">
                  <li>Consulter d’abord le catalogue public pour découvrir l’offre disponible.</li>
                  <li>Créer un compte distributeur ou commercial.</li>
                  <li>Compléter vos coordonnées, votre activité et vos besoins d’approvisionnement.</li>
                  <li>Accéder à l’espace commercial pour les précommandes et les commandes.</li>
                </ul>
                <Link className="tm-inline-link" to="/catalogue">Découvrir le catalogue <ArrowRight size={15} /></Link>
              </article>
            </div>
          </div>
        </section>

        <section id="interaction" className="tm-content-section">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Interaction</span><h2>Comment interagir avec l’application</h2><p>Le public, les futurs membres et les utilisateurs connectés n’utilisent pas la plateforme de la même manière. Voici le parcours recommandé.</p></div>
            <div className="tm-about-step-grid">
              <StepItem number="01" title="Découvrir" text="Le public consulte l’accueil, la page À propos, le catalogue et les informations de contact." />
              <StepItem number="02" title="Créer un compte" text="Les producteurs et distributeurs s’inscrivent avec le profil qui correspond à leur activité." />
              <StepItem number="03" title="Utiliser l’espace membre" text="Chaque rôle accède à un portail adapté : déclaration, coordination, commandes, traçabilité ou administration." />
              <StepItem number="04" title="Collaborer" text="Les acteurs interagissent via les données saisies, les prévisions, les commandes et les contacts configurés dans l’application." />
            </div>
          </div>
        </section>

        <section className="tm-content-section tm-section-soft">
          <div className="tm-container">
            <div className="tm-section-heading"><span>Avantages</span><h2>Ce que la plateforme apporte</h2><p>Tantsaha Miombona ne se limite pas à un simple site vitrine : elle accompagne l’organisation de la filière, la visibilité des produits et la relation entre les acteurs.</p></div>
            <div className="tm-about-card-grid">
              <AboutCard icon={<Truck size={24} />} title="Processus plus lisible" text="Le chemin du producteur au client final est expliqué et illustré pour rassurer le public et les partenaires." />
              <AboutCard icon={<Globe2 size={24} />} title="Visibilité en ligne" text="Le catalogue et les pages publiques valorisent mieux les activités, les produits et les objectifs de l’établissement." />
              <AboutCard icon={<Smartphone size={24} />} title="Utilisation simple" text="Le public découvre l’écosystème, tandis que les membres interagissent dans des espaces adaptés à leurs besoins." />
              <AboutCard icon={<BadgeCheck size={24} />} title="Image plus professionnelle" text="Une structure plus claire, des pages dédiées et une meilleure hiérarchie visuelle renforcent la crédibilité du projet." />
            </div>
          </div>
        </section>

        <section className="tm-content-section">
          <div className="tm-container tm-about-cta">
            <div>
              <span>Prêt à passer à l’action ?</span>
              <h2>Explorez la plateforme, contactez l’équipe ou rejoignez le réseau.</h2>
              <p>Vous pouvez commencer par la page catalogue, créer un compte membre ou revenir à l’accueil pour découvrir l’ensemble de l’écosystème.</p>
            </div>
            <div className="tm-about-highlight-actions"><Link className="tm-btn tm-btn-primary" to="/catalogue">Voir le catalogue</Link><Link className="tm-btn tm-btn-light" to="/register">Devenir membre</Link><Link className="tm-btn tm-btn-ghost" to="/">Retour à l’accueil</Link></div>
          </div>
        </section>
      </main>
    </div>
  );
}
