// components/Achievements.tsx
'use client';

import React, { JSX, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Cert = { title: string; issuer?: string };

// --- replace / augment these with exact items from your resume as needed ---
const ACHIEVEMENTS: string[] = [
  'Winner — TechKnow 2022-23',
  'Special mention — Game Expanse 2023',
  'Participated — IRIS Expo (Nov 2024)',
];

const CERTIFICATIONS: Cert[] = [
  { title: "The Complete Beginner’s Course", issuer: 'Udemy' },
  { title: 'Computer Architecture and Organization Masterclass', issuer: 'Udemy' },
  { title: 'Amazon Web Services (Foundations)', issuer: 'AWS' },
  { title: 'Mobile Games Development Masterclass', issuer: 'Udemy' },
  { title: 'Python Fundamentals', issuer: 'Cisco' },
  { title: 'IBM Skills Build', issuer: 'IBM' },
  { title: 'Endless Runner course', issuer: 'Udemy' },
  { title: 'TPS Action Adventure course', issuer: 'Udemy' },
];

export default function Achievements(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector('.ac-heading') as HTMLElement | null;
      const achCards = gsap.utils.toArray<HTMLElement>('.ac-ach-card');
      const certCards = gsap.utils.toArray<HTMLElement>('.ac-cert-card');

      // initial states: hide heading & cards
      if (heading) gsap.set(heading, { autoAlpha: 0, y: 18 });
      gsap.set([...achCards, ...certCards], {
        autoAlpha: 0,
        transformOrigin: 'top center',
        rotateX: -80,
        y: 40,
        scale: 0.995,
      });

      // timeline: heading then roll-in cards. mobile/desktop tuning via matchMedia
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': function () {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              end: 'bottom top',
              toggleActions: 'play none none reverse',
              // markers: true,
            },
          });

          // heading
          if (heading) tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });

          // achievements stack: roll in from bottom to top (first in -> bottom of stack)
          tl.to(
            achCards,
            {
              rotateX: 0,
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: 'back.out(1.1)',
              stagger: { each: 0.12, from: 'start' },
            },
            '-=0.12'
          );

          // slight gap between groups
          tl.to({}, { duration: 0.08 });

          // certifications
          tl.to(
            certCards,
            {
              rotateX: 0,
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: 'back.out(1.1)',
              stagger: { each: 0.12, from: 'start' },
            },
            '-=0.06'
          );
        },

        '(max-width: 767px)': function () {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'bottom top',
              toggleActions: 'play none none reverse',
            },
          });

          if (heading) tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' });

          tl.to(
            [...achCards, ...certCards],
            {
              rotateX: 0,
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.58,
              ease: 'back.out(1.0)',
              stagger: 0.09,
            },
            '-=0.06'
          );
        },
      });

      // hover micro-interaction: subtle lift for cards (desktop only)
      if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
        [...achCards, ...certCards].forEach((el) => {
          const card = el as HTMLElement;
          const onEnter = () => gsap.to(card, { y: -6, scale: 1.02, duration: 0.18, ease: 'power2.out' });
          const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });

          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mouseleave', onLeave);
          card.addEventListener('focusin', onEnter);
          card.addEventListener('focusout', onLeave);

          // store a property to remove later via dataset
          (card as any).__ac_cleanup = { onEnter, onLeave };
        });
      }
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => {
      // remove hover listeners if attached
      const all = sectionRef.current?.querySelectorAll('.ac-ach-card, .ac-cert-card') ?? [];
      all.forEach((card) => {
        const c = card as HTMLElement & { __ac_cleanup?: any };
        if (c.__ac_cleanup) {
          c.removeEventListener('mouseenter', c.__ac_cleanup.onEnter);
          c.removeEventListener('mouseleave', c.__ac_cleanup.onLeave);
          c.removeEventListener('focusin', c.__ac_cleanup.onEnter);
          c.removeEventListener('focusout', c.__ac_cleanup.onLeave);
        }
      });

      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-4 md:px-8 lg:px-20 text-white"
      aria-labelledby="ach-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 id="ach-heading" className="ac-heading text-3xl md:text-4xl font-extrabold mb-6">
          Achievements & Certifications
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Achievements column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Achievements</h3>

            <div className="relative">
              {ACHIEVEMENTS.map((a, i) => {
                const z = 100 + i;
                return (
                  <article
                    key={a}
                    className="ac-ach-card relative rounded-2xl border border-white/8 bg-white/6 backdrop-blur-md p-5 md:p-6 mb-0 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    style={{
                      marginTop: i === 0 ? 0 : -28,
                      zIndex: z,
                    }}
                    tabIndex={0}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">{a}</h4>
                        <div className="text-xs text-slate-300">Achievement</div>
                      </div>
                      <div className="text-xs text-slate-300" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Certifications column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Certifications</h3>

            <div className="relative">
              {CERTIFICATIONS.map((c, i) => {
                const z = 200 + i;
                return (
                  <article
                    key={`${c.title}-${i}`}
                    className="ac-cert-card relative rounded-2xl border border-white/8 bg-white/6 backdrop-blur-md p-5 md:p-6 mb-0 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    style={{
                      marginTop: i === 0 ? 0 : -28,
                      zIndex: z,
                    }}
                    tabIndex={0}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">{c.title}</h4>
                        {c.issuer && <div className="text-xs text-slate-300">{c.issuer}</div>}
                      </div>

                      <div className="text-xs text-slate-300">Certificate</div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}
