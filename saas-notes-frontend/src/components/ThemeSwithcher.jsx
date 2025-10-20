import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Zap,
  Sparkles,
  CloudMoon,
} from "lucide-react";

const themes = [
  { name: "default", label: "Light", icon: <Sun className="text-yellow-400" /> },
  { name: "theme-dark-neon", label: "Dark Neon", icon: <Zap className="text-cyan-400" /> },
  { name: "theme-cyber", label: "Cyber", icon: <Sparkles className="text-fuchsia-400" /> },
  { name: "theme-aurora", label: "Aurora", icon: <CloudMoon className="text-emerald-400" /> },
  { name: "theme-midnight", label: "Midnight", icon: <Moon className="text-indigo-400" /> },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Cycle through themes
  const nextTheme = () => {
    const idx = themes.findIndex((t) => t.name === theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next.name);
  };

  const current = themes.find((t) => t.name === theme);

  return (
    <button
      onClick={nextTheme}
      className="
        relative flex items-center justify-center w-14 h-8 rounded-full
        bg-surface/60 border border-border backdrop-blur-md
        shadow-[0_0_12px_var(--color-accent)] transition-all duration-500 ease-in-out
        hover:scale-105 group overflow-hidden
      "
      style={{
        boxShadow: "0 0 20px var(--color-accent)",
      }}
    >
      <div
        className="
          absolute left-0 top-0 h-full w-1/2 bg-[var(--color-accent)]
          rounded-l-full transition-all duration-500
          group-hover:w-[60%]
        "
        style={{ opacity: 0.15 }}
      />
      <div className="z-10 flex items-center gap-1 text-sm text-text font-medium">
        {current?.icon}
      </div>
    </button>
  );
}
