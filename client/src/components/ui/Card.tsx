import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({
  title,
  description,
  children,
  className = ""
}: CardProps) => {
  return (
    <section className={`ui-card ${className}`}>
      {(title || description) && (
        <header className="ui-card-header">
          {title && <h3 className="ui-card-title">{title}</h3>}
          {description && (
            <p className="ui-card-description">{description}</p>
          )}
        </header>
      )}

      <div className="ui-card-body">{children}</div>
    </section>
  );
};

export default Card;
