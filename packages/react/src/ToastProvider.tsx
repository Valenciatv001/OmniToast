import React from 'react';
import type { ToastPosition } from '@omnitoast/core';
import { ToastContainer } from './ToastContainer';
import { ModalContainer } from './ModalContainer';
import './styles.css';

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
}: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer defaultPosition={defaultPosition} maxToasts={maxToasts} />
      <ModalContainer />
    </>
  );
}
