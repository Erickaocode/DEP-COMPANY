import React, { useState } from 'react';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

import { cartItems as initialCart } from '@/data/cart';
import { storeSettings } from '@/data/storeSettings';

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCart);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removido');
  };

  const handleWhatsAppOrder = () => {
    if (!storeSettings.whatsapp) {
      toast.error('WhatsApp não configurado');
      return;
    }

    let message = `Olá! Gostaria de fazer um pedido:\n\n`;

    cartItems.forEach(item => {
      message += `• ${item.product_name} - Tam: ${item.size} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity)
        .toFixed(2)
        .replace('.', ',')}\n`;
    });

    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;

    const whatsappUrl = `https://wa.me/${storeSettings.whatsapp}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        storeName={storeSettings.store_name}
        cartCount={cartItems.length}
      />

      <div className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 mb-12 text-center"
          >
            Carrinho
          </motion.h1>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
              <p className="text-neutral-500 mb-6">Seu carrinho está vazio</p>
              <Link to={createPageUrl('Products')}>
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-sm tracking-widest uppercase rounded-none px-8 py-6">
                  Ver Coleção
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-6 mb-12">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-6 pb-6 border-b border-neutral-100"
                  >
                    <div className="w-24 h-32 bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-neutral-300" />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 mb-1">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Tamanho: {item.size}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-neutral-900">
                        R$ {(item.price * item.quantity)
                          .toFixed(2)
                          .replace('.', ',')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-neutral-400 hover:text-neutral-900 transition-colors self-start"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="bg-neutral-50 p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-lg font-medium">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <Button
                  onClick={handleWhatsAppOrder}
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white text-sm tracking-widest uppercase rounded-none flex items-center justify-center gap-3"
                >
                  Finalizar pelo WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
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
