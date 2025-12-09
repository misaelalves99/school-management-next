// src/core/firebase/client.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  type Auth,
} from 'firebase/auth';

// Instâncias internas (não exportadas diretamente)
let firebaseAppInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;
let facebookProviderInstance: FacebookAuthProvider | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  // Opcional:
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function createFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    // IMPORTANTE: essa função só deve rodar no client.
    // Nunca chame getFirebaseApp/getFirebaseAuth em código que
    // roda no servidor (RSC sem "use client").
    throw new Error(
      'Firebase deve ser inicializado apenas em componentes client-side.',
    );
  }

  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }

  return getApp();
}

// ==== Getters públicos (sem inicializar nada na importação) ====

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseAppInstance) {
    firebaseAppInstance = createFirebaseApp();
  }
  return firebaseAppInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider();
    // Se quiser forçar seleção de conta:
    // googleProviderInstance.setCustomParameters({ prompt: 'select_account' });
  }
  return googleProviderInstance;
}

export function getFacebookProvider(): FacebookAuthProvider {
  if (!facebookProviderInstance) {
    facebookProviderInstance = new FacebookAuthProvider();
  }
  return facebookProviderInstance;
}
