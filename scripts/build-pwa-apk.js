#!/usr/bin/env node
// scripts/build-pwa-apk.js
// Builds Android APK from ViralKit PWA using Google's Bubblewrap CLI
// Prerequisites: Java JDK 17+, Android SDK, Node.js 18+

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const APP_CONFIG = {
  // Must match your manifest.json
  packageId: 'app.viralkit.android',
  appName: 'ViralKit',
  appShortName: 'ViralKit',
  appVersion: '1.0.0',
  appVersionCode: 1,

  // Your deployed PWA URL
  manifestUrl: 'https://viralkit.app/manifest.json',

  // Signing (generate with keytool)
  keystore: {
    path: './viralkit.keystore',
    alias: 'viralkit',
    password: process.env.KEYSTORE_PASSWORD ?? 'changeme',
  },

  // Features
  enableNotifications: true,
  enableLocationPermission: false,
  enableCameraPermission: true,   // needed for image capture
  enableStoragePermission: true,  // needed for media upload
}

async function buildAPK() {
  console.log('🚀 Building ViralKit Android APK...\n')

  // Step 1: Install Bubblewrap if not present
  try {
    execSync('npx @bubblewrap/cli --version', { stdio: 'pipe' })
  } catch {
    console.log('📦 Installing Bubblewrap...')
    execSync('npm install -g @bubblewrap/cli', { stdio: 'inherit' })
  }

  // Step 2: Generate keystore if it doesn't exist
  if (!fs.existsSync(APP_CONFIG.keystore.path)) {
    console.log('🔑 Generating signing keystore...')
    execSync(
      `keytool -genkey -v -keystore ${APP_CONFIG.keystore.path} \
      -alias ${APP_CONFIG.keystore.alias} \
      -keyalg RSA -keysize 2048 -validity 10000 \
      -storepass ${APP_CONFIG.keystore.password} \
      -keypass ${APP_CONFIG.keystore.password} \
      -dname "CN=ViralKit, OU=Mobile, O=ViralKit App, L=Lagos, S=Lagos, C=NG"`,
      { stdio: 'inherit' }
    )
    console.log('✅ Keystore generated!\n')
  }

  // Step 3: Create twa-manifest.json
  const twaManifest = {
    packageId: APP_CONFIG.packageId,
    host: 'viralkit.app',
    name: APP_CONFIG.appName,
    launcherName: APP_CONFIG.appShortName,
    display: 'standalone',
    orientation: 'portrait',
    themeColor: '#f97316',
    navigationColor: '#0a0a0f',
    navigationColorDark: '#0a0a0f',
    backgroundColor: '#0a0a0f',
    startUrl: '/dashboard',
    iconUrl: 'https://viralkit.app/icons/icon-512x512.png',
    maskableIconUrl: 'https://viralkit.app/icons/icon-512x512.png',
    appVersion: APP_CONFIG.appVersion,
    appVersionCode: APP_CONFIG.appVersionCode,
    signingKey: {
      path: APP_CONFIG.keystore.path,
      alias: APP_CONFIG.keystore.alias,
    },
    useBrowserOnChromeOS: false,
    shortcuts: [
      {
        name: 'Create Video',
        shortName: 'Video',
        url: '/dashboard/studio/video',
        icons: [{ src: 'https://viralkit.app/icons/shortcut-video.png', sizes: '96x96' }],
      },
      {
        name: 'Create Image',
        shortName: 'Image',
        url: '/dashboard/studio/image',
        icons: [{ src: 'https://viralkit.app/icons/shortcut-image.png', sizes: '96x96' }],
      },
    ],
    enableNotifications: APP_CONFIG.enableNotifications,
    features: {
      locationDelegation: { enabled: APP_CONFIG.enableLocationPermission },
    },
    alphaDependencies: { enabled: false },
    generatorApp: 'bubblewrap-cli',
    webManifestUrl: APP_CONFIG.manifestUrl,
    isChromeOSOnly: false,
    isMetaQuest: false,
    fullScopeUrl: 'https://viralkit.app/',
    minSdkVersion: 21,
    targetSdkVersion: 34,
  }

  fs.writeFileSync('twa-manifest.json', JSON.stringify(twaManifest, null, 2))
  console.log('✅ twa-manifest.json created\n')

  // Step 4: Build the APK
  console.log('🔨 Building APK (this takes 2-5 minutes)...')
  execSync('npx @bubblewrap/cli build', { stdio: 'inherit' })

  console.log('\n✅ APK built successfully!')
  console.log('📁 Output: ./app-release-signed.apk')
  console.log('\n📱 Next steps:')
  console.log('1. Test on your Android phone: adb install app-release-signed.apk')
  console.log('2. Upload to Google Play Console: https://play.google.com/console')
  console.log('3. Create new app → Upload AAB or APK → Fill store listing')
  console.log('4. Add Digital Asset Links for TWA verification:')
  console.log('   - Run: npx @bubblewrap/cli fingerprint')
  console.log('   - Add to: https://viralkit.app/.well-known/assetlinks.json')
}

buildAPK().catch(err => {
  console.error('❌ Build failed:', err.message)
  process.exit(1)
})