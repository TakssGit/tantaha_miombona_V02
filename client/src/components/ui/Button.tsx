import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
