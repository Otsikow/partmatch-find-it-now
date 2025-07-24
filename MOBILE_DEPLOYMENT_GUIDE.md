# PartMatch Mobile Deployment Guide

This guide will help you deploy the PartMatch app to Android and iOS platforms using Capacitor.

## Prerequisites

1. **Development Environment Setup:**
   - Node.js (v16 or higher)
   - Git
   - Android Studio (for Android development)
   - Xcode (for iOS development - Mac only)

2. **Developer Accounts:**
   - Google Play Console account ($25 one-time fee)
   - Apple Developer Program account ($99/year)

## Step 1: Export Project from Lovable

1. Click the "Export to Github" button in your Lovable project
2. Create a new GitHub repository and connect it
3. Clone the repository to your local machine:
   ```bash
   git clone [your-repo-url]
   cd partmatch-find-it-now
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Initialize Capacitor (Already Done)

The project is already configured with Capacitor. The configuration is in `capacitor.config.ts`.

## Step 4: Add Mobile Platforms

```bash
# Add iOS platform
npx cap add ios

# Add Android platform  
npx cap add android
```

## Step 5: Build the Web Assets

```bash
npm run build
```

## Step 6: Sync Project with Native Platforms

```bash
npx cap sync
```

## Step 7: Configure App Icons and Splash Screens

### For iOS:
1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```
2. In Xcode, navigate to `App` > `App` > `Assets.xcassets` > `AppIcon.appiconset`
3. Replace the default icons with your custom icons (use the generated `app-icon.png`)

### For Android:
1. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```
2. Navigate to `app` > `src` > `main` > `res` > `mipmap-*` folders
3. Replace the default `ic_launcher.png` files with your custom icons

## Step 8: Configure App Details

### Update Android Manifest (`android/app/src/main/AndroidManifest.xml`):
```xml
<application
    android:label="PartMatch - Find Car Parts"
    android:icon="@mipmap/ic_launcher"
    ...>
```

### Update iOS Info.plist (`ios/App/App/Info.plist`):
```xml
<key>CFBundleDisplayName</key>
<string>PartMatch</string>
<key>CFBundleName</key>
<string>PartMatch</string>
```

## Step 9: Production Environment Variables

Create a `.env.production` file in your project root:
```
VITE_SUPABASE_URL=https://ytgmzhevgcmvevuwkocz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Z216aGV2Z2NtdmV2dXdrb2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzA5NDgsImV4cCI6MjA2NjIwNjk0OH0.yOoZd4w7sURBnsQuGb1custfkz1_g5MGt9skysV1fPI
```

## Step 10: Build for Production

### Android APK:
```bash
# Build the web assets for production
npm run build

# Sync with native project
npx cap sync android

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Select `Build` > `Generate Signed Bundle / APK`
2. Choose APK
3. Create or select your keystore file
4. Build the production APK

### iOS IPA:
```bash
# Build the web assets for production
npm run build

# Sync with native project  
npx cap sync ios

# Open in Xcode
npx cap open ios
```

In Xcode:
1. Select your project target
2. Choose `Product` > `Archive`
3. Once archived, select `Distribute App`
4. Choose distribution method (App Store or Ad Hoc)

## Step 11: Testing on Physical Devices

### Android:
1. Enable Developer Options and USB Debugging on your Android device
2. Connect device via USB
3. In Android Studio, select your device and click Run

### iOS:
1. Connect your iOS device via USB
2. In Xcode, select your device from the device list
3. Click the Run button

## Step 12: Store Submission

### Google Play Store:
1. Create a Google Play Console account
2. Create a new app listing
3. Upload your APK in the "App releases" section
4. Fill out store listing information:
   - Title: "PartMatch - Find Car Parts in Ghana"
   - Short description: "The easiest way to find and order car parts in Ghana"
   - Full description: Include app features and benefits
   - Screenshots: Capture key app screens
   - App icon: Use the generated icon
5. Set content rating and pricing
6. Submit for review

### Apple App Store:
1. Create an Apple Developer account
2. In App Store Connect, create a new app
3. Fill out app information:
   - Name: "PartMatch"
   - Bundle ID: `app.lovable.da5f3cd368ef41748020511e0e3ffc08`
   - Description and keywords
   - Screenshots for different device sizes
   - App icon
4. Upload your build using Xcode or Application Loader
5. Submit for App Store review

## Step 13: Configure Push Notifications (Optional)

If you want to add push notifications:

1. Install Capacitor Push Notifications plugin:
   ```bash
   npm install @capacitor/push-notifications
   ```

2. Configure in your Supabase project:
   - Set up FCM for Android
   - Set up APNs for iOS

3. Add notification handling code to your app

## Step 14: Deep Linking Configuration

Update your `capacitor.config.ts` to handle deep links:
```typescript
plugins: {
  App: {
    appUrlOpen: {
      url: 'partmatch://open',
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **Build Errors**: Ensure all dependencies are installed and platforms are synced
2. **Icon Issues**: Make sure icons are the correct sizes for each platform
3. **Permissions**: Add necessary permissions to AndroidManifest.xml and Info.plist

### Useful Commands:
```bash
# Clean and rebuild
npx cap clean
npm run build
npx cap sync

# View device logs
npx cap run android --log
npx cap run ios --log
```

## Final Steps

1. Test thoroughly on both platforms
2. Prepare store assets (screenshots, descriptions)
3. Follow platform-specific submission guidelines
4. Monitor app performance post-launch

## Support

For issues specific to Lovable and Supabase integrations:
- Check Supabase documentation for mobile configuration
- Ensure all API endpoints work correctly in mobile environment
- Test offline functionality if implemented

Remember to update your Capacitor configuration to point to your production URL instead of the development server once you're ready for store submission.