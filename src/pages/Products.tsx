import { useState } from 'react';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { products } from '@/data/products';
import { cartItems } from '@/data/cart';
import { storeSettings } from '@/data/storeSettings';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'camiseta', label: 'Camisetas' },
    { value: 'camisa', label: 'Camisas' },
    { value: 'polo', label: 'Polo' },
    { value: 'regata', label: 'Regatas' },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header
        storeName={storeSettings.store_name}
        cartCount={cartItems.length}
      />

      {/* Page Header */}
      <div className="pt-32 pb-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4"
          >
            Coleção
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="w-12 h-px bg-neutral-900 mx-auto"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-neutral-200 sticky top-20 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            {categories.map(cat => (
              <Button
                key={cat.value}
                variant="ghost"
                onClick={() => setActiveCategory(cat.value)}
                className={`text-sm tracking-wider uppercase whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-
