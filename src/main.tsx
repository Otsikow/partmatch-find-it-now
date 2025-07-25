import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

// Render the app first
createRoot(document.getElementById("root")!).render(<App />);

// Register PWA features after app renders (non-blocking)
setTimeout(() => {
  import('./utils/pwa').then(({ registerServiceWorker, handleInstallPrompt }) => {
    registerServiceWorker();
    handleInstallPrompt();
  }).catch((error) => {
    console.warn('PWA module failed to load:', error);
  });
}, 100);
