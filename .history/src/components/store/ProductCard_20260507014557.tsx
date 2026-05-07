import { Link } from 'react-router-dom';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-white transition hover:border-white">
      <div className="overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-[400px] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-[400px] w-full bg-zinc-900 flex items-center justify-center text-zinc-600 text-sm">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        {product.category && (
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{product.category}</p>
        )}
        <p className="mt-2 text-zinc-400">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>

        <button className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-300">
          Ver produto
        </button>
      </div>
    </Link>
  );
}