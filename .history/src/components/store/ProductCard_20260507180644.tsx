import { Link } from 'react-router-dom';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block relative overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-all duration-500"
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 border border-zinc-700 flex items-center justify-center">
              <span className="text-zinc-600 text-xs font-mono">IMG</span>
            </div>
            <span className="text-zinc-700 text-xs tracking-widest">SEM FOTO</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs tracking-[0.3em] uppercase font-bold border border-white px-4 py-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Ver Produto
          </span>
        </div>

        {/* Category badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] tracking-[0.3em] uppercase font-mono bg-black/80 text-zinc-400 px-2 py-1">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-zinc-800">
        <h2 className="text-white font-bold text-sm tracking-wide uppercase truncate mb-1">
          {product.name}
        </h2>
        <p className="text-zinc-400 text-sm font-mono">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </Link>
  );
}