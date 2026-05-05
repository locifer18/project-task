import React, { FC } from "react";

interface InputProps {
  type?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  autoComplete?: string;
  required?: boolean;
  accept?: string;
}

const Input: FC<InputProps> = ({
  type = "text",
  id, name, placeholder, defaultValue, value, onChange,
  className = "", min, max, step, disabled = false,
  success = false, error = false, hint, autoComplete, required, accept,
}) => {
  let extra = "";
  if (error) extra = "border-red-500 focus:border-red-500 focus:ring-red-500/10 text-red-800 dark:text-red-400 dark:border-red-500";
  else if (success) extra = "border-green-400 focus:border-green-400 focus:ring-green-500/10";

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        accept={accept}
        className={`input-base ${extra} ${className}`}
      />
      {hint && (
        <p className={`mt-1.5 text-xs ${error ? "text-red-500" : success ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
