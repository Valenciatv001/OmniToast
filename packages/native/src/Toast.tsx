import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { dismissToast } from '@omnitoast/core';
import type { ToastState, ToastPosition } from '@omnitoast/core';
import { VariantIcon } from './icons';
import { useTheme } from './ThemeContext';

interface ToastProps {
  toast: ToastState;
}

/** True when the position is bottom-anchored */
function isBottom(pos: ToastPosition) {
  return pos === 'bottom' || pos === 'bottom-left' || pos === 'bottom-right';
}

export function Toast({ toast: t }: ToastProps) {
  const { colors, borderRadius, fontFamily } = useTheme();
  const translateY = useRef(new Animated.Value(isBottom(t.position) ? 60 : -60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current; // progress bar
  const dismissed = useRef(false);

  // ── Enter animation ──────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 220,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    if (t.duration > 0) {
      Animated.timing(scaleX, {
        toValue: 0,
        duration: t.duration,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  // ── Dismiss ───────────────────────────────────────────────
  function handleDismiss() {
    if (dismissed.current) return;
    dismissed.current = true;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: isBottom(t.position) ? 60 : -60,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => dismissToast(t.id));
  }

  const accentColor = colors![t.variant as keyof typeof colors];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: colors!.background,
          borderColor: accentColor + '40',
          borderRadius: borderRadius ?? 14,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {/* Left colour stripe */}
      <View style={[styles.stripe, { backgroundColor: accentColor }]} />

      {/* Icon */}
      <View style={styles.iconWrap}>
        <VariantIcon variant={t.variant} size={20} color={accentColor} />
      </View>

      {/* Text */}
      <View style={styles.content}>
        {t.title ? (
          <Text style={[styles.title, { color: colors!.text, fontFamily }]} numberOfLines={1}>
            {t.title}
          </Text>
        ) : null}
        <Text
          style={[
            t.title ? styles.message : styles.messageOnly,
            { color: t.title ? colors!.textMuted : colors!.text, fontFamily },
          ]}
          numberOfLines={3}
        >
          {t.message}
        </Text>
      </View>

      {/* Close */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={handleDismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Dismiss notification"
      >
        <Text style={[styles.closeText, { color: colors!.textMuted }]}>✕</Text>
      </TouchableOpacity>

      {/* Progress bar */}
      {t.duration > 0 && (
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: accentColor,
              transform: [{ scaleX }],
              borderRadius: borderRadius ?? 14,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    width: '100%',
    overflow: 'hidden',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  stripe: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
  },
  iconWrap: {
    marginLeft: 8,
    marginTop: 1,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  messageOnly: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeBtn: {
    paddingHorizontal: 4,
    paddingTop: 1,
  },
  closeText: {
    fontSize: 13,
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    transformOrigin: 'left',
  },
});

