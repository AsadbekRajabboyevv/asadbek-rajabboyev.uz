const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
    const username = (req.body.username || '').trim();
    const password = (req.body.password || '').trim();

    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    if (username === expectedUser && password === expectedPass) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Invalid credentials. Please check your username and password.' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/', requireAuth, (req, res) => {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    const about = db.prepare('SELECT * FROM about_paragraphs ORDER BY sort_order').all();
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order').all();
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order').all();
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order').all();
    const themes = db.prepare('SELECT * FROM themes').all();
    
    res.render('admin/dashboard', { settings, about, skills, projects, experience, education, themes, query: req.query });
});

router.post('/themes/create', requireAuth, (req, res) => {
    const { name, bg_color, fg_color, accent_color, glass_bg, glass_border } = req.body;
    const code = 'custom_' + Date.now();
    try {
        db.prepare(`
            INSERT INTO themes (code, name, bg_color, fg_color, accent_color, glass_bg, glass_border, is_custom)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
            code,
            name || 'My Custom Theme',
            bg_color || '#0d1117',
            fg_color || '#f0f6fc',
            accent_color || '#58a6ff',
            glass_bg || 'rgba(22, 27, 34, 0.6)',
            glass_border || 'rgba(56, 139, 253, 0.25)'
        );
        // Automatically activate created theme
        db.prepare('UPDATE settings SET theme = ? WHERE id = 1').run(code);
    } catch (e) {
        console.error('Failed to create custom theme:', e);
    }
    res.redirect('/admin?tab=settings');
});

router.post('/themes/delete/:id', requireAuth, (req, res) => {
    try {
        const themeToDelete = db.prepare('SELECT code, is_custom FROM themes WHERE id = ?').get(req.params.id);
        if (themeToDelete && themeToDelete.is_custom) {
            db.prepare('DELETE FROM themes WHERE id = ?').run(req.params.id);
            const currentSettings = db.prepare('SELECT theme FROM settings WHERE id = 1').get();
            if (currentSettings?.theme === themeToDelete.code) {
                db.prepare('UPDATE settings SET theme = ? WHERE id = 1').run('cyber_dark');
            }
        }
    } catch (e) {
        console.error('Failed to delete custom theme:', e);
    }
    res.redirect('/admin?tab=settings');
});

router.post('/settings', requireAuth, upload.fields([{ name: 'profile_image' }, { name: 'music_file' }]), (req, res) => {
    const {
        full_name, birth_date, job_title_en, job_title_ru, job_title_uz,
        position_en, location_en, location_url, current_company, company_url,
        email_1, email_2, phone, theme
    } = req.body;

    let profile_image = req.body.existing_profile_image;
    if (req.files && req.files['profile_image']) {
        profile_image = req.files['profile_image'][0].filename;
    }

    let music_file = req.body.existing_music_file || '';
    if (req.files && req.files['music_file']) {
        music_file = req.files['music_file'][0].filename;
    }
    if (req.body.delete_music === '1') {
        music_file = '';
    }

    // Validate theme exists in database
    let validTheme = theme || 'cyber_dark';
    const themeExists = db.prepare('SELECT code FROM themes WHERE code = ?').get(validTheme);
    if (!themeExists) {
        validTheme = 'cyber_dark';
    }

    const stmt = db.prepare(`
        UPDATE settings SET
            full_name = ?, birth_date = ?, job_title_en = ?, job_title_ru = ?, job_title_uz = ?,
            position_en = ?, location_en = ?, location_url = ?, current_company = ?, company_url = ?,
            email_1 = ?, email_2 = ?, phone = ?, theme = ?, music_file = ?
        WHERE id = 1
    `);

    stmt.run(
        full_name || 'Asadbek Rajabboyev',
        birth_date || '29 March 2006',
        job_title_en || '', job_title_ru || '', job_title_uz || '',
        position_en || '', location_en || '', location_url || '',
        current_company || '', company_url || '',
        email_1 || '', email_2 || '', phone || '',
        validTheme, music_file
    );

    res.redirect('/admin?tab=settings');
});

// About CRUD
router.post('/about/create', requireAuth, (req, res) => {
    const text_en = req.body.text_en || '';
    const text_ru = req.body.text_ru || text_en || '';
    const text_uz = req.body.text_uz || text_en || '';
    const sort_order = req.body.sort_order || 0;
    db.prepare('INSERT INTO about_paragraphs (text_en, text_ru, text_uz, sort_order) VALUES (?, ?, ?, ?)').run(text_en, text_ru, text_uz, sort_order);
    res.redirect('/admin?tab=about');
});
router.post('/about/update/:id', requireAuth, (req, res) => {
    const text_en = req.body.text_en || '';
    const text_ru = req.body.text_ru || text_en || '';
    const text_uz = req.body.text_uz || text_en || '';
    const sort_order = req.body.sort_order || 0;
    db.prepare('UPDATE about_paragraphs SET text_en=?, text_ru=?, text_uz=?, sort_order=? WHERE id=?').run(text_en, text_ru, text_uz, sort_order, req.params.id);
    res.redirect('/admin?tab=about');
});
router.post('/about/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM about_paragraphs WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=about');
});

// Skills CRUD
router.post('/skills/create', requireAuth, (req, res) => {
    const name = req.body.name || '';
    const icon_class = req.body.icon_class || 'fas fa-code';
    const percentage = req.body.percentage || 50;
    const sort_order = req.body.sort_order || 0;
    db.prepare('INSERT INTO skills (name, icon_class, percentage, sort_order) VALUES (?, ?, ?, ?)').run(name, icon_class, percentage, sort_order);
    res.redirect('/admin?tab=skills');
});
router.post('/skills/update/:id', requireAuth, (req, res) => {
    const name = req.body.name || '';
    const icon_class = req.body.icon_class || 'fas fa-code';
    const percentage = req.body.percentage || 50;
    const sort_order = req.body.sort_order || 0;
    db.prepare('UPDATE skills SET name=?, icon_class=?, percentage=?, sort_order=? WHERE id=?').run(name, icon_class, percentage, sort_order, req.params.id);
    res.redirect('/admin?tab=skills');
});
router.post('/skills/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM skills WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=skills');
});

// Projects CRUD
router.post('/projects/create', requireAuth, upload.single('image'), (req, res) => {
    const title_en = req.body.title_en || '';
    const title_ru = req.body.title_ru || title_en || '';
    const title_uz = req.body.title_uz || title_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const github_url = req.body.github_url || '';
    const technologies = req.body.technologies || '[]';
    const sort_order = req.body.sort_order || 0;
    let image = req.body.image || '';
    if (req.file) image = req.file.filename;

    db.prepare('INSERT INTO projects (title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order);
    res.redirect('/admin?tab=projects');
});
router.post('/projects/update/:id', requireAuth, upload.single('image'), (req, res) => {
    const title_en = req.body.title_en || '';
    const title_ru = req.body.title_ru || title_en || '';
    const title_uz = req.body.title_uz || title_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const github_url = req.body.github_url || '';
    const technologies = req.body.technologies || '[]';
    const sort_order = req.body.sort_order || 0;
    let image = req.body.image || '';
    if (req.file) image = req.file.filename;

    db.prepare('UPDATE projects SET title_en=?, title_ru=?, title_uz=?, description_en=?, description_ru=?, description_uz=?, image=?, github_url=?, technologies=?, sort_order=? WHERE id=?').run(title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order, req.params.id);
    res.redirect('/admin?tab=projects');
});
router.post('/projects/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=projects');
});

// Experience CRUD
router.post('/experience/create', requireAuth, (req, res) => {
    const company_en = req.body.company_en || '';
    const company_ru = req.body.company_ru || company_en || '';
    const company_uz = req.body.company_uz || company_en || '';
    const company_url = req.body.company_url || '';
    const position_en = req.body.position_en || '';
    const position_ru = req.body.position_ru || position_en || '';
    const position_uz = req.body.position_uz || position_en || '';
    const period_en = req.body.period_en || '';
    const period_ru = req.body.period_ru || period_en || '';
    const period_uz = req.body.period_uz || period_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const sort_order = req.body.sort_order || 0;

    db.prepare('INSERT INTO experience (company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order);
    res.redirect('/admin?tab=experience');
});
router.post('/experience/update/:id', requireAuth, (req, res) => {
    const company_en = req.body.company_en || '';
    const company_ru = req.body.company_ru || company_en || '';
    const company_uz = req.body.company_uz || company_en || '';
    const company_url = req.body.company_url || '';
    const position_en = req.body.position_en || '';
    const position_ru = req.body.position_ru || position_en || '';
    const position_uz = req.body.position_uz || position_en || '';
    const period_en = req.body.period_en || '';
    const period_ru = req.body.period_ru || period_en || '';
    const period_uz = req.body.period_uz || period_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const sort_order = req.body.sort_order || 0;

    db.prepare('UPDATE experience SET company_en=?, company_ru=?, company_uz=?, company_url=?, position_en=?, position_ru=?, position_uz=?, period_en=?, period_ru=?, period_uz=?, description_en=?, description_ru=?, description_uz=?, sort_order=? WHERE id=?').run(company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order, req.params.id);
    res.redirect('/admin?tab=experience');
});
router.post('/experience/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM experience WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=experience');
});

// Education CRUD
router.post('/education/create', requireAuth, (req, res) => {
    const institution_en = req.body.institution_en || '';
    const institution_ru = req.body.institution_ru || institution_en || '';
    const institution_uz = req.body.institution_uz || institution_en || '';
    const institution_url = req.body.institution_url || '';
    const degree_en = req.body.degree_en || '';
    const degree_ru = req.body.degree_ru || degree_en || '';
    const degree_uz = req.body.degree_uz || degree_en || '';
    const period_en = req.body.period_en || '';
    const period_ru = req.body.period_ru || period_en || '';
    const period_uz = req.body.period_uz || period_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const sort_order = req.body.sort_order || 0;

    db.prepare('INSERT INTO education (institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order);
    res.redirect('/admin?tab=education');
});
router.post('/education/update/:id', requireAuth, (req, res) => {
    const institution_en = req.body.institution_en || '';
    const institution_ru = req.body.institution_ru || institution_en || '';
    const institution_uz = req.body.institution_uz || institution_en || '';
    const institution_url = req.body.institution_url || '';
    const degree_en = req.body.degree_en || '';
    const degree_ru = req.body.degree_ru || degree_en || '';
    const degree_uz = req.body.degree_uz || degree_en || '';
    const period_en = req.body.period_en || '';
    const period_ru = req.body.period_ru || period_en || '';
    const period_uz = req.body.period_uz || period_en || '';
    const description_en = req.body.description_en || '';
    const description_ru = req.body.description_ru || description_en || '';
    const description_uz = req.body.description_uz || description_en || '';
    const sort_order = req.body.sort_order || 0;

    db.prepare('UPDATE education SET institution_en=?, institution_ru=?, institution_uz=?, institution_url=?, degree_en=?, degree_ru=?, degree_uz=?, period_en=?, period_ru=?, period_uz=?, description_en=?, description_ru=?, description_uz=?, sort_order=? WHERE id=?').run(institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order, req.params.id);
    res.redirect('/admin?tab=education');
});
router.post('/education/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM education WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=education');
});

router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ filename: req.file.filename });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

module.exports = router;
