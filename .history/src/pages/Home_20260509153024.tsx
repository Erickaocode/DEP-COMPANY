import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import HeroSection from '@/components/store/HeroSection'
import ProductCard from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { StoreSettings, Product, CartItem } from '@/types'
import { getStoreSettings, getProducts, getCartItems } from '@/services/storage'
import { useState, useEffect } from 'react'

export default function Home() {
  const [settings, setSettings] = useState<StoreSettings>({ store_name: 'DEP LOW' })
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])


  useEffect(() => {
  const handler = () => {
    const s = getStoreSettings()
    if (s) setSettings(s)
    setProducts(getProducts().filter(p => p.featured))
    setCartItems(getCartItems())
  }
  handler()
  window.addEventListener('storage', handler)
  window.addEventListener('focus', handler)
  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener('focus', handler)
  }
}, [])

  return (
    <div className="min-h-screen bg-black">
      <Header
        storeName={settings.store_name}
        logoUrl={settings.logo_url}
        cartCount={cartItems.length}
      />

      <HeroSection
        heroImage={settings.hero_image_url}
        storeName={settings.store_name}
        tagline={settings.tagline}
      />

      <section className="py-24 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono mb-3">DEP LOW /</p>
            <h2 className="text-5xl font-black tracking-tighter uppercase text-white">
              Destaques
            </h2>
            <div className="w-12 h-px bg-white mt-4" />
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-zinc-800">
              <p className="text-zinc-600 font-mono text-sm mb-4">// NENHUM DESTAQUE</p>
              <p className="text-zinc-700 text-xs tracking-widest">
                Ative "destaque" em um produto no painel admin
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono mb-4">SOBRE A MARCA /</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">
                Nossa História
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Cada peça é cuidadosamente selecionada para trazer qualidade e estilo ao seu guarda-roupa.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Com materiais premium e atenção aos detalhes, criamos roupas que você vai amar usar todos os dias.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center"
            >
              <span className="text-zinc-700 text-xs tracking-widest uppercase font-mono">
                Sua foto aqui
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}