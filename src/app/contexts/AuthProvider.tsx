// app/contexts/AuthProvider.tsx
'use client';

import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { AuthContext, User } from './AuthContext';
import { auth, googleProvider, facebookProvider } from '@/app/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FbUser,
} from 'firebase/auth';

const toUser = (u: FbUser): User => ({
  id: u.uid,
  name: u.displayName ?? '',
  email: u.email ?? '',
  photoURL: u.photoURL ?? undefined,
});

export const mapAuthError = (code?: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado nas configurações do Firebase.';
    default:
      return 'Falha na autenticação. Tente novamente.';
  }
};

interface Props { children: ReactNode; }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const u = toUser(fbUser);
        setUser(u);
        try { localStorage.setItem('authUser', JSON.stringify(u)); } catch {}
      } else {
        setUser(null);
        try { localStorage.removeItem('authUser'); } catch {}
      }
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      return true;
    } catch (e: any) {
      console.error('login error:', e?.code, e?.message);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      return true;
    } catch (e: any) {
      console.error('register error:', e?.code, e?.message);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (e: any) {
      console.error('google login error:', e?.code, e?.message);
      return false;
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      return true;
    } catch (e: any) {
      console.error('facebook login error:', e?.code, e?.message);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    try { localStorage.removeItem('authUser'); } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        mapAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
