import { useState, useEffect } from 'react';
import { User, Schedule, JSONBinConfig, ThemeType } from './types';
import ThemeToggle from './components/ThemeToggle';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ScheduleForm from './components/ScheduleForm';
import LandingPage from './components/LandingPage';
import VisivineLogo from './components/VisivineLogo';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Cloud, Wifi, Sprout, ArrowLeft, ArrowRight, Home, Menu, X, ChevronRight } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('kol_theme') as ThemeType;
    return saved || 'dark'; // Default to dark for a sleek, modern glassmorphic look
  });

  // Mobile navigation hamburger state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kol_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Landing page visible state (only shown if not logged in)
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return !localStorage.getItem('kol_current_user');
  });

  // Schedule list state
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);

  // JSONBin Cloud synchronization configuration (Defaulted to system-wide database credentials)
  const [jsonBinConfig, setJsonBinConfig] = useState<JSONBinConfig>(() => {
    const saved = localStorage.getItem('kol_jsonbin_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.binId) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      apiKey: '$2a$10$Gl8ImjEHP94fMNQXhdDeG.xDPJRbU3BUY4tc05GOOXsRUzW/ApfnS',
      binId: '6a4268c9da38895dfe0fe3b6',
      autoSync: true
    };
  });

  // Synchronize HTML element classes on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kol_theme', theme);
  }, [theme]);

  // Auto-pull from cloud on app boot if credentials exist
  useEffect(() => {
    if (jsonBinConfig.apiKey && jsonBinConfig.binId) {
      pullDataFromJSONBin().then((success) => {
        if (success) {
          console.log('Successfully auto-pulled data from JSONBin on startup!');
        }
      });
    }
  }, []);

  // Load schedules whenever user changes
  useEffect(() => {
    if (currentUser) {
      const allSchedules: Schedule[] = JSON.parse(localStorage.getItem('kol_schedules') || '[]');
      const userSchedules = allSchedules.filter(s => s.userId === currentUser.id);
      
      // Sort schedules by date descending
      userSchedules.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      setSchedules(userSchedules);
    } else {
      setSchedules([]);
    }
  }, [currentUser]);

  // Helper function to push data to JSONBin cloud
  const pushDataToJSONBin = async (overrideConfig?: JSONBinConfig): Promise<boolean> => {
    const activeConfig = overrideConfig || jsonBinConfig;
    if (!activeConfig.apiKey || !activeConfig.binId) return false;

    try {
      const users = localStorage.getItem('kol_users') || '[]';
      const schedules = localStorage.getItem('kol_schedules') || '[]';

      const payload = {
        users: JSON.parse(users),
        schedules: JSON.parse(schedules)
      };

      const response = await fetch(`https://api.jsonbin.io/v3/b/${activeConfig.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': activeConfig.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal push data ke JSONBin');
      return true;
    } catch (err) {
      console.error('JSONBin Push Error:', err);
      return false;
    }
  };

  // Helper function to pull data from JSONBin cloud
  const pullDataFromJSONBin = async (overrideConfig?: JSONBinConfig): Promise<boolean> => {
    const activeConfig = overrideConfig || jsonBinConfig;
    if (!activeConfig.apiKey || !activeConfig.binId) return false;

    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${activeConfig.binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': activeConfig.apiKey
        }
      });

      if (!response.ok) throw new Error('Gagal pull data dari JSONBin');
      
      const result = await response.json();
      const data = result.record;

      if (data) {
        if (data.users) localStorage.setItem('kol_users', JSON.stringify(data.users));
        if (data.schedules) localStorage.setItem('kol_schedules', JSON.stringify(data.schedules));
        
        // Refresh local memory
        if (currentUser) {
          const allSchedules: Schedule[] = JSON.parse(localStorage.getItem('kol_schedules') || '[]');
          const userSchedules = allSchedules.filter(s => s.userId === currentUser.id);
          userSchedules.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
          setSchedules(userSchedules);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('JSONBin Pull Error:', err);
      return false;
    }
  };

  const handleUpdateJSONBinConfig = (newConfig: JSONBinConfig) => {
    setJsonBinConfig(newConfig);
    localStorage.setItem('kol_jsonbin_config', JSON.stringify(newConfig));
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('kol_current_user', JSON.stringify(user));
    setShowLanding(false);

    // Auto-sync or Pull when logging in / registering
    if (jsonBinConfig.apiKey && jsonBinConfig.binId) {
      if (jsonBinConfig.autoSync) {
        // Push newly created user & demo schedules to JSONBin
        await pushDataToJSONBin();
      } else {
        // Otherwise pull latest schedules from cloud
        await pullDataFromJSONBin();
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kol_current_user');
    setShowLanding(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('kol_current_user', JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem('kol_users') || '[]');
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('kol_users', JSON.stringify(users));
    }

    if (jsonBinConfig.apiKey && jsonBinConfig.binId && jsonBinConfig.autoSync) {
      await pushDataToJSONBin();
    }
  };

  // Add or edit schedule handler
  const handleSaveSchedule = async (formData: Omit<Schedule, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    let updatedAllSchedules: Schedule[] = [];
    const allSchedules: Schedule[] = JSON.parse(localStorage.getItem('kol_schedules') || '[]');

    if (editingSchedule) {
      // Edit mode
      updatedAllSchedules = allSchedules.map((item) => {
        if (item.id === editingSchedule.id) {
          return {
            ...item,
            ...formData,
            // Keep original details
            id: item.id,
            userId: item.userId,
            createdAt: item.createdAt,
          };
        }
        return item;
      });
    } else {
      // Create mode
      const newSchedule: Schedule = {
        ...formData,
        id: 'sch_' + Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      updatedAllSchedules = [newSchedule, ...allSchedules];
    }

    localStorage.setItem('kol_schedules', JSON.stringify(updatedAllSchedules));
    
    // Refresh user-specific schedules list
    const userSchedules = updatedAllSchedules.filter(s => s.userId === currentUser.id);
    userSchedules.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    setSchedules(userSchedules);

    // Close Modal
    setIsFormOpen(false);
    setEditingSchedule(undefined);

    // AutoSync to Cloud if active
    if (jsonBinConfig.apiKey && jsonBinConfig.binId && jsonBinConfig.autoSync) {
      await pushDataToJSONBin();
    }
  };

  // Delete schedule handler
  const handleDeleteSchedule = async (id: string) => {
    const allSchedules: Schedule[] = JSON.parse(localStorage.getItem('kol_schedules') || '[]');
    const updatedAllSchedules = allSchedules.filter(s => s.id !== id);

    localStorage.setItem('kol_schedules', JSON.stringify(updatedAllSchedules));

    if (currentUser) {
      const userSchedules = updatedAllSchedules.filter(s => s.userId === currentUser.id);
      userSchedules.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      setSchedules(userSchedules);
    }

    // AutoSync to Cloud if active
    if (jsonBinConfig.apiKey && jsonBinConfig.binId && jsonBinConfig.autoSync) {
      await pushDataToJSONBin();
    }
  };

  const syncIndicator = (
    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
      {jsonBinConfig.apiKey && jsonBinConfig.binId ? (
        <>
          <Cloud className="w-3.5 h-3.5 text-blue-500" />
          <span>Cloud Aktif</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5 text-amber-500" />
          <span>Lokal Perangkat</span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative p-4 md:p-6 lg:p-8 select-none transition-colors duration-500">
      {/* Decorative ambient background glows */}
      <div className="fixed top-12 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-12 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Top Header Navigation Bar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 relative z-50">
        <div 
          onClick={() => {
            setShowLanding(true);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
          title="Kembali ke Beranda"
        >
          <VisivineLogo iconSize="w-10 h-10" showText={true} />
        </div>

        {/* Global Controls - Desktop view only */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            showLanding ? (
              <button
                onClick={() => setShowLanding(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-500/5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Lihat Beranda</span>
              </button>
            )
          ) : (
            !showLanding && (
              <button
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-500/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </button>
            )
          )}
          {syncIndicator}
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>

        {/* Mobile Controls & Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} onChange={setTheme} />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center border border-slate-500/10 dark:border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu with Glassmorphism */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 right-0 glass-panel-glow border border-slate-500/15 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl z-50 md:hidden mt-2"
            >
              {/* Action Button inside mobile menu */}
              {currentUser ? (
                showLanding ? (
                  <button
                    onClick={() => {
                      setShowLanding(false);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/15"
                  >
                    <span>Buka Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowLanding(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer border border-slate-500/5"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-500" />
                      <span>Lihat Beranda</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )
              ) : (
                !showLanding && (
                  <button
                    onClick={() => {
                      setShowLanding(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer border border-slate-500/5"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-blue-500" />
                      <span>Kembali ke Beranda</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )
              )}

              {/* Sync Status inside mobile menu */}
              <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-500/5">
                <span className="text-xs text-slate-400 font-semibold">Status Database</span>
                {syncIndicator}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN SCREEN AREA */}
      <main className="max-w-7xl mx-auto relative z-20">
        <AnimatePresence mode="wait">
          {showLanding ? (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage 
                onEnterApp={() => setShowLanding(false)} 
                isLoggedIn={!!currentUser}
              />
            </motion.div>
          ) : !currentUser ? (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm 
                onLogin={handleLogin} 
                onPullData={() => pullDataFromJSONBin()}
                onPushData={() => pushDataToJSONBin()}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboard
                user={currentUser}
                onUpdateUser={handleUpdateUser}
                schedules={schedules}
                onAddSchedule={() => {
                  setEditingSchedule(undefined);
                  setIsFormOpen(true);
                }}
                onEditSchedule={(item) => {
                  setEditingSchedule(item);
                  setIsFormOpen(true);
                }}
                onDeleteSchedule={handleDeleteSchedule}
                onLogout={handleLogout}
                syncIndicator={syncIndicator}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto text-center mt-12 pt-6 border-t border-slate-500/10 text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 Visivine Plan • Sistem Manajemen Jadwal & Kampanye Kreator Modern</p>
      </footer>

      {/* MODAL POPUPS */}
      <AnimatePresence>
        {isFormOpen && (
          <ScheduleForm
            schedule={editingSchedule}
            onSave={handleSaveSchedule}
            onClose={() => {
              setIsFormOpen(false);
              setEditingSchedule(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
