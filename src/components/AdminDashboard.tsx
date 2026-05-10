import React, { useState } from 'react';
import { Shibir } from '../types';
import { Plus, Trash2, Calendar, MapPin, Type, FileText, Image as ImageIcon, Upload, X, SlidersHorizontal, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  shibirs: Shibir[];
  onAdd: (shibir: Omit<Shibir, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (shibir: Shibir) => void;
  t: any;
  language: string;
}

export default function AdminDashboard({ shibirs, onAdd, onDelete, onUpdate, t, language }: AdminDashboardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingShibir, setEditingShibir] = useState<Shibir | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: ''
  });
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = e instanceof File ? e : e.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onerror = () => {
      clearInterval(progressInterval);
      setUploadState('error');
      setErrorMessage('Failed to read file. Please try again.');
    };

    reader.onloadend = () => {
      const img = new Image();
      img.onerror = () => {
        clearInterval(progressInterval);
        setUploadState('error');
        setErrorMessage('Invalid image file.');
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Finalize progress
        setUploadProgress(100);
        setTimeout(() => {
          clearInterval(progressInterval);
          setFormData({ ...formData, imageUrl: dataUrl });
          setUploadState('success');
        }, 300);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShibir) {
      onUpdate({ ...formData, id: editingShibir.id });
    } else {
      onAdd(formData);
    }
    closeForm();
  };

  const startEditing = (shibir: Shibir) => {
    setEditingShibir(shibir);
    setFormData({
      title: shibir.title,
      description: shibir.description,
      startDate: shibir.startDate,
      endDate: shibir.endDate,
      location: shibir.location,
      imageUrl: shibir.imageUrl || ''
    });
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingShibir(null);
    setUploadState('idle');
    setUploadProgress(0);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: ''
    });
  };

  return (
    <div className="space-y-8 sm:space-y-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full pt-10 sm:pt-20">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 sm:p-14 rounded-[32px] sm:rounded-[50px] shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                 <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">
                   {editingShibir ? 'Edit Shibir' : 'New Shibir'}
                 </h2>
                 <button onClick={closeForm} className="w-8 sm:w-10 h-8 sm:h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Youth Awakening"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none px-6 py-4 rounded-[20px] text-sm font-bold outline-none focus:ring-2 ring-ui-purple/20 transition-all placeholder:text-zinc-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">Location</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rishikesh"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none px-6 py-4 rounded-[20px] text-sm font-bold outline-none focus:ring-2 ring-ui-purple/20 transition-all placeholder:text-zinc-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">Start Date</label>
                    <input
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none px-4 sm:px-6 py-3 sm:py-4 rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold outline-none focus:ring-2 ring-ui-purple/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">End Date</label>
                    <input
                      required
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none px-4 sm:px-6 py-3 sm:py-4 rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-bold outline-none focus:ring-2 ring-ui-purple/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about the shibir..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-none px-6 py-4 rounded-[20px] text-sm font-bold outline-none focus:ring-2 ring-ui-purple/20 transition-all resize-none placeholder:text-zinc-300"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4">Banner Image</label>
                  <div className="relative group overflow-hidden bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-ui-purple/50 transition-all aspect-[21/9] flex flex-col items-center justify-center">
                    {uploadState === 'uploading' ? (
                      <div className="flex flex-col items-center gap-4 w-full px-12">
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-ui-purple h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest animate-pulse mb-1">
                            Processing... {uploadProgress}%
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Estimated: {Math.max(1, Math.ceil((100 - uploadProgress) / 10))}s remaining
                          </p>
                        </div>
                      </div>
                    ) : uploadState === 'error' ? (
                      <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                        <div>
                          <p className="text-sm font-bold text-red-500">{errorMessage}</p>
                          <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                            <RefreshCw className="w-3 h-3" />
                            Retry Upload
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : formData.imageUrl ? (
                      <>
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, imageUrl: '' });
                              setUploadState('idle');
                            }}
                            className="p-3 bg-red-500 text-white rounded-2xl hover:scale-110 transition-all shadow-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {uploadState === 'success' && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 p-8 text-center w-full h-full justify-center">
                        <Upload className="w-8 h-8 text-zinc-400 group-hover:text-ui-purple transition-colors" />
                        <div>
                          <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">Click to upload banner</p>
                          <p className="text-[10px] font-medium text-zinc-400 mt-1">Recommended size: 1200x500px (Max 2MB)</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-ui-blue to-ui-purple text-white py-5 rounded-[24px] font-bold uppercase tracking-widest text-xs shadow-xl shadow-ui-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingShibir ? 'Update Event' : 'Publish Event'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pb-32"
            >
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Manage Events</h2>
                  <div className="h-0.5 w-8 bg-ui-purple rounded-full" />
                </div>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">New Shibir</span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              </div>
              {shibirs.length === 0 ? (
                <div className="py-32 text-center bg-white/40 border-2 border-dashed border-zinc-200 rounded-[40px]">
                  <p className="text-zinc-400 font-medium italic">No shibirs created yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shibirs.map((shibir) => (
                      <motion.div 
                        key={shibir.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="group bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-3 sm:p-5 rounded-[24px] sm:rounded-[40px] border border-zinc-100 dark:border-white/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 hover:shadow-2xl transition-all"
                      >
                        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-100 dark:bg-zinc-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                         <img src={shibir.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" alt={shibir.title} />
                       </div>
                       <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{shibir.title}</h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-ui-purple/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-ui-purple">
                            <MapPin className="w-3 h-3" />
                            {shibir.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(shibir.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:pr-6">
                       <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this shibir? This action cannot be undone.')) {
                            onDelete(shibir.id);
                          }
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:bg-red-500 hover:text-white rounded-[16px] sm:rounded-[20px] transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-inner"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(shibir);
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 rounded-[16px] sm:rounded-[20px] transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-inner"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
