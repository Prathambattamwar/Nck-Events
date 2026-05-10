import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, RotateCcw, Heart, History, ChevronDown, Calendar, Clock } from 'lucide-react';
import { JapaStats } from '../types';

const MALA_SIZE = 108;

type JapaHistoryEntry = {
  id: string;
  timestamp: string;
  malas: number;
  mantras: number;
};

type JapaState = {
  count: number;
  sessionMalas: number;
  stats: JapaStats;
  history: JapaHistoryEntry[];
};

type JapaAction = 
  | { type: 'INCREMENT' } 
  | { type: 'COMPLETE_MALA' }
  | { type: 'RESET_MALA' }
  | { type: 'SYNC_DATA'; stats: JapaStats; history: JapaHistoryEntry[] }
  | { type: 'CLEAR_HISTORY' };

function japaReducer(state: JapaState, action: JapaAction): JapaState {
  switch (action.type) {
    case 'INCREMENT': {
      const newStats = {
        ...state.stats,
        totalMantraCount: state.stats.totalMantraCount + 1,
        lastSession: new Date().toISOString()
      };
      if (newStats.totalMantraCount > 0 && newStats.totalMantraCount % MALA_SIZE === 0) {
        // We handle this via side effect for UX, but we could do it here
      }
      return {
        ...state,
        count: state.count + 1,
        stats: newStats
      };
    }
    case 'COMPLETE_MALA': {
      const timestamp = new Date().toISOString();
      const newHistoryEntry: JapaHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp,
        malas: 1,
        mantras: MALA_SIZE
      };

      const newStats = {
        ...state.stats,
        totalMalasCompleted: state.stats.totalMalasCompleted + 1,
        lastSession: timestamp
      };

      return {
        ...state,
        count: 0,
        sessionMalas: state.sessionMalas + 1,
        stats: newStats,
        history: [newHistoryEntry, ...state.history].slice(0, 50) // Keep last 50 entries
      };
    }
    case 'RESET_MALA':
      return { ...state, count: 0 };
    case 'SYNC_DATA':
      return { 
        ...state, 
        stats: action.stats, 
        history: action.history 
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    default:
      return state;
  }
}

export default function JapaCounter() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [state, dispatch] = useReducer(japaReducer, {
    count: 0,
    sessionMalas: 0,
    stats: { totalMantraCount: 0, totalMalasCompleted: 0, lastSession: new Date().toISOString() },
    history: []
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('japa_stats');
    const savedHistory = localStorage.getItem('japa_history');
    
    dispatch({ 
      type: 'SYNC_DATA', 
      stats: savedStats ? JSON.parse(savedStats) : state.stats,
      history: savedHistory ? JSON.parse(savedHistory) : []
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('japa_stats', JSON.stringify(state.stats));
    localStorage.setItem('japa_history', JSON.stringify(state.history));
  }, [state.stats, state.history]);

  useEffect(() => {
    if (state.count === MALA_SIZE) {
      const timer = setTimeout(() => {
        completeMala();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.count]);

  const increment = useCallback(() => {
    if (state.count < MALA_SIZE) {
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(12);
      }
      dispatch({ type: 'INCREMENT' });
    }
  }, [state.count]);

  const resetCurrent = () => {
    if (confirm('Reset current count?')) {
      dispatch({ type: 'RESET_MALA' });
    }
  };

  const completeMala = () => {
    dispatch({ type: 'COMPLETE_MALA' });
    // Haptic feedback for completion
    if (window.navigator?.vibrate) {
      window.navigator.vibrate([30, 50, 30]);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-ui-purple">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Total Malas</span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {state.stats.totalMalasCompleted}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-ui-blue">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Total Mantras</span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {state.stats.totalMantraCount}
          </p>
        </div>
      </div>

      {/* Main Counter Stage */}
      <div className="relative flex flex-col items-center">
        {/* Progress Ring */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative w-72 h-72 sm:w-[500px] sm:h-[500px] flex items-center justify-center transition-all duration-500 ease-out [--radius:132px] sm:[--radius:230px]"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(168,85,247,0.15)]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-ui-blue)" />
                <stop offset="50%" stopColor="var(--color-ui-purple)" />
                <stop offset="100%" stopColor="var(--color-ui-pink)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="46"
              className="fill-none stroke-zinc-100 dark:stroke-white/5"
              strokeWidth="1"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              className="fill-none"
              style={{ stroke: 'url(#ringGradient)' }}
              strokeWidth="4"
              pathLength="100"
              animate={{ strokeDashoffset: 100 - (state.count / MALA_SIZE * 100) }}
              strokeDasharray="100 100"
              strokeLinecap="round"
              transition={{ type: "spring", stiffness: 40, damping: 20 }}
            />
          </svg>

          {/* Beads Decoration - Robust Wrapper Pattern for Layout integrity */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(108)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{ 
                  transform: `translate(-50%, -50%) rotate(${i * (360/108)}deg) translateY(calc(-1 * var(--radius)))`
                }}
              >
                <motion.div
                  className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shadow-sm transition-all duration-500 ${
                    i < state.count 
                      ? 'bg-ui-purple scale-125 shadow-[0_0_8px_rgba(168,85,247,0.6)]' 
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                  animate={{
                    scale: i === state.count - 1 ? [1, 1.8, 1.25] : (i < state.count ? 1.25 : 1),
                    opacity: i % 9 === 0 ? 1 : (i < state.count ? 0.9 : 0.2)
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95, y: 2 }}
            whileHover={{ scale: 1.01 }}
            onClick={increment}
            className="group relative w-56 h-56 sm:w-96 sm:h-96 bg-zinc-950 dark:bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.1)] border-[4px] sm:border-[8px] border-zinc-100/5 dark:border-zinc-900/5 overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-ui-purple translate-y-full group-hover:translate-y-0 transition-transform duration-700 opacity-10" />
            
            <AnimatePresence mode="popLayout">
              <motion.span
                key={state.count}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.5 }}
                className="text-7xl sm:text-9xl font-black text-white dark:text-zinc-900 tracking-tighter"
              >
                {state.count}
              </motion.span>
            </AnimatePresence>
            <div className="flex flex-col items-center mt-1 sm:mt-2">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-ui-purple group-hover:animate-pulse mb-0.5 sm:mb-1">
                Active
              </span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 dark:text-zinc-400">
                Tap to count
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-sm">
          <button
            onClick={completeMala}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-ui-purple text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-ui-purple/90 transition-all hover:shadow-xl shadow-ui-purple/20"
          >
            <Trophy className="w-4 h-4" />
            Complete Mala
          </button>
          <button
            onClick={resetCurrent}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-all hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Count
          </button>
        </div>
      </div>

      {/* Info Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 dark:bg-zinc-900/50 p-8 rounded-[48px] border border-white/5 flex items-start gap-5 shadow-2xl"
      >
        <div className="w-12 h-12 bg-ui-purple text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-ui-purple/20">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">Spiritual Quotient</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            You have completed <span className="font-bold text-ui-purple">{state.sessionMalas} malas</span> in this session. 
            Steady chanting brings inner peace, mental clarity, and divine connection.
          </p>
        </div>
      </motion.div>

      {/* History History Section */}
      <div className="bg-white dark:bg-zinc-900/50 rounded-[40px] border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm">
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-zinc-500" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Completion History</h4>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{state.history.length} Saved Entries</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isHistoryOpen ? 180 : 0 }}
            className="w-8 h-8 flex items-center justify-center text-zinc-400"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6 sm:px-8 sm:pb-8"
            >
              <div className="space-y-3 pt-2">
                {state.history.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-xs text-zinc-400 font-medium italic">No history recorded yet. Complete a mala to start your log.</p>
                  </div>
                ) : (
                  state.history.map((entry) => (
                    <div 
                      key={entry.id}
                      className="group flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 hover:border-ui-purple/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-ui-purple" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                              <Calendar className="w-3 h-3 text-zinc-400" />
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                              <Clock className="w-3 h-3 text-zinc-500/50" />
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                            {entry.malas} Mala{entry.malas > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-ui-purple tracking-tighter">
                          +{entry.mantras}
                        </span>
                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Mantras</p>
                      </div>
                    </div>
                  ))
                )}
                {state.history.length > 0 && (
                  <button 
                    onClick={() => {
                      if(confirm('Clear history forever?')) {
                        dispatch({ type: 'CLEAR_HISTORY' });
                      }
                    }}
                    className="w-full py-3 mt-4 text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
                  >
                    Clear All History
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
