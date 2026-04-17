import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider } from '@modal-toast/react';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
