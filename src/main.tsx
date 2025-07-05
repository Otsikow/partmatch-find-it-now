import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, handleInstallPrompt } from './utils/pwa'

// Register PWA service worker
registerServiceWorker();

// Handle PWA install prompt
handleInstallPrompt();

createRoot(document.getElementById("root")!).render(<App />);
