// =====================================================================
//  Asadbek Rajabboyev Portfolio — index.js
//  Includes: Birthday overlay, scroll reveal, skill bars, back-to-top,
//            scroll-progress, cursor glow, active nav, typing reset,
//            mobile menu, language switcher, smooth scroll, contact form
// =====================================================================

// ======================== BIRTHDAY CONFIG ============================
// Portfolio birinchi sayt chiqgan sana: 4-may 2024
const BIRTHDAY_MONTH = 5;   // May (1-indexed)
const BIRTHDAY_DAY   = 4;
const LAUNCH_YEAR    = 2025; // Portfolio birinchi chiqqan yil

function getBirthdayYears() {
    const now = new Date();
    return now.getFullYear() - LAUNCH_YEAR;
}

function isBirthdayToday() {
    const now = new Date();
    return now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function showBirthday() {
    const years = getBirthdayYears();
    if (years <= 0) return; // hali 1 yil bo'lmagan bo'lsa chiqmasin

    const overlay = document.getElementById('birthday-overlay');
    const canvas  = document.getElementById('bday-canvas');
    const yearNum = document.getElementById('bday-year-num');
    const cakeYear = document.getElementById('cake-year-text');

    if (!overlay) return;

    // Yilni ko'rsat
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

    const colors = [
        '#3B82F6','#60A5FA','#93C5FD','#F59E0B','#FCD34D',
        '#34D399','#F472B6','#A78BFA','#FCA5A5','#6EE7B7'
    ];

    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height - canvas.height,
            w:     6 + Math.random() * 9,
            h:     8 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot:   Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
            vy:    2 + Math.random() * 3,
            vx:    (Math.random() - 0.5) * 1.5,
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

            p.y   += p.vy;
            p.x   += p.vx;
            p.rot += p.rotSpeed;

            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        confettiAnim = requestAnimationFrame(draw);
    }
    draw();
}

function stopConfetti() {
    if (confettiAnim) {
        cancelAnimationFrame(confettiAnim);
        confettiAnim = null;
    }
    confettiParticles = [];
}

// ======================== SCROLL REVEAL ==============================
function initScrollReveal() {
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const elements = document.querySelectorAll(revealClasses.join(','));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // skill bar animatsiyasi
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    bar.classList.add('animated');
                });
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ======================== SKILL BARS =================================
// Skill barlar scroll qilinganda animatsiya bilan to'ladi (reveal orqali ishlaydi)
// CSS --target-width variable ishlatilgan, .animated class qo'shilganda ishlaydi

// ======================== SCROLL PROGRESS BAR ========================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }, { passive: true });
}

// ======================== BACK TO TOP ================================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======================== CURSOR GLOW ================================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    // Faqat desktop uchun
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
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// ======================== SMOOTH SCROLL ==============================
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('a[href^="#"]');
    const mobileMenuEl = document.getElementById('mobile-menu');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 70;
                const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
            if (mobileMenuEl && !mobileMenuEl.classList.contains('hidden')) {
                mobileMenuEl.classList.add('hidden');
            }
        });
    });
});

// ======================== LANGUAGE SWITCHER ==========================
const translations = {
    en: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-skills": "Skills",
        "nav-projects": "Projects",
        "nav-experience": "Experience",
        "nav-contact": "Contact",
        "hero-greeting": "Hello, I'm",
        "hero-title": "Java Backend Developer",
        "hero-contact": "Contact Me",
        "hero-about": "About Me",
        "about-title": "About Me",
        "about-personal": "Personal Information",
        "about-name": "Name:",
        "about-location": "Location:",
        "about-job": "Current Job:",
        "about-age": "Age:",
        "about-position": "Position:",
        "about-bio": "My interest in IT began in my childhood. I was very interested in creating Android applications, which led me to IT Park Uzbekistan Urgench branch in December 2022. There, I learned FrontEnd skills for 1 month, and in January 2023, I enrolled in a mobile programming course due to my interest in creating Android applications.",
        "about-bio-2": "For 6 months, a strong and experienced mentor, Islombek Yadgarov, taught me his experiences, and I successfully completed the course in July 2023 by creating my own small applications and games. Due to my interest in this field, I became an apprentice to the same mentor in September 2023, and for 6 months, he taught me the backend part of the Java programming language.",
        "about-bio-3": "During these 6 months, I joined the demo version of the e-qarz application and gained my own experience. In February 2024, I was hired through an interview at A1tech company under TATUUF for professional development. In March 2024, I participated in a real project and successfully completed it. Later in April, I joined the biggest startup and largest project, and I am still working on this project at this company. In the future, I aim to improve my skills and work for major companies like Google, Microsoft, and Amazon.",
        "skills-title": "My Skills",
        "projects-title": "Top Projects",
        "projects-view-github": "View on GitHub",
        "projects-live-demo": "Live Demo",
        "projects-chat-demo-desc": "This application is just like telegram but this is a demo version, this application uses websocket and is a very simple project",
        "projects-subcourse-desc": "The Subcourse application is a platform for online learning. It has the functions of adding courses, adding lessons, and adding online tests and participating in them through the admin panel, while a regular user can participate in these lessons, evaluate the lesson, and test their knowledge in an online test.",
        "projects-userbot-desc": "This is a telegram user bot that can manage your chats and automatically respond to users who write to you when you are not online.",
        "projects-add-new": "Add New Project",
        "projects-add-desc": "Upload your project image and add GitHub link",
        "experience-title": "Experience",
        "experience-a1tech-date": "February 2024 - October 2025",
        "experience-a1tech-position": "Java Backend Developer",
        "experience-a1tech-desc": "Working on large-scale projects and startups. Successfully completed a real project in March 2024 and currently working on a major startup project.",
        "experience-uzinfocom-date": "October 2025 - Present",
        "experience-uzinfocom-position": "Software Engineer",
        "experience-uzinfocom-desc": "I am currently working as a Software Engineer at Uzinfocom, Uzbekistan's national IT integrator. I am actively involved in the HET Billing System, a mission-critical nationwide platform that manages electricity consumption billing for over 8 million residential households and legal consumers across the country.",
        "experience-apprentice-title": "Apprenticeship",
        "experience-apprentice-date": "September 2023 - February 2024",
        "experience-apprentice-position": "Java Backend Apprentice",
        "experience-apprentice-desc": "Learned Java backend development under the mentorship of Islombek Yadgarov. Contributed to the demo version of the e-qarz application.",
        "experience-itpark-date": "January 2023 - July 2023",
        "experience-itpark-position": "Mobile Development Student",
        "experience-itpark-desc": "Completed a 6-month mobile development course. Created small applications and games as part of the training.",
        "education-title": "Education",
        "education-school-name": "General Secondary School No. 5, Urganch District, Khorezm Region",
        "education-school-date": "September 2013 - May 2024",
        "education-school-level": "General Secondary Education (Grades 1–11)",
        "education-school-desc": "I studied at the 5th general secondary school in Urganch district, Khorezm region. I began my education in September 2013 as a first-grade student and successfully completed the 11th grade in May 2024.",
        "education-university-name": "Urgench State University named after Al-Beruni",
        "education-university-date": "September 2025 – 2029 (Expected)",
        "education-university-level": "Bachelor's Degree",
        "education-university-desc": "In September 2025, one year after completing secondary school, I was recommended for admission to Urgench State University named after Al-Beruni as a bachelor's degree student at the Faculty of Computer Engineering. I am expected to graduate in 2029.",
        "contact-title": "Contact Me",
        "contact-info": "Contact Information",
        "contact-address": "Address",
        "contact-email": "Email",
        "contact-phone": "Phone",
        "contact-social": "Social Media",
        "contact-form": "Send Me a Message",
        "contact-name": "Name",
        "contact-email-address": "Email",
        "contact-subject": "Subject",
        "contact-message": "Message",
        "contact-send": "Send Message",
        "footer-copyright": "© 2024 All rights reserved"
    },
    ru: {
        "nav-home": "Главная",
        "nav-about": "Обо мне",
        "nav-skills": "Навыки",
        "nav-projects": "Проекты",
        "nav-experience": "Опыт",
        "nav-contact": "Контакты",
        "hero-greeting": "Привет, я",
        "hero-title": "Java Backend Разработчик",
        "hero-contact": "Связаться со мной",
        "hero-about": "Обо мне",
        "about-title": "Обо мне",
        "about-personal": "Личная информация",
        "about-name": "Имя:",
        "about-location": "Местоположение:",
        "about-job": "Текущая работа:",
        "about-age": "Возраст:",
        "about-position": "Должность:",
        "about-bio": "Мой интерес к IT начался в детстве. Я очень интересовался созданием Android-приложений, что привело меня в IT Park Uzbekistan Ургенчский филиал в декабре 2022 года. Там я изучал навыки FrontEnd в течение 1 месяца, а в январе 2023 года я записался на курс мобильного программирования.",
        "about-bio-2": "В течение 6 месяцев сильный и опытный наставник, Исломбек Ядгаров, обучал меня своему опыту, и я успешно завершил курс в июле 2023 года. В сентябре 2023 года я стал учеником того же наставника и в течение 6 месяцев изучал серверную часть Java.",
        "about-bio-3": "В феврале 2024 года я был принят на работу в компанию A1tech. В марте 2024 года я участвовал в реальном проекте и успешно завершил его. В будущем я стремлюсь работать в Google, Microsoft и Amazon.",
        "skills-title": "Мои навыки",
        "projects-title": "Топ проекты",
        "projects-view-github": "Смотреть на GitHub",
        "projects-live-demo": "Демо версия",
        "projects-chat-demo-desc": "Это приложение похоже на Telegram, но это демо-версия, использующая WebSocket.",
        "projects-subcourse-desc": "Subcourse — платформа для онлайн-обучения с функциями добавления курсов, уроков, онлайн-тестов через панель администратора.",
        "projects-userbot-desc": "Telegram user bot, который управляет чатами и автоматически отвечает пользователям, когда вы не в сети.",
        "projects-add-new": "Добавить новый проект",
        "projects-add-desc": "Загрузите изображение и добавьте ссылку GitHub",
        "experience-title": "Опыт работы",
        "experience-a1tech-date": "Февраль 2024 — Октябрь 2025",
        "experience-a1tech-position": "Java Backend Разработчик",
        "experience-a1tech-desc": "Работа над крупномасштабными проектами и стартапами. Успешно завершил реальный проект в марте 2024 года.",
        "experience-uzinfocom-date": "Октябрь 2025 — настоящее время",
        "experience-uzinfocom-position": "Программист",
        "experience-uzinfocom-desc": "Работаю программистом в Узинфоком. Участвую в разработке системы HET Billing — критически важной платформы для 8+ миллионов потребителей.",
        "experience-apprentice-title": "Ученичество",
        "experience-apprentice-date": "Сентябрь 2023 — Февраль 2024",
        "experience-apprentice-position": "Java Backend Ученик",
        "experience-apprentice-desc": "Изучал Java backend под руководством Исломбека Ядгарова. Участвовал в демо-версии e-qarz.",
        "experience-itpark-date": "Январь 2023 — Июль 2023",
        "experience-itpark-position": "Студент мобильной разработки",
        "experience-itpark-desc": "Завершил 6-месячный курс мобильной разработки. Создал небольшие приложения и игры.",
        "education-title": "Образование",
        "education-school-name": "Средняя общеобразовательная школа №5, Ургенчский район, Хорезмская область",
        "education-school-date": "Сентябрь 2013 — Май 2024",
        "education-school-level": "Общее среднее образование (1–11 классы)",
        "education-school-desc": "Обучался в 5-й средней общеобразовательной школе Ургенчского района. Начал в 2013 году и успешно окончил 11-й класс в мае 2024 года.",
        "education-university-name": "Ургенчский государственный университет имени Аль-Беруни",
        "education-university-date": "Сентябрь 2025 — 2029 (ожидается)",
        "education-university-level": "Степень бакалавра",
        "education-university-desc": "В сентябре 2025 года поступил на факультет компьютерной инженерии УрДУ. Окончание планируется в 2029 году.",
        "contact-title": "Связаться со мной",
        "contact-info": "Контактная информация",
        "contact-address": "Адрес",
        "contact-email": "Электронная почта",
        "contact-phone": "Телефон",
        "contact-social": "Социальные сети",
        "contact-form": "Отправить мне сообщение",
        "contact-name": "Имя",
        "contact-email-address": "Электронная почта",
        "contact-subject": "Тема",
        "contact-message": "Сообщение",
        "contact-send": "Отправить сообщение",
        "footer-copyright": "© 2024 Все права защищены"
    },
    uz: {
        "nav-home": "Bosh sahifa",
        "nav-about": "Men haqimda",
        "nav-skills": "Ko'nikmalar",
        "nav-projects": "Loyihalar",
        "nav-experience": "Tajriba",
        "nav-contact": "Aloqa",
        "hero-greeting": "Salom, men",
        "hero-title": "Java Backend Dasturchi",
        "hero-contact": "Men bilan bog'laning",
        "hero-about": "Men haqimda",
        "about-title": "Men haqimda",
        "about-personal": "Shaxsiy ma'lumot",
        "about-name": "Ism:",
        "about-location": "Manzil:",
        "about-job": "Hozirgi ish joyi:",
        "about-age": "Yosh:",
        "about-position": "Lavozim:",
        "about-bio": "ITga qiziqishim yoshligimdan paydo bo'lgan. Android ilovalar yaratishga qiziqqanim uchun 2022-yil dekabr oyida IT Park Uzbekistan Urganch filialiga keldim va FrontEnd ko'nikmalarini 1 oy o'rgandim.",
        "about-bio-2": "6 oy davomida mentor Islombek Yadgarov tajribalarini o'rgatdi va 2023-yil iyulda kursni muvaffaqiyatli bitirdim. Sentyabr 2023da shu mentorga shogirdlikka tushib, Java backend dasturlashni o'rgandim.",
        "about-bio-3": "2024-yil fevralda A1tech kompaniyasiga suhbat orqali qabul qilindim. Mart oyida real loyihani yakunladim. Kelajakda Google, Microsoft, Amazon kabi yirik kompaniyalarda ishlashni maqsad qilganman.",
        "skills-title": "Mening ko'nikmalarim",
        "projects-title": "Top loyihalarim",
        "projects-view-github": "GitHub da ko'rish",
        "projects-live-demo": "Jonli namoyish",
        "projects-chat-demo-desc": "Bu ilova telegram kabi, lekin demo varianti bo'lib websocket ishlatilgan.",
        "projects-subcourse-desc": "Subcourse — onlayn ta'lim platformasi. Admin panel orqali kurslar, darslar va testlar qo'shish mumkin.",
        "projects-userbot-desc": "Telegram user bot — chatlarni boshqaradi va siz offline bo'lganda avtomatik javob beradi.",
        "projects-add-new": "Yangi loyiha qo'shish",
        "projects-add-desc": "Loyiha rasmini yuklang va GitHub havolasini qo'shing",
        "experience-title": "Tajriba",
        "experience-a1tech-date": "Fevral 2024 — Oktyabr 2025",
        "experience-a1tech-position": "Java Backend Dasturchi",
        "experience-a1tech-desc": "Katta loyihalar va startaplar ustida ishlash. 2024-yil mart oyida real loyihani muvaffaqiyatli yakunladim.",
        "experience-uzinfocom-date": "2025-yil oktyabr — Hozirgi kungacha",
        "experience-uzinfocom-position": "Dasturiy ta'minot muhandisi",
        "experience-uzinfocom-desc": "Uzinfocom kompaniyasida dasturiy ta'minot muhandisi bo'lib ishlayapman. 8 milliondan ortiq iste'molchi uchun HET Billing tizimida faol ishtirok etaman.",
        "experience-apprentice-title": "Shogirdlik",
        "experience-apprentice-date": "Sentyabr 2023 — Fevral 2024",
        "experience-apprentice-position": "Java Backend Shogird",
        "experience-apprentice-desc": "Islombek Yadgarov rahbarligida Java backend o'rgandim. E-qarz demo versiyasiga hissa qo'shdim.",
        "experience-itpark-date": "Yanvar 2023 — Iyul 2023",
        "experience-itpark-position": "Mobil dasturlash talabasi",
        "experience-itpark-desc": "6 oylik mobil dasturlash kursini yakunladim. Kichik ilovalar va o'yinlar yaratdim.",
        "education-title": "Ta'lim",
        "education-school-name": "Xorazm viloyati, Urganch tumani, 5-sonli umumiy o'rta ta'lim maktabi",
        "education-school-date": "2013-yil sentyabr — 2024-yil may",
        "education-school-level": "Umumiy o'rta ta'lim (1–11-sinflar)",
        "education-school-desc": "Xorazm viloyati Urganch tumanidagi 5-sonli maktabda tahsil olganman. 2013-yilda 1-sinfga qabul qilinganman va 2024-yilda 11-sinfni tamomlaganman.",
        "education-university-name": "Al-Beruniy nomidagi Urganch davlat universiteti",
        "education-university-date": "2025-yil sentyabr — 2029-yil (kutilmoqda)",
        "education-university-level": "Bakalavr darajasi",
        "education-university-desc": "2025-yil sentyabrda UrDU Kompyuter injiniringi fakultetiga bakalavr sifatida o'qishga tavsiya qilinganman. 2029-yilda tamomlayman.",
        "contact-title": "Men bilan bog'laning",
        "contact-info": "Aloqa ma'lumotlari",
        "contact-address": "Manzil",
        "contact-email": "Elektron pochta",
        "contact-phone": "Telefon",
        "contact-social": "Ijtimoiy tarmoqlar",
        "contact-form": "Menga xabar yuboring",
        "contact-name": "Ism",
        "contact-email-address": "Elektron pochta",
        "contact-subject": "Mavzu",
        "contact-message": "Xabar",
        "contact-send": "Xabar yuborish",
        "footer-copyright": "© 2024 Barcha huquqlar himoyalangan"
    }
};

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Typing animation matnini yangilash
    const typingEl = document.querySelector('.typing-text');
    if (typingEl && translations[lang] && translations[lang]['hero-title']) {
        typingEl.textContent = translations[lang]['hero-title'];
        // Animatsiyani qayta ishga tushirish
        typingEl.style.animation = 'none';
        typingEl.offsetHeight; // reflow
        typingEl.style.animation = '';
    }

    // Active lang button highlight
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-blue-300');
    });
    if (event && event.target) {
        const closest = event.target.closest('.language-btn');
        if (closest) closest.classList.add('ring-2', 'ring-blue-300');
    }

    localStorage.setItem('preferred-language', lang);
}

// ======================== CONTACT FORM ===============================
function initContactForm() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!window.TELEGRAM_CONFIG) {
            alert("Config yuklanmadi (env.js).");
            return;
        }
        const { BOT_TOKEN, CHAT_ID } = window.TELEGRAM_CONFIG;

        const lastSent = localStorage.getItem('last_sent');
        const now = Date.now();
        if (lastSent && now - lastSent < 5 * 60 * 1000) {
            const secsLeft = Math.ceil((5 * 60 * 1000 - (now - lastSent)) / 1000);
            const minsLeft = Math.ceil(secsLeft / 60);
            alert(`Iltimos, ${minsLeft} daqiqadan so'ng qaytadan yuboring.`);
            return;
        }

        const name    = document.getElementById('name').value;
        const email   = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => {
                const ip = data.ip;
                const text = `💬 Yangi xabar:\n👤 Ismi: ${name}\n📧 Email: ${email}\n📌 Mavzu: ${subject}\n📝 Xabar: ${message}\n🌐 IP: ${ip}`;

                return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
                });
            })
            .then(res => {
                if (res.ok) {
                    localStorage.setItem('last_sent', now);
                    alert("Xabar yuborildi! 😊");
                    form.reset();
                } else {
                    alert("Xatolik: xabar yuborilmadi.");
                }
            })
            .catch(err => alert("Xatolik: " + err.message));
    });
}

// ======================== INIT ALL =================================
document.addEventListener('DOMContentLoaded', () => {
    // Til sozlamasi
    const storedLang = localStorage.getItem('preferred-language') || 'en';
    // Event simulyatsiz chaqiramiz
    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[storedLang] && translations[storedLang][key]) {
            el.textContent = translations[storedLang][key];
        }
    });

    // Scroll reveal
    initScrollReveal();

    // Scroll progress bar
    initScrollProgress();

    // Back to top
    initBackToTop();

    // Cursor glow
    initCursorGlow();

    // Active nav
    initActiveNav();

    // Contact form
    initContactForm();

    // Birthday — faqat 4-may kuni ko'rsatiladi
    if (isBirthdayToday()) {
        // Kichik kechikish bilan ochilsin (sahifa yuklanganidan keyin)
        setTimeout(showBirthday, 800);
    }
});