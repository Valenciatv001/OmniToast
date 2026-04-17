import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast, modal, useToast } from '@modal-toast/native';
import type { ToastPosition } from '@modal-toast/native';

// ─── Palette ────────────────────────────────────────────────────────────────

const COLORS = {
  bg: '#0a0a10',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHover: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.07)',
  text: '#f0f0f5',
  textMuted: 'rgba(240,240,245,0.5)',
  success: '#22c55e',
  error: '#ef4444',
  info: '#3b82f6',
};

// ─── Position options ────────────────────────────────────────────────────────

const POSITIONS: { label: string; value: ToastPosition }[] = [
  { label: '↖ top-left',     value: 'top-left' },
  { label: '↑ top',          value: 'top' },
  { label: '↗ top-right',    value: 'top-right' },
  { label: '↙ bottom-left',  value: 'bottom-left' },
  { label: '↓ bottom',       value: 'bottom' },
  { label: '↘ bottom-right', value: 'bottom-right' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function Panel({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <View style={styles.panel}>
      <SectionLabel label={label} />
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  color,
  textColor = '#fff',
  onPress,
}: {
  label: string;
  color: string;
  textColor?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.btn, styles.btnGhost]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.btnText, { color: COLORS.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function DemoScreen() {
  const insets = useSafeAreaInsets();
  const [position, setPosition] = useState<ToastPosition>('top');
  const { toasts } = useToast();

  // Toast helpers
  const randomMessage = (variant: 'success' | 'error' | 'info') => {
    const msgs = {
      success: ['Payment confirmed!', 'Profile saved.', 'Changes applied.'],
      error:   ['Something went wrong.', 'Network error — retry.', 'Upload failed.'],
      info:    ['New update available.', 'Sync complete.', 'You have 3 messages.'],
    };
    return msgs[variant][Math.floor(Math.random() * 3)];
  };

  function fireToast(variant: 'success' | 'error' | 'info') {
    toast[variant](randomMessage(variant), { position });
  }

  function fireToastWithTitle(variant: 'success' | 'error' | 'info') {
    const config = {
      success: { title: 'Success', message: 'Account activated successfully.' },
      error:   { title: 'Error',   message: 'Could not connect to server.' },
      info:    { title: 'Info',    message: 'You have 3 unread messages.' },
    }[variant];
    toast[variant](config.message, { title: config.title, position });
  }

  function showModal(variant: 'success' | 'error' | 'info') {
    const config = {
      success: {
        title: 'Publish changes?',
        message: 'Your updates will go live immediately and be visible to all users.',
        confirmLabel: 'Publish',
        cancelLabel: 'Cancel',
        onConfirm: async () => {
          await new Promise((r) => setTimeout(r, 1200));
          toast.success('Published successfully!', { position });
        },
      },
      error: {
        title: 'Delete permanently?',
        message: 'This action cannot be undone. All associated data will be removed.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        onConfirm: () => { toast.error('Item deleted.', { position }); },
      },
      info: {
        title: 'Update available',
        message: 'Version 2.0 is ready. Restart the app to apply the update.',
        confirmLabel: 'Restart now',
        cancelLabel: 'Later',
        onConfirm: () => { toast.info('Restarting…', { position }); },
      },
    }[variant];

    modal[variant](config);
  }

  return (
    <View style={[styles.root, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📦  @modal-toast/native</Text>
          </View>
          <Text style={styles.heroTitle}>
            Beautiful{' '}
            <Text style={styles.heroGradientText}>toasts & modals</Text>
            {'\n'}for Expo & React Native
          </Text>
          <Text style={styles.heroSub}>
            Cross-platform toast notification package.{'\n'}
            One API — works on iOS, Android & Web.
          </Text>
        </View>

        {/* ── Simple toasts ────────────────────────────────── */}
        <Panel label="TOASTS" title="Simple notifications">
          <View style={styles.btnGrid}>
            <ActionButton
              label="✓  Success"
              color={COLORS.success}
              textColor="#000"
              onPress={() => fireToast('success')}
            />
            <ActionButton
              label="✕  Error"
              color={COLORS.error}
              onPress={() => fireToast('error')}
            />
            <ActionButton
              label="ℹ  Info"
              color={COLORS.info}
              onPress={() => fireToast('info')}
            />
            <GhostButton
              label="Dismiss all"
              onPress={() => toast.dismissAll()}
            />
          </View>
        </Panel>

        {/* ── Toasts with title ────────────────────────────── */}
        <Panel label="TOASTS" title="With title">
          <View style={styles.btnGrid}>
            <ActionButton
              label="✓  Success"
              color={COLORS.success}
              textColor="#000"
              onPress={() => fireToastWithTitle('success')}
            />
            <ActionButton
              label="✕  Error"
              color={COLORS.error}
              onPress={() => fireToastWithTitle('error')}
            />
            <ActionButton
              label="ℹ  Info"
              color={COLORS.info}
              onPress={() => fireToastWithTitle('info')}
            />
            <GhostButton
              label="Persistent ∞"
              onPress={() =>
                toast.success('Tap × to dismiss', { position, duration: 0 })
              }
            />
          </View>
        </Panel>

        {/* ── Modal dialogs ────────────────────────────────── */}
        <Panel label="MODALS" title="Confirmation dialogs">
          <View style={styles.btnGrid}>
            <ActionButton
              label="Publish"
              color={COLORS.success}
              textColor="#000"
              onPress={() => showModal('success')}
            />
            <ActionButton
              label="Delete"
              color={COLORS.error}
              onPress={() => showModal('error')}
            />
            <ActionButton
              label="Update"
              color={COLORS.info}
              onPress={() => showModal('info')}
            />
            <GhostButton
              label="Simple"
              onPress={() =>
                modal.error({
                  message: 'This action is irreversible.',
                  confirmLabel: 'OK',
                })
              }
            />
          </View>
        </Panel>

        {/* ── Position picker ──────────────────────────────── */}
        <Panel label="POSITION" title="Toast position">
          <View style={styles.posGrid}>
            {POSITIONS.map((pos) => (
              <TouchableOpacity
                key={pos.value}
                style={[
                  styles.posBtn,
                  position === pos.value && styles.posBtnActive,
                ]}
                onPress={() => setPosition(pos.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.posBtnText,
                    position === pos.value && styles.posBtnTextActive,
                  ]}
                >
                  {pos.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Panel>

        {/* ── Code snippet ─────────────────────────────────── */}
        <View style={styles.codeBlock}>
          <Text style={styles.codeComment}>{'// Setup — App.tsx\n'}</Text>
          <Text style={styles.codeLine}>
            <Text style={styles.codeKw}>{'import '}</Text>
            <Text style={styles.code}>{'{ ToastProvider } '}</Text>
            <Text style={styles.codeKw}>{'from '}</Text>
            <Text style={styles.codeStr}>{"'@modal-toast/native'\n"}</Text>
          </Text>
          <Text style={styles.codeLine}>
            <Text style={styles.code}>{'<ToastProvider defaultPosition='}</Text>
            <Text style={styles.codeStr}>{'"top"'}</Text>
            <Text style={styles.code}>{'>\n  <App />\n</ToastProvider>\n\n'}</Text>
          </Text>
          <Text style={styles.codeComment}>{'// Usage — anywhere\n'}</Text>
          <Text style={styles.codeLine}>
            <Text style={styles.codeFn}>{'toast'}</Text>
            <Text style={styles.code}>{'.'}</Text>
            <Text style={styles.codeFn}>{'success'}</Text>
            <Text style={styles.code}>{"('Payment confirmed!')\n"}</Text>
          </Text>
          <Text style={styles.codeLine}>
            <Text style={styles.codeFn}>{'modal'}</Text>
            <Text style={styles.code}>{'.'}</Text>
            <Text style={styles.codeFn}>{'error'}</Text>
            <Text style={styles.code}>{'({ title: '}</Text>
            <Text style={styles.codeStr}>{"'Delete?'"}</Text>
            <Text style={styles.code}>{', onConfirm: fn })'}</Text>
          </Text>
        </View>

        {/* Active count */}
        {toasts.length > 0 && (
          <Text style={styles.activeCount}>
            {toasts.length} active toast{toasts.length > 1 ? 's' : ''}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    gap: 16,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingBottom: 8,
    gap: 14,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroGradientText: {
    color: COLORS.info, // can't do real gradient in RN Text without a library
  },
  heroSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Panel
  panel: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },

  // Button grid
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: COLORS.surfaceHover,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },

  // Position grid
  posGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  posBtn: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  posBtnActive: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  posBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  posBtnTextActive: {
    color: COLORS.info,
  },

  // Code block
  codeBlock: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  codeComment: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: 'rgba(240,240,245,0.25)',
    lineHeight: 20,
  },
  codeLine: {
    lineHeight: 20,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  codeKw: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#c084fc',
  },
  codeStr: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#86efac',
  },
  codeFn: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#60a5fa',
  },

  activeCount: {
    fontSize: 12,
    color: 'rgba(240,240,245,0.25)',
    textAlign: 'center',
    paddingBottom: 8,
  },
});
