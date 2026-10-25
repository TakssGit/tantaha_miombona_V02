import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, id, className = "", ...props }: InputProps) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={`form-input ${className}`}
        {...props}
      />

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Input;
