# Gembok Bill - Sistem Manajemen ISP Terintegrasi

[![GitHub stars](https://img.shields.io/github/stars/alijayanet/gembok-bill)](https://github.com/alijayanet/gembok-bill/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/alijayanet/gembok-bill)](https://github.com/alijayanet/gembok-bill/network)
[![GitHub issues](https://img.shields.io/github/issues/alijayanet/gembok-bill)](https://github.com/alijayanet/gembok-bill/issues)
[![GitHub license](https://img.shields.io/github/license/alijayanet/gembok-bill)](https://github.com/alijayanet/gembok-bill/blob/main/LICENSE)

## 📋 Deskripsi Aplikasi

**Gembok Bill** adalah sistem manajemen RTRWNet terintegrasi yang menggabungkan WhatsApp Gateway dengan portal admin web untuk mengelola layanan internet secara komprehensif. Aplikasi ini dirancang khusus untuk RTRWNet yang membutuhkan solusi all-in-one untuk manajemen pelanggan, billing, monitoring, dan notifikasi.

### 🎯 Fitur Utama

- **🔧 WhatsApp Bot Gateway** - Interface perintah via WhatsApp dengan role-based access control
- **🌐 Web Portal Admin** - Dashboard admin yang lengkap dengan versioning system
- **💳 Sistem Billing Terintegrasi** - Manajemen tagihan dan pembayaran
- **💳 Payment Gateway** - Integrasi Midtrans, Xendit, Tripay
- **📊 GenieACS Management** - Monitoring dan manajemen perangkat ONU/ONT
- **🛠️ Mikrotik Management** - Manajemen PPPoE dan Hotspot
- **📱 Portal Pelanggan** - Self-service untuk pelanggan
- **📈 Monitoring Real-time** - PPPoE, RX Power, dan sistem dengan grafik terpisah
- **🔔 Notifikasi Otomatis** - WhatsApp notifications
- **📋 Trouble Ticket System** - Manajemen gangguan via WhatsApp dan web
- **👥 Role-Based Access Control** - Super Admin, Admin, Technician, Customer
- **📱 WhatsApp Commands** - Trouble report, PPPoE management, version info
- **🎨 Enhanced UI** - Traffic graphs separation, high bandwidth support, admin settings cleanup

---

## 📱 WhatsApp Commands

### 👑 **Admin Commands** *(Super Admin & Admin)*
- **`admin`** - Menu bantuan khusus admin
- **`cekstatus [nomor]`** - Cek status pelanggan berdasarkan nomor
- **`gantissid [nomor] [ssid_baru]`** - Ganti SSID WiFi pelanggan
- **`reboot [nomor]`** - Reboot perangkat pelanggan
- **`status`** - Cek status sistem dan koneksi
- **`restart`** - Restart layanan WhatsApp
- **`version`** - Tampilkan informasi versi aplikasi
- **`info`** - Tampilkan informasi sistem lengkap

### 🔧 **Technician Commands** *(Admin & Technician)*
- **`teknisi`** - Menu bantuan khusus teknisi
- **`trouble`** - Lihat daftar laporan gangguan
- **`status [id]`** - Cek status laporan gangguan tertentu
- **`update [id] [status] [catatan]`** - Update status laporan
- **`selesai [id] [catatan]`** - Tandai laporan selesai
- **`addpppoe [user] [pass] [profile] [ip] [info]`** - Tambah user PPPoE
- **`editpppoe [user] [field] [value]`** - Edit field user PPPoE
- **`delpppoe [user] [alasan]`** - Hapus user PPPoE
- **`pppoe [filter]`** - List semua user PPPoE
- **`checkpppoe [user]`** - Cek status user PPPoE
- **`restartpppoe [user]`** - Restart koneksi user PPPoE

### 👤 **Customer Commands** *(Semua User)*
- **`menu`** - Menu umum untuk semua user
- **`billing`** - Menu bantuan untuk fitur billing
- **`cekstatus [nomor]`** - Cek status pelanggan (terbatas)
- **`version`** - Tampilkan informasi versi aplikasi

### 📚 **Help Commands**
- **`help trouble`** - Bantuan untuk fitur trouble report
- **`help pppoe`** - Bantuan untuk fitur PPPoE management

---

## 🚀 Instalasi

### Persyaratan Sistem

- **Node.js** v18+ (direkomendasikan v20+)
- **npm** atau yarn
- **GenieACS** API access
- **Mikrotik** API access
- **WhatsApp** number untuk bot
- **Database SQLite** (built-in)

### 1. Clone Repository

```bash
# Install git jika belum ada
apt install git curl -y

# Clone repository
git clone https://github.com/alijayanet/gembok-bill
cd gembok-bill
```

### 2. Install Dependencies

```bash
# Install semua dependencies
npm install
```

### 3. Konfigurasi Settings

Edit file `settings.json` dengan pengaturan yang sesuai:

```json
{
  "app_version": "2.1.0",
  "version_name": "WhatsApp Modular + Role System",
  "version_date": "2025-01-27",
  "version_notes": "Added technician role, trouble report & PPPoE WhatsApp commands",
  "build_number": "20250127.001",
  "app_name": "GEMBOK",
  "company_header": "GEMBOK",
  "footer_info": "Info Hubungi : 081947215703",
  
  "admins.0": "6281947215703",
  "admin_enabled": "true",
  "admin_username": "admin",
  "admin_password": "admin",
  
  "technician_numbers.0": "6283807665111",
  "technician_numbers.1": "6282218094111",
  "technician_group_id": "120363029715729111@g.us",
  
  "genieacs_url": "http://192.168.8.89:7557",
  "genieacs_username": "admin",
  "genieacs_password": "admin",
  
  "mikrotik_host": "192.168.8.1",
  "mikrotik_port": "8728",
  "mikrotik_user": "admin",
  "mikrotik_password": "admin",
  "main_interface": "ether1-ISP",
  "pppoe_monitor_enable": "true",
  
  "whatsapp_session_path": "./whatsapp-session",
  "whatsapp_keep_alive": "true",
  "whatsapp_restart_on_error": "true",
  "whatsapp_log_level": "silent",
  
  "pppoe_monitor_interval": "60000",
  "pppoe_notifications.enabled": "true",
  "pppoe_notifications.loginNotifications": "true",
  "pppoe_notifications.logoutNotifications": "true",
  "pppoe_notifications.includeOfflineList": "true",
  "pppoe_notifications.maxOfflineListCount": "20",
  "pppoe_notifications.monitorInterval": "60000",
  
  "rx_power_warning": "-40",
  "rx_power_critical": "-45",
  "rx_power_notification_enable": "true",
  "rx_power_notification_interval": "300000",
  
  "customerPortalOtp": "false",
  "otp_length": "4",
  "otp_expiry_minutes": "5",
  
  "server_port": "3003",
  "server_host": "localhost",
  "secret_key": "gembok-digital-network",
  "reconnect_interval": "5000",
  "log_level": "info",
  "logo_filename": "logo.png",
  "payment_gateway": {
    "active": "midtrans",
    "midtrans": {
      "enabled": true,
      "production": false,
      "merchant_id": "G123456789",
      "client_key": "SB-Mid-client-123456789",
      "server_key": "SB-Mid-server-123456789"
    },
    "xendit": {
      "enabled": false,
      "production": false,
      "api_key": "xnd_public_development_123456789",
      "callback_token": "xnd_callback_token_123456789"
    },
    "tripay": {
      "enabled": false,
      "production": false,
      "api_key": "DEV-123456789",
      "private_key": "private_key_123456789",
      "merchant_code": "T12345"
    }
  },
  "payment_accounts": {
    "bank_transfer": {
      "bank_name": "Bank BRI",
      "account_number": "1234-5678-9012-3456",
      "account_name": "GEMBOK"
    },
    "cash": {
      "office_address": "Jl. Contoh No. 123, Kota, Provinsi",
      "office_hours": "08:00 - 17:00 WIB"
    }
  }
}
```

### 4. Setup Database

```bash
# Jalankan script untuk setup database billing
node scripts/add-payment-gateway-tables.js
```

### 5. Menjalankan Aplikasi

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Dengan PM2:**
```bash
# Install PM2 jika belum ada
npm install -g pm2

# Start aplikasi
pm2 start app.js --name gembok-bill

# Monitor aplikasi
pm2 monit

# View logs
pm2 logs gembok-bill
```

### 6. Setup WhatsApp Bot

1. **Siapkan 2 nomor WhatsApp:**
   - 1 nomor untuk bot (akan scan QR code)
   - 1 nomor untuk admin (untuk mengirim perintah)

2. **Scan QR Code** yang muncul di terminal untuk login WhatsApp bot

3. **Test dengan perintah**: `status` atau `menu`

---

## 🌐 Akses Web Portal

- **Portal Pelanggan**: `http://ipserver:3003`
- **Admin Dashboard**: `http://ipserver:3003/admin/login`
- **Login Admin**: Username dan password yang dikonfigurasi di `settings.json`

---

## 💳 Sistem Billing

### Fitur Billing

- **📊 Dashboard Billing** - Statistik real-time
- **👥 Manajemen Pelanggan** - CRUD pelanggan dengan PPPoE username
- **📦 Manajemen Paket** - Paket internet dengan harga
- **📄 Manajemen Invoice** - Buat, edit, hapus tagihan
- **💰 Manajemen Pembayaran** - Tracking pembayaran
- **🔄 Auto Invoice** - Generate tagihan otomatis
- **💳 Payment Gateway** - Integrasi Midtrans, Xendit, Tripay
- **📱 WhatsApp Notifications** - Notifikasi tagihan dan pembayaran

### Payment Gateway

Aplikasi mendukung 3 payment gateway populer di Indonesia:

1. **Midtrans** - Payment gateway terpopuler
2. **Xendit** - Payment gateway enterprise
3. **Tripay** - Payment gateway lokal

**Setup Payment Gateway:**
1. Akses `/admin/billing/payment-settings`
2. Pilih gateway yang aktif
3. Masukkan API keys
4. Test koneksi
5. Aktifkan production mode

---

## 🔧 WhatsApp Bot Commands

### Perintah untuk Pelanggan
- `menu` - Menampilkan menu bantuan
- `status` - Cek status perangkat
- `refresh` - Refresh data perangkat
- `gantiwifi [nama]` - Ganti nama WiFi
- `gantipass [password]` - Ganti password WiFi
- `info` - Informasi layanan
- `speedtest` - Test kecepatan internet

### Perintah untuk Admin

#### GenieACS Commands
- `devices` - Daftar perangkat
- `cekall` - Cek semua perangkat
- `cek [nomor]` - Cek status ONU
- `cekstatus [nomor]` - Cek status pelanggan
- `admincheck [nomor]` - Cek perangkat admin
- `gantissid [nomor] [ssid]` - Ubah SSID
- `gantipass [nomor] [pass]` - Ubah password
- `reboot [nomor]` - Restart ONU
- `factory reset [nomor]` - Reset factory
- `refresh` - Refresh data perangkat
- `tag [nomor] [tag]` - Tambah tag pelanggan
- `untag [nomor] [tag]` - Hapus tag
- `tags [nomor]` - Lihat tags
- `addtag [device_id] [nomor]` - Tambah tag perangkat
- `addppoe_tag [pppoe_id] [nomor]` - Tambah tag dengan id pppoe
- `adminssid [nomor] [ssid]` - Admin ubah SSID
- `adminrestart [nomor]` - Admin restart ONU
- `adminfactory [nomor]` - Admin factory reset
- `confirm admin factory reset [nomor]` - Konfirmasi factory reset

#### Mikrotik Commands
- `interfaces` - Daftar interface
- `interface [nama]` - Detail interface
- `enableif [nama]` - Aktifkan interface
- `disableif [nama]` - Nonaktifkan interface
- `ipaddress` - Alamat IP
- `routes` - Tabel routing
- `dhcp` - DHCP leases
- `ping [ip] [count]` - Test ping
- `logs [topics] [count]` - Log Mikrotik
- `firewall [chain]` - Status firewall
- `users` - Daftar semua user
- `profiles [type]` - Daftar profile
- `identity [nama]` - Info router
- `clock` - Waktu router
- `resource` - Info resource
- `reboot` - Restart router
- `confirm restart` - Konfirmasi restart

#### Hotspot & PPPoE Management
- `vcr [user] [profile] [nomor]` - Buat voucher
- `hotspot` - User hotspot aktif
- `pppoe` - User PPPoE aktif
- `offline` - User PPPoE offline
- `addhotspot [user] [pass] [profile]` - Tambah user
- `addpppoe [user] [pass] [profile] [ip]` - Tambah PPPoE
- `setprofile [user] [profile]` - Ubah profile
- `delhotspot [username]` - Hapus user hotspot
- `delpppoe [username]` - Hapus user PPPoE
- `addpppoe_tag [user] [nomor]` - Tambah tag PPPoE
- `member [username] [profile] [nomor]` - Tambah member
- `list` - Daftar semua user
- `remove [username]` - Hapus user (generic)
- `addadmin [nomor]` - Tambah nomor admin
- `removeadmin [nomor]` - Hapus nomor admin

#### Sistem & Admin
- `otp [nomor]` - Kirim OTP
- `status` - Status sistem
- `logs` - Log aplikasi
- `restart` - Restart aplikasi
- `debug resource` - Debug resource
- `checkgroup` - Cek status group
- `setadmin [nomor]` - Set nomor admin
- `settechnician [nomor]` - Set nomor teknisi
- `setheader [teks]` - Set header pesan
- `setfooter [teks]` - Set footer pesan
- `setgenieacs [url] [user] [pass]` - Set GenieACS
- `setmikrotik [host] [port] [user] [pass]` - Set Mikrotik
- `admin` - Menu admin
- `help` - Bantuan perintah
- `ya/iya/yes` - Konfirmasi ya
- `tidak/no/batal` - Konfirmasi tidak
- `addwan [interface]` - Tambah WAN

#### WiFi & Layanan
- `info wifi` - Info WiFi pelanggan
- `info` - Info layanan
- `gantiwifi [ssid]` - Ganti nama WiFi
- `gantipass [password]` - Ganti password WiFi
- `speedtest` - Test kecepatan
- `diagnostic` - Diagnostik perangkat
- `history` - Riwayat perangkat
- `menu` - Menu utama
- `factory reset` - Reset factory (pelanggan)
- `confirm factory reset` - Konfirmasi factory reset

---

## 🛠️ Troubleshooting

### Masalah Group dan Nomor Teknisi

Jika ada error seperti:
```
Error sending message: Error: item-not-found
warn: Skipping invalid WhatsApp number: 6283807665111
```

**Solusi:**

1. **Jalankan Script Perbaikan Otomatis:**
   ```bash
   node scripts/fix-technician-config.js
   ```

2. **Cek Status Group:**
   - Kirim perintah WhatsApp: `checkgroup`
   - Akan menampilkan status group dan nomor teknisi

3. **Perbaiki Manual:**
   - Buka Admin Settings
   - Update nomor teknisi dengan format: `628xxxxxxxxxx`
   - Pastikan group ID berformat: `120363029715729111@g.us`
   - Tambahkan bot ke group teknisi

### Format Nomor yang Benar
- ✅ `628xxxxxxxxxx`
- ❌ `08xxxxxxxxxx`
- ❌ `+628xxxxxxxxxx`

### Format Group ID yang Benar
- ✅ `120363029715729111@g.us`
- ❌ `120363029715729111`
- ❌ `group-120363029715729111`

### Masalah Payment Gateway

1. **Invalid API Key:**
   - Pastikan API key benar dan aktif
   - Cek status akun di dashboard payment gateway
   - Test koneksi di `/admin/billing/payment-settings`

2. **Webhook Error:**
   - Pastikan URL webhook benar
   - Cek firewall dan port
   - Verifikasi signature di webhook handler

---

## 📝 Update Log

### 🆕 **v2.1.0 - WhatsApp Modular + Role System** *(2025-01-27)*

#### ✨ **Fitur Baru yang Ditambahkan:**

##### 🔧 **WhatsApp Modular Architecture**
- **Refactoring WhatsApp Module:** Memisahkan `whatsapp.js` (5923 baris) menjadi modul-modul yang lebih kecil dan maintainable
- **`whatsapp-core.js`:** Core utilities, admin validation, dan state management
- **`whatsapp-commands.js`:** Command handlers untuk semua perintah WhatsApp
- **`whatsapp-message-handlers.js`:** Message routing dan role-based access control
- **`whatsapp-new.js`:** Main orchestrator untuk koneksi dan event handling

##### 👥 **Role-Based Access Control (RBAC)**
- **Super Admin:** Akses penuh ke semua fitur
- **Admin:** Akses ke fitur admin dan teknisi
- **Technician:** Akses khusus untuk fitur teknisi
- **Customer:** Akses terbatas untuk fitur pelanggan

##### 📋 **WhatsApp Trouble Report Management**
- **Perintah `trouble`:** Lihat daftar laporan gangguan
- **Perintah `status [id]`:** Cek status laporan tertentu
- **Perintah `update [id] [status] [catatan]`:** Update status laporan
- **Perintah `selesai [id] [catatan]`:** Tandai laporan selesai
- **Perintah `catatan [id] [catatan]`:** Tambah catatan ke laporan
- **Perintah `help trouble`:** Bantuan untuk fitur trouble report

##### 🌐 **WhatsApp PPPoE Management**
- **Perintah `addpppoe [user] [pass] [profile] [ip] [info]`:** Tambah user PPPoE baru
- **Perintah `editpppoe [user] [field] [value]`:** Edit field user PPPoE
- **Perintah `delpppoe [user] [alasan]`:** Hapus user PPPoE
- **Perintah `pppoe [filter]`:** List semua user PPPoE
- **Perintah `checkpppoe [user]`:** Cek status user PPPoE
- **Perintah `restartpppoe [user]`:** Restart koneksi user PPPoE
- **Perintah `help pppoe`:** Bantuan untuk fitur PPPoE

##### 🆘 **Dedicated Help Menus**
- **`admin`:** Menu bantuan khusus admin
- **`teknisi`:** Menu bantuan khusus teknisi
- **`menu`:** Menu umum untuk semua user
- **`billing`:** Menu bantuan untuk fitur billing

##### 📊 **Versioning System**
- **WhatsApp Commands:**
  - `version`: Tampilkan informasi versi aplikasi
  - `info`: Tampilkan informasi sistem lengkap
- **Web Admin Display:**
  - Version info di sidebar admin
  - Version info di footer aplikasi
  - Company name dan build number

##### 🎨 **Web Admin Enhancements**
- **Internet Traffic Graph Separation:**
  - Grafik Download (RX) terpisah
  - Grafik Upload (TX) terpisah
  - Grafik Combined Overview
  - Support bandwidth >1Gbps dan >500Mbps
  - Status traffic: Ultra High, Very High, High, Medium, Low, Idle
- **Admin Settings Cleanup:**
  - Hide version info fields (sudah ada di sidebar/footer)
  - Hide technical/sensitive fields
  - Keep admin/technician numbers visible for easy editing
  - Informational alerts untuk field yang disembunyikan

##### 🏢 **Application Branding Update**
- **Company Name:** Diubah dari "ALIJAYA DIGITAL NETWORK" ke "GEMBOK"
- **App Name:** "GEMBOK" (dari settings.json)
- **Consistent branding** di semua interface

#### 🔧 **Technical Improvements:**

##### 📁 **File Structure Changes**
```
config/
├── whatsapp-core.js          # Core utilities & validation
├── whatsapp-commands.js      # Command handlers
├── whatsapp-message-handlers.js # Message routing
├── whatsapp-new.js           # Main orchestrator
├── whatsapp-trouble-commands.js # Trouble report commands
├── whatsapp-pppoe-commands.js   # PPPoE management commands
├── version-utils.js          # Version display utilities
├── help-messages.js          # Help message definitions
└── whatsapp.js               # Original (backup)
```

##### 🎯 **Code Quality Improvements**
- **Modular Architecture:** Setiap modul memiliki tanggung jawab spesifik
- **Dependency Injection:** WhatsApp core diinjeksi ke command handlers
- **Error Handling:** Improved error handling dan logging
- **Code Reusability:** Functions yang dapat digunakan ulang
- **Testing Support:** Isolated testing untuk setiap modul

##### 🔐 **Security Enhancements**
- **Role Validation:** Validasi role sebelum eksekusi command
- **Input Sanitization:** Sanitasi input untuk mencegah injection
- **Access Control:** Pembatasan akses berdasarkan role

#### 📋 **Configuration Updates:**

##### ⚙️ **settings.json New Fields**
```json
{
  "app_version": "2.1.0",
  "version_name": "WhatsApp Modular + Role System",
  "version_date": "2025-01-27",
  "version_notes": "Added technician role, trouble report & PPPoE WhatsApp commands",
  "build_number": "20250127.001",
  "app_name": "GEMBOK",
  "company_header": "GEMBOK",
  "technician_numbers.0": "6283807665111",
  "technician_numbers.1": "6282218094111"
}
```

##### 🔑 **Role Configuration**
- **Admin Numbers:** `admins.0`, `admins.1`, `admins.2`
- **Technician Numbers:** `technician_numbers.0`, `technician_numbers.1`, `technician_numbers.2`
- **Dynamic Role Detection:** Otomatis mendeteksi role berdasarkan nomor

#### 🚀 **Migration Guide:**

##### 📥 **Untuk Update dari v2.0.0:**
1. **Backup** file `whatsapp.js` yang lama
2. **Update** `settings.json` dengan field baru
3. **Restart** aplikasi untuk menggunakan modul baru
4. **Test** fitur WhatsApp dan web admin

##### 🔄 **Rollback (jika diperlukan):**
1. **Rename** `whatsapp.js` menjadi `whatsapp-new.js`
2. **Rename** `whatsapp_backup.js` menjadi `whatsapp.js`
3. **Restart** aplikasi

#### 🧪 **Testing & Validation:**

##### ✅ **WhatsApp Commands Tested:**
- Admin commands: `admin`, `cekstatus`, `gantissid`, `reboot`, `status`, `restart`
- Technician commands: `teknisi`, `trouble`, `addpppoe`, `editpppoe`, `delpppoe`
- Customer commands: `menu`, `billing`, `cekstatus`
- Version commands: `version`, `info`

##### ✅ **Web Admin Tested:**
- Version display di sidebar dan footer
- Traffic graph separation dan high bandwidth support
- Admin settings cleanup dan field visibility
- Role-based access control

#### 📚 **Documentation Added:**
- **`docs/WHATSAPP_MODULAR_README.md`:** Comprehensive guide untuk arsitektur modular
- **`docs/TROUBLE_REPORT_WHATSAPP.md`:** Dokumentasi fitur trouble report
- **`docs/PPPOE_WHATSAPP.md`:** Dokumentasi fitur PPPoE management
- **`docs/WEB_ADMIN_VERSIONING.md`:** Dokumentasi fitur versioning

---

### 🆕 **v2.0.0 - Base System** *(2025-01-20)*

#### ✨ **Fitur Dasar:**
- WhatsApp Bot Gateway dengan perintah dasar
- Web Portal Admin dengan dashboard
- Sistem Billing terintegrasi
- Payment Gateway (Midtrans, Xendit, Tripay)
- GenieACS Management
- Mikrotik Management
- Customer Portal
- Monitoring Real-time
- Notifikasi otomatis
- Trouble Ticket System

---

## 👥 Role-Based Access Control (RBAC)

### 🔐 **Role Hierarchy**

#### 👑 **Super Admin**
- **Akses:** Semua fitur aplikasi
- **Perintah WhatsApp:** Semua admin commands
- **Web Admin:** Full access ke semua halaman
- **Konfigurasi:** Dapat mengubah semua settings

#### 👨‍💼 **Admin**
- **Akses:** Fitur admin dan teknisi
- **Perintah WhatsApp:** Admin commands + technician commands
- **Web Admin:** Access ke dashboard, billing, mikrotik, genieacs
- **Konfigurasi:** Dapat mengubah operational settings

#### 🔧 **Technician**
- **Akses:** Fitur teknisi dan monitoring
- **Perintah WhatsApp:** Technician commands + basic customer commands
- **Web Admin:** Limited access (monitoring, trouble reports)
- **Konfigurasi:** Read-only access ke settings

#### 👤 **Customer**
- **Akses:** Fitur pelanggan terbatas
- **Perintah WhatsApp:** Basic customer commands
- **Web Admin:** Customer portal only
- **Konfigurasi:** Tidak ada akses

### 🔑 **Role Configuration**

#### **Admin Numbers** *(settings.json)*
```json
{
  "admins.0": "6281947215703",    // Super Admin
  "admins.1": "6287764444430",    // Additional Admin 1
  "admins.2": "6281234567890"     // Additional Admin 2
}
```

#### **Technician Numbers** *(settings.json)*
```json
{
  "technician_numbers.0": "6283807665111",  // Technician 1
  "technician_numbers.1": "6282218094111",  // Technician 2
  "technician_numbers.2": "6281234567891"   // Technician 3
}
```

### 🚪 **Access Control Matrix**

| Feature | Super Admin | Admin | Technician | Customer |
|---------|-------------|-------|------------|----------|
| WhatsApp Admin Commands | ✅ | ✅ | ❌ | ❌ |
| WhatsApp Technician Commands | ✅ | ✅ | ✅ | ❌ |
| WhatsApp Customer Commands | ✅ | ✅ | ✅ | ✅ |
| Web Admin Dashboard | ✅ | ✅ | ❌ | ❌ |
| Billing Management | ✅ | ✅ | ❌ | ❌ |
| Mikrotik Management | ✅ | ✅ | ❌ | ❌ |
| GenieACS Management | ✅ | ✅ | ❌ | ❌ |
| Settings Management | ✅ | ✅ | ❌ | ❌ |
| Trouble Report Management | ✅ | ✅ | ✅ | ❌ |
| Customer Portal | ✅ | ✅ | ✅ | ✅ |

---

## 📁 Struktur Aplikasi

```
gembok-bill/
├── app.js                 # File utama aplikasi
├── package.json           # Dependencies dan scripts
├── settings.json          # Konfigurasi aplikasi
├── config/               # Modul konfigurasi
│   ├── whatsapp.js       # WhatsApp bot handler (original)
│   ├── whatsapp-new.js   # WhatsApp bot handler (modular)
│   ├── whatsapp-core.js  # Core utilities & validation
│   ├── whatsapp-commands.js # Command handlers
│   ├── whatsapp-message-handlers.js # Message routing
│   ├── whatsapp-trouble-commands.js # Trouble report commands
│   ├── whatsapp-pppoe-commands.js # PPPoE management commands
│   ├── version-utils.js  # Version display utilities
│   ├── help-messages.js  # Help message definitions
│   ├── genieacs.js       # GenieACS API
│   ├── mikrotik.js       # Mikrotik API
│   ├── billing.js        # Billing system
│   ├── paymentGateway.js # Payment gateway manager
│   ├── logger.js         # Logging system
│   └── settingsManager.js # Settings management
├── routes/               # Express routes
│   ├── adminAuth.js      # Admin authentication
│   ├── adminDashboard.js # Dashboard routes
│   ├── adminBilling.js   # Billing management
│   ├── adminGenieacs.js  # GenieACS management
│   ├── adminMikrotik.js  # Mikrotik management
│   ├── adminHotspot.js   # Hotspot management
│   ├── adminSetting.js   # Settings management
│   ├── customerPortal.js # Customer portal
│   ├── payment.js        # Payment gateway routes
│   └── troubleReport.js  # Trouble ticket system
├── views/                # EJS templates
│   ├── admin/           # Admin views
│   │   ├── billing/     # Billing pages
│   │   └── ...
│   ├── customer/        # Customer views
│   └── partials/        # Shared components
├── public/               # Static files
│   ├── css/
│   ├── js/
│   └── img/
├── data/                 # Database files
├── logs/                 # Log files
├── scripts/              # Utility scripts
└── whatsapp-session/     # WhatsApp session files
```

---

## 🌐 Web Admin Features

### 📊 **Dashboard Enhancements**

#### **Internet Traffic Monitoring**
- **Separated Traffic Graphs:**
  - **Download (RX):** Grafik terpisah untuk traffic download
  - **Upload (TX):** Grafik terpisah untuk traffic upload
  - **Combined Overview:** Grafik gabungan untuk overview
- **High Bandwidth Support:**
  - Support hingga >1Gbps dan >500Mbps
  - Auto-scaling untuk berbagai range bandwidth
  - Format otomatis: bps, Kbps, Mbps, Gbps
- **Traffic Status Indicators:**
  - **Ultra High:** >1Gbps (Red)
  - **Very High:** >500Mbps (Red)
  - **High:** >100Mbps (Orange)
  - **Medium:** >10Mbps (Blue)
  - **Low:** >1Mbps (Gray)
  - **Idle:** <1Mbps (Gray)

#### **Version Information Display**
- **Sidebar Version Panel:**
  - Version number dan build number
  - Release date dan company info
  - Version badge dengan styling
- **Footer Version Row:**
  - Version name dan build info
  - Release date dan notes
  - Consistent dengan sidebar

### ⚙️ **Admin Settings Management**

#### **Smart Field Visibility**
- **Visible Fields:**
  - Admin dan technician numbers
  - Company info dan branding
  - Operational settings
  - Business configurations
- **Hidden Fields:**
  - Version info (sudah ada di sidebar/footer)
  - Technical/internal settings
  - API keys dan sensitive data
  - System file paths

#### **User-Friendly Interface**
- **Informational Alerts:** Penjelasan mengapa field disembunyikan
- **Field Labels:** Label yang jelas dan informatif
- **Categorized Settings:** Pengelompokan berdasarkan fungsi
- **Easy Navigation:** Interface yang intuitif

### 🎨 **UI/UX Improvements**

#### **Responsive Design**
- **Mobile-First:** Optimized untuk mobile devices
- **Bootstrap 5:** Modern UI framework
- **Custom CSS:** Styling yang konsisten
- **Icon Integration:** Bootstrap Icons untuk visual appeal

#### **Branding Consistency**
- **Company Name:** "GEMBOK" branding
- **Color Scheme:** Consistent color palette
- **Typography:** Readable font choices
- **Layout:** Clean dan organized interface

---

## 🤝 Kontribusi

Untuk berkontribusi pada proyek ini:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan ESLint untuk code formatting
- Tulis unit tests untuk fitur baru
- Update dokumentasi untuk perubahan
- Ikuti conventional commits

---

## 📄 Lisensi

Distributed under the ISC License. See `LICENSE` for more information.

---

## 🆘 Support

- **📱 Telegram Group**: [https://t.me/alijayaNetAcs](https://t.me/alijayaNetAcs)
- **📢 Telegram Channel**: [https://t.me/alijayaNetwork](https://t.me/alijayaNetwork)
- **📺 YouTube**: [https://www.youtube.com/shorts/qYJFQY7egFw](https://www.youtube.com/shorts/qYJFQY7egFw)
- **💬 Issues**: [GitHub Issues](https://github.com/alijayanet/gembok-bill/issues)
- **📞 WhatsApp Support**: 081947215703

---

## 🙏 Donasi

Rekening Donasi Untuk Pengembangan:
- **Bank**: BRI
- **No. Rekening**: 4206 01 003953 531
- **Atas Nama**: WARJAYA
- **Info**: 081947215703 GEMBOK

---

## ⚠️ Disclaimer

**Jangan lupa untuk mengkonfigurasi file `settings.json` terlebih dahulu sebelum menjalankan aplikasi!**

Aplikasi ini dikembangkan untuk keperluan ISP dan membutuhkan konfigurasi yang tepat untuk berfungsi dengan baik. Pastikan semua kredensial API dan pengaturan sudah benar sebelum deployment ke production.

---

**Made with ❤️ by [GEMBOK Team](https://github.com/alijayanet)**
