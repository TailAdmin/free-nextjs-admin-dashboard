import React from "react";

interface ChartTabProps {
  selected: "weekly" | "monthly" | "yearly";
  onChange: (value: "weekly" | "monthly" | "yearly") => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, onChange }) => {
  const getButtonClass = (option: "weekly" | "monthly" | "yearly") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex w-full sm:w-fit items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange("weekly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "weekly"
        )}`}
      >
        Semanal
      </button>

      <button
        onClick={() => onChange("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Mensual
      </button>

      <button
        onClick={() => onChange("yearly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "yearly"
        )}`}
      >
        Anual
      </button>
    </div>
  );
};

export default ChartTab;
