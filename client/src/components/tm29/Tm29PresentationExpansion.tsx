import React from 'react';
import './tm29-visual-contact.css';

const benefits = [
  { n: '01', title: 'Pour les producteurs', text: 'Présentez les récoltes, les périodes de disponibilité et les quantités prévues. Les précommandes aident à mieux planifier la production, à trouver des débouchés et à limiter les pertes après récolte.', icon: 'ðŸŒ±' },
  { n: '02', title: 'Pour les points focaux et collecteurs', text: 'Coordonnez les demandes, les volumes, les lieux de collecte et le transport. Les informations partagées facilitent la préparation des lots et réduisent les déplacements inutiles.', icon: 'ðŸšš' },
  { n: '03', title: 'Pour les transformateurs', text: 'Orientez les tomates vers les produits adaptés : sauce, coulis, concentré ou tomates séchées. La transformation locale contribue à prolonger la conservation et à créer davantage de valeur.', icon: 'ðŸ­' },
  { n: '04', title: 'Pour les distributeurs et acheteurs', text: 'Consultez le catalogue, les stocks déclarés et les informations sur les produits. Les commandes et précommandes facilitent l’anticipation des besoins et l’organisation de l’approvisionnement.', icon: 'ðŸ§º' },
  { n: '05', title: 'Pour l’économie malgache', text: 'En rapprochant agriculture, collecte, transformation et commerce, la plateforme vise à soutenir les activités locales, les revenus des acteurs de la filière et la valeur ajoutée créée à Madagascar.', icon: 'ðŸ‡²ðŸ‡¬' },
  { n: '06', title: 'Pour la qualité et la confiance', text: 'Des informations plus claires sur les produits, les lots, les quantités et les étapes facilitent le suivi des commandes et renforcent la confiance entre les partenaires.', icon: 'âœ“' },
];

export default function Tm29PresentationExpansion() {
  return (
    <section className="tm29-benefits" aria-labelledby="tm29-benefits-title">
      <div className="tm29-shell">
        <span className="tm29-eyebrow">UNE FILIÈRE PLUS FORTE</span>
        <h2 id="tm29-benefits-title">Une plateforme utile à chaque acteur de la filière tomate</h2>
        <p className="tm29-lead">Tantsaha Miombona rapproche les producteurs, les points focaux, les collecteurs, les transformateurs et les distributeurs autour d’informations plus claires et d’une meilleure coordination.</p>
        <div className="tm29-benefit-grid">
          {benefits.map((item) => (
            <article className="tm29-benefit-card" key={item.n}>
              <div className="tm29-benefit-card__top"><span className="tm29-benefit-icon" aria-hidden="true">{item.icon}</span><span className="tm29-benefit-number">{item.n}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="tm29-value-chain" aria-label="Étapes de la chaîne de valeur">
          <span>Production</span><b aria-hidden="true">â†’</b><span>Coordination</span><b aria-hidden="true">â†’</b><span>Collecte</span><b aria-hidden="true">â†’</b><span>Transformation</span><b aria-hidden="true">â†’</b><span>Distribution</span>
        </div>
      </div>
    </section>
  );
}
