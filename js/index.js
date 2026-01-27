      // Mobile Menu Toggle
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');

      mobileMenuButton.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
      });

      // Language Switcher
      const translations = {
          en: {
              // Navigation
              "nav-home": "Home",
              "nav-about": "About",
              "nav-skills": "Skills",
              "nav-projects": "Projects",
              "nav-experience": "Experience",
              "nav-contact": "Contact",
              
              // Hero Section
              "hero-greeting": "Hello, I'm",
              "hero-title": "Java Backend Developer",
              "hero-contact": "Contact Me",
              "hero-about": "About Me",
              
              // About Section
              "about-title": "About Me",
              "about-personal": "Personal Information",
              "about-name": "Name:",
              "about-location": "Location:",
              "about-job": "Current Job:",
              "about-age":"Age:",
              "about-position": "Position:",
              "about-bio": "My interest in IT began in my childhood. I was very interested in creating Android applications, which led me to IT Park Uzbekistan Urgench branch in December 2022. There, I learned FrontEnd skills for 1 month, and in January 2023, I enrolled in a mobile programming course due to my interest in creating Android applications.",
              "about-bio-2": "For 6 months, a strong and experienced mentor, Islombek Yadgarov, taught me his experiences, and I successfully completed the course in July 2023 by creating my own small applications and games. Due to my interest in this field, I became an apprentice to the same mentor in September 2023, and for 6 months, he taught me the backend part of the Java programming language.",
              "about-bio-3": "During these 6 months, I joined the demo version of the e-qarz application and gained my own experience. In February 2024, I was hired through an interview at A1tech company under TATUUF for professional development. In March 2024, I participated in a real project and successfully completed it. Later in April, I joined the biggest startup and largest project, and I am still working on this project at this company. In the future, I aim to improve my skills and work for major companies like Google, Microsoft, and Amazon.",
              
              // Skills Section
              "skills-title": "My Skills",
              
              // Projects Section
              "projects-title": "Top Projects",
              "projects-view-github": "View on GitHub",
              "projects-live-demo": "Live Demo",
              "projects-chat-demo-desc": "This application is just like telegram but this is a demo version, this application uses websocket and is a very simple project",
              "projects-subcourse-desc": "The Subcourse application is a platform for online learning. It has the functions of adding courses, adding lessons, and adding online tests and participating in them through the admin panel, while a regular user can participate in these lessons, evaluate the lesson, and test their knowledge in an online test.",
              "projects-userbot-desc": "This is a telegram user bot that can manage your chats and automatically respond to users who write to you when you are not online.",
              "projects-add-new": "Add New Project",
              "projects-add-desc": "Upload your project image and add GitHub link",
              
              // Experience Section
              "experience-title": "Experience",
              "experience-a1tech-date": "February 2024 - October 2025",
              "experience-a1tech-position": "Java Backend Developer",
              "experience-a1tech-desc": "Working on large-scale projects and startups. Successfully completed a real project in March 2024 and currently working on a major startup project.",
              "experience-uzinfocom-date": "October 2025 - Present",
              "experience-uzinfocom-position": "Software Engineer",
              "experience-uzinfocom-desc": " I am currently working as a Software Engineer at Uzinfocom, Uzbekistan’s national IT integrator. I am actively involved in the HET Billing System, a mission-critical nationwide platform that manages electricity consumption billing for over 8 million residential households and legal consumers across the country.",
              "experience-apprentice-title": "Apprenticeship",
              "experience-apprentice-date": "September 2023 - February 2024",
              "experience-apprentice-position": "Java Backend Apprentice",
              "experience-apprentice-desc": "Learned Java backend development under the mentorship of Islombek Yadgarov. Contributed to the demo version of the e-qarz application.",
              "experience-itpark-date": "January 2023 - July 2023",
              "experience-itpark-position": "Mobile Development Student",
              "experience-itpark-desc": "Completed a 6-month mobile development course. Created small applications and games as part of the training.",

                // Education Section
              "education-title": "Education",
              "education-school-name": "General Secondary School No. 5, Urganch District, Khorezm Region",
              "education-school-date": "September 2013 - May 2024",
              "education-school-level": "General Secondary Education (Grades 1-11)",
              "education-school-desc": "I studied at the 5th general secondary school in Urganch district, Khorezm region. I began my education in September 2013 as a first-grade student and successfully completed the 11th grade in May 2024.",
              "education-university-name": "Urgench State University named after Al-Beruni",
              "education-university-date": "September 2025 - 2029 (Expected)",
              "education-university-level": "Bachelor’s Degree",
              "education-university-desc": "In September 2025, one year after completing secondary school, I was recommended for admission to Urgench State University named after Al-Beruni as a bachelor’s degree student at the Faculty of Computer Engineering. I am expected to graduate in 2029.",              
              // Contact Section
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
              
              // Footer
              "footer-copyright": "© 2024 All rights reserved"
          },
          ru: {
              // Navigation
              "nav-home": "Главная",
              "nav-about": "Обо мне",
              "nav-skills": "Навыки",
              "nav-projects": "Проекты",
              "nav-experience": "Опыт",
              "nav-contact": "Контакты",
              
              // Hero Section
              "hero-greeting": "Привет, я",
              "hero-title": "Java Backend Разработчик",
              "hero-contact": "Связаться со мной",
              "hero-about": "Обо мне",
              
              // About Section
              "about-title": "Обо мне",
              "about-personal": "Личная информация",
              "about-name": "Имя:",
              "about-location": "Местоположение:",
              "about-job": "Текущая работа:",
              "about-age":"возраст:",
              "about-position": "Должность:",
              "about-bio": "Мой интерес к IT начался в детстве. Я очень интересовался созданием Android-приложений, что привело меня в IT Park Uzbekistan Ургенчский филиал в декабре 2022 года. Там я изучал навыки FrontEnd в течение 1 месяца, а в январе 2023 года я записался на курс мобильного программирования из-за моего интереса к созданию Android-приложений.",
              "about-bio-2": "В течение 6 месяцев сильный и опытный наставник, Исломбек Ядгаров, обучал меня своему опыту, и я успешно завершил курс в июле 2023 года, создав свои собственные небольшие приложения и игры. Благодаря моему интересу к этой области, я стал учеником того же наставника в сентябре 2023 года, и в течение 6 месяцев он обучал меня серверной части языка программирования Java.",
              "about-bio-3": "В течение этих 6 месяцев я присоединился к демо-версии приложения e-qarz и получил свой собственный опыт. В феврале 2024 года я был принят на работу через собеседование в компанию A1tech при ТАТУУФ для повышения квалификации. В марте 2024 года я участвовал в реальном проекте и успешно завершил его. Позже, в апреле, я присоединился к крупнейшему стартапу и крупнейшему проекту, и я до сих пор работаю над этим проектом в этой компании. В будущем я стремлюсь улучшить свои навыки и работать в крупных компаниях, таких как Google, Microsoft и Amazon.",
              
              // Skills Section
              "skills-title": "Мои навыки",
              
              // Projects Section
              "projects-title": "Топ проекты",
              "projects-view-github": "Смотреть на GitHub",
              "projects-live-demo": "Демо версия",
              "projects-chat-demo-desc": "Это приложение похоже на Telegram, но это демо-версия, это приложение использует WebSocket и представляет собой очень простой проект.",
              "projects-subcourse-desc": "Приложение Subcourse — это платформа для онлайн-обучения. Он имеет функции добавления курсов, добавления уроков, добавления онлайн-тестов и участия в них через панель администратора, при этом обычный пользователь может участвовать в этих уроках, оценивать урок и проверять свои знания в онлайн-тесте.",
              "projects-userbot-desc": "Это бот для пользователей Telegram, который может управлять вашими чатами и автоматически отвечать пользователям, которые пишут вам, когда вы не в сети.",
              "projects-add-new": "Добавить новый проект",
              "projects-add-desc": "Загрузите изображение проекта и добавьте ссылку на GitHub",
              
              // Experience Section
              "experience-title": "Опыт работы",
              "experience-a1tech-date": "Февраль 2024 - Октябрь 2025",
              "experience-a1tech-position": "Java Backend Разработчик",
              "experience-a1tech-desc": "Работа над крупномасштабными проектами и стартапами. Успешно завершил реальный проект в марте 2024 года и в настоящее время работаю над крупным стартап-проектом.",
              "experience-uzinfocom-date": "Октябрь 2025 - настоящее время",
              "experience-uzinfocom-position": "Программист",
              "experience-uzinfocom-desc": "В настоящее время я работаю программистом в компании \"Узинфоком\", национальном ИТ-интеграторе Узбекистана. Я активно участвую в разработке системы выставления счетов HET, критически важной общенациональной платформы, которая управляет выставлением счетов за потребление электроэнергии для более чем 8 миллионов домохозяйств и юридический потребителей по всей стране.",
              "experience-apprentice-title": "Ученичество",
              "experience-apprentice-date": "Сентябрь 2023 - Февраль 2024",
              "experience-apprentice-position": "Java Backend Ученик",
              "experience-apprentice-desc": "Изучал разработку Java backend под руководством Исломбека Ядгарова. Внес вклад в демо-версию приложения e-qarz.",
              "experience-itpark-date": "Январь 2023 - Июль 2023",
              "experience-itpark-position": "Студент мобильной разработки",
              "experience-itpark-desc": "Завершил 6-месячный курс мобильной разработки. Создал небольшие приложения и игры в рамках обучения.",
              
              // Education Section
              "education-title": "Образование",
              "education-school-name": "Средняя общеобразовательная школа №5, Ургенчский район, Хорезмская область",
              "education-school-date": "Сентябрь 2013 - Май 2024",
              "education-school-level": "Общее среднее образование (1-11 классы)",
              "education-school-desc": "Я обучался в средней общеобразовательной школе №5 Ургенчского района Хорезмской области. Обучение начал в сентябре 2013 года в первом классе и успешно окончил 11-й класс в мае 2024 года.",
              "education-university-name": "Ургенчский государственный университет имени Аль-Беруни",
              "education-university-date": "Сентябрь 2025 - 2029 (ожидается)",
              "education-university-level": "Степень бакалавра",
              "education-university-desc": "В сентябре 2025 года, через год после окончания школы, я был рекомендован к поступлению в Ургенчский государственный университет имени Аль-Беруни на обучение по программе бакалавриата на факультет компьютерной инженерии. Окончание обучения планируется в 2029 году.",           
             // Contact Section
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
              
              // Footer
              "footer-copyright": "© 2024 Все права защищены"
          },
          uz: {
              // Navigation
              "nav-home": "Bosh sahifa",
              "nav-about": "Men haqimda",
              "nav-skills": "Ko'nikmalar",
              "nav-projects": "Loyihalar",
              "nav-experience": "Tajriba",
              "nav-contact": "Aloqa",
              
              // Hero Section
              "hero-greeting": "Salom, men",
              "hero-title": "Java Backend Dasturchi",
              "hero-contact": "Men bilan bog'laning",
              "hero-about": "Men haqimda",
              
              // About Section
              "about-title": "Men haqimda",
              "about-personal": "Shaxsiy ma'lumot",
              "about-name": "Ism:",
              "about-location": "Manzil:",
              "about-job": "Hozirgi ish joyi:",
              "about-position": "Lavozim:",
            "about-age":"Yosh:",
              "about-bio": "ITga qiziqishim yoshligimdan paydo bo'lgan. Android ilovalar yaratish haqida juda qiziqardim va shu bois 2022-yil dekabr oyida IT Park Uzbekistan Urganch filialiga keldim va shu joyda FrontEnd ko'nikmalarini 1oy davomida o'rgandim va 2023-yil yanvar oyida qiziqishim android ilovalar yaratish bo'lganligi uchun mobile dasturlash kursiga yozildim.",
              "about-bio-2": "6 oy davomida kuchli va tajribali mentor Islombek Yadgarov o'z tajribalarini o'rgatdi hamda ozimning kichik ilovalarim va kichik o'yinlarni yasab kursni 2023-yil iyul oyida muvaffaqiyatli bitirdim. Shu sohaga qiziqishim tufayli uni davom ettirish maqsadida shu mentorga 2023-yil sentyabr oyida shogirdlikka tushdim va 6oy Java dasturlash tilining asosiy qismi bo'lgan backend qismini o'rgatdi.",
              "about-bio-3": "Men shu 6 oy davomida e-qarz ilovasining demo versiyasiga qo'shilib o'zimning tajribamni orttirdim. 2024-yil fevral oyida TATUUF qoshidagi A1tech kompaniyasiga malaka oshirish uchun suhbat asosida ishga qabul qilindim. 2024-yil mart oyida real proyektda qatnashib uni muvaffaqiyatli bitirib topshirdim, keynchalik aprel oyida eng katta startap va katta proyektga qo'shildim va hozirgacha shu proyekt ustida shu kompaniyada ishlayapman. Kelajakda o'z malakalarimni oshirib eng katta kompaniyalardan biri bo'lgan Google, Microsoft, Amazon kabi yirik kompaniyalarga ishga kirish maqsad qilganman.",
              
              // Skills Section
              "skills-title": "Mening ko'nikmalarim",
              
              // Projects Section
              "projects-title": "Top loyihalarim",
              "projects-view-github": "GitHub da ko'rish",
              "projects-live-demo": "Jonli namoyish",
              "projects-chat-demo-desc": "Bu ilova huddi telegram kabi bo'ladi lekn bu demo varianti, bu programmada websocket ishlatilgan va juda sodda qilingan proyekt",
              "projects-subcourse-desc": "Subcourse ilovasi bu onlayn ta'lim olish uchun platforma hisoblanadi, admin panel orqali kurslar qo'shish, darslar qo'shish va online test qo'shish hamda shularda qatnashish funksiyalari mavjud, oddiy foydalanuvchi esa shu darslarda qatnashishi va darsni baholashi va onlayn testda o'zini bilimlarini sinab ko'rishi mumkin ",
              "projects-userbot-desc": "Bu telegram user bot va u sizning chatlaringizni boshqarishi va siz onlayn bo'lmagan vaqti sizga yozgan foydalanuvchilarga avtomatik javob beradi.",
              "projects-add-new": "Yangi loyiha qo'shish",
              "projects-add-desc": "Loyiha rasmini yuklang va GitHub havolasini qo'shing",
              
              // Experience Section
              "experience-title": "Tajriba",
              "experience-a1tech-date": "Fevral 2024 - Oktyabr 2025",
              "experience-a1tech-position": "Java Backend Dasturchi",
              "experience-a1tech-desc": "Katta loyihalar va startaplar ustida ishlash. 2024-yil mart oyida real loyihani muvaffaqiyatli yakunladim va hozirda katta startap loyihasi ustida ishlayapman.",
              "experience-uzinfocom-date": "2025-yil oktyabr - Hozirgi kungacha",
              "experience-uzinfocom-position": "Dasturiy ta'minot muhandisi",
              "experience-uzinfocom-desc": "Men hozirda O'zbekistonning milliy IT integratori Uzinfocom kompaniyasida dasturiy ta'minot muhandisi bo'lib ishlayapman. Men mamlakat bo'ylab 8 milliondan ortiq turar-joy xonadonlari va yuridik iste'molchilar uchun elektr energiyasi iste'moli uchun hisob-kitoblarni boshqaradigan juda muhim milliy platforma bo'lgan HET Billing tizimida faol ishtirok etaman.",
              "experience-apprentice-title": "Shogirdlik",
              "experience-apprentice-date": "Sentyabr 2023 - Fevral 2024",
              "experience-apprentice-position": "Java Backend Shogird",
              "experience-apprentice-desc": "Islombek Yadgarov rahbarligida Java backend dasturlashni o'rgandim. E-qarz ilovasining demo versiyasiga hissa qo'shdim.",
              "experience-itpark-date": "Yanvar 2023 - Iyul 2023",
              "experience-itpark-position": "Mobil dasturlash talabasi",
              "experience-itpark-desc": "6 oylik mobil dasturlash kursini yakunladim. O'quv jarayonida kichik ilovalar va o'yinlar yaratdim.",
              
              //Education Section
              "education-title": "Ta’lim",
              "education-school-name": "Xorazm viloyati, Urganch tumani, 5-sonli umumiy o‘rta ta’lim maktabi",
              "education-school-date": "2013-yil sentyabr - 2024-yil may",
              "education-school-level": "Umumiy o‘rta ta’lim (1-11-sinflar)",
              "education-school-desc": "Men Xorazm viloyati, Urganch tumani, 5-sonli umumiy o‘rta ta’lim maktabida tahsil olganman. 2013-yil sentyabr oyida 1-sinfga qabul qilinganman va 2024-yil may oyida 11-sinfni muvaffaqiyatli tamomlaganman.",   
              "education-university-name": "Al-Beruniy nomidagi Urganch davlat universiteti",
              "education-university-date": "2025-yil sentyabr - 2029-yil (kutilmoqda)",
              "education-university-level": "Bakalavr darajasi",
              "education-university-desc": "Maktabni tugatganimdan bir yil o‘tib, 2025-yil sentyabr oyida Al-Beruniy nomidagi Urganch davlat universitetining Kompyuter injiniringi fakultetiga bakalavr bosqichida o‘qishga tavsiya qilinganman. O‘qishni 2029-yilda tamomlashim rejalashtirilgan.",             
              // Contact Section
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
              
              // Footer
              "footer-copyright": "© 2024 Barcha huquqlar himoyalangan"
          }
      };

      function changeLanguage(lang) {
          const elements = document.querySelectorAll('[data-lang-key]');
          
          elements.forEach(element => {
              const key = element.getAttribute('data-lang-key');
              if (translations[lang] && translations[lang][key]) {
                  element.textContent = translations[lang][key];
              }
          });
          
          // Highlight active language button
          document.querySelectorAll('.language-btn').forEach(btn => {
              btn.classList.remove('ring-2', 'ring-blue-300');
          });
          event.target.closest('.language-btn').classList.add('ring-2', 'ring-blue-300');
          
          // Store language preference
          localStorage.setItem('preferred-language', lang);
      }

      document.addEventListener("DOMContentLoaded", () => {
        const menuLinks = document.querySelectorAll('a[href^="#"]');
        const mobileMenu = document.getElementById('mobile-menu');
    
        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
    
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
    
                if (targetElement) {
                    const offset = 70; // fixed header balandligi
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
    
                // Mobil menyuni yopish
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    });
    
      document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
    
        const { BOT_TOKEN, CHAT_ID } = window.TELEGRAM_CONFIG;
    
        // 5 daqiqa (300000 ms) cheklov tekshiruvi
        const lastSent = localStorage.getItem('last_sent');
        const now = Date.now();
    
        if (lastSent && now - lastSent < 5 * 60 * 1000) {
            const minsLeft = Math.ceil((5 * 60 * 1000 - (now - lastSent)) / 1000);
            alert(`Iltimos, ${Math.ceil(minsLeft / 60)} daqiqadan so‘ng qaytadan yuboring.`);
            return;
        }
    
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
    
        // IP olish
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;
    
                const text = `
    💬 Yangi xabar:
        👤 Ismi: ${name}
        📧 Email: ${email}
        📌 Mavzu: ${subject}
        📝 Xabar: ${message}
        🌐 IP: ${ip}
                `;
    
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: text,
                        parse_mode: 'Markdown'
                    })
                }).then(res => {
                    if (res.ok) {
                        localStorage.setItem('last_sent', now); // yuborilgan vaqtni saqlash
                        alert("Xabar yuborildi! 😊");
                        document.querySelector('form').reset();
                    } else {
                        alert("Xatolik: xabar yuborilmadi.");
                    }
                }).catch(err => {
                    alert("Xatolik: " + err.message);
                });
            });
    });
    
      // Set default language to English
      document.addEventListener('DOMContentLoaded', () => {
          const storedLang = localStorage.getItem('preferred-language') || 'en';
          changeLanguage(storedLang);
      });