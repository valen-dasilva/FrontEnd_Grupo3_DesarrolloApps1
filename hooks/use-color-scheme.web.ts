import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
  setColorScheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    if (systemScheme) {
      setColorSchemeState(systemScheme);
    }
  }, [systemScheme]);

  const toggleColorScheme = () => {
    setColorSchemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  const activeScheme = hasHydrated ? colorScheme : 'light';

  return React.createElement(
    ThemeContext.Provider,
    { value: { colorScheme: activeScheme, toggleColorScheme, setColorScheme } },
    children
  );
}

export function useColorScheme(): ColorScheme {
  const context = useContext(ThemeContext);
  return context.colorScheme;
}

export function useTheme() {
  return useContext(ThemeContext);
}
