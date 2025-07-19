import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

// Render the app first
createRoot(document.getElementById("root")!).render(<App />);

// Register PWA features after app renders (non-blocking)
setTimeout(() => {
  import('./utils/pwa').then(({ registerServiceWorker, handleInstallPrompt }) => {
    registerServiceWorker().catch((error) => {
      console.warn('PWA features unavailable:', error);
    });
    handleInstallPrompt();
  }).catch((error) => {
    console.warn('PWA module failed to load:', error);
  });

  // Register Firebase messaging service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Firebase SW registered:', registration);
      })
      .catch((error) => {
        console.warn('Firebase SW registration failed:', error);
      });
  }
}, 100);
