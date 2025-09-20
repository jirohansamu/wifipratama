# Update: Mikrotik PPPoE & Isolir Profile Integration

Tanggal: 2025-08-11

Repo: https://github.com/alijayanet/gembok-bill

## Changelog (v1.2.0)
- feat(packages): ganti input profil PPPoE jadi dropdown dan load dari Mikrotik
- feat(suspension): tambah UI pilih & simpan profil isolir
- feat(settings): tambahkan setSetting() untuk persistensi settings.json
- feat(api): endpoint GET/POST isolir-profile (ambil/simpan)
- fix(frontend): perbaiki path API profil Mikrotik ke `/admin/mikrotik/profiles/api`
- ux(suspension): ubah submit ke x-www-form-urlencoded agar kompatibel body parser
- chore(docs): tambahkan panduan penggunaan, troubleshooting

## Rilis
- Disarankan membuat Release GitHub: `v1.2.0` dengan file `update.md` ini sebagai release notes.
- Pastikan tag mengandung commit perubahan fitur PPPoE dropdown, isolir profile, dan settings persistence.

### How to tag and release
```bash
# Cek status dan commit perubahan
git status
git add .
git commit -m "release: v1.2.0 – PPPoE dropdown & isolir profile"

# Buat tag versi
git tag -a v1.2.0 -m "Release v1.2.0: PPPoE dropdown, isolir profile setting, settings persistence"

# Push branch & tag ke GitHub
git push origin HEAD
git push origin v1.2.0

# Buat GitHub Release
# - Title: v1.2.0
# - Tag: v1.2.0
# - Body: salin isi dari file update.md
```

## Ringkasan Perubahan
- Memperbaiki dropdown profil PPPoE pada manajemen paket dan memastikan data diambil langsung dari Mikrotik.
- Menambahkan konfigurasi profil isolir yang bisa dipilih dan disimpan dari UI Service Suspension.
- Menyelaraskan logika suspend/restore agar menggunakan profil isolir yang terkonfigurasi.
- Peningkatan handling error dan feedback UI (toast) agar lebih informatif.

## Fitur Baru & Perubahan

- __Dropdown Profil PPPoE di Paket__
  - File: `views/admin/billing/packages.ejs`
  - Input profil PPPoE diubah dari teks bebas menjadi dropdown.
  - Dropdown terisi dinamis dari endpoint `GET /admin/mikrotik/profiles/api`.
  - Tersedia tombol Reload untuk memuat ulang profil.
  - Edit paket akan preload daftar profil dan men-seleksi profil yang sedang digunakan.

- __Konfigurasi Profil Isolir di Service Suspension__
  - File UI: `views/admin/billing/service-suspension.ejs`
  - File backend: `routes/adminBilling.js`, `config/serviceSuspension.js`, `config/settingsManager.js`
  - Menambahkan dropdown untuk memilih profil isolir dari daftar profil Mikrotik.
  - Tombol Save akan menyimpan pilihan ke `settings.json` pada kunci top-level `isolir_profile`.
  - Endpoint baru:
    - `GET /admin/billing/service-suspension/isolir-profile` → ambil profil isolir tersimpan.
    - `POST /admin/billing/service-suspension/isolir-profile` → simpan profil isolir.
  - Perubahan pada `serviceSuspension.js`:
    - `ensureIsolirProfile()` dan `suspendCustomerService()` kini membaca `isolir_profile` dari settings.
    - Hanya membuat profil otomatis di Mikrotik jika nama profil tepat `"isolir"`. Selain itu, diasumsikan profil sudah ada di Mikrotik.

- __Perbaikan Path API__
  - Frontend sebelumnya menggunakan path salah untuk profil Mikrotik.
  - Diperbaiki menjadi `GET /admin/mikrotik/profiles/api` di semua lokasi terkait.

- __Persistensi Settings__
  - File: `config/settingsManager.js`
  - Menambahkan fungsi `setSetting(key, value)` untuk menulis ke `settings.json`.
  - Nilai default aman saat pembacaan, dan penulisan menangani error.

## Cara Pakai / Alur
- __Mengelola Paket__
  1. Buka halaman Paket.
  2. Tambah/Edit paket, pilih profil PPPoE dari dropdown.
  3. Simpan. Paket akan menyimpan nama profil.

- __Mengatur Profil Isolir__
  1. Buka halaman Service Suspension.
  2. Klik Reload untuk memuat profil dari Mikrotik.
  3. Pilih profil isolir dan klik Simpan.
  4. Kunci `isolir_profile` akan ditulis ke `settings.json`.

- __Suspend/Restore__
  - Saat suspend, sistem menggunakan `isolir_profile` dari settings untuk mengubah profil PPPoE user di Mikrotik.
  - Saat restore, profil user akan dikembalikan seperti semula sesuai logika yang ada.

## Validasi & Troubleshooting
- __Validasi UI__
  - Pastikan dropdown profil terisi (jika gagal, akan muncul toast error).
  - Saat Simpan profil isolir, pastikan toast sukses tampil.
- __Validasi File__
  - Periksa `settings.json` dan pastikan ada kunci top-level `"isolir_profile"` (misal: `"ISOLIR"`).
- __Jika Gagal Simpan__
  - Cek response `POST /admin/billing/service-suspension/isolir-profile`.
  - Jika pesan: `Gagal menyimpan ke settings.json`, cek izin tulis folder proyek.

## Keamanan & Akses
- Endpoint terkait Mikrotik dan Service Suspension berada di area admin dan seharusnya terlindungi middleware autentikasi admin (mengikuti pola yang ada).
- Jangan menyimpan kredensial sensitif di UI/Frontend. Pastikan `settings.json` memiliki izin yang sesuai.

## Catatan
- Koneksi Mikrotik:
  - `mikrotik_host`, `mikrotik_port`, `mikrotik_user`, `mikrotik_password` harus valid dan service API Mikrotik aktif.
- Mode autentikasi:
  - `user_auth_mode` saat ini `"mikrotik"`. Jika menggunakan RADIUS, perlu penyesuaian konfigurasi (tidak termasuk dalam update ini).

## File Terkait
- `views/admin/billing/packages.ejs` (dropdown PPPoE profile)
- `views/admin/billing/service-suspension.ejs` (UI pilih & simpan profil isolir)
- `routes/adminBilling.js` (endpoint isolir profile GET/POST, perbaikan path)
- `config/serviceSuspension.js` (menggunakan `isolir_profile` saat suspend)
- `config/settingsManager.js` (`setSetting()` untuk persistensi)

## Ringkasan Perubahan per Berkas
- `views/admin/billing/packages.ejs`: tambah JS untuk fetch & populate profil PPPoE + tombol reload, integrasi di modal add/edit paket.
- `views/admin/billing/service-suspension.ejs`: UI dropdown profil isolir, tombol reload & simpan, kirim form `x-www-form-urlencoded`, toast feedback.
- `routes/adminBilling.js`: tambah `GET/POST /admin/billing/service-suspension/isolir-profile`, load service suspension page, perbaiki path API profil Mikrotik di frontend.
- `config/serviceSuspension.js`: gunakan `getSetting('isolir_profile', 'isolir')`, hanya auto-create profil jika nama persis `isolir`.
- `config/settingsManager.js`: implementasi `setSetting(key, value)` untuk menulis ke `settings.json`.

---
Jika ada masalah atau ingin menambah fitur baru (misal, indikator loading/disable sementara saat fetch/simpan), beri tahu agar saya sesuaikan.
