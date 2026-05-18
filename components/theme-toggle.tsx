"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "repforge-theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function handleToggle(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="pf-theme-toggle" aria-label="테마 전환">
      <button
        type="button"
        className={theme === "dark" ? "pf-theme-toggle__button pf-theme-toggle__button--active" : "pf-theme-toggle__button"}
        onClick={() => handleToggle("dark")}
      >
        다크
      </button>
      <button
        type="button"
        className={theme === "light" ? "pf-theme-toggle__button pf-theme-toggle__button--active" : "pf-theme-toggle__button"}
        onClick={() => handleToggle("light")}
      >
        라이트
      </button>
    </div>
  );
}
