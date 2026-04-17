import { useEffect, useState, useRef } from 'react';
import { dismissToast } from '@modal-toast/core';
import type { ToastState, ToastPosition } from '@modal-toast/core';
import { VariantIcon, CloseIcon } from './icons';

interface ToastProps {
  toast: ToastState;
}

/** Maps position group to the enter animation class */
function enterClass(position: ToastPosition): string {
  if (position.includes('right')) return 'mt-toast--enter-right';
  if (position.includes('left'))  return 'mt-toast--enter-left';
  if (position === 'top')         return 'mt-toast--enter-top';
  return 'mt-toast--enter-bottom';
}

/**
 * Individual toast component.
 * Handles its own enter/exit animation lifecycle.
 */
export function Toast({ toast: t }: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const dismissed = useRef(false);

  function handleDismiss() {
    if (dismissed.current) return;
    dismissed.current = true;
    setExiting(true);
    // Wait for CSS exit animation before removing from DOM
    setTimeout(() => dismissToast(t.id), 220);
  }

  // Track exiting state if the store removes the toast from outside
  useEffect(() => {
    if (!t.visible && !dismissed.current) {
      handleDismiss();
    }
  }, [t.visible]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'mt-toast',
        `mt-toast--${t.variant}`,
        exiting ? 'mt-toast--exit' : enterClass(t.position),
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Variant icon */}
      <VariantIcon
        variant={t.variant}
        className="mt-toast__icon"
        size={20}
      />

      {/* Text content */}
      <div className="mt-toast__content">
        {t.title && <p className="mt-toast__title">{t.title}</p>}
        <p className="mt-toast__message">{t.message}</p>
      </div>

      {/* Close button */}
      <button
        className="mt-toast__close"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        <CloseIcon size={14} />
      </button>

      {/* Progress bar — only shown for auto-dismiss toasts */}
      {t.duration > 0 && (
        <div
          className="mt-toast__progress"
          style={{ animationDuration: `${t.duration}ms` }}
        />
      )}
    </div>
  );
}
