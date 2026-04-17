import { StyleSheet, View } from 'react-native';
import { useToast } from '@modal-toast/core';
import type { ToastPosition, ToastState } from '@modal-toast/core';
import { Toast } from './Toast';

interface ToastContainerProps {
  defaultPosition: ToastPosition;
  maxToasts: number;
  /** Optional top/bottom offset (e.g. to respect safe areas manually) */
  topOffset?: number;
  bottomOffset?: number;
}

function isBottom(pos: ToastPosition) {
  return pos === 'bottom' || pos === 'bottom-left' || pos === 'bottom-right';
}

function groupByPosition(toasts: ToastState[]): Map<ToastPosition, ToastState[]> {
  const map = new Map<ToastPosition, ToastState[]>();
  for (const t of toasts) {
    const bucket = map.get(t.position) ?? [];
    bucket.push(t);
    map.set(t.position, bucket);
  }
  return map;
}

function containerStyle(position: ToastPosition, top: number, bottom: number) {
  const base: Record<string, unknown> = {
    position: 'absolute',
    left: 16,
    right: 16,
  };

  if (isBottom(position)) {
    base.bottom = bottom;
    base.flexDirection = 'column-reverse';
  } else {
    base.top = top;
  }

  if (position.includes('left')) {
    base.alignItems = 'flex-start';
  } else if (position.includes('right')) {
    base.alignItems = 'flex-end';
  } else {
    base.alignItems = 'center';
  }

  return base;
}

/**
 * Renders active toasts as an absolute-positioned overlay.
 * Mount inside the root <View> of your app or inside <ToastProvider>.
 */
export function ToastContainer({
  maxToasts,
  topOffset = 50,
  bottomOffset = 30,
}: ToastContainerProps) {
  const { toasts } = useToast();

  const visible = toasts.slice(0, maxToasts);
  const grouped = groupByPosition(visible);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {Array.from(grouped.entries()).map(([position, items]) => (
        <View
          key={position}
          style={containerStyle(position, topOffset, bottomOffset)}
          pointerEvents="box-none"
        >
          {items.map((t) => (
            <Toast key={t.id} toast={t} />
          ))}
        </View>
      ))}
    </View>
  );
}
