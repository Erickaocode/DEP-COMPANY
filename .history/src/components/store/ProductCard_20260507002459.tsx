import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        to={createPageUrl(`ProductDetail?id=${product.id}`)}
        className="group block"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-300 text-sm tracking-widest uppercase">
                Sem imagem
              </span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Featured Badge */}
          {product.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-neutral-900 text-white text-xs tracking-widest uppercase">
              Destaque
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium tracking-wide text-neutral-900 group-hover:text-neutral-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500">
            R$ {product.price?.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}