import {
  useEffect,
  useState
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  Gauge,
  Scale,
  Sprout,
  Users
} from "lucide-react";

import PageHeader
  from "../components/layout/PageHeader";

import Card
  from "../components/ui/Card";

import Loader
  from "../components/ui/Loader";

import Table, {
  type TableColumn
} from "../components/ui/Table";

import StatusBadge
  from "../components/common/StatusBadge";

import {
  businessService
} from "../services/business.service";

import type {
  DashboardKpi,
  RecentLot
} from "../types/dashboard";

const icons = {
  producers: Users,
  lots: Sprout,
  quantity: Scale,
  quality: ClipboardCheck,
  loss: Boxes,
  yield: Gauge
};

const colors = [
  "#1f7a4d",
  "#2563eb",
  "#f59e0b",
  "#dc2626"
];

const DashboardPage = () => {
  const [
    data,
    setData
  ] = useState<any>(null);

  useEffect(() => {
    businessService
      .dashboard()
      .then(setData)
      .catch(
        console.error
      );
  }, []);

  if (!data) {
    return <Loader />;
  }

  const columns:
    TableColumn<RecentLot>[] =
    [
      {
        key: "code",
        title: "Lot"
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
        title: "Classe"
      },
      {
        key: "status",
        title: "Statut",
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
        title="Tableau de bord"
        description="Données réelles de la base SQLite locale."
      />

      <div className="dashboard-kpi-grid">
        {data.kpis.map(
          (
            kpi:
              DashboardKpi
          ) => {
            const Icon =
              icons[
                kpi.id as
                  keyof typeof icons
              ] || Gauge;

            return (
              <article
                className="kpi-card"
                key={kpi.id}
              >
                <div className="kpi-top">
                  <div
                    className={`kpi-icon ${kpi.color}`}
                  >
                    <Icon
                      size={19}
                    />
                  </div>
                </div>

                <div className="kpi-label">
                  {kpi.label}
                </div>

                <div className="kpi-value">
                  {kpi.value}
                </div>

                <div className="kpi-trend">
                  {kpi.trend}
                </div>
              </article>
            );
          }
        )}
      </div>

      <div className="dashboard-grid-two">
        <Card title="Quantités reçues">
          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  data.quantityEvolution
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={
                    false
                  }
                />

                <XAxis
                  dataKey="period"
                  tick={{
                    fontSize: 9
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 9
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="quantity"
                  fill="#1f7a4d"
                  radius={[
                    6,
                    6,
                    0,
                    0
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Qualité">
          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    data.qualityDistribution
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                >
                  {data.qualityDistribution.map(
                    (
                      item: any,
                      index: number
                    ) => (
                      <Cell
                        key={
                          item.name
                        }
                        fill={
                          colors[
                            index %
                              colors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid-two">
        <Card title="Évolution des pertes">
          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={
                  data.lossEvolution
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="period"
                  tick={{
                    fontSize: 9
                  }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  dataKey="value"
                  stroke="#dc2626"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Alertes">
          <div className="alert-list">
            {data.alerts.map(
              (
                alert: any
              ) => (
                <div
                  className="alert-item"
                  key={
                    alert.id
                  }
                >
                  <div className="alert-item-icon">
                    <AlertTriangle
                      size={16}
                    />
                  </div>

                  <div>
                    <div className="alert-item-title">
                      {
                        alert.title
                      }
                    </div>

                    <div className="alert-item-message">
                      {
                        alert.message
                      }
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      <div className="page-section">
        <Card title="Derniers lots">
          <Table
            columns={columns}
            rows={
              data.recentLots
            }
          />
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
