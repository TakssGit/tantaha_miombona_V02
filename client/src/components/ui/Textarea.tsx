import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = ({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`form-textarea ${className}`}
        {...props}
      />

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Textarea;
