// PWA utility functions

// Register service worker
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
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

// Install prompt for PWA
export const handleInstallPrompt = (): void => {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button or banner
    showInstallPrompt(deferredPrompt);
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
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