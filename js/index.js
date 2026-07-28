// =====================================================================
//  Asadbek Rajabboyev Portfolio — index.js
//  3 separate HTML pages per language (no JS translations needed)
// =====================================================================

// ======================== BIRTHDAY CONFIG ============================
const BIRTHDAY_MONTH = 5;
const BIRTHDAY_DAY   = 4;
const LAUNCH_YEAR    = 2025;

function getBirthdayYears() {
    return new Date().getFullYear() - LAUNCH_YEAR;
}

function isBirthdayToday() {
    const now = new Date();
    return now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
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
        if (!window.TELEGRAM_CONFIG) { alert("Config yuklanmadi (env.js)."); return; }
        const { BOT_TOKEN, CHAT_ID } = window.TELEGRAM_CONFIG;
        const now = Date.now();
        const lastSent = localStorage.getItem('last_sent');
        if (lastSent && now - lastSent < 5 * 60 * 1000) {
            alert(`Iltimos, ${Math.ceil((5 * 60 * 1000 - (now - lastSent)) / 60000)} daqiqadan so'ng qaytadan yuboring.`);
            return;
        }
        const name    = document.getElementById('name').value;
        const email   = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => {
                const text = `💬 Yangi xabar:\n👤 Ismi: ${name}\n📧 Email: ${email}\n📌 Mavzu: ${subject}\n📝 Xabar: ${message}\n🌐 IP: ${data.ip}`;
                return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
                });
            })
            .then(res => {
                if (res.ok) { localStorage.setItem('last_sent', now); alert("Xabar yuborildi! 😊"); form.reset(); }
                else alert("Xatolik: xabar yuborilmadi.");
            })
            .catch(err => alert("Xatolik: " + err.message));
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
