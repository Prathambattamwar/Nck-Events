/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Shibir } from './types';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import JapaCounter from './components/JapaCounter';

import { Language, translations } from './translations';
import { socketService } from './services/socketService';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [shibirs, setShibirs] = useState<Shibir[]>([]);

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('shibir_lang');
    return (saved as Language) || 'en';
  });

  // Real-time integration
  useEffect(() => {
    socketService.connect();
    
    socketService.subscribeToShibirs((initialShibirs) => {
      setShibirs(initialShibirs);
    });

    socketService.subscribeToShibirAdded((newShibir) => {
      setShibirs(prev => {
        // Prevent duplicates
        if (prev.find(s => s.id === newShibir.id)) return prev;
        return [newShibir, ...prev];
      });
    });

    socketService.subscribeToShibirRemoved((id) => {
      setShibirs(prev => prev.filter(s => s.id !== id));
    });

    socketService.subscribeToShibirUpdated((updatedShibir) => {
      setShibirs(prev => prev.map(s => s.id === updatedShibir.id ? updatedShibir : s));
    });
  }, []);

  const t = translations[language];

  const translatedShibirs = useMemo(() => {
    const now = new Date();
    // Set time to start of day for cleaner comparison if needed, 
    // but here we compare full date/time
    return shibirs
      .filter(s => {
        const end = new Date(s.endDate);
        // We keep it if the end date is today or in the future
        // End date is inclusive of the full day, so we compare with the end of that day
        end.setHours(23, 59, 59, 999);
        return end >= now;
      })
      .map(s => {
        const translation = (t as any).initialShibirs?.find((ts: any) => ts.id === s.id);
        if (translation) {
          return { ...s, ...translation };
        }
        return s;
      });
  }, [shibirs, language, t]);

  // Automatic deletion of expired shibirs from the data source
  useEffect(() => {
    const cleanupExpired = () => {
      const now = new Date();
      shibirs.forEach(shibir => {
        const end = new Date(shibir.endDate);
        end.setHours(23, 59, 59, 999);
        if (end < now) {
          console.log(`Automatically removing expired shibir: ${shibir.title}`);
          socketService.removeShibir(shibir.id);
        }
      });
    };

    // Run cleanup on mount and then every hour
    cleanupExpired();
    const interval = setInterval(cleanupExpired, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [shibirs]);

  useEffect(() => {
    localStorage.setItem('shibir_lang', language);
  }, [language]);

  const navigate = useNavigate();

  const handleLogin = (role: 'admin' | 'student', email: string) => {
    const newUser: User = { id: Date.now().toString(), email, role };
    setUser(newUser);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const addShibir = (newShibir: Omit<Shibir, 'id'>) => {
    socketService.addShibir(newShibir);
  };

  const deleteShibir = (id: string) => {
    socketService.removeShibir(id);
  };

  const updateShibir = (shibir: Shibir) => {
    socketService.updateShibir(shibir);
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('shibir_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shibir_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shibir_theme', 'light');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} language={language} setLanguage={setLanguage} t={t} />} />
      <Route element={<Layout user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} language={language} setLanguage={setLanguage} t={t} />}>
        <Route 
          path="/dashboard" 
          element={!user ? <Navigate to="/login" /> : (user.role === 'student' ? <StudentDashboard shibirs={translatedShibirs} /> : <Navigate to="/admin" />)} 
        />
        <Route 
          path="/japa" 
          element={!user ? <Navigate to="/login" /> : <JapaCounter />} 
        />
        <Route 
          path="/admin" 
          element={!user ? <Navigate to="/login" /> : (user.role === 'admin' ? <AdminDashboard shibirs={translatedShibirs} onAdd={addShibir} onDelete={deleteShibir} onUpdate={updateShibir} t={t} language={language} /> : <Navigate to="/dashboard" />)} 
        />
      </Route>
      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
