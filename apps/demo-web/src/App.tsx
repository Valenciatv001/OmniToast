import { useState, useRef, useEffect } from 'react';
import { toast, modal, useToast } from '@omnitoast/react';
import type { ToastPosition } from '@omnitoast/react';

interface EventLog {
  id: string;
  time: string;
  type: string;
  detail: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

const POSITIONS: { id: ToastPosition; label: string; gridArea: string }[] = [
  { id: 'top-left', label: 'Top Left', gridArea: 'tl' },
  { id: 'top', label: 'Top Center', gridArea: 'tc' },
  { id: 'top-right', label: 'Top Right', gridArea: 'tr' },
  { id: 'bottom-left', label: 'Bottom Left', gridArea: 'bl' },
  { id: 'bottom', label: 'Bottom Center', gridArea: 'bc' },
  { id: 'bottom-right', label: 'Bottom Right', gridArea: 'br' },
];

export function App() {
  const { toasts, activeModal } = useToast();
  const [activeTab, setActiveTab] = useState<'toast' | 'modal' | 'async' | 'imperative'>('toast');
  const [variant, setVariant] = useState<'success' | 'error' | 'info'>('success');
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [title, setTitle] = useState('System Updated');
  const [message, setMessage] = useState('All background services synced cleanly.');
  const [duration, setDuration] = useState(4000);
  const [isPersistent, setIsPersistent] = useState(false);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [copied, setCopied] = useState(false);
  const [codeTab, setCodeTab] = useState<'axios' | 'async' | 'react' | 'native'>('axios');

  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (type: string, detail: string, logVariant: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const now = new Date();
    const time = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    setLogs((prev) => [
      { id: Math.random().toString(36).substring(2, 9), time, type, detail, variant: logVariant },
      ...prev.slice(0, 49),
    ]);
  };

  useEffect(() => {
    addLog('SYSTEM_INIT', 'Engine initialized. Event listener attached.', 'info');
  }, []);

  const handleDispatchToast = () => {
    const dur = isPersistent ? 0 : duration;
    const opts = { title: title.trim() || undefined, position, duration: dur };

    if (variant === 'success') {
      toast.success(message, opts);
      addLog('TOAST_DISPATCH', `variant=success position=${position} duration=${dur}ms`, 'success');
    } else if (variant === 'error') {
      toast.error(message, opts);
      addLog('TOAST_DISPATCH', `variant=error position=${position} duration=${dur}ms`, 'error');
    } else {
      toast.info(message, opts);
      addLog('TOAST_DISPATCH', `variant=info position=${position} duration=${dur}ms`, 'info');
    }
  };

  const handleDispatchModal = () => {
    if (variant === 'error') {
      modal.error({
        title: title || 'Critical Action Required',
        message: message || 'Are you sure you want to proceed? This cannot be undone.',
        confirmLabel: 'Proceed',
        cancelLabel: 'Abort',
        onConfirm: () => {
          toast.error('Action confirmed.');
          addLog('MODAL_CONFIRM', 'User accepted danger modal payload.', 'error');
        },
        onCancel: () => {
          addLog('MODAL_CANCEL', 'Modal dismissed by user.', 'info');
        },
      });
      addLog('MODAL_OPEN', 'variant=error (modal)', 'error');
    } else {
      modal.info({
        title: title || 'System Notification',
        message: message || 'A new firmware version is available for deployment.',
        confirmLabel: 'Acknowledge',
        cancelLabel: 'Dismiss',
        onConfirm: () => {
          toast.success('Acknowledged');
          addLog('MODAL_CONFIRM', 'User acknowledged info modal.', 'success');
        },
      });
      addLog('MODAL_OPEN', 'variant=info (modal)', 'info');
    }
  };

  const handleAsyncPromisePreset = () => {
    addLog('PROMISE_INIT', 'Simulating async network mutation...', 'info');
    modal.error({
      title: 'Purge Storage Cache?',
      message: 'This operation simulates a 1.5s network transaction with automatic promise resolution.',
      confirmLabel: 'Execute Purge',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        addLog('PROMISE_PENDING', 'Promise pending... UI controls locked.', 'warning');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Database cache purged cleanly.', { position });
        addLog('PROMISE_RESOLVED', 'Promise resolved successfully in 1500ms.', 'success');
      },
    });
  };

  const handleAxiosPreset = () => {
    addLog('INTERCEPTOR_TRIGGER', 'Out-of-React trigger: Axios response status 503', 'error');
    toast.error('Network Gateway Error: Endpoint unreachable [503]', {
      title: 'API Interceptor',
      position,
      duration: 5000,
    });
  };

  const handleSpamTest = () => {
    addLog('STRESS_TEST', 'Spamming 6 rapid toasts to verify queue engine...', 'warning');
    const items = [
      { v: 'success' as const, m: 'Worker #1 connected' },
      { v: 'info' as const, m: 'Reading buffer chunk 0x8F' },
      { v: 'error' as const, m: 'Packet dropped on socket 4' },
      { v: 'success' as const, m: 'Retry successful' },
      { v: 'info' as const, m: 'Metrics pushed to Prometheus' },
    ];
    items.forEach((item, idx) => {
      setTimeout(() => {
        toast[item.v](item.m, { position });
      }, idx * 120);
    });
  };

  const generateCodeSnippet = () => {
    if (activeTab === 'toast') {
      const titleProp = title.trim() ? `, title: '${title}'` : '';
      const durProp = isPersistent ? `, duration: 0` : duration !== 3000 ? `, duration: ${duration}` : '';
      return `import { toast } from '@omnitoast/react';\n\n// Trigger from anywhere (React or Non-React)\ntoast.${variant}('${message}'${titleProp || durProp || position !== 'top-right' ? `, {\n  position: '${position}'${titleProp}${durProp}\n}` : ''});`;
    }
    if (activeTab === 'modal') {
      return `import { modal, toast } from '@omnitoast/react';\n\nmodal.${variant === 'error' ? 'error' : 'info'}({\n  title: '${title || 'Confirm Action'}',\n  message: '${message || 'Proceed with task?'}',\n  confirmLabel: 'Confirm',\n  cancelLabel: 'Cancel',\n  onConfirm: () => {\n    toast.success('Action executed!');\n  }\n});`;
    }
    if (activeTab === 'async') {
      return `import { modal, toast } from '@omnitoast/react';\n\n// Modal handles promise loading state natively\nmodal.error({\n  title: 'Delete Resource',\n  message: 'Permanently remove selected items?',\n  onConfirm: async () => {\n    await api.deleteResource(); // Button locks & shows loading...\n    toast.success('Resource deleted');\n  }\n});`;
    }
    return `// Outside React Component (e.g. src/services/api.ts)\nimport { toast } from '@omnitoast/core';\n\naxios.interceptors.response.use(\n  (res) => res,\n  (err) => {\n    toast.error(\`HTTP \${err.response?.status}: \${err.message}\`, {\n      title: 'Network Failure'\n    });\n    return Promise.reject(err);\n  }\n);`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      {/* Background Decorators */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar__inner">
          <div className="navbar__brand">
            <span className="navbar__logo-icon">⚡</span>
            <span className="navbar__logo-text">OmniToast</span>
            <span className="navbar__version-tag">v0.1.6</span>
          </div>

          <div className="navbar__meta">
            <span className="meta-badge meta-badge--green">
              <span className="status-dot" /> Core Zero-Deps
            </span>
            <span className="meta-badge">Pub/Sub Engine</span>
            <a
              href="https://github.com/Valenciatv001/OmniToast"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="navbar__link"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__chip">
          <span>ARCHITECTURAL SPECIFICATION</span> — Cross-Platform Modal & Toast Engine
        </div>
        <h1 className="hero__headline">
          High-performance notification core.<br />
          Decoupled from rendering cycles.
        </h1>
        <p className="hero__description">
          Engineered with a zero-dependency headless pub/sub state machine. Fire alerts from React components, Axios interceptors, or native modules with identical semantics.
        </p>

        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__val">0</span>
            <span className="stat-card__lbl">External Dependencies</span>
          </div>
          <div className="stat-card__divider" />
          <div className="stat-card">
            <span className="stat-card__val">&lt; 2.8 KB</span>
            <span className="stat-card__lbl">Minzipped Size</span>
          </div>
          <div className="stat-card__divider" />
          <div className="stat-card">
            <span className="stat-card__val">60 FPS</span>
            <span className="stat-card__lbl">Hardware Accelerated</span>
          </div>
          <div className="stat-card__divider" />
          <div className="stat-card">
            <span className="stat-card__val">Web & Expo</span>
            <span className="stat-card__lbl">Universal Adapters</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Workbench */}
      <main className="workbench">
        <div className="workbench__header">
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'toast' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('toast')}
            >
              Toasts
            </button>
            <button
              className={`tab-btn ${activeTab === 'modal' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('modal')}
            >
              Modals
            </button>
            <button
              className={`tab-btn ${activeTab === 'async' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('async')}
            >
              Promise Loading
            </button>
            <button
              className={`tab-btn ${activeTab === 'imperative' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('imperative')}
            >
              Imperative API
            </button>
          </div>
          <div className="workbench__status">
            <span>Stack Active: <strong>{toasts.length}</strong></span>
            {activeModal && <span className="badge-modal-active">Modal Open</span>}
          </div>
        </div>

        <div className="workbench__grid">
          {/* Left Panel: Controls */}
          <div className="panel panel--controls">
            <div className="panel__title-bar">
              <span className="panel__title">Control Workbench</span>
              <span className="panel__subtitle">Configure parameters</span>
            </div>

            {/* Variant Selector */}
            <div className="control-group">
              <label className="control-label">Status Variant</label>
              <div className="variant-grid">
                <button
                  className={`variant-btn variant-btn--success ${variant === 'success' ? 'active' : ''}`}
                  onClick={() => setVariant('success')}
                >
                  <span className="dot dot--success" /> Success
                </button>
                <button
                  className={`variant-btn variant-btn--error ${variant === 'error' ? 'active' : ''}`}
                  onClick={() => setVariant('error')}
                >
                  <span className="dot dot--error" /> Error
                </button>
                <button
                  className={`variant-btn variant-btn--info ${variant === 'info' ? 'active' : ''}`}
                  onClick={() => setVariant('info')}
                >
                  <span className="dot dot--info" /> Info
                </button>
              </div>
            </div>

            {/* Title & Message inputs */}
            <div className="control-group">
              <label className="control-label">Header Title (Optional)</label>
              <input
                type="text"
                className="input-text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Payment Confirmed"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Message Payload</label>
              <input
                type="text"
                className="input-text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message body"
              />
            </div>

            {/* Position Pinboard */}
            <div className="control-group">
              <label className="control-label">Display Anchor Position</label>
              <div className="pinboard">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos.id}
                    className={`pin-btn pin-btn--${pos.gridArea} ${position === pos.id ? 'active' : ''}`}
                    onClick={() => setPosition(pos.id)}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timing Slider */}
            <div className="control-group">
              <div className="control-label-flex">
                <label className="control-label">Auto-Dismiss Duration</label>
                <span className="control-val">{isPersistent ? 'Persistent (0ms)' : `${duration}ms`}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                disabled={isPersistent}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="range-input"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPersistent}
                  onChange={(e) => setIsPersistent(e.target.checked)}
                />
                Require manual user dismiss (Duration = 0)
              </label>
            </div>

            {/* Actions */}
            <div className="action-row">
              {activeTab === 'modal' ? (
                <button className="btn btn--primary" onClick={handleDispatchModal}>
                  Trigger Modal Dialog
                </button>
              ) : activeTab === 'async' ? (
                <button className="btn btn--primary" onClick={handleAsyncPromisePreset}>
                  Simulate Promise Lifecycle
                </button>
              ) : (
                <button className="btn btn--primary" onClick={handleDispatchToast}>
                  Dispatch Notification
                </button>
              )}

              <button className="btn btn--secondary" onClick={() => toast.dismissAll()}>
                Dismiss Stack
              </button>
            </div>

            {/* Real World Driver Presets */}
            <div className="presets-section">
              <span className="presets-title">Scenario Drivers:</span>
              <div className="preset-chips">
                <button className="chip" onClick={handleAxiosPreset}>
                  ⚡ Axios Interceptor 503
                </button>
                <button className="chip" onClick={handleAsyncPromisePreset}>
                  ⏳ Async Lock & Resolving State
                </button>
                <button className="chip" onClick={handleSpamTest}>
                  🚀 Queue Stress (Spam 5)
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Code Generator & Telemetry */}
          <div className="panel panel--inspector">
            <div className="panel__title-bar">
              <span className="panel__title">Live Inspector & Generator</span>
              <button className="copy-btn" onClick={copyCode}>
                {copied ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>

            {/* Generated Code Snippet */}
            <div className="code-container">
              <pre className="code-content">
                <code>{generateCodeSnippet()}</code>
              </pre>
            </div>

            {/* Real-time Telemetry Stream */}
            <div className="telemetry">
              <div className="telemetry__header">
                <span className="telemetry__title">
                  <span className="status-dot status-dot--pulse" /> Live Pub/Sub Telemetry Stream
                </span>
                <button className="clear-link" onClick={() => setLogs([])}>
                  Clear
                </button>
              </div>

              <div className="telemetry__log" ref={logContainerRef}>
                {logs.length === 0 ? (
                  <div className="log-empty">No events recorded. Trigger a toast or modal to inspect pub/sub dispatches.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className={`log-entry log-entry--${log.variant}`}>
                      <span className="log-time">{log.time}</span>
                      <span className="log-type">{log.type}</span>
                      <span className="log-detail">{log.detail}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Engineering Architecture & Integration Examples */}
      <section className="architecture-section">
        <h2 className="section-title">Core Architecture Design Principles</h2>
        <p className="section-subtitle">
          Designed to eliminate common pain points in modern React state distribution.
        </p>

        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-card__number">01</div>
            <h3 className="arch-card__title">Decoupled Headless Core</h3>
            <p className="arch-card__text">
              State logic lives inside a lightweight pub/sub listener model entirely separate from the React reconciliation tree. Call <code>toast.success()</code> inside web sockets, API interceptors, or Redux sagas without hook rules.
            </p>
          </div>

          <div className="arch-card">
            <div className="arch-card__number">02</div>
            <h3 className="arch-card__title">Zero-Render-Leak Engine</h3>
            <p className="arch-card__text">
              Triggering notifications will never trigger unnecessary re-renders in your main page components. Only the mounted container receives targeted pub/sub state patches.
            </p>
          </div>

          <div className="arch-card">
            <div className="arch-card__number">03</div>
            <h3 className="arch-card__title">Universal Adapter Contract</h3>
            <p className="arch-card__text">
              Write business triggers once. Swap <code>@omnitoast/react</code> for Web DOM portals or <code>@omnitoast/native</code> for React Native / Expo with zero modifications to application logic.
            </p>
          </div>
        </div>
      </section>

      {/* Code Integration Showcase */}
      <section className="code-showcase">
        <div className="code-showcase__header">
          <h2 className="section-title">Integration Patterns</h2>
          <div className="code-tabs">
            <button
              className={`code-tab ${codeTab === 'axios' ? 'active' : ''}`}
              onClick={() => setCodeTab('axios')}
            >
              Axios Interceptor
            </button>
            <button
              className={`code-tab ${codeTab === 'async' ? 'active' : ''}`}
              onClick={() => setCodeTab('async')}
            >
              Async Confirmation
            </button>
            <button
              className={`code-tab ${codeTab === 'react' ? 'active' : ''}`}
              onClick={() => setCodeTab('react')}
            >
              React Web Root
            </button>
            <button
              className={`code-tab ${codeTab === 'native' ? 'active' : ''}`}
              onClick={() => setCodeTab('native')}
            >
              Expo Router Layout
            </button>
          </div>
        </div>

        <div className="code-showcase__body">
          <pre className="code-block-large">
            <code>
              {codeTab === 'axios' && `// src/services/apiClient.ts
import axios from 'axios';
import { toast } from '@omnitoast/core';

export const apiClient = axios.create({ baseURL: 'https://api.domain.com' });

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⚡ Triggered seamlessly outside of any React component lifecycle!
    toast.error(error.response?.data?.message || 'Server request failed', {
      title: \`HTTP \${error.response?.status || 500}\`,
      duration: 5000
    });
    return Promise.reject(error);
  }
);`}
              {codeTab === 'async' && `// Inside any component or handler
import { modal, toast } from '@omnitoast/core';

export function handleUserDeletion(userId: string) {
  modal.danger({
    title: 'Delete User Account?',
    message: 'This operation wipes all database records irreversibly.',
    confirmLabel: 'Delete Account',
    cancelLabel: 'Cancel',

    // ⏳ Promise automatic tracking: button locks & displays loading indicator!
    onConfirm: async () => {
      try {
        await api.deleteUser(userId);
        toast.success('User account wiped successfully.');
      } catch (err) {
        toast.error('Failed to wipe user. Try again.');
      }
    }
  });
}`}
              {codeTab === 'react' && `// src/App.tsx
import { ToastProvider } from '@omnitoast/react';
import '@omnitoast/react/index.css';

export default function App() {
  return (
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <MainDashboard />
    </ToastProvider>
  );
}`}
              {codeTab === 'native' && `// app/_layout.tsx (Expo Router)
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@omnitoast/native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider defaultPosition="top" topOffset={60} maxToasts={4}>
        <Stack />
      </ToastProvider>
    </SafeAreaProvider>
  );
}`}
            </code>
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <p>© {new Date().getFullYear()} OmniToast • Distributed under MIT License</p>
          <p className="footer__sub">Engineered with precision for React & Expo developers.</p>
        </div>
      </footer>
    </div>
  );
}
