import React from 'react';

export enum AttendanceStatus {
  PRESENT = 'Asistencia',
  ABSENT = 'Falta',
  LATE = 'Retardo',
  EXCUSED = 'Justificado'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string; // In a real app, this would be hashed
  school?: string;
}

export interface Student {
  id: string;
  name: string;
  matricula: string;
  averageGrade: number;
  attendanceRate: number;
}

export interface Subject {
  id: string;
  name: string;
  group: string; // e.g., "3° A"
  schedule: string; // e.g., "Lun/Mie 08:00 - 10:00"
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  verified?: boolean;
  location?: { lat: number; lng: number };
  timestamp?: string;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  parcial1: number;
  parcial2: number;
  parcial3: number;
  final?: number;
}

export interface LessonPlan {
  topic: string;
  objective: string;
  activities: string[];
  resources: string[];
  duration: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

export interface Message {
  id: string;
  studentId: string;
  sender: 'teacher' | 'student' | 'parent';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  type: 'exam' | 'homework' | 'meeting' | 'other';
}