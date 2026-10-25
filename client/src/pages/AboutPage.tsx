import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ClipboardCheck, Factory, Handshake, Leaf, PackageCheck, ShieldCheck, ShoppingBasket, Sprout, Tractor, Truck, UserPlus, Users } from "lucide-react";
import "../styles/public-home.css";
import "../styles/about-premium.css";

const img = (name: string) => `${import.meta.env.BASE_URL}assets/images/${name}`;
const missions = [
  { title: "Valoriser les récoltes", description: "Donner de la visibilité aux périodes de production et aux volumes déclarés afin de mieux organiser les débouchés.", icon: Sprout },
  { title: "Relier les acteurs", description: "Faciliter la coordination entre producteurs, points focaux, collecteurs et unité de transformation.", icon: Handshake },
  { title: "Transformer localement", description: "Présenter les étapes de contrôle, transformation et conditionnement qui apportent de la valeur aux tomates.", icon: Factory },
  { title: "Préparer la distribution", description: "Rapprocher les produits finis et les distributeurs pour rendre les demandes et commandes plus lisibles.", icon: ShoppingBasket },
];
const journey = [
  {n: "01", title: "Production", desc: "Les producteurs renseignent leurs cultures et prévisions.", picture: "producteurs_champ_tomate.jpg", icon: Tractor},
  {n: "02", title: "Coordination", desc: "Les points focaux regroupent les informations du terrain.", picture: "point_focal_producteurs.jpg", icon: Users},
  {n: "03", title: "Collecte", desc: "Les volumes sont organisés pour la collecte et le transport.", picture: "collecte_transport_tomate.jpg", icon: Truck},
  {n: "04", title: "Transformation", desc: "Les lots sont préparés et transformés selon le processus prévu.", picture: "etablissement_transformation.jpg", icon: Factory},
  {n: "05", title: "Distribution", desc: "Les produits finis sont présentés aux acheteurs et distributeurs.", picture: "produit_sauce_tomate.jpg", icon: PackageCheck},
];
const members = [
  {title:"Vous êtes producteur", picture:"producteurs_champ_tomate.jpg", icon:Tractor, steps:["Créer un compte en choisissant le profil producteur.", "Compléter votre identité, votre localisation et vos coordonnées.", "Renseigner les informations de production et de disponibilité.", "Suivre les consignes de validation et utiliser votre espace membre."]},
  {title:"Vous êtes distributeur", picture:"produit_concentre_tomate.jpg", icon:ShoppingBasket, steps:["Découvrir les produits et les informations du catalogue public.", "Créer un compte avec le profil adapté à votre activité commerciale.", "Préciser vos coordonnées et vos besoins d’approvisionnement.", "Utiliser votre espace commercial pour échanger et préparer vos commandes."]},
];

export default function AboutPage() {
  return <div className="tm-public-site ap12">
    <header className="ap12-header"><div className="ap12-container ap12-header-row">
      <Link className="ap12-brand" to="/"><img src={img("tm29/tomato-logo.svg")} alt="Logo tomate Tantsaha Miombona"/><span><strong>Tantsaha Miombona</strong><small>Filière tomate • Madagascar</small></span></Link>
      <nav aria-label="Navigation À propos"><Link to="/">Accueil</Link><a href="#mission">Notre mission</a><a href="#parcours">La filière</a><a href="#adhesion">Adhésion</a><a href="#utilisation">Mode d’emploi</a></nav>
      <Link className="ap12-button ap12-button--small" to="/register">Devenir membre <ArrowRight size={16}/></Link>
    </div></header>
    <main>
      <section className="ap12-hero"><div className="ap12-container ap12-hero-grid">
        <div className="ap12-hero-content"><span className="ap12-eyebrow"><Leaf size={16}/> À PROPOS DE NOTRE PLATEFORME</span><h1>Ensemble, valorisons la <em>tomate malgache.</em></h1><p>Tantsaha Miombona met en relation les acteurs de la filière tomate, du champ au produit transformé. Découvrez notre approche, notre fonctionnement et la manière de rejoindre le réseau.</p>
          <div className="ap12-actions"><Link to="/register" className="ap12-button">Rejoindre la plateforme <ArrowRight size={17}/></Link><a className="ap12-button ap12-button--outline" href="#mission">Découvrir notre mission</a></div>
          <div className="ap12-hero-tags"><span><BadgeCheck size={16}/> Valorisation locale</span><span><Users size={16}/> Travail collectif</span><span><ShieldCheck size={16}/> Suivi des lots</span></div>
        </div>
        <div className="ap12-hero-visual"><img src={img("producteurs_champ_tomate.jpg")} alt="Récolte de tomates dans une exploitation agricole"/><div className="ap12-hero-caption"><Sprout size={22}/><span>De la terre jusqu’aux marchés<br/><strong>Une chaîne de valeur connectée</strong></span></div></div>
      </div></section>
      <section id="mission" className="ap12-section"><div className="ap12-container"><div className="ap12-section-head"><span className="ap12-eyebrow">NOTRE RAISON D’ÊTRE</span><h2>Une plateforme au service de toute la filière</h2><p>Une organisation plus claire pour les producteurs, les partenaires de terrain, les transformateurs et les distributeurs.</p></div>
        <div className="ap12-mission-grid">{missions.map(item => <article className="ap12-mission-card" key={item.title}><span className="ap12-icon"><item.icon size={26}/></span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        <div className="ap12-story"><img src={img("etablissement_transformation.jpg")} alt="Espace de transformation de produits agricoles" loading="lazy"/><div><span className="ap12-eyebrow">PRODUCTION & TRANSFORMATION</span><h3>Faire grandir la valeur des produits locaux</h3><p>La filière ne s’arrête pas à la récolte : regroupement, contrôle, transformation, conditionnement puis commercialisation contribuent à donner davantage de débouchés aux produits agricoles.</p><p>La plateforme rassemble ces étapes dans un environnement numérique conçu pour faciliter la coordination et rendre les échanges plus transparents.</p><Link className="ap12-text-link" to="/catalogue">Découvrir les produits finis <ArrowRight size={18}/></Link></div></div>
      </div></section>
      <section id="parcours" className="ap12-section ap12-section--soft"><div className="ap12-container"><div className="ap12-section-head"><span className="ap12-eyebrow">LE PARCOURS MÉTIER</span><h2>Cinq étapes, une filière cohérente</h2><p>Chaque acteur intervient à un moment précis pour passer de la production agricole au marché.</p></div>
        <div className="ap12-journey">{journey.map(j => <article className="ap12-journey-card" key={j.n}><div className="ap12-journey-image"><img src={img(j.picture)} alt={j.title} loading="lazy"/><span>{j.n}</span></div><div className="ap12-journey-content"><span className="ap12-icon ap12-icon--small"><j.icon size={22}/></span><h3>{j.title}</h3><p>{j.desc}</p></div></article>)}</div>
      </div></section>
      <section id="adhesion" className="ap12-section"><div className="ap12-container"><div className="ap12-section-head"><span className="ap12-eyebrow">DEVENIR MEMBRE</span><h2>Comment rejoindre Tantsaha Miombona ?</h2><p>Choisissez votre rôle, créez votre compte et complétez les informations utiles à votre activité.</p></div>
        <div className="ap12-members">{members.map(m => <article className="ap12-member-card" key={m.title}><div className="ap12-member-cover"><img src={img(m.picture)} alt={m.title} loading="lazy"/><span className="ap12-member-badge"><m.icon size={22}/></span></div><div className="ap12-member-content"><h3>{m.title}</h3><ol>{m.steps.map((s,i) => <li key={i}><span>{i+1}</span>{s}</li>)}</ol><Link to="/register" className="ap12-button">Créer mon compte <ArrowRight size={17}/></Link></div></article>)}</div>
        <p className="ap12-fineprint"><ClipboardCheck size={17}/> Les modalités exactes d’activation et les droits d’accès dépendent du rôle et de la configuration de l’application.</p>
      </div></section>
      <section id="utilisation" className="ap12-section ap12-section--soft"><div className="ap12-container"><div className="ap12-section-head"><span className="ap12-eyebrow">COMMENT ÇA MARCHE ?</span><h2>Découvrir, s’inscrire, collaborer</h2><p>La navigation publique reste accessible sans compte ; les espaces de gestion sont réservés aux membres autorisés.</p></div>
        <div className="ap12-use-grid"><div className="ap12-use-photo"><img src={img("point_focal_producteurs.jpg")} alt="Échange et coordination entre acteurs agricoles" loading="lazy"/></div><div className="ap12-use-steps">
        <div><span>01</span><h3>Explorer les pages publiques</h3><p>Consultez la présentation de la plateforme, la filière et le catalogue.</p></div><div><span>02</span><h3>Choisir votre profil</h3><p>Inscrivez-vous comme producteur ou distributeur selon votre activité.</p></div><div><span>03</span><h3>Accéder à votre espace</h3><p>Une fois votre compte actif, retrouvez les fonctions disponibles pour votre rôle.</p></div><div><span>04</span><h3>Échanger autour des opérations</h3><p>Prévisions, collecte, produits et commandes facilitent les interactions entre membres.</p></div>
        </div></div></div></section>
      <section className="ap12-final"><div className="ap12-container ap12-final-inner"><div><span className="ap12-eyebrow">ENVIE D’ALLER PLUS LOIN ?</span><h2>Construisons une filière plus forte, ensemble.</h2><p>Découvrez nos produits ou présentez votre activité en rejoignant la plateforme.</p></div><div className="ap12-actions"><Link className="ap12-button ap12-button--light" to="/catalogue">Voir le catalogue <ArrowRight size={17}/></Link><Link className="ap12-button ap12-button--light-outline" to="/register">Devenir membre <UserPlus size={17}/></Link></div></div></section>
    </main><footer className="ap12-footer"><div className="ap12-container"><span>Tantsaha Miombona • Transformation & commerce local</span><Link to="/">Retour à l’accueil <ArrowRight size={15}/></Link></div></footer>
  </div>
}
