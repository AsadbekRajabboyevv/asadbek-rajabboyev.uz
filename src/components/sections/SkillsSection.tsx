'use client';

import React from 'react';

interface SkillsProps {
  skills: any[];
  t: Record<string, string>;
  onHoverSkill: (skillName: string | null) => void;
}

export function SkillsSection({ skills, t, onHoverSkill }: SkillsProps) {
  return (
    <section id="skills" className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto z-20">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-accent mb-3">{t.skills || 'TECHNICAL MASTERY'}</h2>
        <p className="text-4xl md:text-5xl font-extrabold text-white">Skills & Specialized Stack</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skills.map((skill, i) => (
          <div
            key={i}
            onMouseEnter={() => onHoverSkill(skill.name)}
            onMouseLeave={() => onHoverSkill(null)}
            className="group glass-card p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl text-accent group-hover:scale-110 transition-transform">
                <i className={skill.icon_class} />
              </span>
              <span className="text-xs font-bold text-accent glass-panel px-2.5 py-1 rounded-full">
                {skill.percentage}%
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-accent transition-colors">
              {skill.name}
            </h3>

            {/* Skill Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-accent h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
