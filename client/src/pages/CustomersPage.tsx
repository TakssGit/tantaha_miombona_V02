import {
  Archive,
  Edit3,
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
  Customer
} from "../types/customer";

const CustomersPage = () => {
  const [
    rows,
    setRows
  ] =
    useState<
      Customer[]
    >([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    editId,
    setEditId
  ] =
    useState<
      string | null
    >(null);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      location: "",
      type:
        "Détaillant"
    });

  const load =
    async () => {
      setRows(
        await businessService
          .customers
          .list()
      );
    };

  useEffect(() => {
    void load();
  }, []);

  const save =
    async (
      e: FormEvent
    ) => {
      e.preventDefault();

      if (editId) {
        await businessService
          .customers
          .update(
            editId,
            form
          );
      } else {
        await businessService
          .customers
          .create(form);
      }

      setOpen(false);
      setEditId(null);

      await load();
    };

  const columns:
    TableColumn<Customer>[] =
    [
      {
        key: "code",
        title: "Code"
      },
      {
        key: "name",
        title: "Client"
      },
      {
        key: "phone",
        title:
          "Téléphone"
      },
      {
        key:
          "location",
        title:
          "Localisation"
      },
      {
        key: "type",
        title: "Type"
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
              onClick={() => {
                setEditId(
                  row.id
                );

                setForm({
                  name:
                    row.name,
                  phone:
                    row.phone,
                  location:
                    row.location,
                  type:
                    row.type
                });

                setOpen(true);
              }}
            >
              <Edit3 size={14} />
            </button>

            <button
              className="action-icon-button"
              onClick={async () => {
                await businessService
                  .customers
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
        title="Clients"
        description="Clients persistants dans SQLite."
        actions={
          <Button
            onClick={() => {
              setEditId(null);

              setForm({
                name: "",
                phone: "",
                location: "",
                type:
                  "Détaillant"
              });

              setOpen(true);
            }}
          >
            <Plus size={16} />
            Nouveau client
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
        title="Client"
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
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value
              })
            }
          />

          <Input
            label="Téléphone"
            value={
              form.phone
            }
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value
              })
            }
          />

          <Input
            label="Localisation"
            value={
              form.location
            }
            onChange={(e) =>
              setForm({
                ...form,
                location:
                  e.target.value
              })
            }
          />

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
                  "Détaillant",
                label:
                  "Détaillant"
              },
              {
                value:
                  "Grossiste",
                label:
                  "Grossiste"
              },
              {
                value:
                  "Restaurant",
                label:
                  "Restaurant"
              },
              {
                value:
                  "Particulier",
                label:
                  "Particulier"
              }
            ]}
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

export default CustomersPage;
