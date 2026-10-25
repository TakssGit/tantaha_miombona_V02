import {
  Plus
} from "lucide-react";

import {
  useEffect,
  useMemo,
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

import Select
  from "../components/ui/Select";

import Modal
  from "../components/ui/Modal";

import Table, {
  type TableColumn
} from "../components/ui/Table";

import SearchInput
  from "../components/common/SearchInput";

import ClassBadge
  from "../components/common/ClassBadge";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  HarvestLot
} from "../types/lot";

import type {
  Producer
} from "../types/producer";

import type {
  Parcel
} from "../types/parcel";

const LotsPage = () => {
  const [
    lots,
    setLots
  ] =
    useState<
      HarvestLot[]
    >([]);

  const [
    producers,
    setProducers
  ] =
    useState<
      Producer[]
    >([]);

  const [
    parcels,
    setParcels
  ] =
    useState<
      Parcel[]
    >([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    open,
    setOpen
  ] = useState(false);

  const [form, setForm] =
    useState({
      producerCode: "",
      parcelCode: "",
      product: "Tomate",
      harvestDate:
        new Date()
          .toISOString()
          .slice(0, 10),
      harvestTime: "",
      quantityKg: "",
      crates: ""
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
            .lots.list(),

          businessService
            .producers.list(),

          businessService
            .parcels.list()
        ]);

      setLots(a);
      setProducers(b);
      setParcels(c);
    };

  useEffect(() => {
    void load();
  }, []);

  const filtered =
    useMemo(
      () =>
        lots.filter(
          (lot) =>
            `${lot.code} ${lot.producerName}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        ),
      [
        lots,
        search
      ]
    );

  const producer =
    producers.find(
      (item) =>
        item.code ===
        form.producerCode
    );

  const availableParcels =
    producer
      ? parcels.filter(
          (parcel) =>
            parcel.producerId ===
            producer.id
        )
      : [];

  const save =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      await businessService
        .lots.create({
          ...form,
          quantityKg:
            Number(
              form.quantityKg
            ),
          crates:
            Number(
              form.crates
            )
        });

      setOpen(false);

      await load();
    };

  const columns:
    TableColumn<HarvestLot>[] =
    [
      {
        key: "code",
        title: "Lot"
      },
      {
        key:
          "producerName",
        title:
          "Producteur"
      },
      {
        key:
          "harvestDate",
        title: "Date"
      },
      {
        key:
          "quantityKg",
        title:
          "Quantité",
        render: (row) =>
          `${row.quantityKg} kg`
      },
      {
        key:
          "qualityClass",
        title:
          "Classe",
        render: (row) => (
          <ClassBadge
            value={
              row.qualityClass
            }
          />
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
        title="Lots"
        description="Lots de récolte enregistrés dans SQLite."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouveau lot
          </Button>
        }
      />

      <Card>
        <div className="module-toolbar">
          <div className="module-search">
            <SearchInput
              value={search}
              onChange={setSearch}
            />
          </div>
        </div>

        <Table
          columns={columns}
          rows={filtered}
        />
      </Card>

      <Modal
        open={open}
        title="Nouveau lot"
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
              label="Producteur"
              value={
                form.producerCode
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  producerCode:
                    e.target.value,
                  parcelCode: ""
                })
              }
              options={[
                {
                  value: "",
                  label:
                    "Sélectionner..."
                },
                ...producers
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
                        `${item.code} - ${item.fullName}`
                    })
                  )
              ]}
            />
          </div>

          <Select
            label="Parcelle"
            value={
              form.parcelCode
            }
            onChange={(e) =>
              setForm({
                ...form,
                parcelCode:
                  e.target.value
              })
            }
            options={[
              {
                value: "",
                label:
                  "Non précisée"
              },
              ...availableParcels.map(
                (item) => ({
                  value:
                    item.code,
                  label:
                    item.code
                })
              )
            ]}
          />

          <Input
            label="Produit"
            value={
              form.product
            }
            onChange={(e) =>
              setForm({
                ...form,
                product:
                  e.target.value
              })
            }
          />

          <Input
            label="Date"
            type="date"
            value={
              form.harvestDate
            }
            onChange={(e) =>
              setForm({
                ...form,
                harvestDate:
                  e.target.value
              })
            }
          />

          <Input
            label="Heure"
            type="time"
            value={
              form.harvestTime
            }
            onChange={(e) =>
              setForm({
                ...form,
                harvestTime:
                  e.target.value
              })
            }
          />

          <Input
            label="Quantité kg"
            type="number"
            value={
              form.quantityKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                quantityKg:
                  e.target.value
              })
            }
          />

          <Input
            label="Cagettes"
            type="number"
            value={
              form.crates
            }
            onChange={(e) =>
              setForm({
                ...form,
                crates:
                  e.target.value
              })
            }
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

export default LotsPage;
