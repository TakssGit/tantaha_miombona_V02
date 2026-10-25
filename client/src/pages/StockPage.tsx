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

import type {
  StockItem,
  StockMovement
} from "../types/stock";

const StockPage = () => {
  const [
    stocks,
    setStocks
  ] =
    useState<
      StockItem[]
    >([]);

  const [
    movements,
    setMovements
  ] =
    useState<
      StockMovement[]
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
      finishedLotCode: "",
      type: "Sortie",
      quantity: "",
      reason: "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10)
    });

  const load =
    async () => {
      const [
        a,
        b
      ] =
        await Promise.all([
          businessService
            .stocks.list(),
          businessService
            .stocks.movements()
        ]);

      setStocks(a);
      setMovements(b);
    };

  useEffect(() => {
    void load();
  }, []);

  const save =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      try {
        setError("");

        await businessService
          .stocks
          .createMovement({
            ...form,
            quantity:
              Number(
                form.quantity
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
    TableColumn<StockItem>[] =
    [
      {
        key:
          "productName",
        title:
          "Produit"
      },
      {
        key:
          "finishedLotCode",
        title: "Lot"
      },
      {
        key:
          "inputQuantity",
        title:
          "Entrées"
      },
      {
        key:
          "outputQuantity",
        title:
          "Sorties"
      },
      {
        key:
          "availableQuantity",
        title:
          "Disponible"
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
        title="Stock"
        description="Stock calculé à partir des mouvements SQLite."
        actions={
          <Button
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Mouvement
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={stocks}
        />
      </Card>

      <div className="page-section">
        <Card title="Mouvements">
          <Table
            columns={[
              {
                key: "code",
                title:
                  "Code"
              },
              {
                key:
                  "productName",
                title:
                  "Produit"
              },
              {
                key: "type",
                title:
                  "Type"
              },
              {
                key:
                  "quantity",
                title:
                  "Quantité"
              },
              {
                key:
                  "reason",
                title:
                  "Motif"
              }
            ]}
            rows={movements}
          />
        </Card>
      </div>

      <Modal
        open={open}
        title="Mouvement de stock"
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
                    "Sélectionner..."
                },
                ...stocks.map(
                  (item) => ({
                    value:
                      item.finishedLotCode,
                    label:
                      `${item.finishedLotCode} - ${item.availableQuantity} ${item.unit}`
                  })
                )
              ]}
            />
          </div>

          <Select
            label="Type"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type:
                  e.target.value
              })
            }
            options={[
              {
                value:
                  "Entrée",
                label:
                  "Entrée"
              },
              {
                value:
                  "Sortie",
                label:
                  "Sortie"
              }
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
            label="Motif"
            value={
              form.reason
            }
            onChange={(e) =>
              setForm({
                ...form,
                reason:
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

export default StockPage;
