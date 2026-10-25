import { Sprout, Truck, Factory, ShoppingBasket, Globe2, BadgeCheck, ArrowRight } from "lucide-react";
import React from 'react';
import './tm29-visual-contact.css';

const benefits = [
  { n: '01', title: 'Pour les producteurs', text: 'Présentez les récoltes, les périodes de disponibilité et les quantités prévues. Les précommandes aident à mieux planifier la production, à trouver des débouchés et à limiter les pertes après récolte.', icon: '🌱' },
  { n: '02', title: 'Pour les points focaux et collecteurs', text: 'Coordonnez les demandes, les volumes, les lieux de collecte et le transport. Les informations partagées facilitent la préparation des lots et réduisent les déplacements inutiles.', icon: '🚚' },
  { n: '03', title: 'Pour les transformateurs', text: 'Orientez les tomates vers les produits adaptés : sauce, coulis, concentré ou tomates séchées. La transformation locale contribue à prolonger la conservation et à créer davantage de valeur.', icon: '🏭' },
  { n: '04', title: 'Pour les distributeurs et acheteurs', text: 'Consultez le catalogue, les stocks déclarés et les informations sur les produits. Les commandes et précommandes facilitent l’anticipation des besoins et l’organisation de l’approvisionnement.', icon: '🧺' },
  { n: '05', title: 'Pour l’économie malgache', text: 'En rapprochant agriculture, collecte, transformation et commerce, la plateforme vise à soutenir les activités locales, les revenus des acteurs de la filière et la valeur ajoutée créée à Madagascar.', icon: '🇲🇬' },
  { n: '06', title: 'Pour la qualité et la confiance', text: 'Des informations plus claires sur les produits, les lots, les quantités et les étapes facilitent le suivi des commandes et renforcent la confiance entre les partenaires.', icon: '✓' },
];

export default function Tm29PresentationExpansion() {
  return (
    <section className="tm-about-teaser" aria-label="En savoir plus sur Tantsaha Miombona"><div><h2>Decouvrez Tantsaha Miombona</h2><p>Une filiere plus forte, du producteur au distributeur.</p></div><a href={`${import.meta.env.BASE_URL}a-propos`} className="tm-about-teaser-link">A propos de nous →</a></section>
  );
}
