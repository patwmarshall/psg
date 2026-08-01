import React, { useEffect, useState } from "react";

const THEMES = ["theme-classic", "theme-wood", "theme-dark", "theme-pastel"] as const;
type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "psg:theme";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return (saved as Theme) || "theme-classic";
    } catch {
      return "theme-classic";
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  return (
    <div className="theme-switcher" aria-label="Theme switcher" role="group">
      {THEMES.map((t) => {
        const name = t === "theme-classic" ? "Classic" : t.replace("theme-", "").replace(/^[a-z]/, (c) => c.toUpperCase());
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`button-primary ${theme === t ? "active" : ""}`}
            aria-pressed={theme === t}
            style={{ marginRight: 8, padding: "0.35rem 0.65rem", fontWeight: 600 }}
            title={`Switch to ${name} theme`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
