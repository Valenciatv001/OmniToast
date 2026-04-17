// @ts-ignore
import Svg, { Circle, Path } from 'react-native-svg';
import { View } from 'react-native';
import type { ToastVariant } from '@omnitoast/core';

interface IconProps {
  color: string;
  size?: number;
}

/**
 * NOTE: react-native-svg must be installed in the consumer app.
 * Expo: expo install react-native-svg
 * Bare RN: npx pod-install
 *
 * If you prefer not to use react-native-svg, see icons.fallback.tsx
 * for a text/emoji-based alternative.
 */

export function SuccessIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <Path
        d="M6.5 10.5L8.5 12.5L13.5 7.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ErrorIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <Path
        d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function InfoIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <Path d="M10 9V14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="10" cy="6.5" r="0.75" fill={color} />
    </Svg>
  );
}

/** Color tokens per variant */
export const VARIANT_COLORS: Record<ToastVariant, string> = {
  success: '#22c55e',
  error:   '#ef4444',
  info:    '#3b82f6',
};

/** Returns the icon for a given variant */
export function VariantIcon({
  variant,
  size,
}: {
  variant: ToastVariant;
  size?: number;
}) {
  const color = VARIANT_COLORS[variant];
  switch (variant) {
    case 'success': return <SuccessIcon color={color} size={size} />;
    case 'error':   return <ErrorIcon color={color} size={size} />;
    case 'info':    return <InfoIcon color={color} size={size} />;
  }
}

/** Fallback close icon as a simple View (no react-native-svg required) */
export function CloseIconFallback() {
  return (
    <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
      {/* simple × using two rotated lines would need react-native-svg in practice */}
    </View>
  );
}
