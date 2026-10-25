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
  Reception
} from "../types/reception";

import type {
  HarvestLot
} from "../types/lot";

import type {
  Transport
} from "../types/transport";

const ReceptionsPage = () => {
  const [
    rows,
    setRows
  ] =
    useState<
      Reception[]
    >([]);

  const [
    lots,
    setLots
  ] =
    useState<
      HarvestLot[]
    >([]);

  const [
    transports,
    setTransports
  ] =
    useState<
      Transport[]
    >([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [form, setForm] =
    useState({
      lotCode: "",
      transportCode: "",
      announcedWeightKg: "",
      receivedWeightKg: "",
      decision: "Accepté",
      date:
        new Date()
          .toISOString()
          .slice(0, 10)
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
            .receptions.list(),
          businessService
            .lots.list(),
          businessService
            .transports.list()
        ]);

      setRows(a);
      setLots(b);
      setTransports(c);
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
        .receptions.create({
          ...form,
          announcedWeightKg:
            Number(
              form.announcedWeightKg
            ),
          receivedWeightKg:
            Number(
              form.receivedWeightKg
            )
        });

      setOpen(false);

      await load();
    };

  const columns:
    TableColumn<Reception>[] =
    [
      {
        key: "code",
        title:
          "Réception"
      },
      {
        key:
          "lotCode",
        title: "Lot"
      },
      {
        key:
          "transportCode",
        title:
          "Transport"
      },
      {
        key:
          "receivedWeightKg",
        title:
          "Reçu",
        render: (row) =>
          `${row.receivedWeightKg} kg`
      },
      {
        key:
          "lossRate",
        title:
          "Perte",
        render: (row) =>
          `${row.lossRate}%`
      },
      {
        key:
          "decision",
        title:
          "Décision",
        render: (row) => (
          <StatusBadge
            status={
              row.decision
            }
          />
        )
      }
    ];

  return (
    <>
      <PageHeader
        title="Réceptions"
        description="Réceptions et pertes enregistrées dans SQLite."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouvelle réception
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
        title="Nouvelle réception"
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
            <Select
              label="Transport"
              value={
                form.transportCode
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  transportCode:
                    e.target.value
                })
              }
              options={[
                {
                  value: "",
                  label:
                    "Sélectionner..."
                },
                ...transports.map(
                  (item) => ({
                    value:
                      item.code,
                    label:
                      item.code
                  })
                )
              ]}
            />
          </div>

          <Input
            label="Poids annoncé"
            type="number"
            value={
              form.announcedWeightKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                announcedWeightKg:
                  e.target.value
              })
            }
          />

          <Input
            label="Poids reçu"
            type="number"
            value={
              form.receivedWeightKg
            }
            onChange={(e) =>
              setForm({
                ...form,
                receivedWeightKg:
                  e.target.value
              })
            }
          />

          <Select
            label="Décision"
            value={
              form.decision
            }
            onChange={(e) =>
              setForm({
                ...form,
                decision:
                  e.target.value
              })
            }
            options={[
              {
                value:
                  "Accepté",
                label:
                  "Accepté"
              },
              {
                value:
                  "Accepté sous réserve",
                label:
                  "Accepté sous réserve"
              },
              {
                value:
                  "Déclassé",
                label:
                  "Déclassé"
              },
              {
                value:
                  "Rejeté",
                label:
                  "Rejeté"
              }
            ]}
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

export default ReceptionsPage;
