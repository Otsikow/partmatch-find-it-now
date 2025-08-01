// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIGwoXEcYnmWepvG1Gf4bPCK4jFdNIHbI",
  authDomain: "partmatch-79b1f.firebaseapp.com",
  projectId: "partmatch-79b1f",
  storageBucket: "partmatch-79b1f.appspot.com", // ✅ fixed typo here
  messagingSenderId: "255124503700",
  appId: "1:255124503700:web:d8ef74d281e1be63708881",
  measurementId: "G-TZP1G061J1"
};

// Initialize Firebase app if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: Messaging | null = null;

// Initialize messaging (client-side only)
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging init error:', error);
  }
}

export { messaging };

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.error('Messaging not initialized');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission denied');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: 'BIhL8kXfIaXdLGvvrq2T0BwADPBGHRNCihPz7MAqL8Q-3SBPha5crVOjXugmOOHNjgWj4U5ofEAGNSsPWUEI4JM'
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Listen to foreground messages
export const onMessageListener = () => {
  if (!messaging) return Promise.reject('Messaging not initialized');
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
};

export default app;
