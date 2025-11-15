// components/WorkExperience.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Entry = {
  role: string;
  org: string;
  period: string;
  location?: string;
  bullets: string[];
  tag?: string;
};

const internships: Entry[] = [
  {
    role: 'Tech Artist',
    org: 'Nukebox Studios',
    period: 'June 2025 - July 2025',
    location: 'Bangalore',
    bullets: [
      'Assisted in technical art workflows under the Lead Technical Artist.',
      'Learned & applied shader creation, VFX, and asset implementation techniques.',
      'Optimized art assets for better engine integration.',
    ],
    tag: 'Internship',
  },
  {
    role: 'Social Media Outreach Intern',
    org: 'KSF',
    period: 'July 2024 - October 2024',
    location: 'Remote',
    bullets: [
      'Managed social campaigns and increased engagement.',
      'Worked on content strategy, outreach, and performance tracking.',
    ],
    tag: 'Internship',
  },
];

const experience: Entry[] = [
  {
    role: 'Level Designer',
    org: 'Shikshaverse',
    period: 'October 2023 - December 2023',
    location: 'Chennai',
    bullets: ['Designed biology-based gamified levels.', 'Implemented level flow & pacing.'],
  },
  {
    role: 'Game Designer (Game Expanse)',
    org: 'GAME EXPANSE',
    period: '28 Aug 2023 - 31 Aug 2023',
    location: 'Chennai',
    bullets: [
      'Built a survival game using Unreal Engine 5 around the theme "LOOPS".',
      'Created protagonist in Blender and collaborated with a small team.',
    ],
  },
  {
    role: 'Game Designer (IRIS EXPO)',
    org: 'IRIS EXPO',
    period: 'November 2024',
    location: 'Chennai',
    bullets: [
      'Created a third-person shooter using Unreal Engine 5.',
      'Received positive feedback on gameplay and polish.',
    ],
  },
];

export default function WorkExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // timeline for the vertical progress line (pins while scrolling through cards)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top+=80', // start slightly after top to avoid immediate pinning
          end: 'bottom+=200 bottom',
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          // markers: true,
        },
      });

      // grow the vertical line as user scrolls through the section
      tl.fromTo(
        leftLineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1, ease: 'none' },
        0
      );

      // stagger reveal for all cards (internships + experience)
      const cards = gsap.utils.toArray<HTMLElement>('.we-card');

      gsap.set(cards, { autoAlpha: 0, y: 30, scale: 0.995 });

      cards.forEach((card, idx) => {
        const direction = idx % 2 === 0 ? -1 : 1; // alternate left/right
        const xFrom = `${direction * 120}px`;

        gsap.fromTo(
          card,
          { x: xFrom, autoAlpha: 0, y: 30 },
          {
            x: 0,
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
              markers: false,
            },
          }
        );
      });

      // subtle hover pop for interactive feel
      gsap.utils.toArray<HTMLElement>('.we-card').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { scale: 1.015, duration: 0.18, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      });
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-white py-16 px-6 md:px-12 lg:px-20"
      aria-labelledby="work-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 id="work-heading" className="text-3xl md:text-4xl font-extrabold">
          Internship & Experience
        </h2>
        <div className="relative mt-12">
          {/* left timeline / progress line */}
          <div className="absolute left-6 top-6 bottom-6 hidden md:block">
            <div className="relative h-full w-0">
              <div
                ref={leftLineRef}
                className="absolute left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-b from-purple-400 to-purple-600 origin-top"
                style={{ transformOrigin: 'top center', transform: 'scaleY(0)' }}
                aria-hidden
              />
              {/* markers */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-5 h-5 rounded-full bg-purple-400 shadow-lg" />
            </div>
          </div>

          <div className="md:pl-20">
            {/* Internships */}
            <div>
              <h3 className="text-xl font-bold">Internships</h3>
              <div className="mt-6 grid gap-6">
                {internships.map((it, i) => (
                  <article
                    key={`intern-${i}`}
                    className="we-card relative bg-white/6 border border-white/8 backdrop-blur-sm rounded-2xl p-5 md:p-6 hover:shadow-2xl transition-transform"
                    aria-label={`${it.role} at ${it.org}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold">{it.role}</h4>
                          <span className="text-sm text-slate-300">{it.org}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {it.period} {it.location ? `• ${it.location}` : ''}
                        </div>
                      </div>

                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-700/20 text-purple-200 border border-purple-700/30">
                          {it.tag ?? 'Internship'}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-4 ml-4 list-disc text-sm text-slate-200 space-y-2">
                      {it.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mt-12">
              <h3 className="text-xl font-bold">Experience</h3>
              <div className="mt-6 grid gap-6">
                {experience.map((ex, i) => (
                  <article
                    key={`exp-${i}`}
                    className="we-card relative bg-white/6 border border-white/8 backdrop-blur-sm rounded-2xl p-5 md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold">{ex.role}</h4>
                          <span className="text-sm text-slate-300">{ex.org}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {ex.period} {ex.location ? `• ${ex.location}` : ''}
                        </div>
                      </div>

                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-700/20 text-slate-100 border border-slate-700/30">
                          Project
                        </span>
                      </div>
                    </div>

                    <ul className="mt-4 ml-4 list-disc text-sm text-slate-200 space-y-2">
                      {ex.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}
