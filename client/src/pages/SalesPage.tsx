import {
  Plus
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent
} from "react";

import PageHeader
  from "../components/layout/PageHeader";

import Button
  from "../components/ui/Button";

import Card
  from "../components/ui/Card";

import Input
  from "../components/ui/Input";

import Modal
  from "../components/ui/Modal";

import Select
  from "../components/ui/Select";

import Alert
  from "../components/ui/Alert";

import Table, {
  type TableColumn
} from "../components/ui/Table";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import {
  formatMoney
} from "../utils/formatMoney";

import type {
  Sale
} from "../types/sale";

import type {
  Customer
} from "../types/customer";

import type {
  Product
} from "../types/product";

import type {
  StockItem
} from "../types/stock";

const SalesPage = () => {
  const [
    sales,
    setSales
  ] =
    useState<
      Sale[]
    >([]);

  const [
    customers,
    setCustomers
  ] =
    useState<
      Customer[]
    >([]);

  const [
    products,
    setProducts
  ] =
    useState<
      Product[]
    >([]);

  const [
    stocks,
    setStocks
  ] =
    useState<
      StockItem[]
    >([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [form, setForm] =
    useState({
      customerCode: "",
      productCode: "",
      finishedLotCode: "",
      quantity: "",
      unitPriceAr: "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10),
      status: "Payée"
    });

  const load =
    async () => {
      const [
        a,
        b,
        c,
        d
      ] =
        await Promise.all([
          businessService
            .sales.list(),
          businessService
            .customers.list(),
          businessService
            .products.list(),
          businessService
            .stocks.list()
        ]);

      setSales(a);
      setCustomers(b);
      setProducts(c);
      setStocks(d);
    };

  useEffect(() => {
    void load();
  }, []);

  const save =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      try {
        setError("");

        await businessService
          .sales.create({
            ...form,
            quantity:
              Number(
                form.quantity
              ),
            unitPriceAr:
              Number(
                form.unitPriceAr
              )
          });

        setOpen(false);

        await load();
      } catch (
        current
      ) {
        setError(
          current instanceof
          Error
            ? current.message
            : "Erreur."
        );
      }
    };

  const columns:
    TableColumn<Sale>[] =
    [
      {
        key: "code",
        title: "Vente"
      },
      {
        key:
          "customerName",
        title:
          "Client"
      },
      {
        key:
          "productName",
        title:
          "Produit"
      },
      {
        key:
          "finishedLotCode",
        title:
          "Lot fini"
      },
      {
        key:
          "quantity",
        title:
          "Quantité"
      },
      {
        key:
          "totalAr",
        title: "Total",
        render: (row) =>
          formatMoney(
            row.totalAr
          )
      },
      {
        key: "status",
        title:
          "Statut",
        render: (row) => (
          <StatusBadge
            status={row.status}
          />
        )
      }
    ];

  return (
    <>
      <PageHeader
        title="Ventes"
        description="Ventes réelles avec sortie automatique du stock."
        actions={
          <Button
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Nouvelle vente
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={sales}
        />
      </Card>

      <Modal
        open={open}
        title="Nouvelle vente"
        onClose={() =>
          setOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={save}
        >
          {error && (
            <div className="form-grid-full">
              <Alert variant="danger">
                {error}
              </Alert>
            </div>
          )}

          <div className="form-grid-full">
            <Select
              label="Client"
              value={
                form.customerCode
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  customerCode:
                    e.target.value
                })
              }
              options={[
                {
                  value: "",
                  label:
                    "Sélectionner..."
                },
                ...customers
                  .filter(
                    (item) =>
                      item.status ===
                      "Actif"
                  )
                  .map(
                    (item) => ({
                      value:
                        item.code,
                      label:
                        item.name
                    })
                  )
              ]}
            />
          </div>

          <Select
            label="Produit"
            value={
              form.productCode
            }
            onChange={(e) => {
              const product =
                products.find(
                  (item) =>
                    item.code ===
                    e.target.value
                );

              setForm({
                ...form,
                productCode:
                  e.target.value,
                unitPriceAr:
                  product
                    ? String(
                        product.sellingPriceAr
                      )
                    : ""
              });
            }}
            options={[
              {
                value: "",
                label:
                  "Sélectionner..."
              },
              ...products.map(
                (item) => ({
                  value:
                    item.code,
                  label:
                    item.name
                })
              )
            ]}
          />

          <Select
            label="Lot fini"
            value={
              form.finishedLotCode
            }
            onChange={(e) =>
              setForm({
                ...form,
                finishedLotCode:
                  e.target.value
              })
            }
            options={[
              {
                value: "",
                label:
                  "Sans lot"
              },
              ...stocks
                .filter(
                  (item) =>
                    item.availableQuantity >
                    0
                )
                .map(
                  (item) => ({
                    value:
                      item.finishedLotCode,
                    label:
                      `${item.finishedLotCode} - ${item.availableQuantity} ${item.unit}`
                  })
                )
            ]}
          />

          <Input
            label="Quantité"
            type="number"
            value={
              form.quantity
            }
            onChange={(e) =>
              setForm({
                ...form,
                quantity:
                  e.target.value
              })
            }
          />

          <Input
            label="Prix unitaire"
            type="number"
            value={
              form.unitPriceAr
            }
            onChange={(e) =>
              setForm({
                ...form,
                unitPriceAr:
                  e.target.value
              })
            }
          />

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date:
                  e.target.value
              })
            }
          />

          <Select
            label="Paiement"
            value={
              form.status
            }
            onChange={(e) =>
              setForm({
                ...form,
                status:
                  e.target.value
              })
            }
            options={[
              {
                value:
                  "Payée",
                label:
                  "Payée"
              },
              {
                value:
                  "À crédit",
                label:
                  "À crédit"
              }
            ]}
          />

          <div className="total-preview form-grid-full">
            <div className="total-preview-label">
              Total
            </div>

            <div className="total-preview-value">
              {formatMoney(
                Number(
                  form.quantity ||
                    0
                ) *
                  Number(
                    form.unitPriceAr ||
                      0
                  )
              )}
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SalesPage;
