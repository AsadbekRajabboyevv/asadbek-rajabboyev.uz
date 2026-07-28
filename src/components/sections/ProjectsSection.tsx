'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ProjectsProps {
  projects: any[];
  t: Record<string, string>;
  lang: string;
  onHoverProject: (projectTitle: string | null) => void;
}

export function ProjectsSection({ projects, t, lang, onHoverProject }: ProjectsProps) {
  return (
    <section id="projects" className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto z-20">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-accent mb-3">{t.projects || 'FEATURED WORK'}</h2>
        <p className="text-4xl md:text-5xl font-extrabold text-white">Selected Engineering Projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <div
            key={i}
            onMouseEnter={() => onHoverProject(project['title_' + lang] || project.title_en)}
            onMouseLeave={() => onHoverProject(null)}
            className="group glass-card rounded-3xl overflow-hidden transition-all duration-500 flex flex-col"
          >
            {/* Image Container with Dynamic Spotlight Overlay */}
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img
                src={`/uploads/${project.image}`}
                alt={project['title_' + lang] || project.title_en}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

              {/* Github Overlay Button */}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-accent transition-colors shadow-lg text-lg"
                >
                  <i className="fab fa-github" />
                </a>
              )}
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  {project['title_' + lang] || project.title_en}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project['description_' + lang] || project.description_en}
                </p>
              </div>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.isArray(project.technologies) &&
                  project.technologies.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-full glass-panel text-accent"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
