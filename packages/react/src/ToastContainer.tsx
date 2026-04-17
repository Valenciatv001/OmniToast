import { createPortal } from 'react-dom';
import { useToast } from '@modal-toast/core';
import type { ToastPosition, ToastState } from '@modal-toast/core';
import { Toast } from './Toast';

interface ToastContainerProps {
  /** Default position for toasts that don't specify their own */
  defaultPosition: ToastPosition;
  /** Maximum number of toasts visible at once */
  maxToasts: number;
}

/** Group toasts by their position key */
function groupByPosition(toasts: ToastState[]): Map<ToastPosition, ToastState[]> {
  const map = new Map<ToastPosition, ToastState[]>();
  for (const t of toasts) {
    const bucket = map.get(t.position) ?? [];
    bucket.push(t);
    map.set(t.position, bucket);
  }
  return map;
}

/**
 * Renders all active toasts into a portal attached to document.body.
 * Toasts are grouped by position; each position gets its own container div.
 */
export function ToastContainer({ maxToasts }: ToastContainerProps) {
  const { toasts } = useToast();

  // Slice to max length before grouping so maxToasts is respected globally
  const visible = toasts.slice(0, maxToasts);
  const grouped = groupByPosition(visible);

  if (typeof document === 'undefined') return null; // SSR guard

  const containers = Array.from(grouped.entries()).map(([position, items]) => (
    <div
      key={position}
      className={`mt-container mt-container--${position}`}
      aria-label="Notifications"
    >
      {items.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  ));

  return createPortal(<>{containers}</>, document.body);
}
