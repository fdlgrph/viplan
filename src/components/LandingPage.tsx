import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Sparkles, ArrowRight, ShieldCheck, 
  Layers, CheckSquare, DollarSign, Sprout, ChevronRight 
} from 'lucide-react';
import VisivineLogo from './VisivineLogo';

interface LandingPageProps {
  onEnterApp: () => void;
  isLoggedIn?: boolean;
}

export default function LandingPage({ onEnterApp, isLoggedIn = false }: LandingPageProps) {
  // Features list
  const features = [
    {
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      title: 'Kalender & Jadwal Interaktif',
      desc: 'Pantau tanggal visit, jadwal posting, dan detail brand dalam satu visualisasi agenda yang rapi dan responsif.'
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      title: 'Status Konten Real-time',
      desc: 'Tandai tahapan deliverables dari penulisan script, shooting, editing, hingga konten siap diunggah.'
    },
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
      title: 'Keuangan & Fee Terlacak',
      desc: 'Catat kesepakatan nilai kerjasama, persentase uang muka (DP), pelunasan, hingga total akumulasi pendapatan.'
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-amber-500" />,
      title: 'Multi-Platform Terpadu',
      desc: 'Kelola kampanye lintas jejaring sosial seperti TikTok, Instagram Reels, YouTube, Facebook, dan Threads.'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Container */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 lg:py-12">
        
        {/* Left Side: Brand presentation and copy */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Creator & KOL Workspace</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Kelola Kolaborasi & Jadwal dengan <span className="text-blue-500 relative inline-block">Visivine Plan<span className="absolute bottom-1 left-0 w-full h-1.5 bg-blue-500/20 -z-10 rounded-full"></span></span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
            >
              Platform manajemen jadwal khusus Key Opinion Leader (KOL) dan content creator untuk mencatat campaign, visit brand, melacak status deliverables, pembayaran fee, serta mengamankan data secara cloud.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-tight flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer group"
            >
              <span>{isLoggedIn ? 'Masuk ke Dashboard Admin' : 'Akses Database Panel'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Penyimpanan Aman & Terenkripsi</span>
            </div>
          </motion.div>

          {/* Mini Statistics badge bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-500/10 max-w-lg"
          >
            <div>
              <p className="text-xl md:text-2xl font-black font-display text-blue-600 dark:text-blue-400">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Bebas Iklan</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black font-display text-indigo-500">Multi</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Platform Sosial</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black font-display text-emerald-500">Cloud</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sinkronisasi</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Beautiful App Preview Graphic / Logo Showcase */}
        <div className="lg:col-span-5 flex items-center justify-center relative mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative w-full max-w-[340px]"
          >
            {/* Background glass decorative shape */}
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-white/5 rounded-3xl -rotate-6 scale-105 pointer-events-none border border-slate-500/10 dark:border-white/5" />
            
            {/* Brand Logo Showcase Box */}
            <div className="relative glass-panel rounded-3xl p-8 border border-slate-500/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              
              {/* Visivine Brand Logo Badge & Text */}
              <div className="mb-6 flex flex-col items-center">
                <VisivineLogo iconSize="w-24 h-24" showText={false} isDarkBg={true} />
                <h3 className="text-3xl font-serif tracking-wide text-slate-900 dark:text-white mt-4 flex items-baseline select-none">
                  <span className="text-blue-600 dark:text-blue-400 italic font-black mr-0.5">V</span>
                  <span>isivine</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">
                Campaign & Schedule Ecosystem
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-4 leading-relaxed max-w-[240px]">
                "Tumbuhkan jangkauan visual Anda dengan keteraturan dan perencanaan campaign yang presisi."
              </p>

              {/* Fake UI preview card */}
              <div className="w-full mt-6 pt-5 border-t border-slate-500/10 flex flex-col gap-2.5 text-left">
                <div className="flex justify-between items-center bg-blue-500/5 dark:bg-white/5 rounded-xl p-2 px-3 border border-slate-500/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Visit Skintific</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-bold uppercase">Selesai</span>
                </div>
                <div className="flex justify-between items-center bg-blue-500/5 dark:bg-white/5 rounded-xl p-2 px-3 border border-slate-500/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Eiger Shooting</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md font-bold uppercase">Editing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="mt-12 lg:mt-20 pt-10 border-t border-slate-500/10">
        <div className="text-center space-y-2 mb-10">
          <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Fitur Utama Visivine Plan
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            Semua yang Anda butuhkan untuk mengorganisir jadwal kerja sama endorsement dan campaign dalam satu layar terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-panel hover:border-blue-500/20 rounded-2xl p-5 border border-slate-500/10 dark:border-white/5 transition-all hover:translate-y-[-2px]"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-3">
                {feat.icon}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {feat.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
