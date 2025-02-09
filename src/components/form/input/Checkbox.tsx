import React from "react";

interface CheckboxProps {
  label?: string; // Optional label for the checkbox
  checked: boolean; // Checked state
  className?: string;
  id?: string; // Unique ID for the checkbox
  onChange: (checked: boolean) => void; // Change handler
  disabled?: boolean; // Disabled state
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className={`w-4 h-4 ${className} dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:focus:outline-none rounded text-brand-500 dark:focus:ring-0 focus:ring-0 dark:focus:ring-transparent focus:ring-transparent focus:outline-none dark:focus:bg-outline-none focus:ring-offset-0`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && (
        <span className="font-medium text-gray-800 text-theme-sm dark:text-white">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
