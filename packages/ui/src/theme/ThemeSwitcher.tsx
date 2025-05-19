import React from 'react';
import { useTheme, ThemeName } from './ThemeProvider';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
}) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className={`px-3 py-1 text-sm rounded-md border
          ${theme === 'light' ? 'bg-primary-500 text-white' : 'bg-transparent text-primary-500 border-primary-500'}`}
        onClick={() => handleThemeChange('light')}
      >
        Light
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md border
          ${theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-transparent text-primary-500 border-primary-500'}`}
        onClick={() => handleThemeChange('dark')}
      >
        Dark
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-md border
          ${theme === 'brand' ? 'bg-primary-500 text-white' : 'bg-transparent text-primary-500 border-primary-500'}`}
        onClick={() => handleThemeChange('brand')}
      >
        Brand
      </button>
    </div>
  );
};
