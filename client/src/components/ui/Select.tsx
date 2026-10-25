import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select = ({
  label,
  error,
  options,
  id,
  className = "",
  ...props
}: SelectProps) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}

      <select
        id={id}
        className={`form-select ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Select;
