// Public API surface for @modal-toast/react

export { ToastProvider } from './ToastProvider';
export type { ToastProviderProps } from './ToastProvider';

// Re-export core API so consumers can import everything from one package
export { toast, modal, useToast } from '@modal-toast/core';
export type {
  ToastVariant,
  ToastPosition,
  ToastOptions,
  ToastState,
  ModalOptions,
  ModalState,
} from '@modal-toast/core';
