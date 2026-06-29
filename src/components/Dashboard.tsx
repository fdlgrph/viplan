import React, { useState, ReactNode, useRef } from 'react';
import { Schedule, User, PlatformType, ContentStatusType, PaymentStatusType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Calendar, Clock, MapPin, User as UserIcon, Phone, 
  Layers, DollarSign, CheckCircle2, Circle, AlertCircle, Edit, Trash2, 
  LogOut, CalendarDays, List, Sparkles, TrendingUp, Users, ExternalLink, CheckSquare,
  Camera, Upload, Link as LinkIcon, X
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  schedules: Schedule[];
  onAddSchedule: () => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
  onLogout: () => void;
  syncIndicator: ReactNode;
}

export default function Dashboard({ 
  user, 
  onUpdateUser,
  schedules, 
  onAddSchedule, 
  onEditSchedule, 
  onDeleteSchedule, 
  onLogout,
  syncIndicator
}: DashboardProps) {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Avatar state and modal hooks
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(user.avatarUrl || '');
  const [avatarInputType, setAvatarInputType] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(user.avatarUrl && (user.avatarUrl.startsWith('http://') || user.avatarUrl.startsWith('https://')) ? user.avatarUrl : '');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for custom delete confirmation modal
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  // Fallback beautiful gradients
  const presetGradients = [
    'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', // Flame
    'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', // Ocean
    'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)', // Neon sunset
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Forest
    'linear-gradient(135deg, #DA22FF 0%, #9733EE 100%)', // Purple glow
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran file terlalu besar. Maksimal adalah 2MB.');
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran file terlalu besar. Maksimal adalah 2MB.');
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (avatarInputType === 'url') {
      if (!urlInput.trim()) {
        setErrorMessage('Harap isi tautan gambar terlebih dahulu.');
        return;
      }
      if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
        setErrorMessage('Tautan harus dimulai dengan http:// atau https://');
        return;
      }
      onUpdateUser({
        ...user,
        avatarUrl: urlInput.trim()
      });
    } else {
      onUpdateUser({
        ...user,
        avatarUrl: tempAvatarUrl
      });
    }
    setIsAvatarModalOpen(false);
    setErrorMessage('');
  };

  const handleRemoveAvatar = () => {
    onUpdateUser({
      ...user,
      avatarUrl: undefined
    });
    setTempAvatarUrl('');
    setUrlInput('');
    setIsAvatarModalOpen(false);
    setErrorMessage('');
  };

  // Search and Filter Logic
  const filteredSchedules = schedules.filter((item) => {
    const matchSearch = 
      item.namaBrand.toLowerCase().includes(search.toLowerCase()) ||
      item.namaCampaign.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase()) ||
      item.picBrand.toLowerCase().includes(search.toLowerCase());

    const matchPlatform = platformFilter === 'all' || item.platform === platformFilter;
    const matchStatus = statusFilter === 'all' || item.statusKonten === statusFilter;

    return matchSearch && matchPlatform && matchStatus;
  });

  // Calculations for stats
  const totalCampaigns = filteredSchedules.length;
  
  const totalEarnings = filteredSchedules.reduce((acc, item) => acc + item.fee, 0);
  
  const lunasCount = filteredSchedules.filter(s => s.statusPembayaran === 'lunas').length;
  const dpCount = filteredSchedules.filter(s => s.statusPembayaran === 'dp').length;

  const selesaiCount = filteredSchedules.filter(s => s.statusKonten === 'selesai').length;
  const inProgressCount = filteredSchedules.filter(s => s.statusKonten !== 'selesai' && s.statusKonten !== 'belum shooting').length;
  const belumCount = filteredSchedules.filter(s => s.statusKonten === 'belum shooting').length;

  // Formatting Rupiah
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper styles based on Platform
  const getPlatformStyle = (p: PlatformType) => {
    switch (p) {
      case 'instagram':
        return {
          bg: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/15 hover:to-rose-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20',
          label: 'Instagram',
          dot: 'bg-pink-500'
        };
      case 'tiktok':
        return {
          bg: 'bg-slate-500/10 hover:bg-slate-500/15 text-slate-800 dark:text-slate-200 border-slate-500/20 dark:border-slate-400/20',
          label: 'TikTok',
          dot: 'bg-slate-800 dark:bg-white'
        };
      case 'youtube':
        return {
          bg: 'bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
          label: 'YouTube',
          dot: 'bg-red-500'
        };
      case 'facebook':
        return {
          bg: 'bg-blue-600/10 hover:bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-600/20',
          label: 'Facebook',
          dot: 'bg-blue-600'
        };
      case 'threads':
        return {
          bg: 'bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          label: 'Threads',
          dot: 'bg-indigo-500'
        };
    }
  };

  // Helper styles based on Content Status
  const getStatusColor = (s: ContentStatusType) => {
    switch (s) {
      case 'belum shooting':
        return 'bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400';
      case 'editing':
        return 'bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'review':
        return 'bg-purple-500/15 border border-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'upload':
        return 'bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'selesai':
        return 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
    }
  };

  // Generate calendar days for currentMonth
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Add empty slots for days before first day of month
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Align to Monday
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Add real days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(s => s.tanggal === dateStr);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Profile Info Panel */}
      <div className="glass-panel-glow rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />

        <div className="flex items-center gap-4.5 z-10">
          <div 
            className="relative group/avatar cursor-pointer shrink-0" 
            onClick={() => {
              setTempAvatarUrl(user.avatarUrl || '');
              setUrlInput(user.avatarUrl && (user.avatarUrl.startsWith('http://') || user.avatarUrl.startsWith('https://')) ? user.avatarUrl : '');
              setIsAvatarModalOpen(true);
            }}
            title="Klik untuk mengubah foto profil"
          >
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.fullName} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-cover rounded-2xl border border-slate-500/10 dark:border-white/10 shadow-lg shadow-blue-500/5 group-hover/avatar:opacity-85 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 hover:bg-blue-500 transition-all rounded-2xl flex items-center justify-center text-white font-black text-2xl font-display shadow-lg shadow-blue-500/25 group-hover/avatar:opacity-85">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'K'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full px-2.5 py-0.5 font-bold tracking-wider uppercase">
                Verified Creator
              </span>
              {syncIndicator}
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white mt-1.5">
              Halo, {user.fullName}!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kelola dan pantau semua jadwal visit, campaign brand, dan tenggat waktu konten Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 z-10">
          <motion.button
            id="add-schedule-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddSchedule}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal</span>
          </motion.button>

          <motion.button
            id="logout-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="p-3 rounded-2xl glass-panel text-slate-400 hover:text-slate-600 dark:hover:text-white border-slate-500/10 transition-all cursor-pointer"
            title="Keluar Akun"
          >
            <LogOut className="w-5 h-5 text-rose-500/80 hover:text-rose-500" />
          </motion.button>
        </div>
      </div>

      {/* STATS OVERVIEW SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {/* Stat 1: Total Fee */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-blue-400/30 transition-all"
        >
          <div className="absolute top-4 right-4 p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
          <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">
            {formatIDR(totalEarnings)}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-500/5 pt-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Pendapatan dari filter aktif</span>
          </div>
        </motion.div>

        {/* Stat 2: Total Campaign */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-blue-400/30 transition-all"
        >
          <div className="absolute top-4 right-4 p-2 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Campaign</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">
            {totalCampaigns} <span className="text-xs font-normal text-slate-400">Brand</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-500/5 pt-2.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Aktif berkolaborasi</span>
          </div>
        </motion.div>

        {/* Stat 3: Status Pembayaran */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-blue-400/30 transition-all"
        >
          <div className="absolute top-4 right-4 p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Pembayaran</span>
          <div className="flex items-baseline gap-3 mt-2">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {lunasCount} <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Lunas</span>
            </h3>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {dpCount} <span className="text-xs font-medium text-amber-500">DP</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-500/5 pt-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Kelola cashflow dengan teliti</span>
          </div>
        </motion.div>

        {/* Stat 4: Progress Konten */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-blue-400/30 transition-all"
        >
          <div className="absolute top-4 right-4 p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress Konten</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {selesaiCount} <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Selesai</span>
            </h3>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {inProgressCount} <span className="text-xs font-medium text-blue-500">Proses</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-500/5 pt-2.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{belumCount} campaign belum shooting</span>
          </div>
        </motion.div>
      </div>

      {/* FILTER & VIEWS NAV ROW */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            id="dashboard-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari brand, campaign, lokasi, atau PIC..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm transition-all duration-300"
          />
        </div>

        {/* Filter Drops and View Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Filter */}
          <select
            id="filter-platform"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl glass-input text-xs cursor-pointer min-w-[120px]"
          >
            <option value="all" className="bg-slate-900 text-white">Semua Platform</option>
            <option value="instagram" className="bg-slate-900 text-white">Instagram</option>
            <option value="tiktok" className="bg-slate-900 text-white">TikTok</option>
            <option value="facebook" className="bg-slate-900 text-white">Facebook</option>
            <option value="youtube" className="bg-slate-900 text-white">YouTube</option>
            <option value="threads" className="bg-slate-900 text-white">Threads</option>
          </select>

          {/* Status Filter */}
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl glass-input text-xs cursor-pointer min-w-[120px]"
          >
            <option value="all" className="bg-slate-900 text-white">Semua Progress</option>
            <option value="belum shooting" className="bg-slate-900 text-white">Belum Shooting</option>
            <option value="editing" className="bg-slate-900 text-white">Editing</option>
            <option value="review" className="bg-slate-900 text-white">Review</option>
            <option value="upload" className="bg-slate-900 text-white">Upload</option>
            <option value="selesai" className="bg-slate-900 text-white">Selesai</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-slate-500/10 p-1.5 rounded-xl border border-slate-500/10">
            <button
              id="view-list-btn"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
              title="Tampilan List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              id="view-calendar-btn"
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
              title="Tampilan Kalender"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE VIEW */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((item, idx) => {
                const platformMeta = getPlatformStyle(item.platform);
                return (
                  <motion.div
                    key={item.id}
                    id={`schedule-card-${item.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="glass-panel hover:glass-panel-glow rounded-3xl p-6 relative overflow-hidden transition-all flex flex-col justify-between"
                  >
                    {/* Header: Platform & Payment Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${platformMeta.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${platformMeta.dot}`} />
                        {platformMeta.label}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        item.statusPembayaran === 'lunas' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.statusPembayaran === 'lunas' ? 'LUNAS' : 'DP PAID'}
                      </span>
                    </div>

                    {/* Brand and Campaign Name */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nama Brand:</span>
                        <h4 className="text-base font-black text-blue-600 dark:text-blue-400 font-display">
                          {item.namaBrand}
                        </h4>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 leading-snug">
                        {item.namaCampaign}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                        Deliverables: {item.jumlahDeliverables} ({item.jenisKonten})
                      </p>
                    </div>

                    {/* Core info with icons */}
                    <div className="my-5 py-4 border-y border-slate-500/5 space-y-3">
                      {/* Visit Date & Time */}
                      <div className="flex items-start gap-2.5 text-xs">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">
                            Visit: {new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Pukul {item.jamVisit} WIB
                          </p>
                        </div>
                      </div>

                      {/* Location with Google Maps link */}
                      <div className="flex items-start gap-2.5 text-xs">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{item.lokasi}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.lokasi)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 dark:text-blue-400 hover:underline mt-0.5 inline-flex items-center gap-1 font-medium"
                          >
                            <span>Buka Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* PIC Contacts */}
                      <div className="flex items-start gap-2.5 text-xs bg-blue-500/5 p-2.5 rounded-xl border border-blue-500/10">
                        <UserIcon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            PIC: {item.picBrand}
                          </p>
                          <p className="text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                            <Phone className="w-3 h-3" />
                            <a 
                              href={`https://wa.me/${item.kontakPic.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline text-blue-500 dark:text-blue-400"
                            >
                              {item.kontakPic}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: Fee, deadline, status & Actions */}
                    <div className="space-y-4 pt-1">
                      <div className="flex items-center justify-between">
                        {/* Fee info */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FEE NETT</span>
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                            {formatIDR(item.fee)}
                          </span>
                        </div>

                        {/* Deadline */}
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DEADLINE UPLOAD</span>
                          <span className="text-xs font-bold text-rose-500 font-display block">
                            {new Date(item.deadlineUpload).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Status Konten and Action edit/delete */}
                      <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-500/5">
                        {/* Status badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(item.statusKonten)}`}>
                          {item.statusKonten}
                        </span>

                        {/* Quick actions */}
                        <div className="flex items-center gap-1">
                          <button
                            id={`edit-btn-${item.id}`}
                            onClick={() => onEditSchedule(item)}
                            className="p-1.5 hover:bg-white/10 dark:hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-btn-${item.id}`}
                            onClick={() => setScheduleToDelete(item)}
                            className="p-1.5 hover:bg-white/10 dark:hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                  <Layers className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white font-display">Tidak Ada Jadwal</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Tidak ditemukan jadwal dengan filter aktif Anda. Tambahkan jadwal baru atau sesuaikan filter pencarian.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          /* CALENDAR VIEW FOR BETTER VISUALS */
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel rounded-3xl p-6 shadow-xl"
          >
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white capitalize">
                {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button
                  id="prev-month-btn"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:border-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  id="next-month-btn"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:border-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
              <div>Min</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-20 bg-slate-500/5 rounded-xl border border-transparent" />;
                }

                const daySchedules = getSchedulesForDate(day);
                const isToday = new Date().toDateString() === day.toDateString();

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-20 md:h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      isToday 
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20' 
                        : 'bg-white/5 border-slate-500/10 hover:border-blue-500/30'
                    }`}
                  >
                    <span className="text-xs font-black self-start">{day.getDate()}</span>
                    
                    {/* Schedule Dots/Items */}
                    <div className="flex flex-col gap-1 max-h-[48px] overflow-y-auto">
                      {daySchedules.slice(0, 3).map((item) => {
                        const platformMeta = getPlatformStyle(item.platform);
                        return (
                          <div
                            key={item.id}
                            onClick={() => onEditSchedule(item)}
                            className={`px-1 py-0.5 rounded text-[8px] md:text-[9px] font-bold border truncate cursor-pointer transition-colors ${platformMeta.bg}`}
                            title={`${item.namaBrand} - ${item.namaCampaign}`}
                          >
                            {item.namaBrand}
                          </div>
                        );
                      })}
                      {daySchedules.length > 3 && (
                        <span className="text-[8px] text-slate-400 font-bold self-center">
                          +{daySchedules.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFILE AVATAR CUSTOMIZER MODAL */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-slate-900 border border-slate-500/10 dark:border-white/10 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl relative z-10 text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-lg font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <span>Sesuaikan Foto Profil</span>
                </h3>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Avatar */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative group/modal-avatar">
                  {avatarInputType === 'url' && urlInput ? (
                    <img
                      src={urlInput}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-xl"
                      onError={() => setErrorMessage('Gagal memuat gambar dari tautan.')}
                      onLoad={() => setErrorMessage('')}
                    />
                  ) : tempAvatarUrl ? (
                    <img
                      src={tempAvatarUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl font-display shadow-xl">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'K'}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-2.5 uppercase tracking-wider">
                  Pratinjau Foto Profil
                </p>
              </div>

              {/* Tabs for Input Type */}
              <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarInputType('upload');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    avatarInputType === 'upload'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarInputType('url');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    avatarInputType === 'url'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Tautan Gambar</span>
                </button>
              </div>

              {/* Form Input Container */}
              <div className="space-y-4">
                {avatarInputType === 'upload' ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-blue-500/40 rounded-2xl p-5 text-center cursor-pointer hover:bg-blue-50/10 transition-all group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Seret & taruh gambar atau <span className="text-blue-500 underline">pilih file</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Mendukung PNG, JPG, JPEG (Maks. 2MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tautan URL Gambar
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder="https://contoh.com/gambar.jpg"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
                      />
                    </div>
                  </div>
                )}

                {/* Preset Avatars / Gradients */}
                {avatarInputType === 'upload' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Atau Pilih Preset Warna Gradasi:
                    </label>
                    <div className="flex gap-2.5 justify-center">
                      {presetGradients.map((gradient, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradient.match(/#[0-9A-Fa-f]{6}/g)?.[0] || '#2193b0'}"/><stop offset="100%" stop-color="${gradient.match(/#[0-9A-Fa-f]{6}/g)?.[1] || '#6dd5ed'}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g${index})"/></svg>`;
                            const base64Svg = `data:image/svg+xml;base64,${btoa(svgData)}`;
                            setTempAvatarUrl(base64Svg);
                            setErrorMessage('');
                          }}
                          style={{ background: gradient }}
                          className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform cursor-pointer shadow-sm"
                          title={`Gradasi ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Error message */}
                {errorMessage && (
                  <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {(user.avatarUrl || tempAvatarUrl) && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 text-xs font-bold text-rose-500 hover:text-white bg-rose-500/5 hover:bg-rose-500 rounded-xl transition-all cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {scheduleToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScheduleToDelete(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-slate-900 border border-slate-500/10 dark:border-white/10 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl relative z-10 text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-lg font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <span>Hapus Agenda Campaign</span>
                </h3>
                <button
                  onClick={() => setScheduleToDelete(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Apakah Anda yakin ingin menghapus agenda campaign untuk brand <span className="font-bold text-slate-900 dark:text-white">"{scheduleToDelete.namaBrand}"</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                
                {/* Brand summary info card inside dialog */}
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-500/5 text-xs flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipe Campaign:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{scheduleToDelete.tipeCampaign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {new Date(scheduleToDelete.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleToDelete(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteSchedule(scheduleToDelete.id);
                    setScheduleToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-500/10 cursor-pointer transition-all active:scale-95 animate-pulse-subtle"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
