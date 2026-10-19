import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import { motion } from 'framer-motion'
import { Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { Product, CartItem, StoreSettings } from '@/types'
import { getProduct, getStoreSettings, addCartItem, getCartItems, countCartItems } from '@/services/storage'

type ProductDetailProps = {
  cartItems: CartItem[]
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export default function ProductDetail({ cartItems, setCartItems }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [settings, setSettings] = useState<StoreSettings>({ store_name: 'DEP LOW' })
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    async function load() {
      const [p, s, c] = await Promise.all([
        id ? getProduct(id) : null,
        getStoreSettings(),
        getCartItems(),
      ])
      setProduct(p)
      if (s) setSettings(s)
      setCartItems(c)
      setLoading(false)
    }
    load()
  }, [id, setCartItems])

  const handleAddToCart = async () => {
    if (!product) return
    if (!selectedSize) { toast.error('Selecione um tamanho'); return }

    setAdding(true)
    try {
      const newItem = await addCartItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        size: selectedSize,
        quantity,
      })
      if (newItem) {
        setCartItems(prev => {
          const exists = prev.find(i => i.id === newItem.id)
          return exists ? prev.map(i => i.id === newItem.id ? newItem : i) : [...prev, newItem]
        })
        toast.success('Adicionado ao carrinho!')
      }
    } catch {
      toast.error('Erro ao adicionar ao carrinho')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Produto não encontrado</p>
        <Link to="/products" className="text-neutral-900 underline text-sm">Ver coleção</Link>
      </div>
    )
  }

  const sizes = product.sizes ?? ['P', 'M', 'G', 'GG']

  return (
    <div className="min-h-screen bg-white">
      <Header storeName={settings.store_name} logoUrl={settings.logo_url} cartCount={countCartItems(cartItems)} />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para coleção
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="aspect-[3/4] bg-neutral-100 overflow-hidden">
              {product.image_url
                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">Sem imagem</div>
              }
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
              <div className="flex-1">
                {product.category && (
                  <span className="text-xs tracking-widest text-neutral-500 uppercase mb-4 block">{product.category}</span>
                )}
                <h1 className="text-3xl md:text-4xl font-light mb-4">{product.name}</h1>
                <p className="text-2xl mb-8">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                {product.description && <p className="text-neutral-600 mb-10 leading-relaxed">{product.description}</p>}

                <div className="mb-8">
                  <h3 className="text-xs tracking-widest text-neutral-500 uppercase mb-4">Tamanho</h3>
                  <div className="flex gap-3 flex-wrap">
                    {sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 border text-sm font-medium transition-all ${
                          selectedSize === size ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 hover:border-neutral-600'
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xs tracking-widest text-neutral-500 uppercase mb-4">Quantidade</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-neutral-600 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-neutral-600 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Button onClick={handleAddToCart} disabled={adding}
                className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white uppercase tracking-widest text-sm rounded-none">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar ao Carrinho'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer instagram={settings.instagram} whatsapp={settings.whatsapp} />
    </div>
  )
}