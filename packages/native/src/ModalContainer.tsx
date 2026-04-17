import { useToast } from '@omnitoast/core';
import { Modal } from './Modal';

/**
 * Renders the currently active modal.
 * Mount this inside <ToastProvider> — handled automatically.
 */
export function ModalContainer() {
  const { activeModal } = useToast();

  if (!activeModal) return null;

  return <Modal key={activeModal.id} modalState={activeModal} />;
}
