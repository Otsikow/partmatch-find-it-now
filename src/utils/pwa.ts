// PWA utility functions

// Register service worker with better error handling
export const registerServiceWorker = async (): Promise<void> => {
  // Skip in development to avoid caching issues
  if (import.meta.env.DEV) {
    console.log('Service Worker skipped in development mode');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }

  try {
    // Wait a moment to ensure the page is fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none' // Always check for updates
    });
    
    console.log('SW registered successfully:', registration.scope);
    
    // Handle updates gracefully
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New version available');
              // Auto-update after a delay
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              console.log('App cached for offline use');
            }
          }
        });
      }
    });

  } catch (error) {
    console.warn('SW registration failed (app will work normally):', error);
    // Don't throw - app should continue working without PWA features
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

// Check if app is running as PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

// Install prompt for PWA with better browser compatibility
export const handleInstallPrompt = (): void => {
  // Skip in development or if already a PWA
  if (import.meta.env.DEV || isPWA()) {
    return;
  }

  let deferredPrompt: any;
  let promptShown = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Don't show prompt immediately - wait for user engagement
    setTimeout(() => {
      if (!promptShown && deferredPrompt) {
        showInstallPrompt(deferredPrompt);
        promptShown = true;
      }
    }, 5000); // Wait 5 seconds after page load
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    promptShown = true;
  });
};

const showInstallPrompt = (deferredPrompt: any): void => {
  // Create install banner if not already a PWA
  if (!isPWA() && deferredPrompt) {
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
      <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #1e40af; color: white; padding: 16px; border-radius: 8px; z-index: 1000; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        <div>
          <strong>Install PartMatch Ghana</strong>
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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      installBanner.remove();
    });
    
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      installBanner.remove();
    });
  }
};