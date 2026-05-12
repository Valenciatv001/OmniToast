import { OmniToastTheme, ToastPosition } from '@omnitoast/core';
import { ToastContainer } from './ToastContainer';
import { ModalContainer } from './ModalContainer';
import './styles.css';
import React from 'react';

export interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Default position for toasts that don't specify their own.
   * @default 'top-right'
   */
  defaultPosition?: ToastPosition;
  /**
   * Default auto-dismiss duration in ms.
   * Individual toasts can override this.
   * @default 4000
   */
  defaultDuration?: number;
  /**
   * Maximum number of toasts shown at once.
   * @default 5
   */
  maxToasts?: number;
  /**
   * Custom theme overrides.
   */
  theme?: OmniToastTheme;
}

/**
 * Mount <ToastProvider> once at the root of your React app.
 *
 * @example
 * // React (Vite / CRA)
 * <ToastProvider defaultPosition="top-right">
 *   <App />
 * </ToastProvider>
 *
 * // Next.js App Router — layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ToastProvider>{children}</ToastProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function ToastProvider({
  children,
  defaultPosition = 'top-right',
  maxToasts = 5,
  theme,
}: ToastProviderProps) {
  const themeStyles = React.useMemo(() => {
    if (!theme) return undefined;
    const styles: Record<string, string | undefined> = {};
    if (theme.colors?.success) styles['--mt-success'] = theme.colors.success;
    if (theme.colors?.error) styles['--mt-error'] = theme.colors.error;
    if (theme.colors?.info) styles['--mt-info'] = theme.colors.info;
    if (theme.colors?.background) styles['--mt-bg'] = theme.colors.background;
    if (theme.colors?.text) styles['--mt-text'] = theme.colors.text;
    if (theme.colors?.textMuted) styles['--mt-text-muted'] = theme.colors.textMuted;
    if (theme.colors?.border) styles['--mt-border'] = theme.colors.border;
    if (theme.fontFamily) styles['--mt-font-family'] = theme.fontFamily;
    if (theme.borderRadius !== undefined) {
      styles['--mt-toast-radius'] = `${theme.borderRadius}px`;
    }
    return styles as React.CSSProperties;
  }, [theme]);

  return (
    <div className="mt-theme-provider" style={themeStyles}>
      {children}
      <ToastContainer defaultPosition={defaultPosition} maxToasts={maxToasts} />
      <ModalContainer />
    </div>
  );
}
