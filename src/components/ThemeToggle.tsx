import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full hover:bg-white/30 transition-colors shadow-lg backdrop-blur-sm border border-white/20 text-white hover:text-white"
      aria-label="Toggle theme"
      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
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