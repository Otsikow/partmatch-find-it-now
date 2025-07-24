import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full hover:bg-white/30 transition-colors shadow-lg backdrop-blur-sm border border-white/20 text-white hover:text-white"
      aria-label="Toggle theme"
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-white drop-shadow-md" />
      ) : (
        <Moon className="h-4 w-4 text-white drop-shadow-md" />
      )}
    </Button>
  );
};

export default ThemeToggle;