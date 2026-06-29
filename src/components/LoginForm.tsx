import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { User as UserIcon, Lock, Sparkles, LogIn, ArrowRight, Sprout } from 'lucide-react';
import VisivineLogo from './VisivineLogo';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onPullData?: () => Promise<boolean>;
  onPushData?: () => Promise<boolean>;
}

export default function LoginForm({ onLogin, onPullData, onPushData }: LoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setIsSyncing(true);

    try {
      if (isRegistering) {
        if (!fullName) {
          setError('Nama lengkap wajib diisi.');
          setIsSyncing(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Konfirmasi password tidak cocok.');
          setIsSyncing(false);
          return;
        }
        if (password.length < 4) {
          setError('Password minimal harus 4 karakter.');
          setIsSyncing(false);
          return;
        }

        // Pull latest users and schedules from the central cloud database first
        if (onPullData) {
          setSuccess('Menghubungkan ke cloud database...');
          await onPullData();
        }

        // Check if username exists in the synced database
        const users: any[] = JSON.parse(localStorage.getItem('kol_users') || '[]');
        const userExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());

        if (userExists) {
          setError('Username sudah digunakan. Silakan pilih yang lain.');
          setSuccess('');
          setIsSyncing(false);
          return;
        }

        // Create new user
        const newUser = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          username: username,
          fullName: fullName,
          password: password, // For simulation
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('kol_users', JSON.stringify(users));

        // Ensure schedules are initialized as empty if not present, and do not append demo schedules
        if (!localStorage.getItem('kol_schedules')) {
          localStorage.setItem('kol_schedules', JSON.stringify([]));
        }

        setSuccess('Menyimpan akun baru Anda ke cloud...');
        // Push user list to central JSONBin cloud database
        if (onPushData) {
          await onPushData();
        }

        setSuccess('Registrasi sukses! Mengalihkan ke dashboard...');
        setTimeout(() => {
          onLogin({
            id: newUser.id,
            username: newUser.username,
            fullName: newUser.fullName,
            createdAt: newUser.createdAt,
          });
          setIsSyncing(false);
        }, 1200);

      } else {
        // Login - sync latest cloud data first
        if (onPullData) {
          setSuccess('Menyinkronkan cloud database...');
          await onPullData();
        }

        const users: any[] = JSON.parse(localStorage.getItem('kol_users') || '[]');
        const user = users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );

        if (!user) {
          setError('Username atau password salah.');
          setSuccess('');
          setIsSyncing(false);
          return;
        }

        setSuccess('Login berhasil!');
        setTimeout(() => {
          onLogin({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            createdAt: user.createdAt,
          });
          setIsSyncing(false);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError('Gangguan jaringan. Menggunakan cadangan lokal perangkat...');
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      {/* Visual glowing ball in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        id="login-card-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel-glow rounded-3xl p-8 z-10 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-8">
          <VisivineLogo iconSize="w-16 h-16" showText={false} isDarkBg={true} className="mb-4" />
          <h1 className="text-2xl font-black font-display tracking-tight text-center text-slate-900 dark:text-white">
            {isRegistering ? 'Daftar Visivine Plan' : 'Akses Visivine Plan'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 text-center">
            {isRegistering 
              ? 'Kelola jadwal campaign & visit dalam satu aplikasi glassmorphic' 
              : 'Masuk untuk mengatur jadwal visit & deadline konten Anda'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-pulse"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cth: riska_kol"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm transition-all duration-300 disabled:opacity-50"
                required
                disabled={isSyncing}
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="login-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="cth: Riska Amalia"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm transition-all duration-300 disabled:opacity-50"
                  required
                  disabled={isSyncing}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm transition-all duration-300 disabled:opacity-50"
                required
                disabled={isSyncing}
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="login-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm transition-all duration-300 disabled:opacity-50"
                  required
                  disabled={isSyncing}
                />
              </div>
            </div>
          )}

          <motion.button
            id="login-submit-btn"
            type="submit"
            whileHover={isSyncing ? {} : { scale: 1.01 }}
            whileTap={isSyncing ? {} : { scale: 0.99 }}
            disabled={isSyncing}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses Cloud Sync...
              </span>
            ) : isRegistering ? (
              <>
                Daftar Sekarang <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Masuk <LogIn className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-500/10 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isRegistering ? 'Sudah punya akun?' : 'Belum memiliki akun?'}
            <button
              id="toggle-register-btn"
              type="button"
              disabled={isSyncing}
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              className="ml-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isRegistering ? 'Masuk di sini' : 'Daftar sekarang'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
