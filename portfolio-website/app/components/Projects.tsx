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
    link: 'https://github.com/sarcasm18/ThirdPersonShooter',
  },
  {
    title: 'HWASOO',
    date: 'December 2024',
    tools: 'UnrealEngine, FAB Library, MetaHumans',
    description:
      'Endless runner with gradually increasing difficulty. FAB used for level design; Blender for chase AI & textures.',
    link: 'https://github.com/sarcasm18/TN-Escape',
  },
  {
    title: 'Barbaadi',
    date: 'July 2024',
    tools: 'UnrealEngine, QuixelBridge, Blender',
    description:
      'Rage-room sandbox where players destroy objects. Quixel Megascans for level design and Blender for assets & textures.',
    link: 'https://github.com/sarcasm18/Rage-Room',
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
    title: 'HEADHUNTER',
    date: 'In Development',
    tools: 'UnrealEngine, QuixelBridge, MetaHumans, Unity',
    description:
      'Adventure game with 2D graphics; used Unity for level design and Blender for protagonist/textures.',
    link: 'https://github.com/sarcasm18/PlayableAD',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.project-card');

    // helper for column offset (3-col grid)
    const xFrom = (index: number) => {
      const col = index % 3;
      if (col === 0) return -80;
      if (col === 2) return 80;
      return 0;
    };

    // keep a list of attached handlers so we can remove them on cleanup
    const handlers: {
      el: HTMLElement;
      mousemove?: (e: MouseEvent) => void;
      mouseenter?: () => void;
      mouseleave?: () => void;
      focusin?: () => void;
      focusout?: () => void;
    }[] = [];

    const ctx = gsap.context(() => {
      // hide heading and cards initially
      gsap.set('.projects-heading', { autoAlpha: 0, y: 20 });
      gsap.set(cards, { autoAlpha: 0, y: 36, x: 0, scale: 0.995, rotateX: 0, rotateY: 0 });

      ScrollTrigger.matchMedia({
        // Desktop: pin the section while animation plays; pinSpacing true prevents overlap
        '(min-width: 768px)': function () {
          const pinDistance = Math.round(window.innerHeight * 0.75); // ~75% viewport; tuneable
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 38%', // start when section is comfortably in view
              end: `+=${pinDistance}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.25,
              anticipatePin: 1,
            },
          });

          // animate heading first
          tl.fromTo(
            '.projects-heading',
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power1.out' }
          );

          // then stagger the cards (with x offset per column)
          tl.fromTo(
            cards,
            {
              autoAlpha: 0,
              y: 36,
              x: (i: number) => xFrom(i),
              scale: 0.995,
            },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.75,
              stagger: { each: 0.12 },
            },
            '-=0.15' // slight overlap so cards start a little before heading finishes
          );

          // small hold so cards remain visible briefly
          tl.to({}, { duration: 0.25 });
        },

        // Mobile: shorter pin and simpler animation; still animate heading first
        '(max-width: 767px)': function () {
          const pinDistance = Math.round(window.innerHeight * 0.45); // ~45% viewport
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 82%',
              end: `+=${pinDistance}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.2,
              anticipatePin: 0.5,
            },
          });

          tl.fromTo('.projects-heading', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1 });
          tl.fromTo(
            cards,
            { autoAlpha: 0, y: 28, x: 0, scale: 0.995 },
            { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 0.6, stagger: 0.09 },
            '-=0.1'
          );

          tl.to({}, { duration: 0.18 });
        },
      });

      // Micro-interactions (desktop only): add light tilt + lift; remove listeners on cleanup
      if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
        cards.forEach((card) => {
          const el = card as HTMLElement;

          const onEnter = () => gsap.to(el, { y: -8, scale: 1.02, duration: 0.18, ease: 'power2.out' });
          const onLeave = () =>
            gsap.to(el, { y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 0.25, ease: 'power2.out' });

          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const py = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            const rotY = px * 3;
            const rotX = -py * 3;
            gsap.to(el, { rotateY: rotY, rotateX: rotX, duration: 0.18, ease: 'power2.out' });
          };
          const resetTilt = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.25, ease: 'power2.out' });

          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
          el.addEventListener('mousemove', onMove);
          el.addEventListener('mouseleave', resetTilt);
          el.addEventListener('focusin', onEnter);
          el.addEventListener('focusout', onLeave);

          handlers.push({
            el,
            mousemove: onMove,
            mouseenter: onEnter,
            mouseleave: onLeave,
            focusin: onEnter,
            focusout: onLeave,
          });
        });
      }
    }, containerRef);

    // refresh so ScrollTrigger measures correctly
    ScrollTrigger.refresh();

    return () => {
      // clean up manually-attached listeners
      handlers.forEach((h) => {
        if (!h.el) return;
        if (h.mousemove) h.el.removeEventListener('mousemove', h.mousemove);
        if (h.mouseenter) h.el.removeEventListener('mouseenter', h.mouseenter);
        if (h.mouseleave) h.el.removeEventListener('mouseleave', h.mouseleave);
        if (h.focusin) h.el.removeEventListener('focusin', h.focusin);
        if (h.focusout) h.el.removeEventListener('focusout', h.focusout);
      });

      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={containerRef} className=" px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="projects-heading text-3xl md:text-4xl font-bold text-white">Projects</h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <article
              key={`${project.title}-${i}`}
              tabIndex={0}
              className="project-card relative overflow-hidden rounded-2xl border border-white/8 bg-white/6 backdrop-blur-md shadow-lg p-6 transform-gpu will-change-transform focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              aria-labelledby={`proj-${i}-title`}
            >
              <div className="absolute -top-6 -left-6 w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 opacity-8 pointer-events-none" />

              <header className="flex items-start justify-between gap-4">
                <div>
                  <h3 id={`proj-${i}-title`} className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <div className="mt-1 text-xs text-slate-300">{project.date} • {project.tools}</div>
                </div>

                <div className="ml-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-700/20 text-purple-200 border border-purple-700/30">
                    {project.date === 'In Development' ? 'WIP' : 'Complete'}
                  </span>
                </div>
              </header>

              <p className="mt-4 text-sm text-slate-200 min-h-[68px]">{project.description}</p>

              <footer className="mt-6 flex items-center justify-between">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium inline-flex items-center gap-2 text-purple-300 hover:underline"
                >
                  View repo
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <div className="text-xs text-slate-400">Click to open</div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
