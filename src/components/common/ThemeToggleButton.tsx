import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon } from "../ui/sun-icon/SunIcon";
import { MoonIcon } from "../ui/moon-icon/MoonIcon";

export const ThemeToggleButton: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <span className="hidden dark:block">
        <SunIcon size={20} />
      </span>
      <span className="dark:hidden">
        <MoonIcon size={20} />
      </span>
    </button>
  );
};
