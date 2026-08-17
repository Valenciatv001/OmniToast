import React, { createContext, useContext } from 'react';
import { OmniToastTheme } from '@omnitoast/core';

export const DEFAULT_THEME: Required<OmniToastTheme> = {
  colors: {
    background: 'rgba(15, 16, 22, 0.96)',
    text: '#f4f4f7',
    textMuted: 'rgba(244, 244, 247, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#10b981',
    error: '#f43f5e',
    info: '#06b6d4',
  },
  fontFamily: undefined as any,
  borderRadius: 12,
};

const ThemeContext = createContext<OmniToastTheme>(DEFAULT_THEME);

export function ThemeProvider({ theme, children }: { theme?: OmniToastTheme; children: React.ReactNode }) {
  // Merge provided theme with defaults
  const mergedTheme = React.useMemo(() => {
    if (!theme) return DEFAULT_THEME;
    return {
      colors: {
        ...DEFAULT_THEME.colors,
        ...theme.colors,
      },
      fontFamily: theme.fontFamily ?? DEFAULT_THEME.fontFamily,
      borderRadius: theme.borderRadius ?? DEFAULT_THEME.borderRadius,
    };
  }, [theme]);

  return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
