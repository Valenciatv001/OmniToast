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
import { VariantIcon, VARIANT_COLORS } from './icons';

interface ToastProps {
  toast: ToastState;
}

/** True when the position is bottom-anchored */
function isBottom(pos: ToastPosition) {
  return pos === 'bottom' || pos === 'bottom-left' || pos === 'bottom-right';
}

export function Toast({ toast: t }: ToastProps) {
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

  const accentColor = VARIANT_COLORS[t.variant];

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity, transform: [{ translateY }] },
        { borderColor: accentColor + '40' }, // 25% opacity border
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {/* Left colour stripe */}
      <View style={[styles.stripe, { backgroundColor: accentColor }]} />

      {/* Icon */}
      <View style={styles.iconWrap}>
        <VariantIcon variant={t.variant} size={20} />
      </View>

      {/* Text */}
      <View style={styles.content}>
        {t.title ? (
          <Text style={styles.title} numberOfLines={1}>
            {t.title}
          </Text>
        ) : null}
        <Text style={t.title ? styles.message : styles.messageOnly} numberOfLines={3}>
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
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Progress bar */}
      {t.duration > 0 && (
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: accentColor, transform: [{ scaleX }] },
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
    backgroundColor: 'rgba(14, 14, 22, 0.92)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: '#f0f0f5',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: 'rgba(240,240,245,0.6)',
    lineHeight: 18,
  },
  messageOnly: {
    fontSize: 14,
    color: '#f0f0f5',
    lineHeight: 20,
  },
  closeBtn: {
    paddingHorizontal: 4,
    paddingTop: 1,
  },
  closeText: {
    fontSize: 13,
    color: 'rgba(240,240,245,0.45)',
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 14,
    transformOrigin: 'left',
  },
});
