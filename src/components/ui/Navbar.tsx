'use client';

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

interface NavbarProps {
  lang: string;
  t: Record<string, string>;
}

export function Navbar({ lang, t }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${lang}`} className="group flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_var(--glass-border)] group-hover:scale-105 transition-transform">
            AR
          </div>
          <span className="text-white font-semibold text-lg tracking-wider hidden sm:block">
            ASADBEK <span className="text-accent font-light">RAJABBOYEV</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-accent transition-colors">{t.about || 'About'}</a>
          <a href="#skills" className="hover:text-accent transition-colors">{t.skills || 'Skills'}</a>
          <a href="#projects" className="hover:text-accent transition-colors">{t.projects || 'Projects'}</a>
          <a href="#experience" className="hover:text-accent transition-colors">{t.experience || 'Experience'}</a>
          <a href="#contact" className="hover:text-accent transition-colors">{t.contact || 'Contact'}</a>
        </nav>

        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300">
            <Globe className="w-3.5 h-3.5 text-accent" />
            <Link href="/" className={`px-2 py-0.5 rounded-full transition ${lang === 'en' ? 'bg-accent text-white' : 'hover:text-white'}`}>EN</Link>
            <Link href="/ru" className={`px-2 py-0.5 rounded-full transition ${lang === 'ru' ? 'bg-accent text-white' : 'hover:text-white'}`}>RU</Link>
            <Link href="/uz" className={`px-2 py-0.5 rounded-full transition ${lang === 'uz' ? 'bg-accent text-white' : 'hover:text-white'}`}>UZ</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
