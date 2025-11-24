import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { 
  Users, 
  CalendarClock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  BookOpen, 
  Sparkles,
  Search,
  BrainCircuit,
  MapPin,
  ShieldCheck,
  History,
  Lock,
  Dices,
  XCircle,
  QrCode,
  Star,
  FileSpreadsheet,
  MessageSquare,
  Bell,
  Trash2,
  Plus,
  Check,
  Send
} from 'lucide-react';
import StatCard from './components/StatCard';
import { generateLessonPlanAI, generateStudentFeedbackAI, generateQuizQuestionAI } from './services/geminiService';
import { Student, AttendanceRecord, AttendanceStatus, LessonPlan, Grade, Message, Reminder } from './types';
import { db } from './services/db'; // Import Database Service
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';

// --- HELPERS ---
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- VIEWS ---

// 1. Dashboard View
const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderTitle, setNewReminderTitle] = useState('');

  useEffect(() => {
    setStudentCount(db.students.getAll().length);
    setReminders(db.reminders.getAll());
  }, []);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    
    const newItem = db.reminders.add({
      title: newReminderTitle,
      date: new Date().toISOString(),
      completed: false,
      type: 'other'
    });
    
    setReminders([...reminders, newItem]);
    setNewReminderTitle('');
  };

  const toggleReminder = (id: string) => {
    db.reminders.toggle(id);
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    db.reminders.delete(id);
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hola, Profe. 👋</h1>
          <p className="text-gray-500">Aquí tienes el resumen de tu día.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
          <CalendarClock size={18} className="text-brand-500" />
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Alumnos" 
          value={studentCount} 
          subtitle="En todos los grupos"
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Promedio General" 
          value="8.4" 
          subtitle="+0.2 vs mes anterior"
          icon={<TrendingUp size={24} />}
        />
        <StatCard 
          title="Asistencia Hoy" 
          value="92%" 
          subtitle="4 alumnos ausentes"
          icon={<CheckCircle2 size={24} />}
        />
        <StatCard 
          title="Clases Restantes" 
          value="2" 
          subtitle="Terminas a las 13:30"
          icon={<Clock size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class - Takes up 2/3 on desktop */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CalendarClock className="text-brand-500" size={20} />
                Siguiente Clase
              </h2>
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">10:00 AM</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full bg-gradient-to-r from-brand-500 to-brand-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 className="text-2xl font-bold relative z-10">Historia de México II</h3>
                <p className="opacity-90 mt-1 relative z-10">Grupo 4° B • Aula 12</p>
                <div className="mt-4 pt-4 border-t border-white/20 flex gap-4 relative z-10">
                  <div>
                    <p className="text-xs opacity-75">Tema</p>
                    <p className="font-medium">El Porfiriato</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-3">
                <h4 className="font-medium text-gray-600 mb-2">Acciones Rápidas</h4>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group border border-transparent hover:border-gray-200">
                  <span className="text-gray-700 font-medium">Iniciar Pase de Lista</span>
                  <CheckCircle2 size={18} className="text-gray-400 group-hover:text-brand-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group border border-transparent hover:border-gray-200">
                  <span className="text-gray-700 font-medium">Ver Material de Clase</span>
                  <BookOpen size={18} className="text-gray-400 group-hover:text-brand-500" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Reminders Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Bell className="text-amber-500" size={20} />
                  Recordatorios
                </h2>
                <span className="text-xs text-gray-400">{reminders.filter(r => !r.completed).length} pendientes</span>
             </div>

             <form onSubmit={handleAddReminder} className="mb-4 relative">
                <input 
                  type="text" 
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  placeholder="Agregar nueva tarea..."
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <button 
                  type="submit"
                  disabled={!newReminderTitle.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
             </form>

             <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {reminders.length === 0 && (
                   <p className="text-center text-gray-400 py-4 text-sm">No tienes recordatorios pendientes.</p>
                )}
                {reminders.map(reminder => (
                   <div key={reminder.id} className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${reminder.completed ? 'bg-gray-50 opacity-60' : 'bg-white border border-gray-100 hover:shadow-sm'}`}>
                      <button 
                        onClick={() => toggleReminder(reminder.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${reminder.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500'}`}
                      >
                         {reminder.completed && <Check size={12} strokeWidth={3} />}
                      </button>
                      <span className={`flex-1 text-sm ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                         {reminder.title}
                      </span>
                      <button 
                         onClick={() => deleteReminder(reminder.id)}
                         className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* AI Insights & Alerts */}
        <div className="bg-gradient-to-b from-accent-50 to-white p-6 rounded-2xl shadow-sm border border-accent-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Sparkles className="text-accent-500" size={20} />
            ClassMood AI Insights
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3 items-start p-3 bg-white rounded-xl shadow-sm border border-accent-100/50 hover:shadow-md transition-shadow">
              <AlertCircle size={20} className="text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Atención Sugerida</p>
                <p className="text-xs text-gray-500 mt-1">Jorge Rodríguez ha bajado su promedio un 15% este parcial. Considera una charla motivacional.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-white rounded-xl shadow-sm border border-accent-100/50 hover:shadow-md transition-shadow">
              <TrendingUp size={20} className="text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Buen Progreso</p>
                <p className="text-xs text-gray-500 mt-1">El grupo 4° B mejoró su asistencia general esta semana.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-white rounded-xl shadow-sm border border-accent-100/50 hover:shadow-md transition-shadow">
               <MessageSquare size={20} className="text-blue-500 mt-1 flex-shrink-0" />
               <div>
                  <p className="text-sm font-medium text-gray-800">Mensajes sin leer</p>
                  <p className="text-xs text-gray-500 mt-1">Tienes 1 mensaje nuevo de un padre de familia.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Attendance View
const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [participation, setParticipation] = useState<Record<string, number>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStrict, setIsStrict] = useState(false);
  const [locked, setLocked] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [spotCheckStudent, setSpotCheckStudent] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [scanSimulation, setScanSimulation] = useState<string>("");

  // Load students and today's attendance from DB
  useEffect(() => {
    const loadedStudents = db.students.getAll();
    setStudents(loadedStudents);

    // Check if we already have records for today
    const todayStr = getLocalDateString();
    const todaysRecords = db.attendance.getByDate(todayStr);
    
    // If we have records, load them and lock editing
    if (Object.keys(todaysRecords).length > 0) {
      setRecords(todaysRecords);
      setLocked(true);
    }
  }, []);

  // Use useMemo for mock history + real history combination
  const historyData = useMemo(() => {
    if (!selectedStudent) return [];
    
    // Get real saved history
    const savedHistory = db.attendance.getStudentHistory(selectedStudent.id);
    
    // Mock previous days for visualization if real history is sparse
    const mockHistory = [];
    const today = new Date();
    // Only add mock data if we don't have enough real data for the visual
    if (savedHistory.length < 5) {
      for (let i = 1; i <= 25; i++) {
         const d = new Date(today);
         d.setDate(today.getDate() - i);
         if (d.getDay() === 0 || d.getDay() === 6) continue;
         const rand = Math.random();
         let status = AttendanceStatus.PRESENT;
         if (rand > 0.9) status = AttendanceStatus.ABSENT;
         else if (rand > 0.8) status = AttendanceStatus.LATE;
         mockHistory.push({ date: d, status });
      }
    }

    // Combine real + mock, ensure dates are Date objects for sorting
    const combined = [
        ...savedHistory.map(r => ({ date: new Date(r.date), status: r.status })),
        ...mockHistory
    ];

    // Filter out duplicates if mock logic overlaps (simple protection)
    const uniqueMap = new Map();
    combined.forEach(item => {
      uniqueMap.set(item.date.toDateString(), item);
    });

    return Array.from(uniqueMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [selectedStudent, locked]); // Recalculate when locked changes (after save)

  const setStatusDirectly = (studentId: string, status: AttendanceStatus) => {
    if (locked) return;
    setRecords(prev => ({ ...prev, [studentId]: status }));
  }

  const toggleParticipation = (studentId: string) => {
    setParticipation(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || 0) + 1
    }));
  };

  const handleSecureSave = () => {
    const saveToDb = (loc?: {lat: number, lng: number}) => {
       const todayStr = getLocalDateString();
       
       // Default missing records to ABSENT before saving
       const completeRecords = { ...records };
       students.forEach(s => {
           if (!completeRecords[s.id]) completeRecords[s.id] = AttendanceStatus.ABSENT;
       });

       db.attendance.saveBatch(todayStr, completeRecords, isStrict, loc);
       setLocked(true);
       setRecords(completeRecords); // Update UI with defaults
    };

    if (isStrict && !locationVerified) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocationVerified(true);
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          saveToDb(loc);
        }, (error) => {
          console.error(error);
          alert("Error de ubicación: Se requiere permiso para el Modo Estricto. Intente de nuevo o desactive el modo estricto.");
        });
      } else {
        alert("Geolocalización no soportada.");
      }
    } else {
      saveToDb();
    }
  };

  const handleSpotCheck = () => {
    const randomIdx = Math.floor(Math.random() * students.length);
    const student = students[randomIdx];
    setSpotCheckStudent(student.name);
  };

  const simulateQRScan = () => {
    const absentStudents = students.filter(s => 
      (records[s.id] || AttendanceStatus.ABSENT) === AttendanceStatus.ABSENT
    );
    
    if (absentStudents.length > 0) {
      const randomStudent = absentStudents[Math.floor(Math.random() * absentStudents.length)];
      setRecords(prev => ({ ...prev, [randomStudent.id]: AttendanceStatus.PRESENT }));
      setScanSimulation(`${randomStudent.name} ha marcado asistencia.`);
      setTimeout(() => setScanSimulation(""), 3000);
    } else {
      setScanSimulation("Todos los alumnos presentes.");
      setTimeout(() => setScanSimulation(""), 3000);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
      case AttendanceStatus.ABSENT: return 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200';
      case AttendanceStatus.LATE: return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
      case AttendanceStatus.EXCUSED: return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'Puntual';
      case AttendanceStatus.ABSENT: return 'Falta';
      case AttendanceStatus.LATE: return 'Retardo';
      case AttendanceStatus.EXCUSED: return 'Justif.';
      default: return 'Asistencia';
    }
  };

  const presentCount = historyData.filter(d => d.status === AttendanceStatus.PRESENT).length;
  const historyStats = [
    { name: 'Asistencia', value: presentCount, color: '#10b981' },
    { name: 'Faltas', value: historyData.length - presentCount, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Pase de Lista
            {isStrict && <ShieldCheck className="text-brand-600 animate-pulse" size={24} />}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Matemáticas IV • Grupo 4° B • {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button 
            onClick={() => setShowQR(true)}
            disabled={locked}
            className="px-3 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-50"
          >
            <QrCode size={16} />
            <span className="hidden sm:inline">Código QR</span>
          </button>

          <button 
            onClick={() => setIsStrict(!isStrict)}
            disabled={locked}
            className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors border disabled:opacity-50 ${
              isStrict ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isStrict ? <Lock size={16} /> : <ShieldCheck size={16} />}
            <span className="hidden sm:inline">{isStrict ? 'Modo Estricto' : 'Anti-Fraude'}</span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden xl:block"></div>

          <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-green-600" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          
          <button 
            onClick={handleSecureSave}
            disabled={locked}
            className={`px-4 py-2 text-white rounded-lg transition shadow-md font-medium flex items-center gap-2 ml-auto ${
              locked ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {locked ? (
              <>
                <CheckCircle2 size={18} /> Guardado
              </>
            ) : (
              <>
                {isStrict && <MapPin size={18} />} Guardar
              </>
            )}
          </button>
        </div>
      </div>

      {isStrict && !locked && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <ShieldCheck className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Seguridad Activada</h3>
              <p className="text-sm text-indigo-700">Se registrará geolocalización y hora exacta. Los alumnos no pueden marcar fuera del aula.</p>
            </div>
          </div>
          <button 
            onClick={handleSpotCheck}
            className="px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 font-medium text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Dices size={18} />
            Verificación Aleatoria
          </button>
        </div>
      )}

      {/* QR MODAL */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center relative animate-in zoom-in-95">
             <button 
               onClick={() => setShowQR(false)}
               className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
             >
               <XCircle size={24} className="text-gray-500" />
             </button>

             <h2 className="text-2xl font-bold text-gray-900 mb-2">Escanea para Asistencia</h2>
             <p className="text-gray-500 mb-6">Pide a tus alumnos que escaneen este código desde su app ClassMood.</p>
             
             <div className="bg-white p-4 rounded-xl border-4 border-gray-900 inline-block mb-6 shadow-xl relative overflow-hidden group">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ClassMoodSession-${Date.now()}&bgcolor=ffffff&color=000000&margin=10`} 
                 alt="QR de Asistencia" 
                 className="w-64 h-64 object-contain"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
             </div>

             <div className="flex flex-col gap-3">
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                   El código se actualiza cada 15 segundos para evitar copias.
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-bold">Demo Controls</p>
                  <button 
                    onClick={simulateQRScan}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium flex items-center justify-center gap-2"
                  >
                    <Users size={18} />
                    Simular Alumno Escaneando
                  </button>
                  {scanSimulation && (
                    <div className="mt-2 text-green-600 text-sm font-bold animate-bounce">
                      {scanSimulation}
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Spot Check Modal */}
      {spotCheckStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Verificación Rápida!</h3>
            <p className="text-gray-500 mb-6">Por favor busca a este alumno y confirma su presencia visualmente:</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <span className="text-xl font-bold text-indigo-700">{spotCheckStudent}</span>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setSpotCheckStudent(null)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                Confirmado
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estudiante</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Participación</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Historial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const status = records[student.id] || AttendanceStatus.ABSENT; // Default to Absent for check-in logic
                  const isSelected = selectedStudent?.id === student.id;
                  const stars = participation[student.id] || 0;

                  return (
                    <tr key={student.id} className={`transition-colors ${isSelected ? 'bg-brand-50' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{student.matricula}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Select Buttons */}
                          {!locked && (
                             <>
                                <button 
                                  onClick={() => setStatusDirectly(student.id, AttendanceStatus.PRESENT)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === AttendanceStatus.PRESENT ? 'bg-emerald-500 text-white shadow-md scale-110' : 'text-gray-300 hover:bg-gray-100'}`}
                                  title="Puntual"
                                >
                                  P
                                </button>
                                <button 
                                  onClick={() => setStatusDirectly(student.id, AttendanceStatus.LATE)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === AttendanceStatus.LATE ? 'bg-amber-400 text-white shadow-md scale-110' : 'text-gray-300 hover:bg-gray-100'}`}
                                  title="Retardo"
                                >
                                  R
                                </button>
                                <button 
                                  onClick={() => setStatusDirectly(student.id, AttendanceStatus.ABSENT)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === AttendanceStatus.ABSENT ? 'bg-rose-500 text-white shadow-md scale-110' : 'text-gray-300 hover:bg-gray-100'}`}
                                  title="Falta"
                                >
                                  F
                                </button>
                             </>
                          )}
                          
                          {locked && (
                             <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getStatusColor(status)}`}>
                               {getStatusLabel(status)}
                             </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleParticipation(student.id)}
                          disabled={locked}
                          className="group flex items-center justify-center gap-1 mx-auto hover:bg-yellow-50 px-2 py-1 rounded-lg transition"
                        >
                          <Star size={18} className={`${stars > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'}`} />
                          <span className={`text-sm font-bold ${stars > 0 ? 'text-gray-700' : 'text-gray-300'}`}>{stars > 0 ? stars : ''}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-brand-200 text-brand-800' : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'}`}
                        >
                          <History size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Panel */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit sticky top-6 transition-all duration-300 ${!selectedStudent ? 'opacity-50 grayscale' : 'opacity-100'}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History size={20} className="text-gray-400" />
            Historial de Asistencia
          </h3>
          
          {selectedStudent ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                    {selectedStudent.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 text-sm">{selectedStudent.name}</p>
                   <p className="text-xs text-gray-500">Últimos 30 días hábiles</p>
                 </div>
              </div>

              {/* Mini Chart */}
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={historyStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {historyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold text-gray-800">{historyData.length > 0 ? Math.round((presentCount / historyData.length) * 100) : 0}%</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Vista Mensual</p>
                <div className="grid grid-cols-5 gap-2">
                  {historyData.slice(0, 20).map((record, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium border transition-transform hover:scale-105 cursor-help ${
                        record.status === AttendanceStatus.PRESENT 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : record.status === AttendanceStatus.ABSENT 
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}
                      title={`${record.date.toLocaleDateString()}: ${record.status}`}
                    >
                      {record.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                 <p className="text-xs text-gray-500 mb-1">Tendencia</p>
                 <p className="text-sm text-gray-800 flex items-center gap-2">
                   <TrendingUp size={16} className="text-green-500" />
                   Asistencia estable esta semana.
                 </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search size={40} className="text-gray-200 mb-4" />
              <p className="text-gray-500 text-sm">Selecciona un alumno de la lista para ver su historial detallado y estadísticas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Lesson Planning View (AI Powered)
const Planning = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LessonPlan | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await generateLessonPlanAI('Historia de México II', topic, '90 minutos');
    if (result) {
       setPlan(result);
       db.plans.save(result); // Save to DB
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <BrainCircuit className="text-brand-500" />
          Planeación Inteligente
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Deja que ClassMood AI estructure tu próxima clase. Simplemente ingresa el tema y obtén objetivos, actividades y recursos.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Ej: La Revolución Mexicana, Ecuaciones Cuadráticas..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 min-w-[160px]"
        >
          {loading ? (
            <span className="animate-pulse">Generando...</span>
          ) : (
            <>
              <Sparkles size={18} />
              Generar Plan
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-brand-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{plan.topic}</h2>
            <div className="flex items-center gap-2 mt-2 opacity-90 text-sm">
              <Clock size={16} />
              <span>Duración estimada: {plan.duration}</span>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Objetivo de Aprendizaje</h3>
              <p className="text-gray-800 text-lg leading-relaxed">{plan.objective}</p>
            </section>
            
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                  Actividades
                </h3>
                <ul className="space-y-3">
                  {plan.activities.map((act, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="font-bold text-brand-300 select-none">{i + 1}.</span>
                      {act}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                  Recursos Necesarios
                </h3>
                <ul className="space-y-3">
                  {plan.resources.map((res, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <CheckCircle2 size={18} className="text-accent-400 mt-1 flex-shrink-0" />
                      {res}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Grades & Progress View
const Grades = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    setStudents(db.students.getAll());
    setGrades(db.grades.getAll());
  }, []);

  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    setAiFeedback('');
    setLoadingFeedback(true);
    const feedback = await generateStudentFeedbackAI(student.name, student.averageGrade, student.attendanceRate);
    setAiFeedback(feedback);
    setLoadingFeedback(false);
  };

  const chartData = students.map(s => ({
    name: s.name.split(' ')[0],
    grade: s.averageGrade,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones y Progreso</h1>
        <button 
          onClick={db.reset}
          className="text-xs text-red-400 hover:text-red-600 underline"
        >
          Resetear Base de Datos (Debug)
        </button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Promedio por Alumno (Parcial Actual)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{fill: '#f9fafb'}}
                  />
                  <Bar dataKey="grade" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Alumno</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">P1</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">P2</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">P3</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Prom</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grades.map((g, idx) => {
                    const student = students.find(s => s.id === g.studentId);
                    if (!student) return null;
                    const average = ((g.parcial1 + g.parcial2 + g.parcial3) / 3).toFixed(1);
                    return (
                      <tr key={g.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{g.parcial1}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{g.parcial2}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{g.parcial3}</td>
                        <td className={`px-4 py-3 text-center font-bold ${Number(average) < 7 ? 'text-red-500' : 'text-brand-600'}`}>
                          {average}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleStudentSelect(student)}
                            className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                          >
                            Detalles
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detalle del Alumno</h3>
          {selectedStudent ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedStudent.name}</h4>
                  <p className="text-sm text-gray-500">{selectedStudent.matricula}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Asistencia</p>
                  <p className="text-xl font-bold text-brand-600">{selectedStudent.attendanceRate}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Promedio</p>
                  <p className="text-xl font-bold text-brand-600">{selectedStudent.averageGrade}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-50 to-accent-50 p-4 rounded-xl border border-brand-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-600" />
                  <p className="text-sm font-bold text-brand-800">Sugerencia AI</p>
                </div>
                {loadingFeedback ? (
                   <div className="space-y-2 animate-pulse">
                     <div className="h-2 bg-brand-200 rounded w-full"></div>
                     <div className="h-2 bg-brand-200 rounded w-3/4"></div>
                   </div>
                ) : (
                  <p className="text-sm text-gray-700 italic">"{aiFeedback}"</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Users size={40} className="mx-auto mb-2 opacity-20" />
              <p>Selecciona un alumno para ver detalles y sugerencias.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Messages View
const Messages = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStudents(db.students.getAll());
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      setMessages(db.messages.getThread(selectedStudentId));
    }
  }, [selectedStudentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudentId) return;

    const msg = db.messages.send({
      studentId: selectedStudentId,
      sender: 'teacher',
      content: newMessage
    });

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-gray-200 flex overflow-hidden animate-in fade-in duration-300">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
           <h2 className="text-lg font-bold text-gray-800">Mensajes</h2>
           <p className="text-xs text-gray-500">Comunicación directa con padres y alumnos</p>
        </div>
        <div className="flex-1 overflow-y-auto">
           {students.map(student => (
             <button 
               key={student.id}
               onClick={() => setSelectedStudentId(student.id)}
               className={`w-full p-4 flex items-center gap-3 transition-colors hover:bg-gray-50 text-left border-l-4 ${selectedStudentId === student.id ? 'bg-brand-50 border-brand-500' : 'border-transparent'}`}
             >
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold shrink-0">
                  {student.name.charAt(0)}
               </div>
               <div className="overflow-hidden">
                 <p className="font-medium text-gray-900 truncate">{student.name}</p>
                 <p className="text-xs text-gray-500 truncate">{student.matricula}</p>
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/50">
        {selectedStudent ? (
           <>
             <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm">
                <div>
                   <h3 className="font-bold text-gray-800">{selectedStudent.name}</h3>
                   <span className="text-xs text-green-600 flex items-center gap-1">
                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                     En línea ahora
                   </span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                   <div className="text-center text-gray-400 py-10 text-sm">
                      <MessageSquare size={40} className="mx-auto mb-2 opacity-20" />
                      Inicia la conversación con {selectedStudent.name.split(' ')[0]}.
                   </div>
                )}
                {messages.map(msg => (
                   <div key={msg.id} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                        msg.sender === 'teacher' 
                          ? 'bg-brand-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                         <p>{msg.content}</p>
                         <p className={`text-[10px] mt-1 text-right ${msg.sender === 'teacher' ? 'text-brand-200' : 'text-gray-400'}`}>
                           {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </p>
                      </div>
                   </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                   <input 
                     type="text" 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Escribe un mensaje..."
                     className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                   />
                   <button 
                     type="submit"
                     disabled={!newMessage.trim()}
                     className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     <Send size={20} />
                   </button>
                </form>
             </div>
           </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Selecciona un chat para comenzar</p>
           </div>
        )}
      </div>
    </div>
  );
};

// --- LAYOUT WRAPPER ---
// Fixed prop typing to prevent TS errors
const Layout = ({ children, onLogout }: { children?: React.ReactNode, onLogout: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const session = db.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/students" element={<div className="text-center text-gray-500 mt-20">Directorio de estudiantes en construcción</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;