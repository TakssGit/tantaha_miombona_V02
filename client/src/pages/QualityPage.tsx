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

import Modal
  from "../components/ui/Modal";

import Select
  from "../components/ui/Select";

import Table, {
  type TableColumn
} from "../components/ui/Table";

import ClassBadge
  from "../components/common/ClassBadge";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  QualityCheck
} from "../types/quality";

import type {
  HarvestLot
} from "../types/lot";

const QualityPage = () => {
  const [
    checks,
    setChecks
  ] =
    useState<
      QualityCheck[]
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
      maturity: 2,
      color: 2,
      firmness: 2,
      injuries: 2,
      health: 2,
      cleanliness: 2
    });

  const load =
    async () => {
      const [
        a,
        b
      ] =
        await Promise.all([
          businessService
            .quality.list(),
          businessService
            .lots.list()
        ]);

      setChecks(a);
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
        .quality.create(
          form
        );

      setOpen(false);

      await load();
    };

  const criteria = [
    "maturity",
    "color",
    "firmness",
    "injuries",
    "health",
    "cleanliness"
  ] as const;

  const labels:
    Record<
      string,
      string
    > = {
      maturity:
        "Maturité",
      color:
        "Couleur",
      firmness:
        "Fermeté",
      injuries:
        "Blessures",
      health:
        "État sanitaire",
      cleanliness:
        "Propreté"
    };

  const columns:
    TableColumn<QualityCheck>[] =
    [
      {
        key:
          "lotCode",
        title: "Lot"
      },
      {
        key: "score",
        title: "Score",
        render: (row) =>
          `${row.score}/12`
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
        title="Contrôle qualité"
        description="Contrôles persistants dans SQLite."
        actions={
          <Button
            onClick={() =>
              setOpen(true)
            }
          >
            <Plus size={16} />
            Nouveau contrôle
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          rows={checks}
        />
      </Card>

      <Modal
        open={open}
        title="Contrôle qualité"
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

          {criteria.map(
            (criterion) => (
              <Select
                key={criterion}
                label={
                  labels[
                    criterion
                  ]
                }
                value={
                  form[
                    criterion
                  ]
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    [criterion]:
                      Number(
                        e.target.value
                      )
                  })
                }
                options={[
                  {
                    value: 0,
                    label:
                      "0 - Faible"
                  },
                  {
                    value: 1,
                    label:
                      "1 - Moyen"
                  },
                  {
                    value: 2,
                    label:
                      "2 - Bon"
                  }
                ]}
              />
            )
          )}

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
              Valider
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QualityPage;
