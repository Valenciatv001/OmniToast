// Public API surface for @modal-toast/core

// ─── Imperative API ───────────────────────────────────────────────────────────
export { toast, modal } from './ToastManager';

// ─── React Hook ───────────────────────────────────────────────────────────────
export { useToast } from './useToast';

// ─── Low-level Store (for adapter packages) ───────────────────────────────────
export {
  getState,
  subscribe,
  addToast,
  dismissToast,
  dismissAllToasts,
  showModal,
  dismissModal,
} from './store';

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  ToastVariant,
  ToastPosition,
  ToastOptions,
  ToastState,
  ModalOptions,
  ModalState,
  StoreState,
  StoreListener,
} from './types';
