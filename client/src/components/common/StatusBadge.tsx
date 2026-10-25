import Badge from "../ui/Badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalized = status.toLowerCase();

  let variant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral" = "neutral";

  if (
    normalized.includes("conforme") ||
    normalized.includes("actif") ||
    normalized.includes("accepté") ||
    normalized.includes("disponible") ||
    normalized.includes("résolu")
  ) {
    variant = "success";
  } else if (
    normalized.includes("attente") ||
    normalized.includes("réserve") ||
    normalized.includes("déclassé")
  ) {
    variant = "warning";
  } else if (
    normalized.includes("rejet") ||
    normalized.includes("bloqué") ||
    normalized.includes("critique")
  ) {
    variant = "danger";
  } else if (
    normalized.includes("transport") ||
    normalized.includes("cours")
  ) {
    variant = "info";
  }

  return <Badge variant={variant}>{status}</Badge>;
};

export default StatusBadge;
