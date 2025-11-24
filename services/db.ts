import { Student, AttendanceRecord, Grade, AttendanceStatus, LessonPlan, User, Message, Reminder } from '../types';
import { MOCK_STUDENTS, MOCK_GRADES } from '../constants';

const KEYS = {
  USERS: 'classmood_users',
  SESSION: 'classmood_session',
  STUDENTS: 'classmood_students',
  ATTENDANCE: 'classmood_attendance',
  GRADES: 'classmood_grades',
  PLANS: 'classmood_plans',
  MESSAGES: 'classmood_messages',
  REMINDERS: 'classmood_reminders'
};

// Helper to safely parse JSON
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing ${key}`, e);
    return fallback;
  }
};

export const db = {
  init: () => {
    // Seed initial data if empty
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
    }
    if (!localStorage.getItem(KEYS.GRADES)) {
      localStorage.setItem(KEYS.GRADES, JSON.stringify(MOCK_GRADES));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
    }
    
    // Seed messages
    if (!localStorage.getItem(KEYS.MESSAGES)) {
      const initialMessages: Message[] = [
        {
          id: 'm1',
          studentId: '1',
          sender: 'parent',
          content: 'Hola profesor, Ana faltará mañana por cita médica.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        {
          id: 'm2',
          studentId: '1',
          sender: 'teacher',
          content: 'Enterado, gracias por avisar. Que se mejore.',
          timestamp: new Date(Date.now() - 80000000).toISOString(),
          read: true
        },
        {
          id: 'm3',
          studentId: '4',
          sender: 'student',
          content: 'Profe, ¿cuándo es la entrega del proyecto final?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        }
      ];
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(initialMessages));
    }

    // Seed reminders
    if (!localStorage.getItem(KEYS.REMINDERS)) {
      const initialReminders: Reminder[] = [
        { id: 'r1', title: 'Subir calificaciones Parcial 1', date: new Date().toISOString(), completed: false, type: 'exam' },
        { id: 'r2', title: 'Junta de Consejo Técnico', date: new Date().toISOString(), completed: true, type: 'meeting' },
      ];
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify(initialReminders));
    }
  },

  auth: {
    // Register a new user
    register: (userData: Omit<User, 'id'>) => {
      const users = safeParse<User[]>(KEYS.USERS, []);
      
      // Check if user exists (by email or phone)
      const exists = users.find(u => 
        (userData.email && u.email === userData.email) || 
        (userData.phone && u.phone === userData.phone)
      );

      if (exists) {
        throw new Error("El usuario ya existe con este correo o teléfono.");
      }

      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).slice(2, 11),
      };

      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Auto login after register
      localStorage.setItem(KEYS.SESSION, JSON.stringify(newUser));
      return newUser;
    },

    // Login with identifier (email or phone) and password
    login: (identifier: string, password: string) => {
      const users = safeParse<User[]>(KEYS.USERS, []);
      
      const user = users.find(u => 
        (u.email === identifier || u.phone === identifier) && u.password === password
      );

      if (!user) {
        throw new Error("Credenciales inválidas. Verifica tus datos.");
      }

      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      return user;
    },

    // Get current session
    getSession: (): User | null => {
      return safeParse<User | null>(KEYS.SESSION, null);
    },

    // Logout
    logout: () => {
      localStorage.removeItem(KEYS.SESSION);
    }
  },

  students: {
    getAll: (): Student[] => safeParse(KEYS.STUDENTS, MOCK_STUDENTS),
    add: (student: Student) => {
      const students = db.students.getAll();
      students.push(student);
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    },
    update: (updatedStudent: Student) => {
      const students = db.students.getAll().map(s => 
        s.id === updatedStudent.id ? updatedStudent : s
      );
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    }
  },

  attendance: {
    getAll: (): AttendanceRecord[] => safeParse(KEYS.ATTENDANCE, []),
    
    getByDate: (dateStr: string): Record<string, AttendanceStatus> => {
      const allRecords = db.attendance.getAll();
      // Filter records for this specific date string (YYYY-MM-DD)
      const daysRecords = allRecords.filter(r => r.date.startsWith(dateStr));
      
      const statusMap: Record<string, AttendanceStatus> = {};
      daysRecords.forEach(r => {
        statusMap[r.studentId] = r.status;
      });
      return statusMap;
    },

    saveBatch: (dateStr: string, records: Record<string, AttendanceStatus>, verified: boolean, location?: {lat: number, lng: number}) => {
      let allRecords = db.attendance.getAll();
      
      // Remove existing records for this date to avoid duplicates (overwrite logic)
      // Using slice(0,10) matches YYYY-MM-DD
      allRecords = allRecords.filter(r => r.date.slice(0, 10) !== dateStr);

      // Add new records
      Object.entries(records).forEach(([studentId, status]) => {
        allRecords.push({
          studentId,
          date: dateStr, // Assuming dateStr is already YYYY-MM-DD
          status,
          verified,
          location,
          timestamp: new Date().toISOString()
        });
      });

      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(allRecords));
    },

    // Get history for a specific student
    getStudentHistory: (studentId: string): AttendanceRecord[] => {
      return db.attendance.getAll()
        .filter(r => r.studentId === studentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  },

  grades: {
    getAll: (): Grade[] => safeParse(KEYS.GRADES, MOCK_GRADES),
  },
  
  plans: {
    save: (plan: LessonPlan) => {
      const plans = safeParse<LessonPlan[]>(KEYS.PLANS, []);
      plans.push(plan);
      localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
    }
  },

  messages: {
    getAll: (): Message[] => safeParse(KEYS.MESSAGES, []),
    getThread: (studentId: string): Message[] => {
      return db.messages.getAll()
        .filter(m => m.studentId === studentId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    send: (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
      const messages = db.messages.getAll();
      const newMessage: Message = {
        ...msg,
        id: Math.random().toString(36).slice(2, 9),
        timestamp: new Date().toISOString(),
        read: true // Outgoing messages are read by definition
      };
      messages.push(newMessage);
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
      return newMessage;
    }
  },

  reminders: {
    getAll: (): Reminder[] => safeParse(KEYS.REMINDERS, []),
    add: (reminder: Omit<Reminder, 'id'>) => {
      const reminders = db.reminders.getAll();
      const newReminder = { ...reminder, id: Math.random().toString(36).slice(2, 9) };
      reminders.push(newReminder);
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
      return newReminder;
    },
    toggle: (id: string) => {
      const reminders = db.reminders.getAll().map(r => 
        r.id === id ? { ...r, completed: !r.completed } : r
      );
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    },
    delete: (id: string) => {
      const reminders = db.reminders.getAll().filter(r => r.id !== id);
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
    }
  },

  // Utils for debugging
  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};