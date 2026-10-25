import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { commerceService, type OrderRow } from "../services/commerce.service";

const statuses = ["EN_ATTENTE", "CONFIRMEE", "PREPAREE", "LIVREE", "ANNULEE"];

const OrdersAdminPage = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const load = async () => setRows((await commerceService.allOrders()).orders);
  useEffect(() => { void load(); }, []);

  return (
    <>
      <PageHeader title="Commandes" description="Commandes des distributeurs et revendeurs." />
      <div className="card">
        <table style={{ width: "100%" }}>
          <thead>
            <tr><th>Code</th><th>Client</th><th>Total</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.code}</td>
                <td>{row.customerName}</td>
                <td>{row.totalAr.toLocaleString("fr-FR")} Ar</td>
                <td>
                  <select
                    value={row.status}
                    onChange={async (e) => {
                      await commerceService.setOrderStatus(row.id, e.target.value);
                      await load();
                    }}
                  >
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersAdminPage;
