// PATCH08_CATALOGUE_5
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, PackageCheck, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getPublicCatalogForPreview, isPublicPreview, previewAsset, type CatalogProduct } from "../services/publicCatalogPreview";
import "../styles/v02-public.css";

const visualByCode: Record<string, string> = {
  "PRD-001": "/assets/images/produit_sauce_tomate.png",
  "PRD-002": "/assets/images/produit_puree_tomate.png",
  "PRD-003": "/assets/images/produit_concentre_tomate.png",
  "PRD-004": "/assets/images/produit_coulis_tomate.png",
  "PRD-005": "/assets/images/produit_tomate_sechee.png"
};

export default function PublicCatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    getPublicCatalogForPreview().then((response) => { if (active) setProducts(response.products); }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Catalogue indisponible."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => products.filter((item) => `${item.name} ${item.code} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  return <div className="v04-site">
    <header className="v04-header"><Link to="/">← Accueil</Link><strong>Tantsaha Miombona · Catalogue</strong><Link to="/login">Connexion</Link></header>
    <main className="v04-wrap">
      <section className="v04-hero">
        <div className="v04-hero-copy"><p className="v04-kicker">Catalogue public</p><h1>Produits finis avec visuels réalistes et lecture rapide du stock</h1><p>Le thème graphique s’inspire d’un catalogue e-commerce moderne : image hero, cartes produits, bandeaux visuels et sections promotionnelles.</p><div className="v04-actions"><Link className="v04-primary" to="/register">Créer un compte distributeur</Link><Link to="/login">Se connecter</Link></div><div className="v04-points"><span><BadgeCheck size={15} /> Cartes produit illustrées</span><span><BadgeCheck size={15} /> Design responsive</span><span><BadgeCheck size={15} /> Visibilité du stock</span></div></div>
        <div className="v04-hero-media"><img src={previewAsset("/assets/illustrations/catalogue_showcase.png")} alt="Présentation visuelle du catalogue" /></div>
      </section>

      {isPublicPreview && <p role="note" className="v04-error">Démonstration : tarifs indicatifs et stocks non synchronisés. Commandes réelles non disponibles ici.</p>}
      <p role="note" className="v04-error">Données de démonstration si le serveur est indisponible : prix indicatifs, stocks non synchronisés. Pour les commandes, utilisez l’application connectée.</p><section className="v04-banner-strip"><div className="v04-banner-card"><img src={previewAsset("/assets/illustrations/catalogue_banner.png")} alt="Bannière catalogue" /></div></section>

      <label className="v04-search-card"><span><Search size={16} /> Rechercher dans le catalogue</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, code ou catégorie" /></label>

      {loading && <p role="status">Chargement du catalogue…</p>}
      {error && <div className="v04-error">Impossible de charger le catalogue : {error}</div>}
      {!loading && !error && filtered.length === 0 && <p>Aucun produit disponible.</p>}

      <div className="v04-grid">{!error && filtered.map((item) => <article className="v04-product-card" key={item.id}><div className="v04-product-media" style={{ backgroundImage: `linear-gradient(rgba(12,43,26,.04), rgba(12,43,26,.10)), url('${previewAsset(previewAsset(visualByCode[item.code] || "/assets/images/produit_generique_tomate.png"))}')` }}><span className="v04-chip">{item.category || "Produit"}</span><span className="v04-circle"><PackageCheck size={18} /></span></div><div className="v04-product-body"><p className="v04-kicker">{item.code}</p><h2>{item.name}</h2><p><strong>{Number(item.sellingPriceAr) > 0 ? `${Number(item.sellingPriceAr).toLocaleString("fr-FR")} Ar` : "Prix sur demande"}</strong> / {item.unit}</p><p className={item.availableStock > 0 ? "v04-stock" : "v04-out"}>{isPublicPreview ? "Stock à confirmer" : item.availableStock > 0 ? `Disponible : ${item.availableStock} ${item.unit}` : "Stock à confirmer"}</p><Link className="v04-inline-link" to="/login">Accéder à l’espace commercial <ArrowRight size={15} /></Link></div></article>)}</div>
    </main>
    <footer className="v04-footer">Catalogue public mis à jour avec thème visuel professionnel.</footer>
  </div>;
}
