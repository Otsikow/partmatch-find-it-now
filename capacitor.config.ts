import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.da5f3cd368ef41748020511e0e3ffc08',
  appName: 'partmatch-find-it-now',
  webDir: 'dist',
  server: {
    url: 'https://da5f3cd3-68ef-4174-8020-511e0e3ffc08.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;