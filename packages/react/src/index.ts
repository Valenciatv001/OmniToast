// Public API surface for @omnitoast/react

export { ToastProvider } from './ToastProvider';
export type { ToastProviderProps } from './ToastProvider';

// Re-export core API so consumers can import everything from one package
export { toast, modal, useToast } from '@omnitoast/core';
export type {
  ToastVariant,
  ToastPosition,
  ToastOptions,
  ToastState,
  ModalOptions,
  ModalState,
} from '@omnitoast/core';
