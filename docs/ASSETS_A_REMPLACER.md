# Images et icônes à remplacer

Les fichiers ci-dessous sont volontairement créés comme **placeholders vides**. Vous pouvez les remplacer par de vrais fichiers portant exactement le même nom.

## Images réellement référencées par l’interface

| Fichier | Chemin public | Usage |
|---|---|---|
| `collecte_transport_tomate.jpg` | `/assets/images/collecte_transport_tomate.jpg` | Étape collecte et transport |
| `hero_unite_transformation.jpg` | `/assets/images/hero_unite_transformation.jpg` | Bannière principale de la page d’accueil |
| `point_focal_producteurs.jpg` | `/assets/images/point_focal_producteurs.jpg` | Étape Point focal |
| `producteurs_champ_tomate.jpg` | `/assets/images/producteurs_champ_tomate.jpg` | Étape Production / producteurs |
| `produit_concentre_tomate.jpg` | `/assets/images/produit_concentre_tomate.jpg` | Produit PRD-003 — Concentré de tomate |
| `produit_coulis_tomate.jpg` | `/assets/images/produit_coulis_tomate.jpg` | Produit PRD-004 — Coulis de tomate |
| `produit_generique_tomate.jpg` | `/assets/images/produit_generique_tomate.jpg` | Image de repli pour les autres produits |
| `produit_puree_tomate.jpg` | `/assets/images/produit_puree_tomate.jpg` | Produit PRD-002 — Purée de tomate |
| `produit_sauce_tomate.jpg` | `/assets/images/produit_sauce_tomate.jpg` | Produit PRD-001 — Sauce tomate |
| `produit_tomate_sechee.jpg` | `/assets/images/produit_tomate_sechee.jpg` | Produit PRD-005 — Tomate séchée |
| `qualite_tracabilite.jpg` | `/assets/images/qualite_tracabilite.jpg` | Section qualité et traçabilité |
| `transformation_tomate.jpg` | `/assets/images/transformation_tomate.jpg` | Étape transformation |

## Images préparées mais pas encore directement référencées

| Fichier | Utilisation prévue |
|---|---|
| `contact_localisation.jpg` | Visuel complémentaire localisation/contact |
| `etablissement_transformation.jpg` | Visuel complémentaire de l’établissement |
| `logo_tantsaha_miombona.png` | Logo image de la marque si vous souhaitez remplacer le logo typographique |

## Favicon

- `client/public/favicon.ico`

## Icônes Lucide utilisées dans le code

L’application utilise actuellement `lucide-react`. Des fichiers SVG vides de même nom sont créés dans `client/public/assets/icons/` pour préparer une future substitution. **Remplacer ces SVG ne change pas automatiquement les icônes actuelles** : les composants Lucide restent utilisés tant que le code n’est pas refactorisé vers des fichiers image.

| Icône | Fichier placeholder | Fichiers source qui l’utilisent |
|---|---|---|
| AlertCircle | `client/public/assets/icons/AlertCircle.svg` | `components/ui/Alert.tsx`<br>`features/dashboard/AlertsPanel.tsx` |
| AlertTriangle | `client/public/assets/icons/AlertTriangle.svg` | `components/layout/Sidebar.tsx`<br>`components/ui/Alert.tsx`<br>`features/dashboard/AlertsPanel.tsx`<br>`pages/DashboardPage.tsx` |
| Archive | `client/public/assets/icons/Archive.svg` | `pages/CustomersPage.tsx`<br>`pages/ProducersPage.tsx` |
| ArrowRight | `client/public/assets/icons/ArrowRight.svg` | `pages/HomePage.tsx` |
| BadgeCheck | `client/public/assets/icons/BadgeCheck.svg` | `pages/HomePage.tsx` |
| Boxes | `client/public/assets/icons/Boxes.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/DashboardPage.tsx` |
| CalendarDays | `client/public/assets/icons/CalendarDays.svg` | `components/layout/Sidebar.tsx` |
| CheckCircle2 | `client/public/assets/icons/CheckCircle2.svg` | `components/ui/Alert.tsx`<br>`features/dashboard/AlertsPanel.tsx` |
| ClipboardCheck | `client/public/assets/icons/ClipboardCheck.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/DashboardPage.tsx` |
| ClipboardList | `client/public/assets/icons/ClipboardList.svg` | `components/layout/Sidebar.tsx` |
| Edit3 | `client/public/assets/icons/Edit3.svg` | `pages/CustomersPage.tsx`<br>`pages/ProducersPage.tsx` |
| Factory | `client/public/assets/icons/Factory.svg` | `components/layout/Sidebar.tsx`<br>`pages/HomePage.tsx`<br>`pages/TraceabilityPage.tsx` |
| Gauge | `client/public/assets/icons/Gauge.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/DashboardPage.tsx` |
| Inbox | `client/public/assets/icons/Inbox.svg` | `components/common/EmptyState.tsx` |
| Info | `client/public/assets/icons/Info.svg` | `components/ui/Alert.tsx`<br>`features/dashboard/AlertsPanel.tsx` |
| KeyRound | `client/public/assets/icons/KeyRound.svg` | `components/layout/Sidebar.tsx`<br>`pages/AdminPage.tsx` |
| Leaf | `client/public/assets/icons/Leaf.svg` | `pages/HomePage.tsx` |
| LogOut | `client/public/assets/icons/LogOut.svg` | `components/layout/Sidebar.tsx` |
| MapPin | `client/public/assets/icons/MapPin.svg` | `pages/HomePage.tsx` |
| Menu | `client/public/assets/icons/Menu.svg` | `components/layout/Header.tsx`<br>`layouts/Header.tsx` |
| PackageCheck | `client/public/assets/icons/PackageCheck.svg` | `components/layout/Sidebar.tsx`<br>`components/public/PublicCatalogSection.tsx`<br>`pages/HomePage.tsx`<br>`pages/TraceabilityPage.tsx` |
| Phone | `client/public/assets/icons/Phone.svg` | `pages/HomePage.tsx` |
| Plus | `client/public/assets/icons/Plus.svg` | `pages/CollectionsPage.tsx`<br>`pages/CustomersPage.tsx`<br>`pages/LotsPage.tsx`<br>`pages/NonConformitiesPage.tsx`<br>`pages/ProducersPage.tsx`<br>`pages/ProductionsPage.tsx`<br>`pages/ProductsPage.tsx`<br>`pages/QualityPage.tsx`<br>`pages/ReceptionsPage.tsx`<br>`pages/SalesPage.tsx`<br>`pages/StockPage.tsx`<br>`pages/TransportsPage.tsx` |
| Save | `client/public/assets/icons/Save.svg` | `pages/AdminPage.tsx` |
| Scale | `client/public/assets/icons/Scale.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/DashboardPage.tsx` |
| Search | `client/public/assets/icons/Search.svg` | `components/common/SearchInput.tsx`<br>`components/layout/Sidebar.tsx`<br>`pages/TraceabilityPage.tsx` |
| Settings | `client/public/assets/icons/Settings.svg` | `components/layout/Sidebar.tsx`<br>`pages/AdminPage.tsx` |
| ShieldCheck | `client/public/assets/icons/ShieldCheck.svg` | `pages/HomePage.tsx` |
| ShoppingBasket | `client/public/assets/icons/ShoppingBasket.svg` | `components/layout/Sidebar.tsx`<br>`pages/HomePage.tsx` |
| ShoppingCart | `client/public/assets/icons/ShoppingCart.svg` | `components/layout/Sidebar.tsx`<br>`pages/TraceabilityPage.tsx` |
| Sprout | `client/public/assets/icons/Sprout.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/DashboardPage.tsx`<br>`pages/HomePage.tsx`<br>`pages/TraceabilityPage.tsx` |
| Store | `client/public/assets/icons/Store.svg` | `components/layout/Sidebar.tsx` |
| Tractor | `client/public/assets/icons/Tractor.svg` | `pages/HomePage.tsx` |
| Truck | `client/public/assets/icons/Truck.svg` | `components/layout/Sidebar.tsx`<br>`pages/HomePage.tsx`<br>`pages/TraceabilityPage.tsx` |
| User | `client/public/assets/icons/User.svg` | `pages/TraceabilityPage.tsx` |
| UserCheck | `client/public/assets/icons/UserCheck.svg` | `components/layout/Sidebar.tsx`<br>`pages/AdminPage.tsx` |
| UserCog | `client/public/assets/icons/UserCog.svg` | `components/layout/Sidebar.tsx`<br>`pages/AdminPage.tsx` |
| Users | `client/public/assets/icons/Users.svg` | `components/layout/Sidebar.tsx`<br>`features/dashboard/DashboardKpis.tsx`<br>`pages/AdminPage.tsx`<br>`pages/DashboardPage.tsx`<br>`pages/HomePage.tsx` |
| Warehouse | `client/public/assets/icons/Warehouse.svg` | `components/layout/Sidebar.tsx`<br>`pages/TraceabilityPage.tsx` |
| X | `client/public/assets/icons/X.svg` | `components/ui/Modal.tsx` |

## Logo SVG préparé

- `client/public/assets/icons/logo_tantsaha_miombona.svg`

## Conseil de remplacement

Conservez exactement les noms et extensions. Pour les photos, privilégiez JPG/WebP optimisés. Pour le logo et les icônes personnalisées, privilégiez SVG ou PNG transparent.
