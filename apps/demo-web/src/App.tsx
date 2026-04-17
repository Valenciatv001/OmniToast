import React, { useState } from 'react';
import { toast, modal, useToast } from '@omnitoast/react';
import type { ToastPosition } from '@omnitoast/react';

const POSITIONS: ToastPosition[] = [
  'top-left', 'top', 'top-right',
  'bottom-left', 'bottom', 'bottom-right',
];

const POSITION_LABELS: Record<ToastPosition, string> = {
  'top-left': '↖ top-left',
  'top': '↑ top',
  'top-right': '↗ top-right',
  'bottom-left': '↙ bottom-left',
  'bottom': '↓ bottom',
  'bottom-right': '↘ bottom-right',
};

export function App() {
  const { toasts } = useToast();
  const [position, setPosition] = useState<ToastPosition>('top-right');

  function fire(variant: 'success' | 'error' | 'info') {
    const messages = {
      success: ['Payment confirmed!', 'Profile saved.', 'Changes applied successfully.'],
      error:   ['Something went wrong.', 'Network error — please retry.', 'Upload failed.'],
      info:    ['New update available.', 'Sync complete.', '3 items pending review.'],
    };
    const msg = messages[variant][Math.floor(Math.random() * 3)];
    toast[variant](msg, { position });
  }

  function fireWithTitle(variant: 'success' | 'error' | 'info') {
    const config = {
      success: { title: 'Success', message: 'Your account has been activated.' },
      error:   { title: 'Error',   message: 'Could not connect to the server.' },
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
          toast.success('Published successfully!');
        },
      },
      error: {
        title: 'Delete permanently?',
        message: 'This action cannot be undone. All data associated with this item will be removed.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        onConfirm: () => { toast.error('Item deleted.', { duration: 3000 }); },
      },
      info: {
        title: 'Update available',
        message: 'Version 2.0 is ready to install. Restart the app to apply the update.',
        confirmLabel: 'Restart now',
        cancelLabel: 'Later',
        onConfirm: () => { toast.info('Restarting…'); },
      },
    }[variant];

    modal[variant](config);
  }

  return (
    <main className="demo">
      {/* Hero */}
      <div className="hero">
        <div className="hero__badge">
          <span>📦</span> @omnitoast
        </div>
        <h1 className="hero__title">
          Beautiful <em>toast notifications</em><br />for React & Expo
        </h1>
        <p className="hero__sub">
          A cross-platform modal toast package. One API, zero friction —
          works in React web apps and Expo React Native projects.
        </p>
      </div>

      <div className="panels">
        {/* ── Toast demos ─────────────────────────────────── */}
        <div className="panel">
          <p className="panel__label">Toasts</p>
          <p className="panel__title">Simple notifications</p>
          <div className="btn-grid">
            <button className="btn btn--success" onClick={() => fire('success')}>✓ Success</button>
            <button className="btn btn--error"   onClick={() => fire('error')}>✕ Error</button>
            <button className="btn btn--info"    onClick={() => fire('info')}>ℹ Info</button>
            <button className="btn btn--ghost"   onClick={() => toast.dismissAll()}>Dismiss all</button>
          </div>
        </div>

        {/* ── Toasts with title ──────────────────────────── */}
        <div className="panel">
          <p className="panel__label">Toasts</p>
          <p className="panel__title">With title</p>
          <div className="btn-grid">
            <button className="btn btn--success" onClick={() => fireWithTitle('success')}>✓ Success</button>
            <button className="btn btn--error"   onClick={() => fireWithTitle('error')}>✕ Error</button>
            <button className="btn btn--info"    onClick={() => fireWithTitle('info')}>ℹ Info</button>
            <button className="btn btn--ghost"   onClick={() => toast.success('No timeout!', { position, duration: 0 })}>
              Persistent
            </button>
          </div>
        </div>

        {/* ── Modal demos ──────────────────────────────── */}
        <div className="panel">
          <p className="panel__label">Modals</p>
          <p className="panel__title">Confirmation dialogs</p>
          <div className="btn-grid">
            <button className="btn btn--success" onClick={() => showModal('success')}>Publish</button>
            <button className="btn btn--error"   onClick={() => showModal('error')}>Delete</button>
            <button className="btn btn--info"    onClick={() => showModal('info')}>Update</button>
            <button className="btn btn--ghost"   onClick={() => modal.error({ message: 'This is urgent.', confirmLabel: 'OK' })}>
              Simple
            </button>
          </div>
        </div>

        {/* ── Position selector ────────────────────────── */}
        <div className="panel">
          <p className="panel__label">Position</p>
          <p className="panel__title">Toast position</p>
          <div className="position-grid">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                className={`pos-btn${position === pos ? ' pos-btn--active' : ''}`}
                onClick={() => setPosition(pos)}
              >
                {POSITION_LABELS[pos]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code snippet */}
      <div style={{ width: '100%', maxWidth: 820 }}>
        <div className="code-block">
          <span className="cm">{'// Works identically in React & Expo React Native\n'}</span>
          <span className="kw">import</span>{' { toast, modal, useToast } '}<span className="kw">from</span>{' '}<span className="str">'@omnitoast/react'</span>{'\n\n'}
          <span className="cm">{'// Imperative — works outside React components too\n'}</span>
          toast.<span className="fn">success</span>(<span className="str">'Payment confirmed!'</span>){'\n'}
          toast.<span className="fn">error</span>(<span className="str">'Something went wrong.'</span>, {'{ title: '}<span className="str">'Error'</span>{', duration: 0 }'}){'\n'}
          modal.<span className="fn">error</span>({'{ title: '}<span className="str">'Delete?'</span>{', message: '}<span className="str">'This is permanent.'</span>{', onConfirm: handleDelete }'}){'\n\n'}
          <span className="cm">{'// Hook — reactive access inside components\n'}</span>
          <span className="kw">const</span>{' { toast, toasts, activeModal } = '}<span className="fn">useToast</span>()
        </div>
      </div>

      {/* Active toast count */}
      {toasts.length > 0 && (
        <p style={{ fontSize: 13, color: 'rgba(240,240,245,0.35)' }}>
          {toasts.length} active toast{toasts.length > 1 ? 's' : ''}
        </p>
      )}
    </main>
  );
}
