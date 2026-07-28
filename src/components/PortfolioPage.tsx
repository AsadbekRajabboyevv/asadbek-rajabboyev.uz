'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/ui/SmoothScroll';
import { Navbar } from '@/components/ui/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Dynamically import Three.js Scene to ensure 100% SSR safety and fast initial load
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

interface PortfolioPageProps {
  data: {
    settings: any;
    about: any[];
    skills: any[];
    projects: any[];
    experience: any[];
    education: any[];
    t: Record<string, string>;
    lang: string;
  };
}

export default function PortfolioPage({ data }: PortfolioPageProps) {
  const { settings, about, skills, projects, experience, education, t, lang } = data;
  const [currentSection, setCurrentSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / (totalHeight || 1);
      setScrollProgress(progress);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setCurrentSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <SmoothScroll>
      {/* Background Music Audio Player */}
      {settings.music_file && (
        <>
          <audio ref={audioRef} loop src={`/uploads/${settings.music_file}`} />
          <button
            onClick={toggleAudio}
            className="fixed bottom-6 left-6 z-50 glass-panel p-3.5 rounded-full text-white hover:bg-accent transition-all shadow-[0_0_20px_var(--glass-border)] flex items-center justify-center gap-2 group"
            title="Toggle Background Music"
          >
            <i className={`fas ${isPlaying ? 'fa-volume-up text-accent animate-pulse' : 'fa-volume-mute text-slate-400'} text-base`} />
            <span className="text-xs font-semibold text-slate-200 hidden group-hover:inline transition-all">
              {isPlaying ? 'Sound ON' : 'Sound OFF'}
            </span>
          </button>
        </>
      )}

      {/* 3D Robot Companion R3F Overlay */}
      <Scene section={currentSection} progress={scrollProgress} hoveredTarget={hoveredTarget} />

      {/* Main UI Page Elements */}
      <div className="relative z-20 min-h-screen text-slate-100 selection:bg-accent selection:text-white">
        <Navbar lang={lang} t={t} />

        <main>
          <HeroSection settings={settings} t={t} lang={lang} />
          <AboutSection settings={settings} about={about} t={t} lang={lang} />
          <SkillsSection skills={skills} t={t} onHoverSkill={setHoveredTarget} />
          <ProjectsSection projects={projects} t={t} lang={lang} onHoverProject={setHoveredTarget} />
          <ExperienceSection experience={experience} t={t} lang={lang} />
          <ContactSection settings={settings} t={t} lang={lang} />
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-xs text-slate-400 glass-panel">
          <p>© {new Date().getFullYear()} {settings.full_name}. All rights reserved.</p>
        </footer>
      </div>
    </SmoothScroll>
  );
}