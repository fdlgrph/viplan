export interface User {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
  avatarUrl?: string; // Base64 or HTTP Link
}

export type PlatformType = 'tiktok' | 'instagram' | 'facebook' | 'youtube' | 'threads';

export type ContentType = 'reels' | 'story' | 'feed' | 'video';

export type PaymentStatusType = 'dp' | 'lunas';

export type ContentStatusType = 'belum shooting' | 'editing' | 'review' | 'upload' | 'selesai';

export interface Schedule {
  id: string;
  userId: string;
  tanggal: string; // YYYY-MM-DD
  lokasi: string;
  jamVisit: string; // HH:MM
  picBrand: string;
  kontakPic: string;
  namaBrand: string;
  namaCampaign: string;
  deadlineUpload: string; // YYYY-MM-DD
  platform: PlatformType;
  jenisKonten: ContentType;
  jumlahDeliverables: string; // e.g. "1 reel + 3 story"
  fee: number;
  statusPembayaran: PaymentStatusType;
  statusKonten: ContentStatusType;
  createdAt: string;
}

export interface JSONBinConfig {
  apiKey: string;
  binId: string;
  autoSync: boolean;
}

export type ThemeType = 'light' | 'dark';
