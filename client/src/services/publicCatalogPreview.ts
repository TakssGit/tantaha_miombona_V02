import { commerceService, type CatalogProduct } from "./commerce.service";
import { productsMock } from "../data/products.mock";
export type { CatalogProduct } from "./commerce.service";

const previewMode = import.meta.env.BASE_URL.includes("/tantaha_miombona_V02/") && typeof window !== "undefined" && window.location.hostname.endsWith("github.io");
export const isPublicPreview = previewMode;
export const previewAsset = (value: string) => value.startsWith("/assets/") && previewMode ? import.meta.env.BASE_URL.replace(/\/$/, "") + value : value;
// PATCH08_FIVE_DEMO: these are demo-only, not backend inventory.
export const makeDemoProducts = (): CatalogProduct[] => {
 const existing = productsMock.filter(p => p.active).map((p,index)=>({id:Number(p.id)||index+1,code:p.code,name:p.name,category:p.category,unit:p.unit,sellingPriceAr:p.sellingPriceAr,availableStock:0}));
 const extra: CatalogProduct[] = [
 {id:4,code:'PRD-004',name:'Coulis de tomate',category:'Coulis',unit:'Bouteille',sellingPriceAr:0,availableStock:0},
 {id:5,code:'PRD-005',name:'Tomates séchées',category:'Tomates séchées',unit:'Sachet',sellingPriceAr:0,availableStock:0}
 ];
 return [...existing,...extra.filter(p=>!existing.some(x=>x.code===p.code))];
};
export async function getPublicCatalogForPreview(): Promise<{success:boolean;products:CatalogProduct[]}>{
  if(previewMode)return {success:true,products:makeDemoProducts()};
  try { const response=await commerceService.catalog();if(response.products?.length)return response;return {success:true,products:makeDemoProducts()}; }
  catch { return {success:true,products:makeDemoProducts()}; }
}
