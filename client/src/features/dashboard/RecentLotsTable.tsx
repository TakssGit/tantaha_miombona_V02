import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Table, {
  type TableColumn
} from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/common/StatusBadge";

import { recentLots } from "../../data/dashboard.mock";
import type { RecentLot } from "../../types/dashboard";

const columns: TableColumn<RecentLot>[] = [
  {
    key: "code",
    title: "Code lot"
  },
  {
    key: "producer",
    title: "Producteur"
  },
  {
    key: "quantity",
    title: "Quantité"
  },
  {
    key: "qualityClass",
    title: "Classe",
    render: (row) => (
      <StatusBadge status={`Classe ${row.qualityClass}`} />
    )
  },
  {
    key: "status",
    title: "État",
    render: (row) => (
      <StatusBadge status={row.status} />
    )
  }
];

const RecentLotsTable = () => {
  return (
    <Card
      title="Derniers lots reçus"
      description="Dernières matières premières enregistrées"
    >
      <Table columns={columns} rows={recentLots} />

      <div
        style={{
          marginTop: 15,
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Link to="/lots">
          <Button variant="secondary" size="sm">
            Voir tous les lots
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default RecentLotsTable;
