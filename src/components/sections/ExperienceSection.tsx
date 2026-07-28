'use client';

import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceProps {
  experience: any[];
  t: Record<string, string>;
  lang: string;
}

export function ExperienceSection({ experience, t, lang }: ExperienceProps) {
  return (
    <section id="experience" className="relative py-32 px-6 md:px-12 max-w-5xl mx-auto z-20">
      <div className="text-center mb-20">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-accent mb-3">{t.experience || 'CAREER JOURNEY'}</h2>
        <p className="text-4xl md:text-5xl font-extrabold text-white">Professional Experience</p>
      </div>

      <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 space-y-12 pl-8 md:pl-12">
        {experience.map((item, i) => (
          <div key={i} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-accent border-4 border-slate-900 shadow-[0_0_15px_var(--glass-border)] group-hover:scale-125 transition-transform" />

            <div className="glass-card p-8 rounded-3xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
                    {item.company_url ? (
                      <a href={item.company_url} target="_blank" className="hover:underline flex items-center gap-2">
                        {item['company_' + lang] || item.company_en}
                      </a>
                    ) : (
                      item['company_' + lang] || item.company_en
                    )}
                  </h3>
                  <p className="text-accent font-semibold text-sm">
                    {item['position_' + lang] || item.position_en}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 glass-panel px-3 py-1.5 rounded-full w-max">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>{item['period_' + lang] || item.period_en}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {item['description_' + lang] || item.description_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
