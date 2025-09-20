const express = require('express');
const path = require('path');
const axios = require('axios');
const logger = require('./config/logger');
const whatsapp = require('./config/whatsapp');
const { monitorPPPoEConnections } = require('./config/mikrotik');
const fs = require('fs');
const session = require('express-session');
const { getSetting } = require('./config/settingsManager');

// Import invoice scheduler
const invoiceScheduler = require('./config/scheduler');

// Import technician sync service for hot-reload
const technicianSync = {
    start() {
        const fs = require('fs');
        const sqlite3 = require('sqlite3').verbose();
        const { getSettingsWithCache } = require('./config/settingsManager');
        
        const db = new sqlite3.Database('./data/billing.db');
        
        const sync = () => {
            try {
                const settings = getSettingsWithCache();
                Object.keys(settings).filter(k => k.startsWith('technician_numbers.')).forEach(k => {
                    const phone = settings[k];
                    if (phone) {
                        db.run('INSERT OR IGNORE INTO technicians (phone, name, role, is_active, created_at) VALUES (?, ?, "technician", 1, datetime("now"))', 
                            [phone, `Teknisi ${phone.slice(-4)}`]);
                    }
                });
                console.log('📱 Technician numbers synced from settings.json');
            } catch (e) {
                console.error('Sync error:', e.message);
            }
        };
        
        fs.watchFile('settings.json', { interval: 1000 }, sync);
        sync(); // Initial sync
        console.log('🔄 Technician auto-sync enabled - settings.json changes will auto-update technicians');
    }
};

// Start technician sync service
technicianSync.start();

// Inisialisasi aplikasi Express
const app = express();

// Import route adminAuth
const { router: adminAuthRouter, adminAuth } = require('./routes/adminAuth');

// Middleware dasar - Optimized
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files dengan cache
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1h', // Cache static files untuk 1 jam
  etag: true
}));
app.use(session({
  secret: 'rahasia-portal-anda', // Ganti dengan string random yang aman
  resave: false,
  saveUninitialized: false, // Optimized: tidak save session kosong
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    httpOnly: true
  },
  name: 'admin_session' // Custom session name
}));

// Route khusus untuk login mobile (harus sebelum semua route admin)
app.get('/admin/login/mobile', (req, res) => {
    try {
        const { getSettingsWithCache } = require('./config/settingsManager');
        const appSettings = getSettingsWithCache();
        
        console.log('🔍 Rendering mobile login page...');
        res.render('admin/mobile-login', { 
            error: null,
            success: null,
            appSettings: appSettings
        });
    } catch (error) {
        console.error('❌ Error rendering mobile login:', error);
        res.status(500).send('Error loading mobile login page');
    }
});

// Test route untuk debugging
app.get('/admin/test', (req, res) => {
    res.json({ message: 'Admin routes working!', timestamp: new Date().toISOString() });
});

// POST untuk login mobile
app.post('/admin/login/mobile', async (req, res) => {
    try {
        const { username, password, remember } = req.body;
        const { getSetting } = require('./config/settingsManager');
        
        const credentials = {
            username: getSetting('admin_username', 'admin'),
            password: getSetting('admin_password', 'admin')
        };

        if (!username || !password) {
            return res.render('admin/mobile-login', { 
                error: 'Username dan password harus diisi!',
                success: null,
                appSettings: { companyHeader: 'ISP Monitor' }
            });
        }

        if (username === credentials.username && password === credentials.password) {
            req.session.isAdmin = true;
            req.session.adminUsername = username;

            if (remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            }

            // Redirect to mobile dashboard
            res.redirect('/admin/billing/mobile');
        } else {
            res.render('admin/mobile-login', { 
                error: 'Username atau password salah!',
                success: null,
                appSettings: { companyHeader: 'ISP Monitor' }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/mobile-login', { 
            error: 'Terjadi kesalahan saat login!',
            success: null,
            appSettings: { companyHeader: 'ISP Monitor' }
        });
    }
});

// Redirect untuk mobile login
app.get('/admin/mobile', (req, res) => {
    res.redirect('/admin/login/mobile');
});

// Gunakan route adminAuth untuk /admin
app.use('/admin', adminAuthRouter);

// Import dan gunakan route adminDashboard
const adminDashboardRouter = require('./routes/adminDashboard');
app.use('/admin', adminDashboardRouter);

// Import dan gunakan route adminGenieacs
const adminGenieacsRouter = require('./routes/adminGenieacs');
app.use('/admin', adminGenieacsRouter);

// Import dan gunakan route adminMikrotik
const adminMikrotikRouter = require('./routes/adminMikrotik');
app.use('/admin', adminMikrotikRouter);

// Import dan gunakan route adminHotspot
const adminHotspotRouter = require('./routes/adminHotspot');
app.use('/admin/hotspot', adminHotspotRouter);

// Import dan gunakan route adminSetting
const { router: adminSettingRouter } = require('./routes/adminSetting');
app.use('/admin/settings', adminAuth, adminSettingRouter);

// Import dan gunakan route adminTroubleReport
const adminTroubleReportRouter = require('./routes/adminTroubleReport');
app.use('/admin/trouble', adminAuth, adminTroubleReportRouter);

// Import dan gunakan route adminBilling (dipindah ke bawah agar tidak mengganggu route login)
const adminBillingRouter = require('./routes/adminBilling');
app.use('/admin/billing', adminAuth, adminBillingRouter);

// Import dan gunakan route adminInstallationJobs
const adminInstallationJobsRouter = require('./routes/adminInstallationJobs');
app.use('/admin/installations', adminAuth, adminInstallationJobsRouter);

// Import dan gunakan route adminTechnicians
const adminTechniciansRouter = require('./routes/adminTechnicians');
app.use('/admin/technicians', adminAuth, adminTechniciansRouter);

// Import dan gunakan route adminCableNetwork
const adminCableNetworkRouter = require('./routes/adminCableNetwork');
app.use('/admin/cable-network', adminAuth, adminCableNetworkRouter);

// Import dan gunakan route payment
const paymentRouter = require('./routes/payment');
app.use('/payment', paymentRouter);

// Import dan gunakan route testTroubleReport untuk debugging
const testTroubleReportRouter = require('./routes/testTroubleReport');
app.use('/test/trouble', testTroubleReportRouter);

// Import dan gunakan route trouble report untuk pelanggan
const troubleReportRouter = require('./routes/troubleReport');
app.use('/customer/trouble', troubleReportRouter);

// Import dan gunakan route voucher publik
const { router: publicVoucherRouter } = require('./routes/publicVoucher');
app.use('/voucher', publicVoucherRouter);

// Tambahkan webhook endpoint untuk voucher payment
app.use('/webhook/voucher', publicVoucherRouter);

// Import dan gunakan route API dashboard traffic
const apiDashboardRouter = require('./routes/apiDashboard');
app.use('/api', apiDashboardRouter);

// Konstanta
const VERSION = '1.0.0';

// Variabel global untuk menyimpan status koneksi WhatsApp
// (Tetap, karena status runtime)
global.whatsappStatus = {
    connected: false,
    qrCode: null,
    phoneNumber: null,
    connectedSince: null,
    status: 'disconnected'
};

// HAPUS global.appSettings
// Pastikan direktori sesi WhatsApp ada
const sessionDir = getSetting('whatsapp_session_path', './whatsapp-session');
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    logger.info(`Direktori sesi WhatsApp dibuat: ${sessionDir}`);
}

// Route untuk health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: VERSION,
        whatsapp: global.whatsappStatus.status
    });
});

// Route untuk mendapatkan status WhatsApp
app.get('/whatsapp/status', (req, res) => {
    res.json({
        status: global.whatsappStatus.status,
        connected: global.whatsappStatus.connected,
        phoneNumber: global.whatsappStatus.phoneNumber,
        connectedSince: global.whatsappStatus.connectedSince
    });
});

// Redirect root ke portal pelanggan
app.get('/', (req, res) => {
  res.redirect('/customer/login');
});

// Import PPPoE monitoring modules
const pppoeMonitor = require('./config/pppoe-monitor');
const pppoeCommands = require('./config/pppoe-commands');

// Import GenieACS commands module
const genieacsCommands = require('./config/genieacs-commands');

// Import MikroTik commands module
const mikrotikCommands = require('./config/mikrotik-commands');

// Import RX Power Monitor module
const rxPowerMonitor = require('./config/rxPowerMonitor');

// Tambahkan view engine dan static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Placeholder icons to avoid 404 before real assets are uploaded
try {
  const staticIcons = require('./routes/staticIcons');
  app.use('/', staticIcons);
} catch (e) {
  logger.warn('staticIcons route not loaded:', e.message);
}
// Mount customer portal
const customerPortal = require('./routes/customerPortal');
app.use('/customer', customerPortal);

// Mount customer billing portal
const customerBillingRouter = require('./routes/customerBilling');
app.use('/customer/billing', customerBillingRouter);

// Import dan gunakan route teknisi portal
const { router: technicianAuthRouter } = require('./routes/technicianAuth');
app.use('/technician', technicianAuthRouter);
// Alias Bahasa Indonesia untuk teknisi
app.use('/teknisi', technicianAuthRouter);

// Import dan gunakan route dashboard teknisi
const technicianDashboardRouter = require('./routes/technicianDashboard');
app.use('/technician', technicianDashboardRouter);
// Alias Bahasa Indonesia untuk dashboard teknisi
app.use('/teknisi', technicianDashboardRouter);

// Import dan gunakan route technician cable network
const technicianCableNetworkRouter = require('./routes/technicianCableNetwork');
app.use('/technician', technicianCableNetworkRouter);
// Alias Bahasa Indonesia untuk technician cable network
app.use('/teknisi', technicianCableNetworkRouter);

// Inisialisasi WhatsApp dan PPPoE monitoring
try {
    whatsapp.connectToWhatsApp().then(sock => {
        if (sock) {
            // Set sock instance untuk whatsapp
            whatsapp.setSock(sock);

            // Set sock instance untuk PPPoE monitoring
            pppoeMonitor.setSock(sock);
            pppoeCommands.setSock(sock);

            // Set sock instance untuk GenieACS commands
            genieacsCommands.setSock(sock);

            // Set sock instance untuk MikroTik commands
            mikrotikCommands.setSock(sock);

            // Set sock instance untuk RX Power Monitor
            rxPowerMonitor.setSock(sock);

            // Set sock instance untuk trouble report
            const troubleReport = require('./config/troubleReport');
            troubleReport.setSockInstance(sock);

            logger.info('WhatsApp connected successfully');

            // Initialize PPPoE monitoring jika MikroTik dikonfigurasi
            if (getSetting('mikrotik_host') && getSetting('mikrotik_user') && getSetting('mikrotik_password')) {
                pppoeMonitor.initializePPPoEMonitoring().then(() => {
                    logger.info('PPPoE monitoring initialized');
                }).catch(err => {
                    logger.error('Error initializing PPPoE monitoring:', err);
                });
            }

            // Initialize RX Power monitoring
            try {
                rxPowerMonitor.startRXPowerMonitoring();
                logger.info('RX Power monitoring initialized');
            } catch (err) {
                logger.error('Error initializing RX Power monitoring:', err);
            }
        }
    }).catch(err => {
        logger.error('Error connecting to WhatsApp:', err);
    });

    // Mulai monitoring PPPoE lama jika dikonfigurasi (fallback)
    if (getSetting('mikrotik_host') && getSetting('mikrotik_user') && getSetting('mikrotik_password')) {
        monitorPPPoEConnections().catch(err => {
            logger.error('Error starting legacy PPPoE monitoring:', err);
        });
    }
} catch (error) {
    logger.error('Error initializing services:', error);
}

// Tambahkan delay yang lebih lama untuk reconnect WhatsApp
const RECONNECT_DELAY = 30000; // 30 detik

// Fungsi untuk memulai server hanya pada port yang dikonfigurasi di settings.json
function startServer(portToUse) {
    // Pastikan port adalah number
    const port = parseInt(portToUse);
    if (isNaN(port) || port < 1 || port > 65535) {
        logger.error(`Port tidak valid: ${portToUse}`);
        process.exit(1);
    }
    
    logger.info(`Memulai server pada port yang dikonfigurasi: ${port}`);
    logger.info(`Port diambil dari settings.json - tidak ada fallback ke port alternatif`);
    
    // Hanya gunakan port dari settings.json, tidak ada fallback
    try {
        const server = app.listen(port, () => {
            logger.info(`✅ Server berhasil berjalan pada port ${port}`);
            logger.info(`🌐 Web Portal tersedia di: http://localhost:${port}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            // Update global.appSettings.port dengan port yang berhasil digunakan
            // global.appSettings.port = port.toString(); // Hapus ini
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                logger.error(`❌ ERROR: Port ${port} sudah digunakan oleh aplikasi lain!`);
                logger.error(`💡 Solusi: Hentikan aplikasi yang menggunakan port ${port} atau ubah port di settings.json`);
                logger.error(`🔍 Cek aplikasi yang menggunakan port: netstat -ano | findstr :${port}`);
            } else {
                logger.error('❌ Error starting server:', err.message);
            }
            process.exit(1);
        });
    } catch (error) {
        logger.error(`❌ Terjadi kesalahan saat memulai server:`, error.message);
        process.exit(1);
    }
}

// Mulai server dengan port dari settings.json
const port = getSetting('server_port', 4555);
logger.info(`Attempting to start server on configured port: ${port}`);

// Mulai server dengan port dari konfigurasi
startServer(port);

// Tambahkan perintah untuk menambahkan nomor pelanggan ke tag GenieACS
const { addCustomerTag } = require('./config/customerTag');

// Export app untuk testing
module.exports = app;
