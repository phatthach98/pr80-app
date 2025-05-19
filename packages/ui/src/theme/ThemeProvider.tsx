import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

// Define available themes
export type ThemeName = 'light' | 'dark' | 'brand';

// Theme context type
interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

// Props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  // State to track the current theme
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);

  // Set theme and apply to root element
  const setTheme = useCallback((newTheme: ThemeName) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setThemeState(newTheme);
  }, []);

  // Set the initial theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', defaultTheme);
    setThemeState(defaultTheme);
  }, [defaultTheme]);

  // Memoize the context value
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
