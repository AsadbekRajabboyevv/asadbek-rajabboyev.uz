const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'portfolio.db'));

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  full_name TEXT DEFAULT 'Asadbek Rajabboyev',
  job_title_en TEXT DEFAULT 'Java Backend Developer',
  job_title_ru TEXT DEFAULT 'Java Backend Разработчик',
  job_title_uz TEXT DEFAULT 'Java Backend Dasturchi',
  birth_date TEXT DEFAULT '29 March 2006',
  location_en TEXT DEFAULT 'Urgench, Khorezm',
  location_ru TEXT DEFAULT 'Ургенч, Хорезм',
  location_uz TEXT DEFAULT 'Urganch, Xorazm',
  location_url TEXT DEFAULT 'https://www.google.com/maps?q=Urganch,Khorezm',
  current_company TEXT DEFAULT 'UZINFOCOM LLC',
  company_url TEXT DEFAULT 'https://www.uzinfocom.uz',
  position_en TEXT DEFAULT 'Software Engineer',
  position_ru TEXT DEFAULT 'Инженер-программист',
  position_uz TEXT DEFAULT 'Dasturiy ta''minot muhandisi',
  profile_image TEXT DEFAULT 'asadbek-rajabboyev.png',
  profile_thumbnail TEXT DEFAULT 'asadbek-rajabboyev.jpg',
  email_1 TEXT DEFAULT 'shkoga.irbuc@gmail.com',
  email_2 TEXT DEFAULT 'asadrajab28@gmail.com',
  phone TEXT DEFAULT '+998991594946',
  phone_display TEXT DEFAULT '+998 99 159 49 46',
  linkedin TEXT DEFAULT 'https://www.linkedin.com/in/asadbek-rajabboyev-8b0338297/',
  github TEXT DEFAULT 'https://github.com/AsadbekRajabboyevv',
  telegram TEXT DEFAULT 'https://t.me/asadbek_rajabboyevv',
  instagram TEXT DEFAULT 'https://instagram.com/asadbek_rajabboyevv',
  meta_title_en TEXT DEFAULT 'Asadbek Rajabboyev | Java Backend Developer Portfolio',
  meta_title_ru TEXT DEFAULT 'Асадбек Раджаббоев | Портфолио Java Backend Разработчика',
  meta_title_uz TEXT DEFAULT 'Asadbek Rajabboyev | Java Backend Dasturchi Portfoliosi',
  meta_description_en TEXT DEFAULT 'Asadbek Rajabboyev is a skilled Java Backend Developer with expertise in Spring Boot, REST APIs, and database management.',
  meta_description_ru TEXT DEFAULT 'Асадбек Раджаббоев — опытный Java Backend разработчик со знанием Spring Boot, REST API и управления базами данных.',
  meta_description_uz TEXT DEFAULT 'Asadbek Rajabboyev — Spring Boot, REST API va ma''lumotlar bazasini boshqarish bo''yicha tajribaga ega Java Backend dasturchisi.',
  birthday_month INTEGER DEFAULT 5,
  birthday_day INTEGER DEFAULT 4,
  launch_year INTEGER DEFAULT 2025,
  music_file TEXT DEFAULT 'music.mp3'
);

CREATE TABLE IF NOT EXISTS about_paragraphs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text_en TEXT NOT NULL,
  text_ru TEXT NOT NULL,
  text_uz TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon_class TEXT NOT NULL,
  percentage INTEGER DEFAULT 50,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  image TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  technologies TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_en TEXT NOT NULL,
  company_ru TEXT NOT NULL,
  company_uz TEXT NOT NULL,
  company_url TEXT DEFAULT '',
  position_en TEXT NOT NULL,
  position_ru TEXT NOT NULL,
  position_uz TEXT NOT NULL,
  period_en TEXT NOT NULL,
  period_ru TEXT NOT NULL,
  period_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  institution_en TEXT NOT NULL,
  institution_ru TEXT NOT NULL,
  institution_uz TEXT NOT NULL,
  institution_url TEXT DEFAULT '',
  degree_en TEXT NOT NULL,
  degree_ru TEXT NOT NULL,
  degree_uz TEXT NOT NULL,
  period_en TEXT NOT NULL,
  period_ru TEXT NOT NULL,
  period_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);
`);

// Seed data
const hasSettings = db.prepare('SELECT count(*) as count FROM settings').get();
if (hasSettings.count === 0) {
    db.prepare(`INSERT INTO settings (id) VALUES (1)`).run();
}

const hasAbout = db.prepare('SELECT count(*) as count FROM about_paragraphs').get();
if (hasAbout.count === 0) {
    const stmt = db.prepare('INSERT INTO about_paragraphs (text_en, text_ru, text_uz, sort_order) VALUES (?, ?, ?, ?)');
    stmt.run("My interest in IT began in my childhood. I was very interested in creating Android applications, which led me to IT Park Uzbekistan Urgench branch in December 2022. There, I learned FrontEnd skills for 1 month, and in January 2023, I enrolled in a mobile programming course.", "Мой интерес к IT начался с детства. Мне было очень интересно создавать Android-приложения, что привело меня в IT Park Uzbekistan Ургенчский филиал в декабре 2022 года. Там я изучал FrontEnd 1 месяц, а в январе 2023 года записался на курс мобильного программирования.", "IT ga qiziqishim bolaligimdan boshlangan. Men Android ilovalar yaratishga juda qiziqardim, bu meni 2022-yil dekabr oyida IT Park Uzbekistan Urganch filialiga olib keldi. U yerda 1 oy FrontEnd ko'nikmalarini o'rgandim va 2023-yil yanvar oyida mobil dasturlash kursiga yozildim.", 1);
    stmt.run("For 6 months, a strong and experienced mentor, Islombek Yadgarov, taught me his experiences, and I successfully completed the course in July 2023. In September 2023, I became an apprentice to the same mentor and learned the backend part of Java.", "В течение 6 месяцев сильный и опытный ментор Исломбек Ядгаров делился со мной своим опытом, и в июле 2023 года я успешно завершил курс. В сентябре 2023 года я стал стажёром у того же ментора и изучал серверную часть Java.", "6 oy davomida kuchli va tajribali mentor Islombek Yadgarov menga o'z tajribalarini o'rgatdi va 2023-yil iyul oyida kursni muvaffaqiyatli tugatdim. 2023-yil sentabr oyida o'sha mentorning shogirdi bo'ldim va Java ning backend qismini o'rgandim.", 2);
    stmt.run("In February 2024, I was hired at A1tech company. In March 2024, I participated in a real project and successfully completed it. In the future, I aim to work for major companies like Google, Microsoft, and Amazon.", "В феврале 2024 года меня приняли на работу в компанию A1tech. В марте 2024 года я участвовал в реальном проекте и успешно его завершил. В будущем я стремлюсь работать в крупных компаниях, таких как Google, Microsoft и Amazon.", "2024-yil fevral oyida A1tech kompaniyasiga ishga qabul qilindim. 2024-yil mart oyida haqiqiy loyihada ishtirok etdim va uni muvaffaqiyatli yakunladim. Kelajakda Google, Microsoft va Amazon kabi yirik kompaniyalarda ishlashni maqsad qilganman.", 3);
}

const hasSkills = db.prepare('SELECT count(*) as count FROM skills').get();
if (hasSkills.count === 0) {
    const stmt = db.prepare('INSERT INTO skills (name, icon_class, percentage, sort_order) VALUES (?, ?, ?, ?)');
    const skills = [
        ['Java Core', 'fab fa-java', 95],
        ['Spring Boot', 'fas fa-leaf', 90],
        ['Spring Security', 'fas fa-shield-alt', 85],
        ['REST API', 'fas fa-exchange-alt', 90],
        ['JWT', 'fas fa-key', 85],
        ['Spring Data JPA', 'fas fa-database', 90],
        ['Hibernate', 'fas fa-database', 85],
        ['Android Dev', 'fab fa-android', 80],
        ['JavaScript', 'fab fa-js', 75],
        ['PostgreSQL', 'fas fa-database', 85],
        ['SQLite', 'fas fa-database', 80],
        ['Git', 'fas fa-code-branch', 85]
    ];
    skills.forEach((s, i) => stmt.run(s[0], s[1], s[2], i + 1));
}

const hasProjects = db.prepare('SELECT count(*) as count FROM projects').get();
if (hasProjects.count === 0) {
    const stmt = db.prepare('INSERT INTO projects (title_en, title_ru, title_uz, description_en, description_ru, description_uz, image, github_url, technologies, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run("Chat Demo (demo telegram)", "Чат Демо (демо телеграм)", "Chat Demo (demo telegram)", "This application is just like Telegram but a demo version using WebSocket — a simple real-time chat project.", "Это приложение похоже на Telegram, но демо-версия с использованием WebSocket — простой проект чата в реальном времени.", "Bu ilova xuddi Telegramga o'xshaydi, lekin WebSocket yordamida demo versiya — oddiy real-time chat loyihasi.", "chat-demo.png", "https://github.com/AsadbekRajabboyevv/chat_demo", JSON.stringify(["Java","Spring Boot","PostgreSQL","WebSocket"]), 1);
    stmt.run("Subcourse", "Subcourse", "Subcourse", "An online learning platform with course management, lessons, and online tests via admin panel. Users can enroll, rate lessons, and take tests.", "Платформа онлайн-обучения с управлением курсами, уроками и онлайн-тестами через панель администратора.", "Admin panel orqali kurslarni boshqarish, darslar va onlayn testlar mavjud bo'lgan onlayn ta'lim platformasi.", "subcourse.png", "https://github.com/AsadbekRajabboyevv/subcourse", JSON.stringify(["Java","Spring Boot","Spring Security","PostgreSQL","REST API"]), 2);
    stmt.run("Telegram Userbot", "Telegram Юзербот", "Telegram Userbot", "A Telegram userbot that manages your chats and automatically responds to users when you are offline.", "Telegram-юзербот, который управляет вашими чатами и автоматически отвечает пользователям, когда вы офлайн.", "Telegram userbot — chatlaringizni boshqaradi va siz oflayn bo'lganingizda foydalanuvchilarga avtomatik javob beradi.", "userbot.png", "https://github.com/AsadbekRajabboyevv/userbot", JSON.stringify(["Python","Telethon","Telegram API"]), 3);
}

const hasExperience = db.prepare('SELECT count(*) as count FROM experience').get();
if (hasExperience.count === 0) {
    const stmt = db.prepare('INSERT INTO experience (company_en, company_ru, company_uz, company_url, position_en, position_ru, position_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run("UZINFOCOM LLC", "UZINFOCOM LLC", "UZINFOCOM LLC", "https://www.uzinfocom.uz", "Software Engineer", "Инженер-программист", "Dasturiy ta'minot muhandisi", "October 2025 – Present", "Октябрь 2025 – настоящее время", "2025-yil oktabr – hozir", "Working as a Software Engineer at Uzbekistan's national IT integrator. Actively involved in the HET Billing System — a mission-critical platform managing electricity billing for over 8 million consumers nationwide.", "Работаю инженером-программистом в национальном IT-интеграторе Узбекистана. Активно участвую в разработке системы HET Billing — критически важной платформы для управления биллингом электроэнергии для более чем 8 миллионов потребителей.", "O'zbekistonning milliy IT-integratorida dasturiy ta'minot muhandisi sifatida ishlayapman. HET Billing tizimida faol ishtirok etayapman — bu butun mamlakat bo'ylab 8 milliondan ortiq iste'molchi uchun elektr energiya billingini boshqaruvchi muhim platforma.", 1);
    stmt.run("A1Tech Group", "A1Tech Group", "A1Tech Group", "https://www.a1tech.uz", "Java Backend Developer", "Java Backend Разработчик", "Java Backend Dasturchi", "February 2024 – October 2025", "Февраль 2024 – Октябрь 2025", "2024-yil fevral – 2025-yil oktabr", "Worked on large-scale projects and startups. Successfully completed a real project in March 2024 and contributed to a major startup project.", "Работал над крупными проектами и стартапами. Успешно завершил реальный проект в марте 2024 года и внёс вклад в крупный стартап-проект.", "Katta hajmdagi loyihalar va startaplarda ishladim. 2024-yil mart oyida haqiqiy loyihani muvaffaqiyatli yakunladim va yirik startap loyihasiga hissa qo'shdim.", 2);
    stmt.run("Apprenticeship", "Стажировка", "Shogirdlik", "", "Java Backend Apprentice", "Стажёр Java Backend", "Java Backend Shogird", "September 2023 – February 2024", "Сентябрь 2023 – Февраль 2024", "2023-yil sentabr – 2024-yil fevral", "Learned Java backend development under the mentorship of Islombek Yadgarov. Contributed to the demo version of the e-qarz application.", "Изучал серверную разработку на Java под руководством ментора Исломбека Ядгарова. Участвовал в разработке демо-версии приложения e-qarz.", "Islombek Yadgarov mentorligida Java backend dasturlashni o'rgandim. E-qarz ilovasining demo versiyasini yaratishda ishtirok etdim.", 3);
    stmt.run("IT Park Khorezm", "IT Park Хорезм", "IT Park Xorazm", "https://www.itpark.uz", "Mobile Development Student", "Студент курса мобильной разработки", "Mobil dasturlash kursi talabasi", "January 2023 – July 2023", "Январь 2023 – Июль 2023", "2023-yil yanvar – 2023-yil iyul", "Completed a 6-month mobile development course. Created small applications and games as part of the training.", "Прошёл 6-месячный курс мобильной разработки. В рамках обучения создавал небольшие приложения и игры.", "6 oylik mobil dasturlash kursini tugatdim. O'quv jarayonida kichik ilovalar va o'yinlar yaratdim.", 4);
}

const hasEducation = db.prepare('SELECT count(*) as count FROM education').get();
if (hasEducation.count === 0) {
    const stmt = db.prepare('INSERT INTO education (institution_en, institution_ru, institution_uz, institution_url, degree_en, degree_ru, degree_uz, period_en, period_ru, period_uz, description_en, description_ru, description_uz, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run("Urgench State University named after Al-Beruni", "Ургенчский государственный университет имени Аль-Беруни", "Al-Beruniy nomidagi Urganch davlat universiteti", "https://urdu.uz", "Bachelor's Degree — Computer Engineering", "Бакалавриат — Компьютерная инженерия", "Bakalavr — Kompyuter muhandisligi", "September 2025 – 2029 (Expected)", "Сентябрь 2025 – 2029 (ожидается)", "2025-yil sentabr – 2029 (kutilmoqda)", "Enrolled at the Faculty of Computer Engineering in September 2025. Expected graduation in 2029.", "Поступил на факультет компьютерной инженерии в сентябре 2025 года. Ожидаемый выпуск в 2029 году.", "2025-yil sentabr oyida Kompyuter muhandisligi fakultetiga kirdi. 2029-yilda bitirish kutilmoqda.", 1);
    stmt.run("General Secondary School No. 5, Urgench District", "Общеобразовательная школа №5, Ургенчский район", "Urganch tumani 5-umumta'lim maktabi", "https://schools.emaktab.uz/v2/school?school=1000005497745", "General Secondary Education (Grades 1–11)", "Общее среднее образование (1–11 классы)", "Umumiy o'rta ta'lim (1–11 sinflar)", "September 2013 – May 2024", "Сентябрь 2013 – Май 2024", "2013-yil sentabr – 2024-yil may", "Studied at school No. 5 in Urgench district, Khorezm region. Started in 2013 and successfully completed grade 11 in May 2024.", "Учился в школе №5 Ургенчского района Хорезмской области. Начал в 2013 году и успешно окончил 11 класс в мае 2024 года.", "Xorazm viloyati Urganch tumanidagi 5-maktabda o'qidi. 2013-yilda boshladi va 2024-yil may oyida 11-sinfni muvaffaqiyatli tamomladi.", 2);
}

module.exports = db;
