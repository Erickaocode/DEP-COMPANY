import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import { motion } from 'framer-motion';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Product, CartItem, StoreSettings } from '@/types';

type ProductDetailProps = {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  storeSettings: StoreSettings;
};

export default function ProductDetail({
  products,
  cartItems,
  setCartItems,
  storeSettings,
}: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Produto não encontrado</p>
        <Link to="/" className="text-neutral-900 underline text-sm">
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const sizes = product.sizes ?? ['P', 'M', 'G', 'GG'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Selecione um tamanho');
      return;
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
      size: selectedSize,
      quantity,
    };

    setCartItems(prev => [...prev, newItem]);
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        storeName={storeSettings.store_name}
        logoUrl={storeSettings.logo_url}
        cartCount={cartItems.length}
      />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para coleção
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-[3/4] bg-neutral-100 overflow-hidden"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                  Sem imagem
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="flex-1">
                {product.category && (
                  <span className="text-xs tracking-widest text-neutral-500 uppercase mb-4 block">
                    {product.category}
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-light mb-4">
                  {product.name}
                </h1>

                <p className="text-2xl mb-8">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>

                {product.description && (
                  <p className="text-neutral-600 mb-10 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Sizes */}
                <div className="mb-8">
                  <h3 className="text-xs tracking-widest text-neutral-500 uppercase mb-4">
                    Tamanho
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-10">
                  <h3 className="text-xs tracking-widest text-neutral-500 uppercase mb-4">
                    Quantidade
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-neutral-600 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-neutral-600 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white uppercase tracking-widest text-sm rounded-none"
              >
                Adicionar ao Carrinho
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer
        storeName={storeSettings.store_name}
        instagram={storeSettings.instagram}
        whatsapp={storeSettings.whatsapp}
      />
    </div>
  );
}