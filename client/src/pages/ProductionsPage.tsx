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

import Table, {
  type TableColumn
} from "../components/ui/Table";

import {
  businessService
} from "../services/business.service";

import type {
  Production
} from "../types/production";

import type {
  Product
} from "../types/product";

import type {
  HarvestLot
} from "../types/lot";

const ProductionsPage = () => {
  const [
    rows,
    setRows
  ] =
    useState<
      Production[]
    >([]);

  const [
    products,
    setProducts
  ] =
    useState<
      Product[]
    >([]);

  const [
    lots,
    setLots
  ] =
    useState<
      HarvestLot[]
    >([]);

  const [
    selectedLots,
    setSelectedLots
  ] =
    useState<
      string[]
    >([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [form, setForm] =
    useState({
      productName:
        "Sauce tomate",
      inputKg: "",
      outputKg: "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10),
      status:
        "Terminée"
    });

  const load =
    async () => {
      const [
        a,
        b,
        c
      ] =
        await Promise.all([
          businessService
            .productions.list(),
          businessService
            .products.list(),
          businessService
            .lots.list()
        ]);

      setRows(a);
      setProducts(b);
      setLots(c);
    };

  useEffect(() => {
    void load();
  }, []);

  const save =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      await businessService
        .productions.create({
          ...form,
          inputLotCodes:
            selectedLots,
          inputKg:
            Number(
              form.inputKg
            ),
          outputKg:
            Number(
              form.outputKg
            )
        });

      setOpen(false);
      setSelectedLots([]);

      await load();
    };

  const toggleLot = (
    code: string
  ) => {
    setSelectedLots(
      (current) =>
        current.includes(
          code
        )
          ? current.filter(
              (item) =>
                item !== code
            )
          : [
              ...current,
              code
            ]
    );
  };

  const calculateInput =
    () => {
      const total =
        lots
          .filter(
            (lot) =>
              selectedLots.includes(
                lot.code
              )
          )
          .reduce(
            (sum, lot) =>
              sum +
              lot.quantityKg,
            0
          );

      setForm({
        ...form,
        inputKg:
          String(total)
      });
    };

  const columns:
    TableColumn<Production>[] =
    [
      {
        key: "code",
        title:
          "Fabrication"
      },
      {
        key:
          "productName",
        title:
          "Produit"
      },
      {
        key:
          "inputKg",
        title:
          "Entrée",
        render: (row) =>
          `${row.inputKg} kg`
      },
      {
        key:
          "outputKg",
        title:
          "Sortie",
        render: (row) =>
          `${row.outputKg} kg`
      },
      {
        key:
          "yieldRate",
        title:
          "Rendement",
        render: (row) =>
          `${row.yieldRate}%`
      },
      {
        key: "status",
        title:
          "Statut"
      }
    ];

  return (
    <>
      <PageHeader
        title="Transformation"
        description="Fabrications réellement enregistrées."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouvelle fabrication
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={rows}
        />
      </Card>

      <Modal
        open={open}
        title="Nouvelle fabrication"
        onClose={() =>
          setOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={save}
        >
          <div className="form-grid-full">
            <Select
              label="Produit"
              value={
                form.productName
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  productName:
                    e.target.value
                })
              }
              options={
                products.map(
                  (product) => ({
                    value:
                      product.name,
                    label:
                      product.name
                  })
                )
              }
            />
          </div>

          <div className="form-grid-full">
            <label className="form-label">
              Lots utilisés
            </label>

            <div className="checkbox-list">
              {lots
                .filter(
                  (lot) =>
                    lot.status !==
                    "Rejeté"
                )
                .map(
                  (lot) => (
                    <label
                      className="checkbox-item"
                      key={
                        lot.code
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedLots.includes(
                            lot.code
                          )
                        }
                        onChange={() =>
                          toggleLot(
                            lot.code
                          )
                        }
                      />

                      <div className="checkbox-main">
                        {
                          lot.code
                        }{" "}
                        -{" "}
                        {
                          lot.quantityKg
                        }{" "}
                        kg
                      </div>
                    </label>
                  )
                )}
            </div>

            <div
              style={{
                marginTop: 8
              }}
            >
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={
                  calculateInput
                }
              >
                Calculer l'entrée
              </Button>
            </div>
          </div>

          <Input
            label="Entrée kg"
            type="number"
            value={
              form.inputKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                inputKg:
                  e.target.value
              })
            }
          />

          <Input
            label="Sortie kg"
            type="number"
            value={
              form.outputKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                outputKg:
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
            label="Statut"
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
                  "En cours",
                label:
                  "En cours"
              },
              {
                value:
                  "Terminée",
                label:
                  "Terminée"
              },
              {
                value:
                  "Bloquée",
                label:
                  "Bloquée"
              }
            ]}
          />

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setOpen(false)
              }
            >
              Annuler
            </Button>

            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductionsPage;
