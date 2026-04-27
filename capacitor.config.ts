import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kazanamaz.app',
  appName: 'Kaza Namaz',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      androidIsEncryption: false,
      electronIsEncryption: false,
    },
    FirebaseAuthentication: {
      authDomain: 'auth-5fa37.firebaseapp.com',
      providers: ['google.com'],
    },
  },
};

export default config;
