'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  settings: any;
  t: Record<string, string>;
  lang: string;
}

export function HeroSection({ settings, t, lang }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from(titleRef.current?.children || [], {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-24 px-6 md:px-12 overflow-hidden">
      {/* Dynamic Glow Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-30" style={{ backgroundColor: 'var(--accent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ backgroundColor: 'var(--accent)' }} />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 z-20">
        <div className="lg:col-span-8 space-y-8 text-center lg:text-left">
          {/* Status Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent)' }} />
            <span>Available for Next-Gen Projects</span>
          </div>

          {/* Cinematic Title */}
          <h1 ref={titleRef} className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none">
            <span className="block text-slate-400 text-3xl sm:text-4xl font-normal mb-2">{t.helloIm || "Hello, I'm"}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_0_35px_rgba(0,0,0,0.5)]">
              {settings.full_name || 'Asadbek Rajabboyev'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-2xl">
            {settings['job_title_' + lang] || settings.job_title_en || 'Java Backend Developer'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a
              href="#projects"
              className="group relative glass-card px-8 py-4 rounded-full text-white font-semibold text-sm flex items-center gap-3 overflow-hidden transition-all duration-300 shadow-[0_0_25px_var(--glass-border)]"
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-80 transition-opacity" />
              <span className="relative z-10">{t.projects || 'View Projects'}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-full text-slate-300 font-medium text-sm hover:text-white border border-slate-700 hover:border-accent transition-colors"
            >
              {t.contactMe || 'Contact Me'}
            </a>
          </div>
        </div>

        {/* Empty Column reserved for 3D Robot Positioning */}
        <div className="lg:col-span-4 h-64 lg:h-auto" />
      </div>
    </section>
  );
}
