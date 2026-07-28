const express = require('express');
const router = express.Router();
const db = require('../config/database');

const t = {
    en: {
        home: 'Home', about: 'About', skills: 'My Skills', projects: 'Top Projects',
        experience: 'Experience', education: 'Education', contact: 'Contact Me',
        contactMe: 'Contact Me', aboutMe: 'About Me', personalInfo: 'Personal Information',
        name: 'Name', born: 'Born', location: 'Location', currentJob: 'Current Job',
        positionLabel: 'Position', contactInfo: 'Contact Information', address: 'Address',
        email: 'Email', phoneLabel: 'Phone', socialMedia: 'Social Media',
        sendMessage: 'Send Me a Message', nameLabel: 'Name', emailLabel: 'Email',
        subjectLabel: 'Subject', messageLabel: 'Message', sendBtn: 'Send Message',
        allRights: 'All rights reserved', helloIm: "Hello, I'm",
        portfolioBirthday: 'Portfolio Birthday!', years: 'years!',
        portfolio: 'portfolio', continueBtn: 'Continue 🎉',
        langLabel: 'en'
    },
    ru: {
        home: 'Главная', about: 'Обо мне', skills: 'Мои навыки', projects: 'Лучшие проекты',
        experience: 'Опыт работы', education: 'Образование', contact: 'Связаться',
        contactMe: 'Связаться со мной', aboutMe: 'Обо мне', personalInfo: 'Личная информация',
        name: 'Имя', born: 'Дата рождения', location: 'Местоположение', currentJob: 'Текущая работа',
        positionLabel: 'Должность', contactInfo: 'Контактная информация', address: 'Адрес',
        email: 'Электронная почта', phoneLabel: 'Телефон', socialMedia: 'Социальные сети',
        sendMessage: 'Отправьте мне сообщение', nameLabel: 'Имя', emailLabel: 'Email',
        subjectLabel: 'Тема', messageLabel: 'Сообщение', sendBtn: 'Отправить',
        allRights: 'Все права защищены', helloIm: 'Привет, я',
        portfolioBirthday: 'День рождения портфолио!', years: 'лет!',
        portfolio: 'портфолио', continueBtn: 'Продолжить 🎉',
        langLabel: 'ru'
    },
    uz: {
        home: 'Bosh sahifa', about: 'Men haqimda', skills: 'Ko\'nikmalarim', projects: 'Top loyihalar',
        experience: 'Tajriba', education: 'Ta\'lim', contact: 'Bog\'lanish',
        contactMe: 'Men bilan bog\'lanish', aboutMe: 'Men haqimda', personalInfo: 'Shaxsiy ma\'lumotlar',
        name: 'Ism', born: 'Tug\'ilgan sana', location: 'Joylashuv', currentJob: 'Hozirgi ish',
        positionLabel: 'Lavozim', contactInfo: 'Aloqa ma\'lumotlari', address: 'Manzil',
        email: 'Email', phoneLabel: 'Telefon', socialMedia: 'Ijtimoiy tarmoqlar',
        sendMessage: 'Menga xabar yuboring', nameLabel: 'Ism', emailLabel: 'Email',
        subjectLabel: 'Mavzu', messageLabel: 'Xabar', sendBtn: 'Yuborish',
        allRights: 'Barcha huquqlar himoyalangan', helloIm: 'Salom, men',
        portfolioBirthday: 'Portfolio tug\'ilgan kuni!', years: 'yil bo\'ldi!',
        portfolio: 'portfoliosi', continueBtn: 'Davom etish 🎉',
        langLabel: 'uz'
    }
};

function getPortfolioData(lang) {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    const about = db.prepare('SELECT * FROM about_paragraphs ORDER BY sort_order').all();
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order').all();
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order').all();
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order').all();
    
    projects.forEach(p => { 
        try { 
            p.technologies = JSON.parse(p.technologies); 
        } catch(e) { 
            p.technologies = []; 
        } 
    });
    
    return { settings, about, skills, projects, experience, education, t: t[lang] || t.en, lang };
}

router.get('/', (req, res) => {
    res.render('portfolio', getPortfolioData('en'));
});

router.get('/ru', (req, res) => {
    res.render('portfolio', getPortfolioData('ru'));
});

router.get('/uz', (req, res) => {
    res.render('portfolio', getPortfolioData('uz'));
});

module.exports = router;
