'use client';

import React from 'react';
import { User, MapPin, Briefcase, Calendar } from 'lucide-react';

interface AboutProps {
  settings: any;
  about: any[];
  t: Record<string, string>;
  lang: string;
}

export function AboutSection({ settings, about, t, lang }: AboutProps) {
  return (
    <section id="about" className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto z-20">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] mb-3" style={{ color: 'var(--accent)' }}>{t.about || 'ABOUT ME'}</h2>
        <p className="text-4xl md:text-5xl font-extrabold text-white">Crafting High-Performance Backend Architectures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Personal Details Glass Card */}
        <div className="lg:col-span-5 glass-card p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">{t.personalInfo || 'Personal Overview'}</h3>
          
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-accent" />
              <span className="font-semibold text-slate-100">{t.name || 'Name'}:</span>
              <span>{settings.full_name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="font-semibold text-slate-100">{t.born || 'Born'}:</span>
              <span>{settings.birth_date}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-semibold text-slate-100">{t.location || 'Location'}:</span>
              <a href={settings.location_url} target="_blank" className="text-accent hover:underline">
                {settings['location_' + lang] || settings.location_en}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-accent" />
              <span className="font-semibold text-slate-100">{t.currentJob || 'Company'}:</span>
              <a href={settings.company_url} target="_blank" className="text-accent hover:underline">
                {settings.current_company}
              </a>
            </div>
          </div>
        </div>

        {/* Story Text Paragraphs */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 text-lg leading-relaxed font-light">
          {about.map((paragraph: any, i: number) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent transition-colors">
              <p>{paragraph['text_' + lang] || paragraph.text_en}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
