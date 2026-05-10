import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

type HeroSectionProps = {
  heroImage?: string;
  storeName?: string;
  tagline?: string;
};

const SLIDES = [
  {
    bg: '#18181b',
    label: 'NOVA COLEÇÃO',
    headline: 'VISTA A\nRUA.',
    sub: 'Peças que falam por você — antes mesmo de abrir a boca.',
    accent: '#E8FF00',
  },
  {
    bg: '#0a0a0a',
    label: 'ESSENTIALS',
    headline: 'MENOS\nRUÍDO.',
    sub: 'Streetwear que resiste ao tempo e às tendências.',
    accent: '#FF3B3B',
  },
  {
    bg: '#1c1917',
    label: 'DROP 01',
    headline: 'FEITO\nPRO ASFALTO.',
    sub: 'Do skate ao show. Da rua ao futuro.',
    accent: '#00CFFF',
  },
  {
    bg: '#0f0f0f',
    label: 'LIMITADO',
    headline: 'POUCOS.\nELEGIDOS.',
    sub: 'Edição limitada para quem sabe o que quer.',
    accent: '#FF8C00',
  },
  {
    bg: '#111827',
    label: 'INVERNO 2025',
    headline: 'FRIO\nNÃO PARA.',
    sub: 'Peças pesadas para dias que pedem presença.',
    accent: '#A78BFA',
  },
  {
    bg: '#14532d',
    label: 'COLLAB',
    headline: 'DOIS\nMUNDOS.',
    sub: 'Quando a rua encontra o estúdio.',
    accent: '#4ADE80',
  },
];

export default function HeroSection({ heroImage, storeName, tagline }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  const prev = () => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(p => (p + 1) % SLIDES.length);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">

      {/* Imagem de fundo FIXA — não recria ao trocar slide */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={storeName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Cor de fundo animada por slide — fica atrás da imagem se tiver */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0 z-0"
          style={{ backgroundColor: slide.bg }}
          initial={{ opacity: heroImage ? 0 : 1 }}
          animate={{ opacity: heroImage ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-10 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Accent color strip animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`strip-${current}`}
          className="absolute left-0 top-0 bottom-0 w-1 z-20"
          style={{ backgroundColor: slide.accent }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between px-8 lg:px-16 py-12">

        {/* Top label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mt-16"
          >
            <div className="w-8 h-px" style={{ background: slide.accent }} />
            <span className="text-xs tracking-[0.4em] font-mono" style={{ color: slide.accent }}>
              {slide.label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Main headline */}
        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1
                className="text-[clamp(4rem,12vw,10rem)] font-black text-white leading-none tracking-tighter whitespace-pre-line mb-6"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
              >
                {slide.headline}
              </h1>
              <p className="text-white/50 text-lg max-w-sm mb-10 font-light">
                {tagline || slide.sub}
              </p>
              <Link
                to={createPageUrl('Products')}
                className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase font-bold px-8 py-4 transition-all duration-300 hover:scale-105"
                style={{ background: slide.accent, color: '#000' }}
              >
                Ver Coleção
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? '2rem' : '0.4rem',
                  height: '0.4rem',
                  background: i === current ? slide.accent : 'rgba(255,255,255,0.25)',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-all flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-all flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side label */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <span
          className="text-xs tracking-[0.3em] font-mono text-white/20"
          style={{ writingMode: 'vertical-rl' }}
        >
          DEP LOW — {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}