import React, { createContext, useContext } from 'react';
import { OmniToastTheme } from '@omnitoast/core';

export const DEFAULT_THEME: Required<OmniToastTheme> = {
  colors: {
    background: 'rgba(16, 16, 24, 0.97)',
    text: '#f0f0f5',
    textMuted: 'rgba(240, 240, 245, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6',
  },
  fontFamily: undefined as any,
  borderRadius: 14,
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
