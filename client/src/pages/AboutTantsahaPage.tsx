import { Link } from 'react-router-dom';
import './about-tantsaha.css';

const acteurs = [
 { titre:'Pour les producteurs', texte:'Presentez vos recoltes, les periodes de disponibilite et les quantites prevues. Les precommandes facilitent la planification et limitent les pertes apres recolte.' },
 { titre:'Pour les points focaux et collecteurs', texte:'Coordonnez les demandes, les volumes, les lieux de collecte et le transport, avec des informations partagees plus claires.' },
 { titre:'Pour les transformateurs', texte:'Valorisez les tomates en sauce, coulis, concentre ou tomates sechees, dans un parcours de qualite.' },
 { titre:'Pour les distributeurs et acheteurs', texte:'Decouvrez les produits transformes et facilitez les relations entre les producteurs et les marches.' },
 { titre:'Pour l’economie malgache', texte:'Favorisez la transformation locale, les debouches et la creation de valeur dans la filiere tomate.' },
 { titre:'Pour la qualite et la confiance', texte:'Ameliorez la lisibilite des lots, la coordination et la tracabilite des produits.' },
];
export default function AboutTantsahaPage(){return (<main className="tm-about"><header className="tm-about-hero"><span className="tm-about-eyebrow">UNE FILIERE PLUS FORTE</span><h1>Une plateforme utile a chaque acteur de la filiere tomate</h1><p>Tantsaha Miombona rapproche les producteurs, les points focaux, les collecteurs, les transformateurs et les distributeurs autour d'informations plus claires et d'une meilleure coordination.</p><nav className="tm-about-actions"><Link to="/">Retour a l’accueil</Link><Link to="/catalogue">Decouvrir les produits</Link></nav></header><section className="tm-about-grid" aria-label="Les acteurs de la filiere">{acteurs.map((a,i)=><article className="tm-about-card" key={a.titre}><span className="tm-about-index">{String(i+1).padStart(2,'0')}</span><h2>{a.titre}</h2><p>{a.texte}</p></article>)}</section><aside className="tm-about-bottom"><h2>Du champ au marche</h2><p>Production, coordination, collecte, transformation puis distribution : decouvrez comment les acteurs travaillent ensemble.</p><Link to="/">Voir le parcours sur l’accueil</Link></aside></main>)}
