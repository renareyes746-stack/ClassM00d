import React, { useState } from 'react';
import { db } from '../services/db';
import { LogIn, UserPlus, Mail, Phone, Lock, School, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  
  // Register specific fields
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Improved phone regex: allows digits, spaces, dashes, and plus sign
  const isPhone = /^[\d\s\-\+]+$/.test(identifier) && identifier.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isRegistering) {
        if (!name || !identifier || !password) {
          throw new Error("Por favor completa todos los campos.");
        }
        
        db.auth.register({
          name,
          school,
          email: !isPhone ? identifier : undefined,
          phone: isPhone ? identifier : undefined,
          password
        });
      } else {
        db.auth.login(identifier, password);
      }
      
      onLogin(); // Notify parent component
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-200/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-8 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles size={100} />
           </div>
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-inner">
             C
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Bienvenido a ClassMood</h1>
           <p className="text-brand-100 text-sm mt-2">La plataforma inteligente para docentes.</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => { setIsRegistering(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isRegistering ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isRegistering ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Nombre Completo</label>
                  <div className="relative">
                    <UserPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="Prof. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Escuela</label>
                  <div className="relative">
                    <School size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="Preparatoria Oficial..."
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                {isRegistering ? 'Correo o Teléfono' : 'Credenciales'}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                   {isPhone ? <Phone size={18} /> : <Mail size={18} />}
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="correo@ejemplo.com o 5512345678"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-left-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                 {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 mt-4 group"
            >
              {loading ? (
                <span className="opacity-80">Procesando...</span>
              ) : (
                <>
                  {isRegistering ? 'Crear Cuenta' : 'Ingresar'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
             Al continuar aceptas nuestros <span className="underline cursor-pointer hover:text-brand-600">Términos de Servicio</span> y <span className="underline cursor-pointer hover:text-brand-600">Política de Privacidad</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;