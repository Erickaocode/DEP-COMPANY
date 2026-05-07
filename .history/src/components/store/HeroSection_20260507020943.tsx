import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type HeroSectionProps = {
  heroImage?: string;
  storeName?: string;
  tagline?: string;
};

export default function HeroSection({ heroImage, storeName, tagline }: HeroSectionProps) {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] bg-neutral-100">
      {/* Background Image */}
      {heroImage ? (
        <img
          src={heroImage}
          alt={`${storeName || 'Loja'} - imagem principal`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-100" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6">
              {storeName || 'DEP LOW'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light mb-10 leading-relaxed">
              {tagline || 'Descubra peças únicas que definem seu estilo'}
            </p>
            <Link
              to={createPageUrl('Products')}
              className="group inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 text-sm tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              Ver Coleção
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-16 bg-white/50" />
      </motion.div>
    </section>
  );
}