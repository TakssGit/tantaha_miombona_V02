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

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  Product
} from "../types/product";

import type {
  Production
} from "../types/production";

import type {
  FinishedBatch
} from "../types/finishedBatch";

const ProductsPage = () => {
  const [
    products,
    setProducts
  ] =
    useState<
      Product[]
    >([]);

  const [
    productions,
    setProductions
  ] =
    useState<
      Production[]
    >([]);

  const [
    batches,
    setBatches
  ] =
    useState<
      FinishedBatch[]
    >([]);

  const [
    productOpen,
    setProductOpen
  ] = useState(false);

  const [
    batchOpen,
    setBatchOpen
  ] = useState(false);

  const [
    productForm,
    setProductForm
  ] = useState({
    name: "",
    category: "",
    unit:
      "Bouteille",
    sellingPriceAr: ""
  });

  const [
    batchForm,
    setBatchForm
  ] = useState({
    productionCode: "",
    productCode: "",
    date:
      new Date()
        .toISOString()
        .slice(0, 10),
    quantity: "",
    unit: "kg",
    packaging:
      "Bouteille 500 ml",
    status:
      "Conforme"
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
            .products.list(),
          businessService
            .productions.list(),
          businessService
            .finishedBatches.list()
        ]);

      setProducts(a);
      setProductions(b);
      setBatches(c);
    };

  useEffect(() => {
    void load();
  }, []);

  const saveProduct =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      await businessService
        .products.create({
          ...productForm,
          sellingPriceAr:
            Number(
              productForm.sellingPriceAr
            )
        });

      setProductOpen(false);

      await load();
    };

  const saveBatch =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      await businessService
        .finishedBatches
        .create({
          ...batchForm,
          quantity:
            Number(
              batchForm.quantity
            )
        });

      setBatchOpen(false);

      await load();
    };

  const columns:
    TableColumn<FinishedBatch>[] =
    [
      {
        key: "code",
        title:
          "Lot fini"
      },
      {
        key:
          "productName",
        title:
          "Produit"
      },
      {
        key:
          "productionCode",
        title:
          "Fabrication"
      },
      {
        key:
          "quantity",
        title:
          "Quantité",
        render: (row) =>
          `${row.quantity} ${row.unit}`
      },
      {
        key:
          "packaging",
        title:
          "Conditionnement"
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
        title="Produits finis"
        description="Catalogue et lots finis."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setProductOpen(
                  true
                )
              }
            >
              <Plus size={16} />
              Produit
            </Button>

            <Button
              onClick={() =>
                setBatchOpen(
                  true
                )
              }
            >
              <Plus size={16} />
              Lot fini
            </Button>
          </>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={batches}
        />
      </Card>

      <Modal
        open={productOpen}
        title="Nouveau produit"
        onClose={() =>
          setProductOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={
            saveProduct
          }
        >
          <Input
            label="Nom"
            value={
              productForm.name
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                name:
                  e.target.value
              })
            }
          />

          <Input
            label="Catégorie"
            value={
              productForm.category
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                category:
                  e.target.value
              })
            }
          />

          <Input
            label="Unité"
            value={
              productForm.unit
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                unit:
                  e.target.value
              })
            }
          />

          <Input
            label="Prix Ar"
            type="number"
            value={
              productForm.sellingPriceAr
            }
            onChange={(e) =>
              setProductForm({
                ...productForm,
                sellingPriceAr:
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

      <Modal
        open={batchOpen}
        title="Nouveau lot fini"
        onClose={() =>
          setBatchOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={
            saveBatch
          }
        >
          <div className="form-grid-full">
            <Select
              label="Fabrication"
              value={
                batchForm.productionCode
              }
              onChange={(e) => {
                const production =
                  productions.find(
                    (item) =>
                      item.code ===
                      e.target.value
                  );

                const product =
                  products.find(
                    (item) =>
                      item.name ===
                      production
                        ?.productName
                  );

                setBatchForm({
                  ...batchForm,
                  productionCode:
                    e.target.value,
                  productCode:
                    product?.code ||
                    "",
                  quantity:
                    production
                      ? String(
                          production.outputKg
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
                ...productions.map(
                  (item) => ({
                    value:
                      item.code,
                    label:
                      `${item.code} - ${item.productName}`
                  })
                )
              ]}
            />
          </div>

          <Select
            label="Produit"
            value={
              batchForm.productCode
            }
            onChange={(e) =>
              setBatchForm({
                ...batchForm,
                productCode:
                  e.target.value
              })
            }
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

          <Input
            label="Quantité"
            type="number"
            value={
              batchForm.quantity
            }
            onChange={(e) =>
              setBatchForm({
                ...batchForm,
                quantity:
                  e.target.value
              })
            }
          />

          <Input
            label="Date"
            type="date"
            value={
              batchForm.date
            }
            onChange={(e) =>
              setBatchForm({
                ...batchForm,
                date:
                  e.target.value
              })
            }
          />

          <Input
            label="Conditionnement"
            value={
              batchForm.packaging
            }
            onChange={(e) =>
              setBatchForm({
                ...batchForm,
                packaging:
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

export default ProductsPage;
