import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children, size = "md", variant = "primary",
  startIcon, endIcon, onClick, className = "", disabled = false, type = "button",
}) => {
  const sizeClass = size === "sm" ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm";

  const variantClass =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 shadow-sm"
      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition-colors duration-150 ${sizeClass} ${variantClass} ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
