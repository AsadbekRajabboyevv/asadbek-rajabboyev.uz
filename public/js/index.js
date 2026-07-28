// =====================================================================
//  Asadbek Rajabboyev Portfolio — index.js
// =====================================================================

function getBirthdayConfig() {
    const overlay = document.getElementById('birthday-overlay');
    if (!overlay) return { month: 5, day: 4, year: 2025 };
    return {
        month: parseInt(overlay.dataset.month) || 5,
        day: parseInt(overlay.dataset.day) || 4,
        year: parseInt(overlay.dataset.year) || 2025
    };
}

// ======================== BIRTHDAY CONFIG ============================

function getBirthdayYears() {
    const config = getBirthdayConfig();
    return new Date().getFullYear() - config.year;
}

function isBirthdayToday() {
    const now = new Date();
    const config = getBirthdayConfig();
    return now.getMonth() + 1 === config.month && now.getDate() === config.day;
}

function showBirthday() {
    const years = getBirthdayYears();
    if (years <= 0) return;
    const overlay  = document.getElementById('birthday-overlay');
    const canvas   = document.getElementById('bday-canvas');
    const yearNum  = document.getElementById('bday-year-num');
    const cakeYear = document.getElementById('cake-year-text');
    if (!overlay) return;
    if (yearNum)  yearNum.textContent  = years;
    if (cakeYear) cakeYear.textContent = years;
    overlay.style.display = 'flex';
    canvas.style.display  = 'block';
    startConfetti(canvas);
}

function closeBirthday() {
    const overlay = document.getElementById('birthday-overlay');
    const canvas  = document.getElementById('bday-canvas');
    if (!overlay) return;
    overlay.classList.add('hide');
    setTimeout(() => {
        overlay.style.display = 'none';
        canvas.style.display  = 'none';
        stopConfetti();
    }, 700);
}

// ======================== CONFETTI ENGINE ============================
let confettiAnim = null;
let confettiParticles = [];

function startConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#3B82F6','#60A5FA','#93C5FD','#F59E0B','#FCD34D','#34D399','#F472B6','#A78BFA','#FCA5A5','#6EE7B7'];
    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 6 + Math.random() * 9,
            h: 8 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 1.5,
            opacity: 0.8 + Math.random() * 0.2
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            p.y += p.vy; p.x += p.vx; p.rot += p.rotSpeed;
            if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        });
        confettiAnim = requestAnimationFrame(draw);
    }
    draw();
}

function stopConfetti() {
    if (confettiAnim) { cancelAnimationFrame(confettiAnim); confettiAnim = null; }
    confettiParticles = [];
}

// ======================== SCROLL REVEAL ==============================
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
}

// ======================== SCROLL PROGRESS BAR ========================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (pct > 0 ? (window.scrollY / pct) * 100 : 0) + '%';
    }, { passive: true });
}

// ======================== BACK TO TOP ================================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ======================== CURSOR GLOW ================================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    if (window.innerWidth < 768) { glow.style.display = 'none'; return; }
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    }, { passive: true });
}

// ======================== ACTIVE NAV HIGHLIGHT ======================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active-section');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active-section');
                    }
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
}

// ======================== MOBILE MENU ================================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// ======================== SMOOTH SCROLL ==============================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});

// ======================== CONTACT FORM ===============================
function initContactForm() {
    const form = document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const now = Date.now();
        const lastSent = localStorage.getItem('last_sent');
        if (lastSent && now - lastSent < 5 * 60 * 1000) {
            alert(`Please wait ${Math.ceil((5 * 60 * 1000 - (now - lastSent)) / 60000)} minutes.`);
            return;
        }
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('last_sent', now);
                alert('Message sent! 😊');
                form.reset();
            } else {
                alert('Error: ' + (data.error || 'Could not send message.'));
            }
        })
        .catch(err => alert('Error: ' + err.message));
    });
}

// ======================== INIT ALL =================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initScrollProgress();
    initBackToTop();
    initCursorGlow();
    initActiveNav();
    initContactForm();
    if (isBirthdayToday()) setTimeout(showBirthday, 800);
});
