/**
 * @modal-toast/core — internal pub/sub store
 *
 * Intentionally framework-agnostic. No React, no external dependencies.
 * All UI adapters (React, React Native) subscribe to this store.
 */

import type {
  StoreState,
  StoreListener,
  ToastState,
  ModalState,
  ToastPosition,
  ToastVariant,
} from './types';

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = 'top-right';

// ─── State ───────────────────────────────────────────────────────────────────

let _state: StoreState = {
  toasts: [],
  modal: null,
};

const _listeners = new Set<StoreListener>();
const _timers = new Map<string, ReturnType<typeof setTimeout>>();
let _idCounter = 0;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return `mt-${++_idCounter}-${Date.now().toString(36)}`;
}

function publish(): void {
  // Always pass an immutable snapshot so listener comparisons work
  const snapshot: StoreState = {
    ..._state,
    toasts: [..._state.toasts],
  };
  _listeners.forEach((l) => l(snapshot));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Returns a shallow snapshot of the current store state. */
export function getState(): StoreState {
  return { ..._state, toasts: [..._state.toasts] };
}

/**
 * Subscribe to state changes.
 * @returns An unsubscribe function.
 */
export function subscribe(listener: StoreListener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

// ─── Toast Actions ────────────────────────────────────────────────────────────

export function addToast(options: {
  id?: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  onDismiss?: (id: string) => void;
}): string {
  const id = options.id ?? uid();
  const duration = options.duration ?? DEFAULT_DURATION;
  const position = options.position ?? DEFAULT_POSITION;

  const toast: ToastState = {
    id,
    message: options.message,
    title: options.title,
    variant: options.variant,
    duration,
    position,
    onDismiss: options.onDismiss,
    visible: true,
    createdAt: Date.now(),
  };

  _state = { ..._state, toasts: [toast, ..._state.toasts] };
  publish();

  if (duration > 0) {
    _timers.set(id, setTimeout(() => dismissToast(id), duration));
  }

  return id;
}

/** Dismiss a single toast by its ID. */
export function dismissToast(id: string): void {
  const toast = _state.toasts.find((t) => t.id === id);
  if (!toast) return;

  clearTimeout(_timers.get(id));
  _timers.delete(id);
  toast.onDismiss?.(id);

  _state = { ..._state, toasts: _state.toasts.filter((t) => t.id !== id) };
  publish();
}

/** Dismiss all active toasts at once. */
export function dismissAllToasts(): void {
  _timers.forEach((timer) => clearTimeout(timer));
  _timers.clear();
  _state.toasts.forEach((t) => t.onDismiss?.(t.id));
  _state = { ..._state, toasts: [] };
  publish();
}

// ─── Modal Actions ────────────────────────────────────────────────────────────

export function showModal(options: {
  id?: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onDismiss?: () => void;
  dismissOnBackdrop?: boolean;
}): string {
  const id = options.id ?? uid();

  const modal: ModalState = {
    id,
    title: options.title,
    message: options.message,
    variant: options.variant,
    confirmLabel: options.confirmLabel ?? 'Confirm',
    cancelLabel: options.cancelLabel,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
    onDismiss: options.onDismiss,
    dismissOnBackdrop: options.dismissOnBackdrop ?? true,
    visible: true,
  };

  _state = { ..._state, modal };
  publish();
  return id;
}

/** Dismiss the currently visible modal. */
export function dismissModal(): void {
  if (!_state.modal) return;
  _state.modal.onDismiss?.();
  _state = { ..._state, modal: null };
  publish();
}
