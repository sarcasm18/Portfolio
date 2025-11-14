// components/Projects.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  date?: string;
  tools?: string;
  description?: string;
  link?: string;
};

const projects: Project[] = [
  {
    title: 'Adventure Game',
    date: 'November 2024',
    tools: 'UnrealEngine, QuixelBridge, FAB UE5, MetaHumans, Mixamo',
    description:
      'Third-person shooter with fun combat mechanics. Used Quixel Megascans for level design and MetaHumans for protagonist; textures made with Photoshop & Blender.',
    link: '#',
  },
  {
    title: 'HWASOO',
    date: 'December 2024',
    tools: 'UnrealEngine, FAB Library, MetaHumans',
    description:
      'Endless runner with gradually increasing difficulty. FAB used for level design; Blender for chase AI & textures.',
    link: '#',
  },
  {
    title: 'Barbaadi',
    date: 'July 2024',
    tools: 'UnrealEngine, QuixelBridge, Blender',
    description:
      'Rage-room sandbox where players destroy objects. Quixel Megascans for level design and Blender for assets & textures.',
    link: '#',
  },
  {
    title: 'Timebound',
    date: 'August 2023',
    tools: 'UnrealEngine 5, Blender',
    description:
      'Survival game with looping mechanics and a chase AI. Designed two maps with looping systems to trap players.',
    link: '#',
  },
  {
    title: 'HEADHUNTER (In Development)',
    date: 'In Development',
    tools: 'UnrealEngine, QuixelBridge, MetaHumans, Unity',
    description:
      'Adventure game with 2D graphics; used Unity for level design and Blender for protagonist/textures.',
    link: '#',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // select all cards (returns Array<HTMLElement>)
      const cards = gsap.utils.toArray<HTMLElement>('.project-card');

      cards.forEach((card) => {
        // initial state (in case card is visible on load)
        gsap.set(card, { opacity: 0, y: 32, scale: 0.995 });

        gsap.fromTo(
          card,
          { opacity: 0, y: 32, scale: 0.995 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            // subtle pop once in view
            onComplete: () => {
              gsap.to(card, { duration: 0.4, scale: 1 });
            },
            scrollTrigger: {
              trigger: card,
              start: 'top 92%', // adjust to taste: when the top of the card hits 92% viewport height
              toggleActions: 'restart none none reverse',
              markers: false,
            },
          }
        );
      });
    }, containerRef);

    // helpful when layout changes
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Projects
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <article
              key={`${project.title}-${i}`}
              className="project-card relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg p-6 transform transition hover:scale-[1.01]"
            >
              {/* decorative purple accent */}
              <div className="absolute -top-4 -left-4 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-600 to-purple-300 opacity-10 pointer-events-none" />

              <header className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <div className="mt-1 text-xs text-gray-500">{project.date} • {project.tools}</div>
                </div>

                <div className="ml-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {project.date === 'In Development' ? 'WIP' : 'Complete'}
                  </span>
                </div>
              </header>

              <p className="mt-4 text-sm text-gray-700 min-h-[68px]">{project.description}</p>

              <footer className="mt-6 flex items-center justify-between">
                <a
                  href={project.link}
                  className="text-sm font-medium inline-flex items-center gap-2 text-purple-600 hover:underline"
                >
                  View repo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm">
                    {project.title.split(' ').slice(0, 2).map((t) => t[0]).join('')}
                  </div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
