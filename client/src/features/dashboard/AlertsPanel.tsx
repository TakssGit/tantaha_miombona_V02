import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

import Card from "../../components/ui/Card";
import { dashboardAlerts } from "../../data/dashboard.mock";

const iconMap = {
  danger: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info
};

const colorMap = {
  danger: {
    background: "#feecec",
    color: "#dc2626"
  },
  warning: {
    background: "#fff5d9",
    color: "#d97706"
  },
  success: {
    background: "#e8f8ee",
    color: "#16834c"
  },
  info: {
    background: "#e6f4ff",
    color: "#0284c7"
  }
};

const AlertsPanel = () => {
  return (
    <Card
      title="Alertes et suivi"
      description="Éléments nécessitant votre attention"
    >
      <div className="alert-list">
        {dashboardAlerts.map((alert) => {
          const Icon = iconMap[alert.level];
          const style = colorMap[alert.level];

          return (
            <div key={alert.id} className="alert-item">
              <div
                className="alert-item-icon"
                style={style}
              >
                <Icon size={16} />
              </div>

              <div>
                <div className="alert-item-title">
                  {alert.title}
                </div>

                <div className="alert-item-message">
                  {alert.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AlertsPanel;
