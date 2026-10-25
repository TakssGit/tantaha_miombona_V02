import { commerceService, type CatalogProduct } from "./commerce.service";
import { productsMock } from "../data/products.mock";

// Le type est utilise dans les composants : il doit etre re-exporte.
export type { CatalogProduct } from "./commerce.service";

// Seulement l'aperçu statique hébergé sous le sous-chemin public GitHub Pages.
export const isPublicPreview = import.meta.env.BASE_URL.includes("/tantaha_miombona_V02/") &&
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

export const previewAsset = (url: string): string =>
  isPublicPreview && url.startsWith("/assets/")
    ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${url}`
    : url;

export const getPublicCatalogForPreview = async (): Promise<{ success: boolean; products: CatalogProduct[] }> => {
  if (!isPublicPreview) return commerceService.catalog();
  return {
    success: true,
    products: productsMock.filter((p) => p.active).map((p, index) => ({
      id: Number(p.id) || index + 1,
      code: p.code,
      name: p.name,
      category: p.category,
      unit: p.unit,
      sellingPriceAr: p.sellingPriceAr,
      availableStock: 0 // Non utilisé pour afficher le stock en mode aperçu.
    }))
  };
};
