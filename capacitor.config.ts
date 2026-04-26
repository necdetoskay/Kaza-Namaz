import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kazanamaz.app',
  appName: 'Kaza Namaz',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      authDomain: 'auth-5fa37.firebaseapp.com',
      providers: ['google.com'],
    },
  },
};

export default config;
