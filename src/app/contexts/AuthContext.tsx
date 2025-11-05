// app/contexts/AuthContext.tsx
'use client';

import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  mapAuthError: (code?: string) => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
