import type { LotQualityClass } from "../../types/lot";

interface ClassBadgeProps {
  value: LotQualityClass;
}

const ClassBadge = ({ value }: ClassBadgeProps) => {
  const className =
    value === "A"
      ? "class-a"
      : value === "B"
        ? "class-b"
        : value === "C"
          ? "class-c"
          : value === "REJET"
            ? "class-rejet"
            : "class-none";

  const label =
    value === "NON_CLASSE"
      ? "Non classé"
      : value === "REJET"
        ? "Rejet"
        : `Classe ${value}`;

  return (
    <span className={`class-badge ${className}`}>
      {label}
    </span>
  );
};

export default ClassBadge;
