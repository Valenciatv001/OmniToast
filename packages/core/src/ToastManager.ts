/**
 * Imperative API — usable inside AND outside React components.
 *
 * Example (Axios interceptor):
 *   import { toast } from '@omnitoast/core';
 *   toast.error('Session expired.');
 */

import {
  addToast,
  dismissToast,
  dismissAllToasts,
  showModal,
  dismissModal,
} from './store';
import type { ToastVariant, ToastOptions, ModalOptions } from './types';

// ─── Internal helpers ────────────────────────────────────────────────────────

type QuickToastOptions = Omit<ToastOptions, 'variant' | 'message'>;
type QuickModalOptions = Omit<ModalOptions, 'variant'>;

function makeToastFn(variant: ToastVariant) {
  return (message: string, options?: QuickToastOptions): string =>
    addToast({
      message,
      variant,
      id: options?.id,
      title: options?.title,
      duration: options?.duration,
      position: options?.position,
      onDismiss: options?.onDismiss,
    });
}

function makeModalFn(variant: ToastVariant) {
  return (options: QuickModalOptions): string =>
    showModal({
      variant,
      id: options.id,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
      onDismiss: options.onDismiss,
      dismissOnBackdrop: options.dismissOnBackdrop,
    });
}

// ─── toast ───────────────────────────────────────────────────────────────────

/**
 * Imperative toast API.
 *
 * @example
 * toast.success('Payment confirmed!');
 * toast.error('Something went wrong.', { title: 'Error', duration: 0 });
 * toast.info('New update available.');
 * toast.dismiss(id);
 * toast.dismissAll();
 */
export const toast = {
  /** Show a success toast */
  success: makeToastFn('success'),
  /** Show an error toast */
  error: makeToastFn('error'),
  /** Show an info toast */
  info: makeToastFn('info'),
  /** Dismiss a toast by ID */
  dismiss: dismissToast,
  /** Dismiss all active toasts */
  dismissAll: dismissAllToasts,
} as const;

// ─── modal ───────────────────────────────────────────────────────────────────

/**
 * Imperative modal API.
 *
 * @example
 * modal.error({
 *   title: 'Delete item?',
 *   message: 'This action cannot be undone.',
 *   confirmLabel: 'Delete',
 *   cancelLabel: 'Cancel',
 *   onConfirm: () => deleteItem(id),
 * });
 */
export const modal = {
  /** Show a success modal */
  success: makeModalFn('success'),
  /** Show an error modal */
  error: makeModalFn('error'),
  /** Show an info modal */
  info: makeModalFn('info'),
  /** Dismiss the current modal */
  dismiss: dismissModal,
} as const;
