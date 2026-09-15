import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign Vite HMR websocket reconnection rejections from crashing the preview in AI Studio
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (
      msg.includes('WebSocket') ||
      msg.includes('websocket') ||
      msg.includes('closed without opened')
    ) {
      // Suppress benign Vite HMR dev-server websocket rejection
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
