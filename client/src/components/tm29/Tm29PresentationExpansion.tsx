import React from 'react';
import './tm29-visual-contact.css';

const benefits = [
  { n: '01', title: 'Pour les producteurs', text: 'PrÃ©sentez les rÃ©coltes, les pÃ©riodes de disponibilitÃ© et les quantitÃ©s prÃ©vues. Les prÃ©commandes aident Ã  mieux planifier la production, Ã  trouver des dÃ©bouchÃ©s et Ã  limiter les pertes aprÃ¨s rÃ©colte.', icon: 'ðŸŒ±' },
  { n: '02', title: 'Pour les points focaux et collecteurs', text: 'Coordonnez les demandes, les volumes, les lieux de collecte et le transport. Les informations partagÃ©es facilitent la prÃ©paration des lots et rÃ©duisent les dÃ©placements inutiles.', icon: 'ðŸšš' },
  { n: '03', title: 'Pour les transformateurs', text: 'Orientez les tomates vers les produits adaptÃ©s : sauce, coulis, concentrÃ© ou tomates sÃ©chÃ©es. La transformation locale contribue Ã  prolonger la conservation et Ã  crÃ©er davantage de valeur.', icon: 'ðŸ­' },
  { n: '04', title: 'Pour les distributeurs et acheteurs', text: 'Consultez le catalogue, les stocks dÃ©clarÃ©s et les informations sur les produits. Les commandes et prÃ©commandes facilitent lâ€™anticipation des besoins et lâ€™organisation de lâ€™approvisionnement.', icon: 'ðŸ§º' },
  { n: '05', title: 'Pour lâ€™Ã©conomie malgache', text: 'En rapprochant agriculture, collecte, transformation et commerce, la plateforme vise Ã  soutenir les activitÃ©s locales, les revenus des acteurs de la filiÃ¨re et la valeur ajoutÃ©e crÃ©Ã©e Ã  Madagascar.', icon: 'ðŸ‡²ðŸ‡¬' },
  { n: '06', title: 'Pour la qualitÃ© et la confiance', text: 'Des informations plus claires sur les produits, les lots, les quantitÃ©s et les Ã©tapes facilitent le suivi des commandes et renforcent la confiance entre les partenaires.', icon: 'âœ“' },
];

export default function Tm29PresentationExpansion() {
  return (
    <section className="tm29-benefits" aria-labelledby="tm29-benefits-title">
      <div className="tm29-shell">
        <span className="tm29-eyebrow">UNE FILIÃˆRE PLUS FORTE</span>
        <h2 id="tm29-benefits-title">Une plateforme utile Ã  chaque acteur de la filiÃ¨re tomate</h2>
        <p className="tm29-lead">Tantsaha Miombona rapproche les producteurs, les points focaux, les collecteurs, les transformateurs et les distributeurs autour dâ€™informations plus claires et dâ€™une meilleure coordination.</p>
        <div className="tm29-benefit-grid">
          {benefits.map((item) => (
            <article className="tm29-benefit-card" key={item.n}>
              <div className="tm29-benefit-card__top"><span className="tm29-benefit-icon" aria-hidden="true">{item.icon}</span><span className="tm29-benefit-number">{item.n}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="tm29-value-chain" aria-label="Ã‰tapes de la chaÃ®ne de valeur">
          <span>Production</span><b aria-hidden="true">â†’</b><span>Coordination</span><b aria-hidden="true">â†’</b><span>Collecte</span><b aria-hidden="true">â†’</b><span>Transformation</span><b aria-hidden="true">â†’</b><span>Distribution</span>
        </div>
      </div>
    </section>
  );
}
