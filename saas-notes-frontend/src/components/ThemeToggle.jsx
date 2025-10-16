import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Load theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // Update DOM + localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`
        relative w-14 h-7 rounded-full flex items-center transition-all duration-500 ease-in-out
        ${theme === "dark" ? "bg-gray-800" : "bg-yellow-300"}
        shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.3)]
      `}
    >
      {/* Circle toggle thumb */}
      <div
        className={`
          absolute w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-500 ease-in-out transform
          ${theme === "dark" ? "translate-x-8 bg-gray-700 text-yellow-300" : "translate-x-0 bg-white text-yellow-600"}
          shadow-md
        `}
      >
        {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
      </div>
    </button>
  );
}
