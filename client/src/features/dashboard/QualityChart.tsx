import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import Card from "../../components/ui/Card";
import { qualityDistribution } from "../../data/dashboard.mock";

const COLORS = [
  "#1f7a4d",
  "#2563eb",
  "#f59e0b",
  "#dc2626"
];

const QualityChart = () => {
  return (
    <Card
      title="Répartition des lots"
      description="Classification qualité A / B / C / Rejet"
    >
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={qualityDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              {qualityDistribution.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `${value} %`} />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QualityChart;
