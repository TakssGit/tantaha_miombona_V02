import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import {
  commerceService,
  type CatalogProduct,
  type OrderRow
} from "../services/commerce.service";

const CommercialPortalPage = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [catalog, myOrders] = await Promise.all([
      commerceService.catalog(),
      commerceService.myOrders()
    ]);
    setProducts(catalog.products);
    setOrders(myOrders.orders);
  };

  useEffect(() => { void load(); }, []);

  const selectedItems = useMemo(
    () => products
      .map((p) => ({ productId: p.id, quantity: Number(quantities[p.id] || 0) }))
      .filter((item) => item.quantity > 0),
    [products, quantities]
  );

  const submit = async () => {
    try {
      const result = await commerceService.createOrder({ items: selectedItems, notes });
      setMessage(`${result.message} ${result.code}`);
      setQuantities({});
      setNotes("");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Commande impossible.");
    }
  };

  return (
    <>
      <PageHeader title="Espace distributeur" description="Catalogue, disponibilité et suivi de mes commandes." />
      {message && <div className="card">{message}</div>}

      <div className="card">
        <h3>Nouvelle commande</h3>
        {products.map((product) => (
          <div key={product.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 12, padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
            <div>
              <strong>{product.name}</strong>
              <div>{product.sellingPriceAr.toLocaleString("fr-FR")} Ar — stock {product.availableStock}</div>
            </div>
            <input
              type="number"
              min="0"
              max={product.availableStock}
              placeholder="Qté"
              value={quantities[product.id] || ""}
              onChange={(e) => setQuantities({ ...quantities, [product.id]: e.target.value })}
            />
          </div>
        ))}

        <textarea placeholder="Observation" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="button" className="btn btn-primary" disabled={selectedItems.length === 0} onClick={submit}>
          Envoyer la commande
        </button>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Mes commandes</h3>
        {orders.map((order) => (
          <div key={order.id} style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
            <strong>{order.code}</strong>
            <div>{order.totalAr.toLocaleString("fr-FR")} Ar — {order.status}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommercialPortalPage;
