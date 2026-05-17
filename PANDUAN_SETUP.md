# Panduan Instalasi: Kumpulan Masalah Fiqih

Aplikasi ini menggunakan **Vite + React** untuk frontend, **Express** sebagai proxy backend, dan **Google Spreadsheet** sebagai database via **Google Apps Script**.

## 1. Persiapan Google Spreadsheet
1. Buka [Google Sheets](https://sheets.new).
2. Beri nama file: **Database Masalah Fiqih**.
3. Beri nama Sheet1 menjadi: **masalah_fiqih**.
4. Buat baris pertama sebagai Header dengan kolom berikut:
   - `id`
   - `kategori`
   - `pertanyaan`
   - `jawaban`
   - `ibarot`

## 2. Deploy Google Apps Script
1. Di Google Sheets, klik menu **Extensions** > **Apps Script**.
2. Hapus semua kode bawaan dan tempelkan isi dari file `google-apps-script.js` yang ada di proyek ini.
3. Klik tombol **Deploy** > **New Deployment**.
4. Pilih type: **Web App**.
5. Description: **CRUD Fiqih API**.
6. Execute as: **Me** (Email Anda).
7. Who has access: **Anyone** (Penting agar aplikasi bisa memanggil API).
8. Klik **Deploy** dan setujui izin akses.
9. **Simpan Web App URL** yang dihasilkan (formatnya: `https://script.google.com/macros/s/xxx/exec`).

## 3. Konfigurasi Aplikasi
1. Buka AI Studio Build atau Editor.
2. Atur **Secrets / Environment Variables**:
   - `GAS_URL`: Masukkan Web App URL dari langkah sebelumnya.
   - `ADMIN_PASSWORD`: Masukkan password rahasia untuk dashboard admin.
3. Jalankan aplikasi dengan `npm run dev`.

## 4. Deploy ke Vercel (Optional)
Karena aplikasi ini menggunakan Express sebagai backend, Anda bisa mendeploynya ke Vercel atau platform seperti Railway/Render/Cloud Run.
- Vercel: Gunakan `vercel.json` untuk mengarahkan route ke `server.ts`.
- Kami merekomendasikan Cloud Run (bawaan AI Studio) karena sudah terkonfigurasi.

## 5. Membuat APK Android
Anda bisa menggunakan **Capacitor** untuk mengubah web app ini menjadi aplikasi native Android:
1. Jalankan `npm install @capacitor/core @capacitor/cli @capacitor/android`.
2. Jalankan `npx cap init`.
3. Jalankan `npm run build`.
4. Jalankan `npx cap add android`.
5. Jalankan `npx cap open android` (Ini akan membuka Android Studio).
6. Build APK dari Android Studio.

## Fitur Unggulan
- **Emerald Theme**: Desain islami modern yang menyejukkan mata.
- **RTL Arabic**: Teks Arab ditampilkan dengan font Amiri yang indah dan rata kanan.
- **Offline First Bookmarks**: Menyimpan masalah fawit menggunakan LocalStorage.
- **Admin Dashboard**: Kelola data langsung dari HP Anda.
