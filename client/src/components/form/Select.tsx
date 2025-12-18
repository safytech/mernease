import React from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
}) => {
  return (
    <div className="relative w-full">
      {/* Dropdown */}
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full rounded-lg px-4 pr-10 text-sm appearance-none shadow-theme-xs
          placeholder:text-gray-400 focus:outline-none
          dark:text-white/90 dark:placeholder:text-white/30
          ${
            error
              ? "border border-red-600 bg-red-50/30 text-red-700 placeholder-red-700 focus:border-red-600"
              : "border border-gray-300 bg-transparent focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800"
          } ${className}`}
      >
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <ChevronDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
          error
            ? "text-red-600 dark:text-red-400"
            : "text-gray-400 dark:text-gray-500"
        }`}
      />

      {/* Error message */}
      {error && hint && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{hint}</p>
      )}
    </div>
  );
};

export default Select;
