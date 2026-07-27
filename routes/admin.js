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
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
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
    
    res.render('admin/dashboard', { settings, about, skills, projects, experience, education, query: req.query });
});

router.post('/settings', requireAuth, upload.single('profile_image'), (req, res) => {
    const data = req.body;
    let query = 'UPDATE settings SET ';
    const params = [];
    for (const key in data) {
        query += `${key} = ?, `;
        params.push(data[key]);
    }
    if (req.file) {
        query += `profile_image = ?, `;
        params.push(req.file.filename);
    }
    query = query.slice(0, -2) + ' WHERE id = 1';
    db.prepare(query).run(...params);
    res.redirect('/admin?tab=settings');
});

// About CRUD
router.post('/about/create', requireAuth, (req, res) => {
    const { text_en, text_ru, text_uz, sort_order } = req.body;
    db.prepare('INSERT INTO about_paragraphs (text_en, text_ru, text_uz, sort_order) VALUES (?, ?, ?, ?)').run(text_en, text_ru, text_uz, sort_order || 0);
    res.redirect('/admin?tab=about');
});
router.post('/about/update/:id', requireAuth, (req, res) => {
    const { text_en, text_ru, text_uz, sort_order } = req.body;
    db.prepare('UPDATE about_paragraphs SET text_en=?, text_ru=?, text_uz=?, sort_order=? WHERE id=?').run(text_en, text_ru, text_uz, sort_order || 0, req.params.id);
    res.redirect('/admin?tab=about');
});
router.post('/about/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM about_paragraphs WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=about');
});

// Skills CRUD
router.post('/skills/create', requireAuth, (req, res) => {
    const { name, icon_class, percentage, sort_order } = req.body;
    db.prepare('INSERT INTO skills (name, icon_class, percentage, sort_order) VALUES (?, ?, ?, ?)').run(name, icon_class, percentage || 50, sort_order || 0);
    res.redirect('/admin?tab=skills');
});
router.post('/skills/update/:id', requireAuth, (req, res) => {
    const { name, icon_class, percentage, sort_order } = req.body;
    db.prepare('UPDATE skills SET name=?, icon_class=?, percentage=?, sort_order=? WHERE id=?').run(name, icon_class, percentage || 50, sort_order || 0, req.params.id);
    res.redirect('/admin?tab=skills');
});
router.post('/skills/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM skills WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=skills');
});

// Projects CRUD
router.post('/projects/create', requireAuth, upload.single('image'), (req, res) => {
    const { title_en, title_ru, title_uz, description_en, description_ru, description_uz, github_url, technologies, sort_order } = req.body;
    let image = req.body.image || '';
    if (req.file) image = req.file.filename;
    db.prepare('INSERT INTO projects (title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order || 0);
    res.redirect('/admin?tab=projects');
});
router.post('/projects/update/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title_en, title_ru, title_uz, description_en, description_ru, description_uz, github_url, technologies, sort_order } = req.body;
    let image = req.body.image;
    if (req.file) image = req.file.filename;
    db.prepare('UPDATE projects SET title_en=?, title_ru=?, title_uz=?, description_en=?, description_ru=?, description_uz=?, image=?, github_url=?, technologies=?, sort_order=? WHERE id=?').run(title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order || 0, req.params.id);
    res.redirect('/admin?tab=projects');
});
router.post('/projects/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=projects');
});

// Experience CRUD
router.post('/experience/create', requireAuth, (req, res) => {
    const { company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order } = req.body;
    db.prepare('INSERT INTO experience (company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order || 0);
    res.redirect('/admin?tab=experience');
});
router.post('/experience/update/:id', requireAuth, (req, res) => {
    const { company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order } = req.body;
    db.prepare('UPDATE experience SET company_en=?, company_ru=?, company_uz=?, company_url=?, position_en=?, position_ru=?, position_uz=?, period_en=?, period_ru=?, period_uz=?, description_en=?, description_ru=?, description_uz=?, sort_order=? WHERE id=?').run(company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order || 0, req.params.id);
    res.redirect('/admin?tab=experience');
});
router.post('/experience/delete/:id', requireAuth, (req, res) => {
    db.prepare('DELETE FROM experience WHERE id=?').run(req.params.id);
    res.redirect('/admin?tab=experience');
});

// Education CRUD
router.post('/education/create', requireAuth, (req, res) => {
    const { institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order } = req.body;
    db.prepare('INSERT INTO education (institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order || 0);
    res.redirect('/admin?tab=education');
});
router.post('/education/update/:id', requireAuth, (req, res) => {
    const { institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order } = req.body;
    db.prepare('UPDATE education SET institution_en=?, institution_ru=?, institution_uz=?, institution_url=?, degree_en=?, degree_ru=?, degree_uz=?, period_en=?, period_ru=?, period_uz=?, description_en=?, description_ru=?, description_uz=?, sort_order=? WHERE id=?').run(institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order || 0, req.params.id);
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
