'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const main = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: main.current,
            start: 'top top',
            end: '+=300%',   // longer pin so movement is slow
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            // markers: true,
          },
        });

        // start both tweens at the same time (position 0)
        // 1) scroll-up: move UP and fade out while page scrolls
        tl.fromTo(
          '.scroll-up',
          { y: 0, opacity: 1 },
          { y: '-45vh', opacity: 0, ease: 'power2.out', duration: 1 },
          0 // start at beginning of timeline
        );

        // 2) main text: come from way below into center
        tl.fromTo(
          '.text',
          { y: '100vh', opacity: 0 },
          { y: '0vh', opacity: 1, ease: 'power2.out', duration: 1 },
          0 // sync with the scroll-up tween
        );

        // subtle settle after arrival (optional)
        tl.to('.text', { y: '-3vh', duration: 0.8, ease: 'sine.inOut' }, '+=0.1');
      }, main);

      return () => ctx.revert();
    },
    { scope: main }
  );

  return (
    <>
      <section
        ref={main}
        className="w-full min-h-screen relative flex flex-col items-center justify-center "
      >
        {/* "Scroll Down!" label sits near bottom and will float up */}
        <div className="scroll-up absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg md:text-2xl font-medium text-white">Scroll Down!</h1>
        </div>

        {/* main text that rises into center */}
        <div className="text text-center">
          <h1 className="text-4xl xl:text-6xl font-bold text-white">
            Hi, I'm Sarthak Som Singh
          </h1>
        </div>
      </section>

     
    </>
  );
}
