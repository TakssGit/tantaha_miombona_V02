import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import Card from "../../components/ui/Card";
import { quantityEvolution } from "../../data/dashboard.mock";

const QuantityChart = () => {
  return (
    <Card
      title="Évolution des quantités reçues"
      description="Quantité de tomates réceptionnée par jour"
    >
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={quantityEvolution}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} kg`, "Quantité"]}
            />
            <Bar
              dataKey="quantity"
              fill="#1f7a4d"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QuantityChart;
