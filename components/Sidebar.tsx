import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  GraduationCap, 
  BrainCircuit,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { db } from '../services/db';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { path: '/', label: 'Inicio', icon: LayoutDashboard },
    { path: '/attendance', label: 'Pase de Lista', icon: CalendarCheck },
    { path: '/planning', label: 'Planeación IA', icon: BrainCircuit },
    { path: '/messages', label: 'Mensajes', icon: MessageSquare },
    { path: '/grades', label: 'Evaluaciones', icon: BookOpen },
    { path: '/students', label: 'Alumnos', icon: GraduationCap },
  ];

  const handleLogout = () => {
    db.auth.logout();
    if (onLogout) onLogout();
  };

  return (
    <div className="h-screen w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
          C
        </div>
        <span className="ml-3 font-bold text-gray-800 text-xl hidden lg:block tracking-tight">
          Class<span className="text-brand-600">Mood</span>
        </span>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={22} strokeWidth={2} />
            <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
            
            {/* Tooltip for mobile */}
            <div className="lg:hidden absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              {item.label}
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors group"
        >
          <LogOut size={22} />
          <span className="ml-3 font-medium hidden lg:block group-hover:text-rose-700">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;