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
  Collection
} from "../types/collection";

import type {
  HarvestLot
} from "../types/lot";

const CollectionsPage = () => {
  const [
    items,
    setItems
  ] =
    useState<
      Collection[]
    >([]);

  const [
    lots,
    setLots
  ] =
    useState<
      HarvestLot[]
    >([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [form, setForm] =
    useState({
      lotCode: "",
      center:
        "Centre de collecte principal",
      grossWeightKg: "",
      acceptedWeightKg: "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10),
      time: ""
    });

  const load =
    async () => {
      const [
        a,
        b
      ] =
        await Promise.all([
          businessService
            .collections
            .list(),
          businessService
            .lots.list()
        ]);

      setItems(a);
      setLots(b);
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
        .collections
        .create({
          ...form,
          grossWeightKg:
            Number(
              form.grossWeightKg
            ),
          acceptedWeightKg:
            Number(
              form.acceptedWeightKg
            )
        });

      setOpen(false);
      await load();
    };

  const columns:
    TableColumn<Collection>[] =
    [
      {
        key: "code",
        title:
          "Collecte"
      },
      {
        key:
          "lotCode",
        title: "Lot"
      },
      {
        key: "center",
        title:
          "Centre"
      },
      {
        key:
          "grossWeightKg",
        title:
          "Poids brut",
        render: (row) =>
          `${row.grossWeightKg} kg`
      },
      {
        key:
          "acceptedWeightKg",
        title:
          "Accepté",
        render: (row) =>
          `${row.acceptedWeightKg} kg`
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
        title="Collecte"
        description="Collecte et tri enregistrés dans SQLite."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouvelle collecte
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={items}
        />
      </Card>

      <Modal
        open={open}
        title="Nouvelle collecte"
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
              label="Lot"
              value={
                form.lotCode
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  lotCode:
                    e.target.value
                })
              }
              options={[
                {
                  value: "",
                  label:
                    "Sélectionner..."
                },
                ...lots.map(
                  (lot) => ({
                    value:
                      lot.code,
                    label:
                      lot.code
                  })
                )
              ]}
            />
          </div>

          <div className="form-grid-full">
            <Input
              label="Centre"
              value={
                form.center
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  center:
                    e.target.value
                })
              }
            />
          </div>

          <Input
            label="Poids brut kg"
            type="number"
            value={
              form.grossWeightKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                grossWeightKg:
                  e.target.value
              })
            }
          />

          <Input
            label="Poids accepté kg"
            type="number"
            value={
              form.acceptedWeightKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                acceptedWeightKg:
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

          <Input
            label="Heure"
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({
                ...form,
                time:
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

export default CollectionsPage;
