// ─── Variant & Position ──────────────────────────────────────────────────────

/** The visual/semantic variant of a toast or modal */
export type ToastVariant = 'success' | 'error' | 'info';

/** Where on screen the toast appears */
export type ToastPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right';

// ─── Toast ───────────────────────────────────────────────────────────────────

/** Options passed to toast.success / toast.error / toast.info */
export interface ToastOptions {
  /** Optional custom ID. Auto-generated if omitted. */
  id?: string;
  /** Main notification message */
  message: string;
  /** Optional bold title rendered above the message */
  title?: string;
  /** Visual/semantic variant */
  variant: ToastVariant;
  /**
   * Duration in ms before the toast auto-dismisses.
   * Set to `0` to keep it on screen until manually dismissed.
   * @default 4000
   */
  duration?: number;
  /**
   * Override the default position set on <ToastProvider>.
   * @default 'top-right'
   */
  position?: ToastPosition;
  /** Called when the toast is dismissed (auto or manual) */
  onDismiss?: (id: string) => void;
}

/** Internal toast state stored in the pub/sub store */
export interface ToastState {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration: number;
  position: ToastPosition;
  onDismiss?: (id: string) => void;
  visible: boolean;
  createdAt: number;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

/** Options passed to modal.success / modal.error / modal.info */
export interface ModalOptions {
  /** Optional custom ID */
  id?: string;
  /** Modal heading */
  title?: string;
  /** Modal body text */
  message: string;
  /** Visual/semantic variant for icon and button colors */
  variant: ToastVariant;
  /**
   * Label for the primary action button.
   * @default 'Confirm'
   */
  confirmLabel?: string;
  /** Label for the secondary/cancel button. Omit to hide it. */
  cancelLabel?: string;
  /** Called when the confirm button is pressed */
  onConfirm?: () => void | Promise<void>;
  /** Called when the cancel button is pressed */
  onCancel?: () => void;
  /** Called when the modal closes by any means */
  onDismiss?: () => void;
  /**
   * Whether pressing the backdrop closes the modal.
   * @default true
   */
  dismissOnBackdrop?: boolean;
}

/** Internal modal state stored in the pub/sub store */
export interface ModalState {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onDismiss?: () => void;
  dismissOnBackdrop: boolean;
  visible: boolean;
}

// ─── Store ───────────────────────────────────────────────────────────────────

/** Full snapshot of the pub/sub store */
export interface StoreState {
  toasts: ToastState[];
  /** At most one modal is displayed at a time */
  modal: ModalState | null;
}

/** Listener callback signature for store subscriptions */
export type StoreListener = (state: StoreState) => void;
