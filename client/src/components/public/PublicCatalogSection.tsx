import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { commerceService, type CatalogProduct } from "../../services/commerce.service";

const visualByCode: Record<string, string> = {
  "PRD-001": "/assets/images/produit_sauce_tomate.png",
  "PRD-002": "/assets/images/produit_puree_tomate.png",
  "PRD-003": "/assets/images/produit_concentre_tomate.png",
  "PRD-004": "/assets/images/produit_coulis_tomate.png",
  "PRD-005": "/assets/images/produit_tomate_sechee.png"
};

export default function PublicCatalogSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    commerceService.catalog().then((result) => setProducts(result.products)).catch((err) => setError(err instanceof Error ? err.message : "Catalogue indisponible."));
  }, []);

  return (
    <section id="produits" className="tm-content-section tm-section-products">
      <div className="tm-container">
        <div className="tm-section-heading"><span>Produits finis</span><h2>Catalogue public au style commerce moderne</h2><p>Les cartes produits utilisent maintenant des visuels plus réalistes et un habillage proche d’un site catalogue professionnel.</p></div>
        <div className="tm-mini-summary-grid">
          <div className="tm-mini-summary-card"><BadgeCheck size={15} /><span>Images produit plus lisibles</span></div>
          <div className="tm-mini-summary-card"><BadgeCheck size={15} /><span>Stock visible sur chaque carte</span></div>
          <div className="tm-mini-summary-card"><BadgeCheck size={15} /><span>Accès rapide à la page catalogue</span></div>
        </div>
        {error && <div className="tm-feedback-card">Catalogue indisponible : {error}</div>}
        {!error && products.length === 0 && <div className="tm-feedback-card">Aucun produit disponible pour le moment.</div>}
        <div className="tm-product-grid">{products.map((product) => (
          <article className="tm-product-card" key={product.id}>
            <div className="tm-product-media" style={{ backgroundImage: `linear-gradient(rgba(12,43,26,.04), rgba(12,43,26,.10)), url('${visualByCode[product.code] || "/assets/images/produit_generique_tomate.png"}')` }}>
              <span className="tm-product-chip">{product.category || "Produit"}</span>
              <div className="tm-product-bubble"><PackageCheck size={18} /></div>
            </div>
            <div className="tm-product-body">
              <span className="tm-product-code">{product.code}</span>
              <h3>{product.name}</h3>
              <p>{Number(product.sellingPriceAr).toLocaleString("fr-FR")} Ar / {product.unit}</p>
              <strong className="tm-stock-state">Stock : {product.availableStock}</strong>
              <Link className="tm-inline-link" to="/catalogue">Ouvrir le catalogue <ArrowRight size={15} /></Link>
            </div>
          </article>
        ))}</div>
      </div>
    </section>
  );
}
