import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({
  title,
  description,
  action
}: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div>
        <div className="empty-state-icon">
          <Inbox size={27} />
        </div>

        <h3 className="empty-state-title">{title}</h3>

        {description && (
          <p className="empty-state-description">{description}</p>
        )}

        {action && <div style={{ marginTop: 15 }}>{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
