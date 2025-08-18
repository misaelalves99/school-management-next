// src/types/ClassRoom.ts

import type { Subject } from './Subject';
import type { Teacher } from './Teacher';

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string;
  subjects: Subject[];
  teachers: Teacher[];
  classTeacher: Teacher | null;
}
