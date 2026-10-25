import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import Card from "../../components/ui/Card";
import { lossEvolution } from "../../data/dashboard.mock";

const LossChart = () => {
  return (
    <Card
      title="Évolution des pertes"
      description="Taux de pertes post-récolte"
    >
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lossEvolution}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="period"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 20]}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip formatter={(value) => `${value} %`} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#dc2626"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LossChart;
