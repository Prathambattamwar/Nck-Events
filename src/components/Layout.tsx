import { Outlet, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Moon, Sun, LogOut, User as UserIcon, Calendar, Languages, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../translations';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export default function Layout({ user, onLogout, darkMode, setDarkMode, language, setLanguage, t }: LayoutProps) {
  const navigate = useNavigate();

  if (!user) return <Outlet />;

  return (
    <div className="min-h-screen bg-transparent relative selection:bg-ui-purple/20 selection:text-ui-purple">
      <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 sm:py-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl rounded-[20px] sm:rounded-[32px] h-14 sm:h-20 flex items-center justify-between px-3 sm:px-8 shadow-2xl shadow-black/5 border border-white/40 dark:border-white/10">
          <div 
            className="flex items-center gap-2 sm:gap-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-tr from-ui-pink via-ui-purple to-ui-blue rounded-lg sm:rounded-2xl flex items-center justify-center shadow-xl shadow-ui-purple/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Calendar className="text-white w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-2xl text-zinc-900 dark:text-white tracking-tighter leading-none sm:mb-1">Shibir.OS</span>
              <span className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-ui-purple animate-pulse">Spiritual Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-8">
            <nav className="hidden sm:flex items-center p-1 bg-zinc-100/50 dark:bg-white/5 rounded-xl sm:rounded-2xl border border-zinc-200/50 dark:border-white/10">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  window.location.pathname === '/dashboard' ? 'bg-white dark:bg-zinc-800 text-ui-purple shadow-sm ring-1 ring-black/5' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Events</span>
              </button>
              <button 
                onClick={() => navigate('/japa')}
                className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  window.location.pathname === '/japa' ? 'bg-white dark:bg-zinc-800 text-ui-purple shadow-sm ring-1 ring-black/5' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Japa</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-zinc-100/50 dark:bg-white/5 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm border border-zinc-200/50 dark:border-white/10 group"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-orange-400 group-hover:rotate-90 transition-transform" /> : <Moon className="w-4 h-4 text-zinc-500 group-hover:-rotate-12 transition-transform" />}
                </button>
                
                <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-zinc-200 dark:border-white/10">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-ui-purple uppercase tracking-widest leading-none mb-1">{user?.role}</p>
                    <p className="text-[10px] font-bold text-zinc-400 truncate max-w-[120px]">{user?.email}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-all group shadow-xl shadow-black/10"
                  >
                    <LogOut className="w-4 h-4 text-white dark:text-zinc-900 group-hover:text-white" />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 pb-40">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation - More Ergonomic */}
      <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-zinc-900/90 dark:bg-zinc-100/95 backdrop-blur-2xl px-6 py-4 rounded-[32px] flex items-center justify-between shadow-2xl border border-white/10 dark:border-zinc-900/10">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              window.location.pathname === '/dashboard' ? 'text-ui-blue' : 'text-zinc-500'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Events</span>
          </button>
          
          {/* Central Action Button */}
          <button 
            onClick={() => navigate('/japa')}
            className={`w-14 h-14 -mt-10 bg-gradient-to-tr from-ui-pink via-ui-purple to-ui-blue rounded-full flex items-center justify-center shadow-2xl shadow-ui-purple/40 border-4 border-white dark:border-zinc-100 transition-all active:scale-90 ${
              window.location.pathname === '/japa' ? 'scale-110' : ''
            }`}
          >
            <Hash className="w-6 h-6 text-white" />
          </button>

          <button 
            onClick={onLogout}
            className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
