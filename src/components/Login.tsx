import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Chrome, Facebook, Languages, Sun, Moon } from 'lucide-react';
import { Language } from '../translations';

interface LoginProps {
  onLogin: (role: 'admin' | 'student', email: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export default function Login({ onLogin, darkMode, setDarkMode, language, setLanguage, t }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg(t.validEmailError);
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    // Admin logic
    if (email.toLowerCase() === 'guruji@admin.com') {
      if (password === 'Admin123') {
        onLogin('admin', email);
      } else {
        setErrorMsg('Invalid password for admin account');
      }
      return;
    }

    // Default student login
    onLogin('student', email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#4facfe] via-[#00f2fe] to-[#8E44AD] dark:from-[#0A0A0A] dark:to-[#1A1A1A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-10 rounded-[50px] shadow-2xl flex flex-col items-center"
      >
        {/* Profile Avatar */}
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-ui-pink via-ui-purple to-ui-blue shadow-lg mb-4">
          <div className="w-full h-full bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <User className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-white mb-10">Login</h1>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 px-4 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-ui-purple transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-white dark:bg-zinc-800 border-none px-12 py-4 rounded-2xl shadow-sm focus:shadow-md focus:ring-2 ring-ui-purple/20 transition-all outline-none text-zinc-700 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between px-4 ml-1">
                <label className="text-xs font-bold text-zinc-500">Password</label>
                <button type="button" className="text-[10px] text-ui-blue font-medium hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-ui-purple transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-white dark:bg-zinc-800 border-none px-12 py-4 rounded-2xl shadow-sm focus:shadow-md focus:ring-2 ring-ui-purple/20 transition-all outline-none text-zinc-700 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-wider">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-ui-blue to-ui-purple text-white py-4 rounded-3xl font-bold text-lg shadow-xl shadow-ui-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Log In
          </button>
        </form>

        <div className="w-full py-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[10px] font-medium text-zinc-400">or continue with</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="flex gap-4 mb-8">
          <button className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <Chrome className="w-6 h-6 text-zinc-400" />
          </button>
          <button className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <Facebook className="w-6 h-6 text-ui-blue" />
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Not registered yet? <button className="text-ui-blue font-bold hover:underline">Sign Up &gt;</button>
        </p>
      </motion.div>

      {/* Floating Settings */}
      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-2xl transition-all border border-white/10"
        >
          {darkMode ? <Sun className="w-5 h-5 text-zinc-100" /> : <Moon className="w-5 h-5 text-zinc-800" />}
        </button>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-3xl px-4 py-2 rounded-2xl border border-white/10">
          <Languages className="w-4 h-4 text-white" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer appearance-none"
          >
            <option value="en" className="text-zinc-800">EN</option>
            <option value="hi" className="text-zinc-800">HI</option>
            <option value="te" className="text-zinc-800">TE</option>
          </select>
        </div>
      </div>
    </div>
  );
}

