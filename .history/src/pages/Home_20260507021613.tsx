import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import HeroSection from '@/components/store/HeroSection'
import ProductCard from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { StoreSettings, Product, CartItem } from '@/types'
import { getStoreSettings, getProducts, getCartItems } from '@/services/storage'
import { useState, useEffect } from 'react'

export default function Home() {
  const [settings, setSettings] = useState<StoreSettings>({ store_name: 'Minha Loja' })
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const s = getStoreSettings()
    if (s) setSettings(s)
    setProducts(getProducts().filter(p => p.featured))
    setCartItems(getCartItems())
    setIsLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-white">
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

      {/* Featured Products */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 mb-4">
              Destaques
            </h2>
            <div className="w-12 h-px bg-neutral-900 mx-auto" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-500 mb-2">Nenhum produto em destaque ainda</p>
              <p className="text-sm text-neutral-400">
                Adicione produtos com a opção "destaque" ativada
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
                Nossa História
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Cada peça é cuidadosamente selecionada para trazer qualidade e
                estilo ao seu guarda-roupa.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Com materiais premium e atenção aos detalhes, criamos roupas que
                você vai amar usar todos os dias.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square bg-neutral-800 flex items-center justify-center"
            >
              <span className="text-neutral-600 text-sm tracking-widest uppercase">
                Sua marca aqui
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer
        storeName={settings.store_name}
        instagram={settings.instagram}
        whatsapp={settings.whatsapp}
      />
    </div>
  )
}