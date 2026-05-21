import { useState } from 'react'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'

import { Product, CartItem, StoreSettings } from '@/types'

type Category = {
  value: 'all' | 'camiseta' | 'camisa' | 'polo' | 'regata' | 'calca' | 'bermuda'
  label: string
}

const CATEGORIES: Category[] = [
  { value: 'all', label: 'Todos' },
  { value: 'camiseta', label: 'Camisetas' },
  { value: 'camisa', label: 'Camisas' },
  { value: 'polo', label: 'Polo' },
  { value: 'regata', label: 'Regatas' },
  { value: 'calca', label: 'Calças' },
  { value: 'bermuda', label: 'Bermudas' },
]

type ProductsProps = {
  products: Product[]
  cartItems: CartItem[]
  storeSettings: StoreSettings
}

export default function Products({ products, cartItems, storeSettings }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState<Category['value']>('all')

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        storeName={storeSettings.store_name}
        logoUrl={storeSettings.logo_url}
        cartCount={cartItems.length}
      />

      {/* Page Header */}
      <div className="pt-32 pb-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between"
          >
            <div>
              <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono mb-3">DEP LOW /</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                Coleção
              </h1>
            </div>
            <p className="text-zinc-600 font-mono text-sm mb-2">
              {filteredProducts.length} peças
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-zinc-800 sticky top-16 bg-black z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            <SlidersHorizontal className="w-4 h-4 text-zinc-600 flex-shrink-0 mr-2" />
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-xs tracking-[0.2em] uppercase whitespace-nowrap px-4 py-2 transition-all duration-200 font-mono ${
                  activeCategory === cat.value
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-zinc-800"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <p className="text-zinc-600 font-mono text-sm mb-4">// NENHUM PRODUTO</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs tracking-widest uppercase text-white border border-zinc-700 px-6 py-3 hover:border-white transition-colors"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}