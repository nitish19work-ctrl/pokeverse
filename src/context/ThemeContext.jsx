import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();
const STORAGE_KEY = 'pokeverse-theme';

export function applyTheme(darkMode) {
  const root = document.documentElement;
  root.classList.toggle('dark', darkMode);
  root.classList.toggle('light', !darkMode);
  root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return true;
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(darkMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
