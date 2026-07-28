require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
<<<<<<< HEAD
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
=======

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
>>>>>>> 2fbd807b51c0206a00de8b2cc2a7b64ca9bd282d
});
