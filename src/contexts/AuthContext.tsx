import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import type { User } from '@capacitor-firebase/authentication';

// Sadece bu email'ler giriş yapabilir
const ALLOWED_EMAILS = ['necdetoskay@gmail.com'];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isUnauthorized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    // Native auth state listener
    const unsubscribe = FirebaseAuthentication.addListener(
      'authStateChange',
      (change) => {
        const firebaseUser = change.user;
        if (firebaseUser && !ALLOWED_EMAILS.includes(firebaseUser.email || '')) {
          FirebaseAuthentication.signOut().catch(console.error);
          setUser(null);
          setIsUnauthorized(true);
        } else {
          setUser(firebaseUser);
          setIsUnauthorized(false);
        }
        setIsLoading(false);
      }
    );

    // İlk yüklemede mevcut kullanıcıyı kontrol et
    FirebaseAuthentication.getCurrentUser()
      .then((result) => {
        const firebaseUser = result.user;
        if (firebaseUser && !ALLOWED_EMAILS.includes(firebaseUser.email || '')) {
          FirebaseAuthentication.signOut().catch(console.error);
          setUser(null);
          setIsUnauthorized(true);
        } else {
          setUser(firebaseUser);
          setIsUnauthorized(false);
        }
      })
      .catch(() => {
        // Giriş yapılmamış, normal
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      unsubscribe.then((u) => u.remove());
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      const email = result.user?.email || '';

      if (!ALLOWED_EMAILS.includes(email)) {
        await FirebaseAuthentication.signOut();
        throw new Error('Bu uygulamaya erişim izniniz yok.');
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await FirebaseAuthentication.signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isUnauthorized, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
