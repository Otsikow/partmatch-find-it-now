import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
}, 100);
