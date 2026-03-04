import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type PrimaryColor = 'emerald' | 'blue' | 'orange';

interface ThemeContextType {
  theme: Theme;
  primaryColor: PrimaryColor;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('quickpick_theme') as Theme) || 'light';
  });
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>(() => {
    return (localStorage.getItem('quickpick_primary_color') as PrimaryColor) || 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('quickpick_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('quickpick_primary_color', primaryColor);
    // We can use CSS variables to handle primary color globally if needed, 
    // but for now we'll just pass it through the context and use it in tailwind classes.
    // Actually, it's better to set a data attribute or class on the root.
    const root = document.documentElement;
    root.setAttribute('data-primary', primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ theme, primaryColor, setTheme, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
