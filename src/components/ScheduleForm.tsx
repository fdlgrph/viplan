import React, { useState, useEffect } from 'react';
import { Schedule, PlatformType, ContentType, PaymentStatusType, ContentStatusType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, User, Phone, Briefcase, Award, Layers, DollarSign } from 'lucide-react';

interface ScheduleFormProps {
  schedule?: Schedule; // If provided, we are editing
  onSave: (data: Omit<Schedule, 'id' | 'userId' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function ScheduleForm({ schedule, onSave, onClose }: ScheduleFormProps) {
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [jamVisit, setJamVisit] = useState('');
  const [picBrand, setPicBrand] = useState('');
  const [kontakPic, setKontakPic] = useState('');
  const [namaBrand, setNamaBrand] = useState('');
  const [namaCampaign, setNamaCampaign] = useState('');
  const [deadlineUpload, setDeadlineUpload] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('instagram');
  const [jenisKonten, setJenisKonten] = useState<ContentType>('reels');
  const [jumlahDeliverables, setJumlahDeliverables] = useState('');
  const [feeString, setFeeString] = useState('');
  const [statusPembayaran, setStatusPembayaran] = useState<PaymentStatusType>('dp');
  const [statusKonten, setStatusKonten] = useState<ContentStatusType>('belum shooting');
  const [error, setError] = useState('');

  useEffect(() => {
    if (schedule) {
      setTanggal(schedule.tanggal || '');
      setLokasi(schedule.lokasi || '');
      setJamVisit(schedule.jamVisit || '');
      setPicBrand(schedule.picBrand || '');
      setKontakPic(schedule.kontakPic || '');
      setNamaBrand(schedule.namaBrand || '');
      setNamaCampaign(schedule.namaCampaign || '');
      setDeadlineUpload(schedule.deadlineUpload || '');
      setPlatform(schedule.platform || 'instagram');
      setJenisKonten(schedule.jenisKonten || 'reels');
      setJumlahDeliverables(schedule.jumlahDeliverables || '');
      setFeeString(schedule.fee ? schedule.fee.toString() : '');
      setStatusPembayaran(schedule.statusPembayaran || 'dp');
      setStatusKonten(schedule.statusKonten || 'belum shooting');
    } else {
      // Set some smart defaults
      setTanggal(new Date().toISOString().split('T')[0]);
      setDeadlineUpload(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
      setPlatform('instagram');
      setJenisKonten('reels');
      setStatusPembayaran('dp');
      setStatusKonten('belum shooting');
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!namaBrand || !namaCampaign || !tanggal || !lokasi || !jamVisit || !picBrand || !kontakPic || !deadlineUpload || !jumlahDeliverables || !feeString) {
      setError('Mohon lengkapi semua field yang tersedia.');
      return;
    }

    const feeNum = parseFloat(feeString.replace(/[^0-9]/g, ''));
    if (isNaN(feeNum) || feeNum < 0) {
      setError('Nilai Fee harus berupa angka yang valid.');
      return;
    }

    onSave({
      tanggal,
      lokasi,
      jamVisit,
      picBrand,
      kontakPic,
      namaBrand,
      namaCampaign,
      deadlineUpload,
      platform,
      jenisKonten,
      jumlahDeliverables,
      fee: feeNum,
      statusPembayaran,
      statusKonten
    });
  };

  const formatRupiahInput = (val: string) => {
    const num = val.replace(/[^0-9]/g, '');
    if (!num) {
      setFeeString('');
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(num));
    setFeeString(formatted);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border-white/10 my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-blue-500/10">
          <div>
            <h2 className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <span>{schedule ? 'Edit Agenda Campaign' : 'Tambah Agenda Campaign Baru'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {schedule ? 'Ubah informasi agenda campaign atau visit' : 'Isi form di bawah ini untuk mendaftarkan campaign baru'}
            </p>
          </div>
          <button
            id="close-form-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* SECTION 1: Informasi Brand & Campaign */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 border-b border-slate-500/10 pb-1.5">
              <Award className="w-4 h-4" />
              <span>1. Informasi Brand & Campaign</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  NAMA BRAND <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-nama-brand"
                  type="text"
                  value={namaBrand}
                  onChange={(e) => setNamaBrand(e.target.value)}
                  placeholder="cth: Skintific, Wardah"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  NAMA CAMPAIGN <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-nama-campaign"
                  type="text"
                  value={namaCampaign}
                  onChange={(e) => setNamaCampaign(e.target.value)}
                  placeholder="cth: Launching Sunscreen SPF 50"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  PLATFORM <span className="text-rose-500">*</span>
                </label>
                <select
                  id="form-platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                >
                  <option value="instagram" className="bg-slate-900 text-white">Instagram</option>
                  <option value="tiktok" className="bg-slate-900 text-white">TikTok</option>
                  <option value="facebook" className="bg-slate-900 text-white">Facebook</option>
                  <option value="youtube" className="bg-slate-900 text-white">YouTube</option>
                  <option value="threads" className="bg-slate-900 text-white">Threads</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  JENIS KONTEN <span className="text-rose-500">*</span>
                </label>
                <select
                  id="form-jenis-konten"
                  value={jenisKonten}
                  onChange={(e) => setJenisKonten(e.target.value as ContentType)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                >
                  <option value="reels" className="bg-slate-900 text-white">Reels</option>
                  <option value="story" className="bg-slate-900 text-white">Story</option>
                  <option value="feed" className="bg-slate-900 text-white">Feed</option>
                  <option value="video" className="bg-slate-900 text-white">Video (Long)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  JUMLAH DELIVERABLES <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-deliverables"
                  type="text"
                  value={jumlahDeliverables}
                  onChange={(e) => setJumlahDeliverables(e.target.value)}
                  placeholder="cth: 1 reels + 3 stories"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Lokasi & Waktu Visit */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 border-b border-slate-500/10 pb-1.5">
              <Calendar className="w-4 h-4" />
              <span>2. Informasi Visit & Lokasi</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>TANGGAL VISIT</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-tanggal-visit"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>JAM VISIT</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-jam-visit"
                  type="time"
                  value={jamVisit}
                  onChange={(e) => setJamVisit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>LOKASI VISIT</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-lokasi-visit"
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="cth: Gandaria City Hall"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Brand PIC Contacts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 border-b border-slate-500/10 pb-1.5">
              <User className="w-4 h-4" />
              <span>3. PIC Brand & Kontak</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>NAMA PIC BRAND</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-pic-brand"
                  type="text"
                  value={picBrand}
                  onChange={(e) => setPicBrand(e.target.value)}
                  placeholder="cth: Jessica Alba"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>KONTAK PIC (HP/WA)</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-kontak-pic"
                  type="text"
                  value={kontakPic}
                  onChange={(e) => setKontakPic(e.target.value)}
                  placeholder="cth: 0812-xxxx-xxxx"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Keuangan & Status Progres */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 border-b border-slate-500/10 pb-1.5">
              <Layers className="w-4 h-4" />
              <span>4. Keuangan, Deadline & Progress</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>FEE CAMPAIGN (IDR)</span> <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    id="form-fee"
                    type="text"
                    value={feeString}
                    onChange={(e) => formatRupiahInput(e.target.value)}
                    placeholder="cth: 5.000.000"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>DEADLINE UPLOAD</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-deadline"
                  type="date"
                  value={deadlineUpload}
                  onChange={(e) => setDeadlineUpload(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  STATUS PEMBAYARAN <span className="text-rose-500">*</span>
                </label>
                <select
                  id="form-status-pembayaran"
                  value={statusPembayaran}
                  onChange={(e) => setStatusPembayaran(e.target.value as PaymentStatusType)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                >
                  <option value="dp" className="bg-slate-900 text-white">DP (Uang Muka)</option>
                  <option value="lunas" className="bg-slate-900 text-white">Lunas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  STATUS KONTEN <span className="text-rose-500">*</span>
                </label>
                <select
                  id="form-status-konten"
                  value={statusKonten}
                  onChange={(e) => setStatusKonten(e.target.value as ContentStatusType)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer"
                >
                  <option value="belum shooting" className="bg-slate-900 text-white">Belum Shooting</option>
                  <option value="editing" className="bg-slate-900 text-white">Editing</option>
                  <option value="review" className="bg-slate-900 text-white">Review</option>
                  <option value="upload" className="bg-slate-900 text-white">Upload</option>
                  <option value="selesai" className="bg-slate-900 text-white">Selesai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              id="cancel-form-btn"
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl glass-panel text-slate-700 dark:text-slate-200 text-sm font-semibold hover:border-slate-400 cursor-pointer"
            >
              Batal
            </button>
            <motion.button
              id="submit-form-btn"
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              {schedule ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
