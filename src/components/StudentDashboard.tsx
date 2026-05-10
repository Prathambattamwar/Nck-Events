import { useState } from 'react';
import { Shibir } from '../types';
import { Calendar as CalendarIcon, ArrowRight, X, Hash, Sparkles, MapPin, Clock, Users } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardProps {
  shibirs: Shibir[];
}

export default function StudentDashboard({ shibirs }: StudentDashboardProps) {
  const [selectedShibir, setSelectedShibir] = useState<Shibir | null>(null);
  const navigate = useNavigate();

  const handleSelectShibir = (shibir: Shibir) => {
    setSelectedShibir(shibir);
  };

  const getDuration = (start: string, end: string) => {
    const days = differenceInDays(new Date(end), new Date(start)) + 1;
    return `${days} Day${days > 1 ? 's' : ''} Retreat`;
  };

  return (
    <div className="space-y-12 sm:space-y-20 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20">
      
      <div>
        {/* Shibir List - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {shibirs.map((shibir) => (
          <motion.div 
            key={shibir.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            onClick={() => handleSelectShibir(shibir)}
            className="group bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-100 dark:border-white/5 p-3 sm:p-4 rounded-[32px] sm:rounded-[48px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-ui-purple/10 transition-all cursor-pointer"
          >
            <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800 rounded-[24px] sm:rounded-[36px] overflow-hidden mb-4 sm:mb-6 relative">
               <img 
                 src={shibir.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'} 
                 alt={shibir.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
               />
               <div className="absolute top-5 right-5 px-4 py-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black text-zinc-800 dark:text-white uppercase tracking-[0.2em] shadow-sm">
                 {shibir.location}
               </div>
            </div>
            
            <div className="space-y-5 px-3 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-ui-purple opacity-0 group-hover:opacity-100 transition-opacity">Explore Session</span>
                  <h3 className="text-2xl font-black text-zinc-800 dark:text-white tracking-tight leading-none group-hover:text-ui-purple transition-colors">
                    {shibir.title}
                  </h3>
                </div>
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-zinc-50 dark:bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-ui-purple group-hover:text-white transition-all shadow-inner">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-ui-purple/50" />
                  <span>{format(new Date(shibir.startDate), 'MMM dd')}</span>
                </div>
                <div className="w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-orange-400/50" />
                  <span>{getDuration(shibir.startDate, shibir.endDate)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        </div>

        {shibirs.length === 0 && (
          <div className="py-40 text-center rounded-[60px] border-2 border-dashed border-zinc-100 dark:border-white/5">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700 italic">No shibirs scheduled at this time.</p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedShibir && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShibir(null)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-[32px] sm:rounded-[64px] overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-2 max-h-[90vh] md:max-h-none overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedShibir(null)}
                className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 w-10 sm:w-12 h-10 sm:h-12 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center transition-all group"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 dark:text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <div className="p-4 sm:p-6 lg:p-10 shrink-0">
                <div className="aspect-[4/5] relative rounded-[24px] sm:rounded-[48px] overflow-hidden shadow-xl">
                  <img 
                    src={selectedShibir.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'} 
                    alt={selectedShibir.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Location</p>
                      <p className="text-white text-xl font-bold">{selectedShibir.location}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 md:p-12 lg:p-20 flex flex-col justify-center space-y-8 sm:space-y-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-ui-purple/5 border border-ui-purple/10 rounded-full">
                    <div className="w-2 h-2 bg-ui-purple rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-ui-purple uppercase tracking-[0.2em]">Open for Registration</span>
                  </div>
                  <h2 className="text-5xl sm:text-7xl font-black text-zinc-900 dark:text-white leading-[0.85] tracking-tight sm:tracking-tighter">
                    {selectedShibir.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-12 py-8 sm:py-10 border-y border-zinc-100 dark:border-white/5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Dates</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {format(new Date(selectedShibir.startDate), 'dd MMM')} — {format(new Date(selectedShibir.endDate), 'dd MMM')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Shibir Sthal</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">{selectedShibir.location}</p>
                  </div>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">The Experience</h4>
                    </div>
                    <p className="text-xl sm:text-2xl font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
                      “{selectedShibir.description}”
                    </p>
                  </div>
                  
                   <button 
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-6 rounded-[32px] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     Apply for Retreat
                     <ArrowRight className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
