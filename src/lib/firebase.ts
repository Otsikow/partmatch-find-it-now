// Firebase configuration for push notifications
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBIGwoXEcYnmWepvG1Gf4bPCK4jFdNIHbI",
  authDomain: "partmatch-79b1f.firebaseapp.com",
  projectId: "partmatch-79b1f",
  storageBucket: "partmatch-79b1f.firebasestorage.app",
  messagingSenderId: "255124503700",
  appId: "1:255124503700:web:d8ef74d281e1be63708881",
  measurementId: "G-TZP1G061J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getanalytics(app);

let messaging: Messaging | null = null;

// Initialize messaging only in browser environment
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging initialization failed:', error);
  }
}

export { messaging };

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.error('Firebase messaging not initialized');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BIhL8kXfIaXdLGvvrq2T0BwADPBGHRNCihPz7MAqL8Q-3SBPha5crVOjXugmOOHNjgWj4U5ofEAGNSsPWUEI4JM' // Replace with your VAPID key
      });
      
      console.log('FCM token obtained:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  if (!messaging) {
    return Promise.reject('Firebase messaging not initialized');
  }
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      resolve(payload);
    });
  });
};

export default app;