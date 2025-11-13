"use client";

import React, { JSX, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---------- Resume-derived data (pulled from your uploaded resume) ----------
const PERSON = {
  name: "Sarthak Som Singh",
  role: "Game Developer / Technical Artist",
  location: "Chennai, India",
  phone: "+91-9810338374",
  email: "your.email@example.com",
  links: {
    github: "https://github.com/sarcasm18",
    artstation: "https://www.artstation.com/infernosar",
    linkedin: "https://www.linkedin.com/in/sarthak-som-singh-06409625a",
  },
};

const SKILLS = [
  "UE5",
  "Unity",
  "C/C++",
  "Shaders & VFX",
  "Blender",
  "Profiling",
  "Optimization",
  "Mobile",
];
const PROJECTS = [
  { title: "Third Person Adventure", tech: "UE5", date: "Nov 2024", link: "#" },
  {
    title: "HWASOO - Endless Runner",
    tech: "UE5",
    date: "Dec 2024",
    link: "#",
  },
  { title: "Barbaadi - Rage Room", tech: "UE5", date: "Jul 2024", link: "#" },
];

// small helper
function splitToSpans(text: string) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="inline-block overflow-hidden hero-word-wrap">
      <span className="inline-block hero-word">{w}</span>{" "}
    </span>
  ));
}

export default function Page(): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // HERO reveal (split words)
      gsap.set(".hero-line", { clipPath: "inset(100% 0 0 0)" });
      const tl = gsap.timeline();
      tl.to(".hero-line", {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
      })
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-cta",
          { scale: 0.96, opacity: 0, duration: 0.6, ease: "back.out(1.1)" },
          "-=0.4"
        );

      // blob breathing
      gsap.to(".blob-anim", {
        scale: 1.08,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // skill marquee
      gsap.to(".skills-track", {
        xPercent: -50,
        duration: 14,
        ease: "none",
        repeat: -1,
      });

      // reveal batch for elements
      ScrollTrigger.batch(".reveal", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            ease: "power3.out",
            duration: 0.7,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 18, opacity: 0, duration: 0.45 }),
        batchMax: 6,
      });

      // projects horizontal pin
      const track = projectTrackRef.current;
      if (track) {
        const cards = track.querySelectorAll(".project-card");
        const cardWidth = (cards[0] as HTMLElement).offsetWidth + 24;
        const total = cardWidth * cards.length;
        gsap.set(track, { width: `${total}px` });

        gsap.to(cards, {
          x: (i) => `-=${i * cardWidth}`,
          ease: "none",
          scrollTrigger: {
            trigger: ".projects-pin",
            start: "top top",
            end: () => `+=${total}`,
            scrub: 0.9,
            pin: ".projects-pin",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (value: number) => {
                const frac = value / (total - window.innerWidth);
                const step = 1 / Math.max(1, cards.length - 1);
                const snapped = Math.round(frac / step) * step;
                return snapped;
              },
              duration: 0.45,
              ease: "power2.out",
            },
          },
        });

        // physics-driven hover for cards
        cards.forEach((el) => {
          const card = el as HTMLElement;
          let rafId = 0;
          let lastX = 0;
          let lastY = 0;

          function apply() {
            gsap.to(card, {
              rotationY: lastX,
              rotationX: lastY,
              transformPerspective: 1000,
              transformOrigin: "center",
              duration: 0.45,
              ease: "power2.out",
            });
            rafId = 0;
          }

          card.onpointermove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;

            lastX = (px - 0.5) * 18; // rotationY
            lastY = (0.5 - py) * 12; // rotationX

            if (!rafId) rafId = requestAnimationFrame(apply);
          };

          card.onpointerleave = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
            });
          };

          // slight floating motion using physics-like spring
          gsap.to(card, {
            y: 6,
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }

      ScrollTrigger.refresh();
    }, rootRef);

    // canvas particle system (simple physics) - created outside gsap context for perf
    const canvas = canvasRef.current;
    let animationId: number;
    if (canvas) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      const ctx2 = canvas.getContext("2d");
      if (ctx2) ctx2.scale(dpr, dpr);

      type Particle = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        r: number;
        life: number;
      };
      const particles: Particle[] = [];
      const mouse = { x: 0, y: 0, active: false };

      const spawn = (x: number, y: number, n = 6) => {
        for (let i = 0; i < n; i++) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.9) * 2.5,
            r: 1 + Math.random() * 2.6,
            life: 40 + Math.random() * 60,
          });
        }
      };

      canvas.onpointermove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      };
      canvas.onpointerleave = () => (mouse.active = false);
      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        spawn(e.clientX - rect.left, e.clientY - rect.top, 20);
      };

      function loop() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx2.clearRect(0, 0, w, h);

        // spawn gentle ambient particles near mouse
        if (mouse.active && Math.random() < 0.2) spawn(mouse.x, mouse.y, 1);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          // attractive force towards center slowly
          const cx = w * 0.5;
          const cy = h * 0.4;
          const dx = cx - p.x;
          const dy = cy - p.y;
          p.vx += dx * 0.0006;
          p.vy += dy * 0.0006 + 0.02; // gravity-like

          // mouse repulsion
          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const dist2 = mdx * mdx + mdy * mdy;
            if (dist2 < 2500) {
              const f = 0.15 / Math.max(20, Math.sqrt(dist2));
              p.vx += mdx * f;
              p.vy += mdy * f;
            }
          }

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.life -= 1;

          // draw (neon green / cyan glow)
          ctx2.beginPath();
          const alpha = Math.max(0, Math.min(1, p.life / 100));
          ctx2.fillStyle = `rgba(72, 241, 138, ${alpha})`;
          ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx2.fill();

          // remove
          if (p.life <= 0 || p.y > h + 50 || p.x < -50 || p.x > w + 50)
            particles.splice(i, 1);
        }

        animationId = requestAnimationFrame(loop);
      }
      loop();
    }

    return () => {
      ctx.revert();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen font-sans bg-black text-slate-100 overflow-x-hidden"
    >
      <style jsx>{`
        :root {
          --g1: #06e066; /* neon green */
          --g2: #03b36a; /* deep green */
          --glass: rgba(255, 255, 255, 0.04);
        }

        .hero-line {
          display: block;
          overflow: hidden;
        }
        .hero-word {
          display: inline-block;
          transform: translateY(20px);
        }
        .hero-underline {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke: var(--g1);
          fill: none;
        }
        .blob-anim {
          will-change: transform;
        }
        .skills-track {
          will-change: transform;
        }
        .project-card {
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .neon-text {
          text-shadow: 0 2px 8px rgba(6, 224, 102, 0.12),
            0 0 20px rgba(6, 224, 102, 0.05);
        }

        @media (max-width: 768px) {
          .project-card {
            min-width: 280px;
          }
        }
      `}</style>

      {/* canvas background for particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-green-400 font-extrabold tracking-tight">
            {PERSON.name}
          </div>
          <nav className="flex items-center gap-4 text-sm text-green-200/80">
            <a href="#projects" className="hover:text-green-100">
              Projects
            </a>
            <a href="#experience" className="hover:text-green-100">
              Experience
            </a>
            <a
              href="#contact"
              className="px-3 py-1 rounded bg-gradient-to-r from-green-500 to-green-400 text-black font-semibold"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-24 relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden py-28">
          <div className="absolute -left-32 -top-24 blob-anim pointer-events-none">
            <div className="h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[var(--g2)] via-[var(--g1)] to-[var(--g2)] filter blur-3xl opacity-70" />
          </div>

          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm text-green-200/70 mb-2">Hello — I’m</p>

              <h1 className="text-[40px] md:text-[56px] font-extrabold leading-tight neon-text">
                <div className="hero-line">{splitToSpans(PERSON.name)}</div>
                <div
                  className="mt-3 hero-line text-[20px] md:text-[28px] font-semibold"
                  style={{ color: "var(--g1)" }}
                >
                  {PERSON.role}
                </div>
              </h1>

              <p className="mt-6 text-slate-200/70 max-w-xl reveal">
                I craft realtime VFX, shaders and gameplay systems — shipping
                optimized, playable prototypes across mobile and PC. My work
                focuses on tight feel, high performance and memorable visuals.
              </p>

              <div className="mt-6 flex gap-3">
                <a
                  href={PERSON.links.github}
                  className="hero-cta inline-block rounded-md px-4 py-2 bg-transparent border border-green-700 text-green-200 hover:scale-105 transition-transform"
                >
                  View Code
                </a>
                <a
                  href={PERSON.links.artstation}
                  className="inline-block rounded-md px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 text-black font-medium hover:brightness-105 transition"
                >
                  Art
                </a>
              </div>

              <div className="mt-6 flex gap-4 text-sm text-green-200/60">
                <div>{PERSON.location}</div>
                <div>•</div>
                <div>{PERSON.phone}</div>
              </div>

              <div className="mt-8">
                <div className="text-xs text-green-300 mb-2">Top skills</div>
                <div className="relative overflow-hidden h-10">
                  <div className="skills-track flex gap-3 whitespace-nowrap">
                    {SKILLS.concat(SKILLS).map((s, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 rounded-full bg-white/3 border border-white/6 text-sm text-green-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-[520px]">
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                  <div className="relative h-80 w-full bg-black">
                    {/* Replace /profile.jpg with your image in public folder */}
                    <Image
                      src="/profile.jpg"
                      alt="profile"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-200/60">
                  Highlights: mobile fps +10% • LOD & atlas optimization •
                  shipped prototypes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects: pin horizontal */}
        <section id="projects" className="projects-pin py-14">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-green-200 mb-6">
              Selected Projects
            </h2>

            <div
              ref={projectTrackRef}
              className="flex gap-6 will-change-transform"
            >
              {PROJECTS.map((p, i) => (
                <article
                  key={i}
                  className="project-card min-w-[360px] rounded-xl p-4 bg-gradient-to-br from-black/40 to-white/3 border border-white/6 reveal"
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  <div className="h-44 mb-3 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--g1)] to-[var(--g2)]" />
                    <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg">
                      {p.title}
                    </div>
                  </div>

                  <div className="font-semibold text-green-100">{p.title}</div>
                  <div className="text-xs text-green-200/60">
                    {p.tech} — {p.date}
                  </div>
                  <p className="mt-2 text-sm text-green-50/80">
                    Short description of the project and key technical
                    highlights.
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <a href={p.link} className="text-[var(--g1)] font-medium">
                      View
                    </a>
                    <div className="text-green-200/40 text-xs">→</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-green-200 mb-6">
              Experience
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl p-5 bg-white/3 border border-white/6 reveal">
                <div className="font-semibold text-green-100">
                  Technical Artist Intern — Nukebox Studios
                </div>
                <div className="text-sm text-green-200/60 mt-1">
                  Jun 2025 — Jul 2025
                </div>
                <ul className="mt-3 list-disc pl-5 text-green-50/90">
                  <li>
                    Built shaders & VFX; integrated UE5 assets and optimized
                    draw calls.
                  </li>
                  <li>Reduced memory footprint via atlas & LOD strategies.</li>
                </ul>
              </div>

              <div className="rounded-xl p-5 bg-white/3 border border-white/6 reveal">
                <div className="font-semibold text-green-100">
                  Level Designer — Shikshaverse
                </div>
                <div className="text-sm text-green-200/60 mt-1">
                  Oct 2023 — Dec 2023
                </div>
                <ul className="mt-3 list-disc pl-5 text-green-50/90">
                  <li>
                    Designed biology-themed levels, shipped playable content.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl text-green-200 font-bold mb-4">Contact</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-white/4 border border-white/6">
                <div className="text-sm text-green-100 font-semibold">
                  Email
                </div>
                <div className="text-green-200/60 mt-1">{PERSON.email}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/4 border border-white/6">
                <div className="text-sm text-green-100 font-semibold">
                  Location
                </div>
                <div className="text-green-200/60 mt-1">{PERSON.location}</div>
              </div>
              <div className="rounded-xl p-4 bg-white/4 border border-white/6">
                <div className="text-sm text-green-100 font-semibold">
                  Links
                </div>
                <div className="mt-2 flex gap-2">
                  <a href={PERSON.links.github} className="text-[var(--g1)]">
                    GitHub
                  </a>
                  <a href={PERSON.links.linkedin} className="text-[var(--g2)]">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8">
        <div className="max-w-6xl mx-auto px-6 text-sm text-green-200/60">
          © {new Date().getFullYear()} {PERSON.name} — built with Next.js + GSAP
        </div>
      </footer>
    </div>
  );
}
