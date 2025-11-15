// components/Footer.tsx
'use client';

import React, { JSX } from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {/* Simple avatar / monogram */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-semibold text-white">
                SS
              </div>
            </div>

            <div>
              <div className="text-lg font-semibold text-white">Sarthak Som Singh</div>
              <div className="mt-1 text-sm text-slate-300">+91-9810338374</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:sarthaksomsingh2003@gmail.com"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-sm text-slate-100 hover:brightness-105 transition"
              aria-label="Send email"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 6.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Gmail
            </a>

            <a
              href="https://www.artstation.com/infernosar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-sm text-slate-100 hover:brightness-105 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 21h18L12 3 3 21z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ArtStation
            </a>

            <a
              href="https://www.linkedin.com/in/sarthak-som-singh-06409625a"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-sm text-slate-100 hover:brightness-105 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 9v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M6 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM10 17v-5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              LinkedIn
            </a>

            <a
              href="https://github.com/sarcasm18"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-sm text-slate-100 hover:brightness-105 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.49 0-.24-.01-.86-.01-1.69-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1.01.07 1.55 1.04 1.55 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.26-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85.004 1.7.115 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.4.21 2.44.11 2.7.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" stroke="currentColor" strokeWidth="0.3" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          © {new Date().getFullYear()} Sarthak Som Singh — built with Next.js & GSAP
        </div>
      </div>
    </footer>
  );
}
