import React from 'react';
import db from '@/../config/database';
import PortfolioPage from '@/components/PortfolioPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const tDict: Record<string, Record<string, string>> = {
  en: {
    home: 'Home', about: 'About', skills: 'Skills', projects: 'Projects',
    experience: 'Experience', education: 'Education', contact: 'Contact',
    contactMe: 'Contact Me', aboutMe: 'About Me', personalInfo: 'Personal Information',
    name: 'Name', born: 'Born', location: 'Location', currentJob: 'Current Job',
    positionLabel: 'Position', contactInfo: 'Contact Information', address: 'Address',
    email: 'Email', phoneLabel: 'Phone', socialMedia: 'Social Media',
    sendMessage: 'Send Me a Message', nameLabel: 'Name', emailLabel: 'Email',
    subjectLabel: 'Subject', messageLabel: 'Message', sendBtn: 'Send Message',
    allRights: 'All rights reserved', helloIm: "Hello, I'm"
  },
  ru: {
    home: 'Главная', about: 'Обо мне', skills: 'Навыки', projects: 'Проекты',
    experience: 'Опыт', education: 'Образование', contact: 'Контакты',
    contactMe: 'Связаться со мной', aboutMe: 'Обо мне', personalInfo: 'Личная информация',
    name: 'Имя', born: 'Дата рождения', location: 'Местоположение', currentJob: 'Компания',
    positionLabel: 'Должность', contactInfo: 'Контактная информация', address: 'Адрес',
    email: 'Email', phoneLabel: 'Телефон', socialMedia: 'Социальные сети',
    sendMessage: 'Отправить сообщение', nameLabel: 'Имя', emailLabel: 'Email',
    subjectLabel: 'Тема', messageLabel: 'Сообщение', sendBtn: 'Отправить',
    allRights: 'Все права защищены', helloIm: 'Привет, я'
  },
  uz: {
    home: 'Bosh sahifa', about: 'Men haqimda', skills: 'Ko\'nikmalar', projects: 'Loyihalar',
    experience: 'Tajriba', education: 'Ta\'lim', contact: 'Bog\'lanish',
    contactMe: 'Bog\'lanish', aboutMe: 'Men haqimda', personalInfo: 'Shaxsiy ma\'lumotlar',
    name: 'Ism', born: 'Tug\'ilgan sana', location: 'Joylashuv', currentJob: 'Hozirgi ish',
    positionLabel: 'Lavozim', contactInfo: 'Aloqa ma\'lumotlari', address: 'Manzil',
    email: 'Email', phoneLabel: 'Telefon', socialMedia: 'Ijtimoiy tarmoqlar',
    sendMessage: 'Menga xabar yuboring', nameLabel: 'Ism', emailLabel: 'Email',
    subjectLabel: 'Mavzu', messageLabel: 'Xabar', sendBtn: 'Yuborish',
    allRights: 'Barcha huquqlar himoyalangan', helloIm: 'Salom, men'
  }
};

function getPortfolioData(lang: string) {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    const about = db.prepare('SELECT * FROM about_paragraphs ORDER BY sort_order').all();
    const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order').all();
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order').all();
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order').all();
    const themes = db.prepare('SELECT * FROM themes').all();
    
    projects.forEach((p: any) => {
      try { p.technologies = JSON.parse(p.technologies); } catch { p.technologies = []; }
    });

    return { settings, about, skills, projects, experience, education, themes, t: tDict[lang] || tDict.en, lang };
  } catch (err) {
    return {
      settings: { full_name: 'Asadbek Rajabboyev', job_title_en: 'Java Backend Developer', location_en: 'Urgench', email_1: 'shkoga.irbuc@gmail.com' },
      about: [],
      skills: [],
      projects: [],
      experience: [],
      education: [],
      themes: [],
      t: tDict[lang] || tDict.en,
      lang
    };
  }
}

export default async function LanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const data = getPortfolioData(lang);

  return <PortfolioPage data={data} />;
}
