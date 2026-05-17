export interface FiqhRecord {
  id: number;
  kategori: string;
  pertanyaan: string;
  jawaban: string;
  ibarot: string;
}

export const CATEGORIES = [
  "Thaharah",
  "Sholat",
  "Zakat",
  "Puasa",
  "Haji",
  "Muamalah",
  "Munakahah",
  "Jinayah",
  "Lainnya"
];

export const APP_NAME = "Kumpulan Masalah Fiqih";
