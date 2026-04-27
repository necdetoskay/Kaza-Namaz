import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { User } from '@capacitor-firebase/authentication';
import { db } from '../lib/firebase';
import { AppData } from '../types';

const USER_DATA_PATH = (uid: string) => `users/${uid}/data`;

export const FirebaseSyncService = {
  /**
   * Kullanıcı verisini Firestore'a kaydeder
   */
  async saveUserData(user: User, data: AppData): Promise<void> {
    try {
      const userRef = doc(db, USER_DATA_PATH(user.uid));
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
        email: user.email,
      });
      console.log('Data saved to Firestore');
    } catch (error) {
      console.error('Firestore save error:', error);
    }
  },

  /**
   * Kullanıcı verisini Firestore'dan siler
   */
  async deleteUserData(user: User): Promise<void> {
    try {
      const { deleteDoc } = await import('firebase/firestore');
      const userRef = doc(db, USER_DATA_PATH(user.uid));
      await deleteDoc(userRef);
      console.log('Data deleted from Firestore');
    } catch (error) {
      console.error('Firestore delete error:', error);
    }
  },

  /**
   * Kullanıcı verisini Firestore'dan çeker
   */
  async getUserData(user: User): Promise<AppData | null> {
    try {
      const userRef = doc(db, USER_DATA_PATH(user.uid));
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Remove metadata fields
        const { updatedAt, email, ...appData } = data;
        return appData as AppData;
      }
      return null;
    } catch (error) {
      console.error('Firestore read error:', error);
      return null;
    }
  },

  /**
   * Firestore'dan real-time güncellemeleri dinler
   */
  subscribeToUserData(user: User, callback: (data: AppData) => void): () => void {
    try {
      const userRef = doc(db, USER_DATA_PATH(user.uid));
      return onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const { updatedAt, email, ...appData } = data;
          callback(appData as AppData);
        }
      });
    } catch (error) {
      console.error('Firestore subscription error:', error);
      return () => {};
    }
  },

  /**
   * Verileri birleştirir (local + remote)
   * Son güncelleme tarihine göre hangisinin öncelikli olduğuna karar verir
   */
  async mergeData(localData: AppData | null, user: User): Promise<AppData> {
    try {
      // LocalData null ise onboarding data olarak başlat
      if (!localData) {
        const newData: AppData = {
          user: { gender: null, birthDate: null, startDate: null, dailyTarget: 5 },
          prayers: { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 },
          stats: { streak: 0, totalCompleted: 0, lastActiveDate: new Date().toISOString() },
          history: []
        };
        return newData;
      }

      const remoteData = await this.getUserData(user);
      
      if (!remoteData) {
        // Remote yoksa local'i kaydet
        await this.saveUserData(user, localData);
        return localData;
      }

      // Her ikisi de varsa, son güncelleneni kullan
      const localUpdated = new Date(localData.stats.lastActiveDate || 0).getTime();
      const remoteUpdated = new Date(remoteData.stats.lastActiveDate || 0).getTime();

      if (localUpdated >= remoteUpdated) {
        // Local daha güncel - remote'a kaydet
        await this.saveUserData(user, localData);
        return localData;
      } else {
        // Remote daha güncel - local'e kaydet ve dön
        return remoteData;
      }
    } catch (error) {
      console.error('Merge error:', error);
      return localData;
    }
  }
};
