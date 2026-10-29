"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: ResolvedTheme; // Resolved theme actually active ("light" or "dark")
  themeMode: ThemeMode; // The configured preference ("light", "dark", or "auto")
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [theme, setTheme] = useState<ResolvedTheme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code will only run on the client side
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
    const legacySavedTheme = localStorage.getItem(
      "theme",
    ) as ResolvedTheme | null;
    const initialMode = savedMode || (legacySavedTheme as ThemeMode) || "light";

    setThemeModeState(initialMode);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("theme-mode", themeMode);

    if (themeMode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const resolved = mediaQuery.matches ? "dark" : "light";
        setTheme(resolved);
      };

      handleChange();

      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    } else {
      setTheme(themeMode as ResolvedTheme);
    }
  }, [themeMode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-color-scheme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-color-scheme", "light");
      }
    }
  }, [theme, isInitialized]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState((prevMode) => {
      const currentResolved = theme;
      return currentResolved === "light" ? "dark" : "light";
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
