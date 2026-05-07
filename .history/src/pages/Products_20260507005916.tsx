import { useState, useEffect } from 'react'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ProductCard from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Product, CartItem, StoreSettings } from '@/types'
import { getProducts, getCartItems, getStoreSettings } from '@/services/storage'

type Category = {
  value: 'all' | 'camiseta' | 'camisa' | 'polo' | 'regata'
  label: string
}

const CATEGORIES: Category[] = [
  { value: 'all', label: 'Todos' },
  { value: 'camiseta', label: 'Camisetas' },
  { value: 'camisa', label: 'Camisas' },
  { value: 'polo', label: 'Polo' },
  { value: 'regata', label: 'Regatas' },
]

type ProductsProps = {}

export default function Products({}: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category['value']>('all')

  useEffect(() => {
    setProducts(getProducts())
    setCartItems(getCartItems())
    setStoreSettings(getStoreSettings())
  }, [])

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  if (!storeSettings) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        storeName={storeSettings.store_name}
        logoUrl={storeSettings.logo_url}
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
            {CATEGORIES.map(cat => (
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
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <p className="text-neutral-500 mb-2">Nenhum produto nesta categoria</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="text-sm text-neutral-900 underline"
              >
                Ver todos os produtos
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer
        storeName={storeSettings.store_name}
        instagram={storeSettings.instagram}
        whatsapp={storeSettings.whatsapp}
      />
    </div>
  )
}
