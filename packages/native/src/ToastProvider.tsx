import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ToastPosition } from '@omnitoast/core';
import { ToastContainer } from './ToastContainer';
import { ModalContainer } from './ModalContainer';

export interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Default position for toasts.
   * @default 'top'
   */
  defaultPosition?: ToastPosition;
  /**
   * Maximum number of toasts shown at once.
   * @default 4
   */
  maxToasts?: number;
  /**
   * Distance from the top edge (in px) for top-anchored toasts.
   * Use this to avoid the status bar / notch area if not using safe-area-context.
   * @default 50
   */
  topOffset?: number;
  /**
   * Distance from the bottom edge (in px) for bottom-anchored toasts.
   * @default 30
   */
  bottomOffset?: number;
}

/**
 * Mount <ToastProvider> once at the root of your Expo / RN app.
 *
 * @example
 * // App.tsx
 * import { ToastProvider } from '@omnitoast/native';
 *
 * export default function App() {
 *   return (
 *     <ToastProvider defaultPosition="top" topOffset={60}>
 *       <NavigationContainer>
 *         <RootNavigator />
 *       </NavigationContainer>
 *     </ToastProvider>
 *   );
 * }
 */
export function ToastProvider({
  children,
  defaultPosition = 'top',
  maxToasts = 4,
  topOffset = 50,
  bottomOffset = 30,
}: ToastProviderProps) {
  return (
    <View style={styles.root}>
      {children}
      <ToastContainer
        defaultPosition={defaultPosition}
        maxToasts={maxToasts}
        topOffset={topOffset}
        bottomOffset={bottomOffset}
      />
      <ModalContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
