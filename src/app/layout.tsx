// src/app/layout.tsx
'use client';

import type { ReactNode } from 'react';
import './globals.css';

import { AuthProvider } from '@/core/contexts/AuthProvider';
import { StudentsProvider } from '@/core/contexts/StudentsProvider';
import { TeachersProvider } from '@/core/contexts/TeachersProvider';
import { SubjectsProvider } from '@/core/contexts/SubjectsProvider';
import { ClassRoomsProvider } from '@/core/contexts/ClassRoomsProvider';
import { EnrollmentsProvider } from '@/core/contexts/EnrollmentsProvider';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <StudentsProvider>
            <TeachersProvider>
              <SubjectsProvider>
                <ClassRoomsProvider>
                  <EnrollmentsProvider>{children}</EnrollmentsProvider>
                </ClassRoomsProvider>
              </SubjectsProvider>
            </TeachersProvider>
          </StudentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
