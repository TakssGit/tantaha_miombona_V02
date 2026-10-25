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
  NonConformity
} from "../types/nonconformity";

import type {
  HarvestLot
} from "../types/lot";

const NonConformitiesPage =
  () => {
    const [
      rows,
      setRows
    ] =
      useState<
        NonConformity[]
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
        category:
          "Qualité",
        cause: "",
        correctiveAction:
          "",
        responsible: "",
        date:
          new Date()
            .toISOString()
            .slice(0, 10),
        status: "Ouvert"
      });

    const load =
      async () => {
        const [
          a,
          b
        ] =
          await Promise.all([
            businessService
              .nonConformities
              .list(),

            businessService
              .lots.list()
          ]);

        setRows(a);
        setLots(b);
      };

    useEffect(() => {
      void load();
    }, []);

    const save =
      async (
        e: FormEvent
      ) => {
        e.preventDefault();

        await businessService
          .nonConformities
          .create(form);

        setOpen(false);

        await load();
      };

    const columns:
      TableColumn<NonConformity>[] =
      [
        {
          key: "code",
          title:
            "Référence"
        },
        {
          key:
            "lotCode",
          title: "Lot"
        },
        {
          key:
            "category",
          title: "Type"
        },
        {
          key: "cause",
          title: "Cause"
        },
        {
          key:
            "correctiveAction",
          title:
            "Action"
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
        },
        {
          key:
            "action",
          title:
            "Action",
          render: (row) =>
            row.status !==
            "Résolu" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={
                  async () => {
                    await businessService
                      .nonConformities
                      .resolve(
                        row.id
                      );

                    await load();
                  }
                }
              >
                Résoudre
              </Button>
            ) : (
              "-"
            )
        }
      ];

    return (
      <>
        <PageHeader
          title="Non-conformités"
          description="Registre SQLite des anomalies."
          actions={
            <Button
              onClick={() =>
                setOpen(
                  true
                )
              }
            >
              <Plus size={16} />
              Nouvelle
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
          title="Non-conformité"
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
                      "Aucun"
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

            <Select
              label="Catégorie"
              value={
                form.category
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value
                })
              }
              options={[
                "Qualité",
                "Transport",
                "Hygiène",
                "Quantité",
                "Traçabilité"
              ].map(
                (value) => ({
                  value,
                  label: value
                })
              )}
            />

            <Input
              label="Cause"
              value={
                form.cause
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  cause:
                    e.target.value
                })
              }
            />

            <div className="form-grid-full">
              <Input
                label="Action corrective"
                value={
                  form.correctiveAction
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    correctiveAction:
                      e.target.value
                  })
                }
              />
            </div>

            <Input
              label="Responsable"
              value={
                form.responsible
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  responsible:
                    e.target.value
                })
              }
            />

            <Input
              label="Date"
              type="date"
              value={
                form.date
              }
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

export default NonConformitiesPage;
