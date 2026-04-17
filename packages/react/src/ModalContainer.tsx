import { createPortal } from 'react-dom';
import { useToast } from '@modal-toast/core';
import { Modal } from './Modal';

/**
 * Renders the active modal into a portal.
 * Only one modal is shown at a time.
 */
export function ModalContainer() {
  const { activeModal } = useToast();

  if (!activeModal || typeof document === 'undefined') return null;

  return createPortal(
    <Modal key={activeModal.id} modalState={activeModal} />,
    document.body,
  );
}
