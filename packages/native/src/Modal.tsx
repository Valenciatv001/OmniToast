import { useRef, useEffect, useState } from 'react';

import {
  Animated,
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { dismissModal } from '@omnitoast/core';
import type { ModalState } from '@omnitoast/core';
import { VariantIcon, VARIANT_COLORS } from './icons';

interface ModalProps {
  modalState: ModalState;
}

export function Modal({ modalState: m }: ModalProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const accentColor = VARIANT_COLORS[m.variant];

  // ── Enter animation ──────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 16, stiffness: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Dismiss ───────────────────────────────────────────────
  function close() {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.9, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      dismissModal();
    });
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

  function handleBackdrop() {
    if (m.dismissOnBackdrop) close();
  }

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdrop}>
        <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                { opacity, transform: [{ scale }] },
                { borderColor: accentColor + '30' },
              ]}
              accessibilityViewIsModal
              accessibilityRole="alert"
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: accentColor + '1a' }]}>
                  <VariantIcon variant={m.variant} size={24} />
                </View>
                {m.title ? (
                  <Text style={styles.title}>{m.title}</Text>
                ) : null}
              </View>

              {/* Body */}
              <View style={styles.body}>
                <Text style={styles.message}>{m.message}</Text>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                {m.cancelLabel ? (
                  <TouchableOpacity
                    style={[styles.btn, styles.btnCancel]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnCancelText}>{m.cancelLabel}</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.btn,
                    styles.btnConfirm,
                    { backgroundColor: accentColor },
                    loading && styles.btnDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.btnConfirmText,
                    m.variant === 'success' && { color: '#000' },
                  ]}>
                    {loading ? 'Loading…' : m.confirmLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'rgba(16, 16, 24, 0.97)',
    borderRadius: 20,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: 0.7,
        shadowRadius: 48,
      },
      android: { elevation: 24 },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#f0f0f5',
    letterSpacing: -0.3,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  message: {
    fontSize: 14,
    color: 'rgba(240,240,245,0.6)',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btn: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  btnCancel: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(240,240,245,0.6)',
  },
  btnConfirm: {
    minWidth: 90,
    alignItems: 'center',
  },
  btnConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.1,
  },
  btnDisabled: {
    opacity: 0.55,
  },
});
