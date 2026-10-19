import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import HeroSection from '@/components/store/HeroSection'
import ProductCard from '@/components/store/ProductCard'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { StoreSettings, Product, CartItem } from '@/types'
import { getStoreSettings, getProducts, getCartItems, countCartItems } from '@/services/storage'

function DepLowLogoLarge() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs">
      <text
        x="200" y="120"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Arial Bold', sans-serif"
        fontWeight="900"
        fontSize="100"
        fill="white"
        letterSpacing="-2"
      >DEP</text>
      <line x1="60" y1="135" x2="340" y2="135" stroke="white" strokeWidth="4"/>
      <text
        x="200" y="220"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Arial Bold', sans-serif"
        fontWeight="900"
        fontSize="100"
        fill="white"
        letterSpacing="-2"
      >LOW</text>
      <polygon points="200,255 178,238 222,238" fill="white"/>
    </svg>
  )
}

export default function Home() {
  const [settings, setSettings] = useState<StoreSettings>({ store_name: 'DEP LOW' })
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { hash } = useLocation()

  useEffect(() => {
    async function load() {
      const [s, p, c] = await Promise.all([
        getStoreSettings(),
        getProducts(),
        getCartItems(),
      ])
      if (s) setSettings(s)
      setProducts(p.filter(prod => prod.featured))
      setCartItems(c)
      setLoading(false)
    }
    load()
  }, [])

  // Rola até a seção do link (#sobre, #contato) depois que a página carrega
  useEffect(() => {
    if (!hash || loading) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash, loading])

  return (
    <div className="min-h-screen bg-black">
      <Header storeName={settings.store_name} logoUrl={settings.logo_url} cartCount={countCartItems(cartItems)} />
      <HeroSection heroImage={settings.hero_image_url} storeName={settings.store_name} tagline={settings.tagline} />

      <section className="py-24 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono mb-3">DEP LOW /</p>
            <h2 className="text-5xl font-black tracking-tighter uppercase text-white">Destaques</h2>
            <div className="w-12 h-px bg-white mt-4" />
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
              {products.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-black">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-zinc-800">
              <p className="text-zinc-600 font-mono text-sm mb-4">// NENHUM DESTAQUE</p>
              <p className="text-zinc-700 text-xs tracking-widest">Novidades em breve</p>
            </div>
          )}
        </div>
      </section>

      <section id="sobre" className="py-24 bg-black text-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono mb-4">SOBRE A MARCA /</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">Nossa História</h2>
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
              className="aspect-square bg-black border border-zinc-800 flex items-center justify-center"
            >
              <DepLowLogoLarge />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer instagram={settings.instagram} whatsapp={settings.whatsapp} />
    </div>
  )
}