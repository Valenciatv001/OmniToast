import { useEffect, useState } from 'react';
import { getState, subscribe } from './store';
import { toast, modal } from './ToastManager';
import type { StoreState } from './types';

/**
 * React hook to access the toast/modal state and imperative API.
 *
 * Works identically in @modal-toast/react and @modal-toast/native.
 *
 * @example
 * const { toast, modal, toasts, activeModal } = useToast();
 * toast.success('Saved!');
 * modal.error({ title: 'Error', message: 'Something failed.' });
 */
export function useToast() {
  const [state, setState] = useState<StoreState>(getState);

  useEffect(() => {
    // Sync once in case state changed between initial render and subscription
    setState(getState());
    return subscribe(setState);
  }, []);

  return {
    /** All currently visible toasts */
    toasts: state.toasts,
    /** The currently active modal, or null */
    activeModal: state.modal,
    /** Imperative toast API: toast.success / toast.error / toast.info / toast.dismiss / toast.dismissAll */
    toast,
    /** Imperative modal API: modal.success / modal.error / modal.info / modal.dismiss */
    modal,
  };
}
