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

import Table, {
  type TableColumn
} from "../components/ui/Table";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  Transport
} from "../types/transport";

import type {
  HarvestLot
} from "../types/lot";

const TransportsPage = () => {
  const [
    transports,
    setTransports
  ] =
    useState<
      Transport[]
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

  const [
    selectedLots,
    setSelectedLots
  ] =
    useState<
      string[]
    >([]);

  const [form, setForm] =
    useState({
      driver: "",
      vehicle:
        "Camion léger",
      registration: "",
      date:
        new Date()
          .toISOString()
          .slice(0, 10),
      departure: "",
      arrival: "",
      quantityKg: ""
    });

  const load =
    async () => {
      const [
        a,
        b
      ] =
        await Promise.all([
          businessService
            .transports
            .list(),
          businessService
            .lots.list()
        ]);

      setTransports(a);
      setLots(b);
    };

  useEffect(() => {
    void load();
  }, []);

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

  const save =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      await businessService
        .transports
        .create({
          ...form,
          quantityKg:
            Number(
              form.quantityKg
            ),
          lotCodes:
            selectedLots
        });

      setOpen(false);
      setSelectedLots([]);

      await load();
    };

  const columns:
    TableColumn<Transport>[] =
    [
      {
        key: "code",
        title:
          "Transport"
      },
      {
        key: "driver",
        title:
          "Conducteur"
      },
      {
        key:
          "registration",
        title:
          "Immatriculation"
      },
      {
        key:
          "durationHours",
        title:
          "Durée",
        render: (row) =>
          `${row.durationHours} h`
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
        title="Transport"
        description="Transport et lots associés."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouveau transport
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={transports}
        />
      </Card>

      <Modal
        open={open}
        title="Nouveau transport"
        onClose={() =>
          setOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={save}
        >
          <Input
            label="Conducteur"
            value={
              form.driver
            }
            onChange={(e) =>
              setForm({
                ...form,
                driver:
                  e.target.value
              })
            }
          />

          <Input
            label="Véhicule"
            value={
              form.vehicle
            }
            onChange={(e) =>
              setForm({
                ...form,
                vehicle:
                  e.target.value
              })
            }
          />

          <Input
            label="Immatriculation"
            value={
              form.registration
            }
            onChange={(e) =>
              setForm({
                ...form,
                registration:
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
            label="Départ"
            type="time"
            value={
              form.departure
            }
            onChange={(e) =>
              setForm({
                ...form,
                departure:
                  e.target.value
              })
            }
          />

          <Input
            label="Arrivée"
            type="time"
            value={
              form.arrival
            }
            onChange={(e) =>
              setForm({
                ...form,
                arrival:
                  e.target.value
              })
            }
          />

          <div className="form-grid-full">
            <label className="form-label">
              Lots transportés
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
                        }
                      </div>
                    </label>
                  )
                )}
            </div>
          </div>

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

export default TransportsPage;
