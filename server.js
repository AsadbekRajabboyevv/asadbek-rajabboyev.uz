require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const adminRoutes = require('./routes/admin');

nextApp.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  
  server.use(session({
    secret: process.env.SESSION_SECRET || 'portfolio_secret_key_change_me_2024',
    resave: false,
    saveUninitialized: false,
  }));

  // Serve static uploaded files
  server.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
  server.use('/css', express.static(path.join(__dirname, 'public', 'css')));
  server.use('/js', express.static(path.join(__dirname, 'public', 'js')));

  // EJS Engine for Admin Panel
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'ejs');

  // Admin Routes
  server.use('/admin', adminRoutes);

  // Next.js App Router for Public Ultra-3D Portfolio Pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
