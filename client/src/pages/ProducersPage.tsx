import {
  Archive,
  Edit3,
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

import Modal
  from "../components/ui/Modal";

import Table, {
  type TableColumn
} from "../components/ui/Table";

import SearchInput
  from "../components/common/SearchInput";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  Producer
} from "../types/producer";

import type {
  Parcel
} from "../types/parcel";

const ProducersPage = () => {
  const [
    producers,
    setProducers
  ] = useState<Producer[]>([]);

  const [
    parcels,
    setParcels
  ] = useState<Parcel[]>([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    editId,
    setEditId
  ] = useState<
    string | null
  >(null);

  const [form, setForm] =
    useState({
      fullName: "",
      phone: "",
      commune: "",
      fokontany: "",
      cooperative:
        "Tantsaha Miombona"
    });

  const load = async () => {
    const [
      producerRows,
      parcelRows
    ] = await Promise.all([
      businessService
        .producers
        .list(),

      businessService
        .parcels
        .list()
    ]);

    setProducers(
      producerRows
    );

    setParcels(
      parcelRows
    );
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered =
    useMemo(
      () =>
        producers.filter(
          (item) =>
            `${item.code} ${item.fullName} ${item.commune}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        ),
      [
        producers,
        search
      ]
    );

  const save = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (editId) {
      await businessService
        .producers
        .update(
          editId,
          form
        );
    } else {
      await businessService
        .producers
        .create(form);
    }

    setOpen(false);
    setEditId(null);

    await load();
  };

  const edit = (
  row: Producer
    ) => {
      setEditId(row.id);

      setForm({
        fullName:
          row.fullName,
        phone:
          row.phone,
        commune:
          row.commune,
        fokontany:
          row.fokontany,
        cooperative:
          row.cooperative
      });

      setOpen(true);
    };


  const columns:
    TableColumn<Producer>[] =
    [
      {
        key: "code",
        title: "Code"
      },
      {
        key:
          "fullName",
        title:
          "Producteur"
      },
      {
        key: "phone",
        title:
          "Téléphone"
      },
      {
        key: "commune",
        title:
          "Commune"
      },
      {
        key:
          "totalDeliveredKg",
        title:
          "Livré",
        render: (row) =>
          `${row.totalDeliveredKg} kg`
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
          "actions",
        title:
          "Actions",
        render: (row) => (
          <div className="table-actions">
            <button
              className="action-icon-button"
              onClick={() =>
                edit(row)
              }
            >
              <Edit3 size={14} />
            </button>

            <button
              className="action-icon-button"
              onClick={async () => {
                await businessService
                  .producers
                  .toggle(
                    row.id
                  );

                await load();
              }}
            >
              <Archive
                size={14}
              />
            </button>
          </div>
        )
      }
    ];

  return (
    <>
      <PageHeader
        title="Producteurs"
        description="Données enregistrées dans SQLite."
        actions={
          <Button
            onClick={() => {
              setEditId(null);

              setForm({
                fullName: "",
                phone: "",
                commune: "",
                fokontany: "",
                cooperative:
                  "Tantsaha Miombona"
              });

              setOpen(true);
            }}
          >
            <Plus size={16} />
            Nouveau
          </Button>
        }
      />

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">
            Producteurs
          </div>
          <div className="summary-value">
            {
              producers.length
            }
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">
            Actifs
          </div>
          <div className="summary-value">
            {
              producers.filter(
                (item) =>
                  item.status ===
                  "Actif"
              ).length
            }
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">
            Parcelles
          </div>
          <div className="summary-value">
            {parcels.length}
          </div>
        </div>
      </div>

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
        title={
          editId
            ? "Modifier"
            : "Nouveau producteur"
        }
        onClose={() =>
          setOpen(false)
        }
      >
        <form
          className="form-grid"
          onSubmit={save}
        >
          <Input
            label="Nom"
            value={
              form.fullName
            }
            onChange={(e) =>
              setForm({
                ...form,
                fullName:
                  e.target.value
              })
            }
          />

          <Input
            label="Téléphone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value
              })
            }
          />

          <Input
            label="Commune"
            value={
              form.commune
            }
            onChange={(e) =>
              setForm({
                ...form,
                commune:
                  e.target.value
              })
            }
          />

          <Input
            label="Fokontany"
            value={
              form.fokontany
            }
            onChange={(e) =>
              setForm({
                ...form,
                fokontany:
                  e.target.value
              })
            }
          />

          <div className="form-grid-full">
            <Input
              label="Coopérative"
              value={
                form.cooperative
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  cooperative:
                    e.target.value
                })
              }
            />
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

export default ProducersPage;
