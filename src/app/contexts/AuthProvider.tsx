// app/contexts/AuthProvider.tsx
'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext, User } from './AuthContext';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = (firebaseUser: any): User => ({
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || undefined,
  });

  // Persistência e observador do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser(mapFirebaseUser(firebaseUser));
      else setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(mapFirebaseUser(res.user));
      return true;
    } catch (err) {
      console.error(err);
      alert('Erro ao logar com email/senha.');
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: name });
      setUser(mapFirebaseUser(res.user));
      return true;
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar usuário.');
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(mapFirebaseUser(res.user));
      return true;
    } catch (err) {
      console.error(err);
      alert('Erro ao entrar com Google.');
      return false;
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      setUser(mapFirebaseUser(res.user));
      return true;
    } catch (err) {
      console.error(err);
      alert('Erro ao entrar com Facebook.');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, loginWithFacebook, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
