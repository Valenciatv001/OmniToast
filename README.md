# Modal Toast

A universal, headless-first modal and toast notification library for **React (Web)** and **Expo / React Native**. 

[![npm core](https://img.shields.io/npm/v/@omnitoast/core?style=flat-square&label=%40omnitoast%2Fcore&color=6366f1)](https://www.npmjs.com/package/@omnitoast/core)
[![npm react](https://img.shields.io/npm/v/@omnitoast/react?style=flat-square&label=%40omnitoast%2Freact&color=06b6d4)](https://www.npmjs.com/package/@omnitoast/react)
[![npm native](https://img.shields.io/npm/v/@omnitoast/native?style=flat-square&label=%40omnitoast%2Fnative&color=10b981)](https://www.npmjs.com/package/@omnitoast/native)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B%20%7C%2018%2B%20%7C%2019%2B-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-Compatible-000000?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://omni-toast-demo-web.vercel.app/)

### 🌐 [Live Web Demo (Try it!)](https://omni-toast-demo-web.vercel.app/)

Built with an **Adapter Pattern**, Modal Toast allows you to write your notification triggering logic once (even outside of React components, like inside Axios interceptors or Redux actions) and guarantees beautiful, fluid presentation across every platform.

---

## 📦 Features
- 🚀 **Universal API:** Fire toasts using exactly the same code on Web, iOS, and Android.
- 🧠 **Headless Core:** Zero-dependency pub/sub state machine ensures the highest performance without tying your logic to any rendering engine.
- 🎨 **Platform Optimized UI:**
  - **Web:** Portal-based rendering, rich CSS glassmorphic theming, and GPU accelerated transforms.
  - **Native:** Overlay-based unmounted absolute positioning and native `Animated` APIs for buttery-smooth unblocking performance.
- ⚙️ **Imperative Support:** Call `toast.success()` directly from anywhere. No need to pass down hooks props!

---

## 🛠 Installation

Because the business logic is abstracted, you install the **core** package alongside the **adapter** for your specific platform.

### For React Web
```bash
npm install @omnitoast/core @omnitoast/react
```
*Or using pnpm/yarn:*
```bash
pnpm add @omnitoast/core @omnitoast/react
```

### For Expo / React Native
```bash
npm install @omnitoast/core @omnitoast/native react-native-svg react-native-safe-area-context
```
*(Ensure `react-native-safe-area-context` and `react-native-svg` are appropriately linked in your app or installed via `npx expo install`)*

---

## 💻 Usage: React Web

### 1. Wrap your App with the Provider
Inject the `ToastProvider` at the root of your application to host the CSS and Portal.

```tsx
// App.tsx
import { ToastProvider } from '@omnitoast/react';
import '@omnitoast/react/index.css'; // Don't forget the styles!
import MyComponent from './MyComponent';

export default function App() {
  return (
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <MyComponent />
    </ToastProvider>
  );
}
```

### 2. Trigger Notifications anywhere
You can either use the standard React Hook configuration, or just import the universal `toast` manager to trigger state asynchronously without a React cycle.

#### Option A: Inside a Component (Hooks)
```tsx
import { useToast } from '@omnitoast/core';

export default function Dashboard() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success('Profile saved successfully!')}>
      Save Profile
    </button>
  );
}
```

#### Option B: Outside of React (Imperative)
Perfect for API interceptors or global utilities!
```ts
// api.ts
import { toast } from '@omnitoast/core';

api.interceptors.response.use(
  (res) => res,
  (error) => {
    toast.error('Network request failed: ' + error.message);
    return Promise.reject(error);
  }
);
```

---

## 📱 Usage: Expo / React Native

### 1. Wrap your App with the Provider
Inject the `ToastProvider` outside of your routing layer. Remember to have your app wrapped in `<SafeAreaProvider>` from `react-native-safe-area-context`.

```tsx
// app/_layout.tsx (Expo Router) OR App.tsx
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
}
```

### 2. Triggering Notifications & Modals
Because `modal` and `toast` share the exact same headless core engine, they are both accessible directly from the global state. You have two ways to trigger them:

**Method A: Destructure from the Hook (Inside React)**
```tsx
import { View, Button } from 'react-native';
import { useToast } from '@omnitoast/core'; // Pull both from useToast!

export default function MobileScreen() {
  const { toast, modal } = useToast();

  const handleDelete = () => {
    modal.danger({
      title: 'Delete Account',
      message: 'This operation cannot be undone. Are you sure?',
      confirmLabel: 'Delete Forever',
      cancelLabel: 'Keep Account',
      onConfirm: () => toast.info('Account fully wiped.')
    });
  };

  return <Button title="Delete Account" onPress={handleDelete} color="red" />;
}
```

**Method B: Direct Global Import (Outside React)**
Because OmniToast uses an independent state machine, you can launch native modals completely outside of the React lifecycle (e.g. from an API helper without needing hooks).

```tsx
import { toast, modal } from '@omnitoast/core'; // Imperative globals!

export function handleSystemFailure() {
    modal.danger({
      title: 'Critical Failure',
      message: 'The network connection was lost globally.',
      onConfirm: () => toast.success('Reconnecting...')
    });
}
```

### 3. Auto-Loading States (Promises)
OmniToast has a **built-in Promise-tracking engine**! If you pass an `async` function into `onConfirm`, the modal will automatically lock its buttons and display a loading state until the promise resolves.

```tsx
const handleDelete = () => {
  modal.danger({
    title: 'Delete everything?',
    message: 'Are you absolutely sure?',
    confirmLabel: 'Delete',
    
    // 👇 Because this is ASYNC, the Modal handles all loading states natively!
    onConfirm: async () => {
      try {
        // ⏳ The modal visually switches to "Loading..." and locks the buttons
        await backend.deleteUserAccount(); 
        
        // Modal cleanly slides away, and we chain a separate Toast!
        toast.success("Account deleted!");
      } catch (error) {
        // 🚨 If the backend fails, the Modal stops loading and stays open for another try!
        toast.error("Network failed. Try again.");
      }
    }
  });
};
```

---

## 🎨 Theming & Customization

OmniToast is designed to be fully brandable. You can customize colors, fonts, and borders across both Web and Native using the `theme` prop on the `ToastProvider`.

```tsx
const myTheme = {
  colors: {
    background: '#1a1a2e',
    text: '#ffffff',
    success: '#00d1b2',
    error: '#ff3860',
    info: '#209cee',
    border: 'rgba(255,255,255,0.1)'
  },
  borderRadius: 12,
  fontFamily: 'Inter-Regular' // (Native only: use your loaded font name)
};

// ... in your root file
<ToastProvider theme={myTheme}>
  <App />
</ToastProvider>
```

### Web Specifics (CSS Variables)
On the web, we use CSS custom properties. You can also override them directly in your global CSS:
```css
:root {
  --mt-success: #00d1b2;
  --mt-toast-radius: 8px;
}
```

---

## 📖 Component API

### `ToastProvider`
Props vary slightly between platforms because native layout differs significantly from CSS layout.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxToasts` | `number` | `3` | Max notifications displayed simultaneously before queueing. |
| `defaultPosition` | `string` | `'bottom-right'` (web) / `'top'` (native) | Where edge positioning is anchored. |
| `topOffset` | `number` | `50` | (Native Only) Pixels from the top safe area boundary |
| `bottomOffset` | `number`| `30` | (Native Only) Pixels from the bottom safe area boundary |

### `toast.[variant]()`
Available Variants: `toast.success()`, `toast.error()`, `toast.info()`, `toast.show()`.

```ts
toast.success('Your message here', {
  position: 'top-left', // override default position
  duration: 5000,       // auto-dismiss MS (default 3000)
  id: 'unique-id'       // prevent duplicates
});
```

### `modal.[variant]()`
Available Variants: `modal.info()`, `modal.danger()`, `modal.success()`, `modal.show()`.

```ts
modal.danger({
  title: 'String',
  message: 'String',
  confirmLabel: 'String',
  cancelLabel: 'String',
  onConfirm: () => void | Promise<void>,
  onClose: () => void
});
```
