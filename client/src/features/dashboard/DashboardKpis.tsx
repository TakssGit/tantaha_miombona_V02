import {
  Boxes,
  ClipboardCheck,
  Gauge,
  Scale,
  Sprout,
  Users
} from "lucide-react";
import { dashboardKpis } from "../../data/dashboard.mock";

const iconMap = {
  producers: Users,
  lots: Sprout,
  quantity: Scale,
  quality: ClipboardCheck,
  loss: Boxes,
  yield: Gauge
};

const DashboardKpis = () => {
  return (
    <div className="dashboard-kpi-grid">
      {dashboardKpis.map((kpi) => {
        const Icon =
          iconMap[kpi.id as keyof typeof iconMap] ?? Gauge;

        return (
          <article key={kpi.id} className="kpi-card">
            <div className="kpi-top">
              <div className={`kpi-icon ${kpi.color}`}>
                <Icon size={19} />
              </div>
            </div>

            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-trend">{kpi.trend}</div>
          </article>
        );
      })}
    </div>
  );
};

export default DashboardKpis;
