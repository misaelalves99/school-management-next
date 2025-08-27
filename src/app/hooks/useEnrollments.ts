// src/app/hooks/useEnrollments.ts

import { useContext } from 'react';
import { EnrollmentsContext } from '../contexts/EnrollmentsContext';

export const useEnrollments = () => useContext(EnrollmentsContext);
