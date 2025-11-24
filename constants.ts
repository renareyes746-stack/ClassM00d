import { Student, Subject, Grade } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Ana García López', matricula: 'A0012345', averageGrade: 9.2, attendanceRate: 98 },
  { id: '2', name: 'Carlos Hernández Ruiz', matricula: 'A0012346', averageGrade: 8.5, attendanceRate: 90 },
  { id: '3', name: 'Fernanda Martínez Pérez', matricula: 'A0012347', averageGrade: 7.8, attendanceRate: 85 },
  { id: '4', name: 'Jorge Rodríguez Sánchez', matricula: 'A0012348', averageGrade: 6.5, attendanceRate: 75 },
  { id: '5', name: 'Lucía Torres Gómez', matricula: 'A0012349', averageGrade: 9.8, attendanceRate: 100 },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Matemáticas IV', group: '4° B', schedule: '08:00 - 09:30' },
  { id: 's2', name: 'Historia de México II', group: '4° B', schedule: '10:00 - 11:30' },
  { id: 's3', name: 'Literatura II', group: '4° B', schedule: '12:00 - 13:30' },
];

export const MOCK_GRADES: Grade[] = [
  { studentId: '1', subjectId: 's1', parcial1: 9, parcial2: 9.5, parcial3: 9 },
  { studentId: '2', subjectId: 's1', parcial1: 8, parcial2: 8, parcial3: 9 },
  { studentId: '3', subjectId: 's1', parcial1: 7, parcial2: 8, parcial3: 8 },
  { studentId: '4', subjectId: 's1', parcial1: 6, parcial2: 7, parcial3: 6 },
  { studentId: '5', subjectId: 's1', parcial1: 10, parcial2: 9, parcial3: 10 },
];