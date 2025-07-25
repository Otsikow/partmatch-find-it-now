// Simplified PWA utility functions for broad browser compatibility

// Register service worker with a streamlined approach
export const registerServiceWorker = (): void => {
  // Skip in development to avoid caching issues
  if (import.meta.env.DEV) {
    console.log('Service Worker registration skipped in development mode.');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          // Check for updates on page load
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available; a reload is needed.
                    console.log('New content is available, please refresh.');
                    // Optionally, prompt the user to reload.
                  } else {
                    // Content is cached for offline use.
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('Service Worker not supported in this browser.');
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show local notification
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/app-icon-192.png',
      badge: '/app-icon-192.png',
      ...options
    });
  }
};

// Enhanced PWA detection with Brave browser support
export const isPWA = (): boolean => {
  // Standard PWA detection
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as any).standalone;
  const isAndroidApp = document.referrer.includes('android-app://');
  
  // Brave browser specific detection
  const isBraveStandalone = window.matchMedia('(display-mode: window-controls-overlay)').matches;
  
  return isStandalone || isIosStandalone || isAndroidApp || isBraveStandalone;
};

// Enhanced install prompt with better Brave browser support
export const handleInstallPrompt = async (): Promise<void> => {
  // Skip in development or if already a PWA
  if (import.meta.env.DEV || isPWA()) {
    return;
  }

  // Check if user has previously dismissed the install prompt
  const hasInstalledOrDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
  if (hasInstalledOrDismissed) {
    return;
  }

  const brave = false; // Simplified for now
  let deferredPrompt: any;
  let promptShown = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // For Brave, show prompt with different timing
    const promptDelay = brave ? 8000 : 5000;
    setTimeout(() => {
      if (!promptShown && deferredPrompt) {
        showInstallPrompt(deferredPrompt, brave);
        promptShown = true;
      }
    }, promptDelay);
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    localStorage.setItem('pwa-install-dismissed', 'true');
    deferredPrompt = null;
    promptShown = true;
  });
};

const showInstallPrompt = (deferredPrompt: any, isBrave: boolean = false): void => {
  // Create install banner if not already a PWA
  if (!isPWA() && deferredPrompt) {
    const braveText = isBrave ? ' (Brave Browser)' : '';
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
      <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #1e40af; color: white; padding: 16px; border-radius: 8px; z-index: 1000; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        <div>
          <strong>Install PartMatch${braveText}</strong>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Get quick access from your home screen</p>
        </div>
        <div>
          <button id="install-btn" style="background: white; color: #1e40af; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 8px; cursor: pointer; font-weight: 500;">Install</button>
          <button id="dismiss-btn" style="background: transparent; color: white; border: 1px solid white; padding: 8px 12px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('install-btn')?.addEventListener('click', async () => {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
      } catch (error) {
        console.warn('Install prompt failed:', error);
      }
      installBanner.remove();
    });
    
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      installBanner.remove();
    });
  }
};