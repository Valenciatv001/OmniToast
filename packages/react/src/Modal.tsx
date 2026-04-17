import { useState } from 'react';

import { dismissModal } from '@modal-toast/core';
import type { ModalState } from '@modal-toast/core';
import { VariantIcon } from './icons';

interface ModalProps {
  modalState: ModalState;
}

/**
 * Renders a single blocking modal dialog.
 * Handles confirm loading state, exit animation, and backdrop click.
 */
export function Modal({ modalState: m }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  function close() {
    setExiting(true);
    setTimeout(dismissModal, 200);
  }

  function handleBackdropClick() {
    if (m.dismissOnBackdrop) close();
  }

  async function handleConfirm() {
    if (loading) return;
    if (m.onConfirm) {
      setLoading(true);
      try {
        await m.onConfirm();
      } finally {
        setLoading(false);
      }
    }
    close();
  }

  function handleCancel() {
    m.onCancel?.();
    close();
  }

  return (
    <div
      className={`mt-modal-overlay${exiting ? ' mt-modal-overlay--exit' : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={`mt-modal mt-modal--${m.variant}${exiting ? ' mt-modal--exit' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={m.title ? `mt-modal-title-${m.id}` : undefined}
        aria-describedby={`mt-modal-msg-${m.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mt-modal__header">
          <div className="mt-modal__icon-wrap">
            <VariantIcon variant={m.variant} size={22} />
          </div>
          {m.title && (
            <h2
              className="mt-modal__title"
              id={`mt-modal-title-${m.id}`}
            >
              {m.title}
            </h2>
          )}
        </div>

        {/* Body */}
        <div className="mt-modal__body">
          <p className="mt-modal__message" id={`mt-modal-msg-${m.id}`}>
            {m.message}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-modal__footer">
          {m.cancelLabel && (
            <button
              className="mt-modal__btn mt-modal__btn--cancel"
              onClick={handleCancel}
              type="button"
            >
              {m.cancelLabel}
            </button>
          )}
          <button
            className="mt-modal__btn mt-modal__btn--confirm"
            onClick={handleConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? 'Loading…' : m.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
