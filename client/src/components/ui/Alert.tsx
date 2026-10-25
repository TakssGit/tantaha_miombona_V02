import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

type AlertVariant = "success" | "warning" | "danger" | "info";

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info
};

const Alert = ({
  variant = "info",
  children
}: AlertProps) => {
  const Icon = icons[variant];

  return (
    <div className={`ui-alert ui-alert-${variant}`}>
      <Icon size={17} />
      <div>{children}</div>
    </div>
  );
};

export default Alert;
