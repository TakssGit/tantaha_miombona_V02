import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  actions
}: PageHeaderProps) => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-header-title">
          {title}
        </h1>

        {description && (
          <p className="page-header-description">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="page-header-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;