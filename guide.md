# Chroma Core Alignment - Walkthrough

Pembangunan aplikasi Chroma Core Alignment telah selesai. Game ini siap digunakan oleh penjaga pos untuk mengetes peserta!

## Komponen yang Ditambahkan

- **File:** `src/hooks/useChromaGame.ts`
  - Terdiri dari logic _state machine_ lengkap (`IDLE`, `PREP`, `PLAY`, `CHECK`) dengan sistem timer dan hitung mundur (`setInterval`/`setTimeout`).
  - Mengimplementasikan randomizer kata warna (`MERAH`, `KUNING`, `BIRU`, `HIJAU`) beserta variasi _hex code_-nya agar sesuai dengan kebutuhan bahwa tulisan dan warna tidak selalu memiliki korespondensi yang sama.
- **File UI:** `src/app/page.tsx`
  - Menampilkan elemen secara reaktif berdasarkan mode (fase state) untuk kenyamanan permainan.
  - Saat mode `IDLE`, menyediakan input Nama Kelompok beserta tombol memulai.
  - Mode `PREP` memberikan fase _Bersiaplah_ dengan hitung mundur `5` ke `1`.
  - Mode `PLAY` memunculkan teks warna besar di tengah-tengah tampilan neon (dengan hitung mundur 3 detik).
  - Mode `CHECK` menyajikan tombol admin ("+10 Detik", "Hentikan Permainan", "Next Round") sambil mengingatkan Penpos dengan pesan besar bergradasi ("WAKTUNYA CEK POSISI").
- **CSS Estetik:** `src/app/globals.css`
  - Mengedepankan transisi mulus dan _gradient background_ di bagian luar bingkai hitam agar terlihat premium dan lebih menyala (dengan adanya sentuhan `.animate-scale-up`, `.text-glow`, `.countdown-pop`, dan animasi custom lainnya memudarkan nuansa AI generik).

## Validasi

- Seluruh kode diselesaikan tanpa ada _TypeScript error_ maupun duplikasi _lint_ redundant (menjalankan command `npm run build` berhasil tanpa cegatan error).
- Prinsip _DRY_ telah diamati dengan menggabungkan komputasi `randomizeColors` dan modularisasi _timeout_ yang solid dan re-use timer secara efisien.

Anda dapat memainkan gamenya secara langsung dengan membuka terminal lokal yang mengarah ke proyek dan menjalankan `npm run dev`.
