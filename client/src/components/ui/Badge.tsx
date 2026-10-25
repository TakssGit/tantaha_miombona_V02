import type { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const Badge = ({
  children,
  variant = "neutral"
}: BadgeProps) => {
  return (
    <span className={`ui-badge ui-badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
