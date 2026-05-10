import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  , Save, Store,
  MessageCircle, Instagram, Plus, Pencil, Trash2, Image
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Product, StoreSettings } from '@/types'
import { getStoreSettings, saveStoreSettings, getProducts, deleteProduct } from '@/services/storage'

const defaultSettings: StoreSettings = {
  store_name: '',
  logo_url: '',
  hero_image_url: '',
  tagline: '',
  instagram: '',
  whatsapp: '',
}

export default function AdminSettings() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState<StoreSettings>(defaultSettings)

  const loadData = useCallback(() => {
    const s = getStoreSettings()
    if (s) setFormData(s)
    setProducts(getProducts())
  }, [])

  useEffect(() => {
  const handler = () => {
    const s = getStoreSettings()
    if (s) setFormData(s)
    setProducts(getProducts())
  }
  handler()
  window.addEventListener('storage', handler)
  window.addEventListener('focus', handler)
  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener('focus', handler)
  }
}, [])

  function handleSave() {
    saveStoreSettings(formData)
    toast.success('Configurações salvas com sucesso!')
  }

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo_url' | 'hero_image_url'
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id)
    setProducts(getProducts())
    toast.success('Produto removido!')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-lg font-medium">Painel Administrativo</h1>
          <Link to="/"><Button variant="outline">Ver Loja</Button></Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <Store size={18} /> Dados da Loja
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Nome da Loja</Label>
                    <Input value={formData.store_name} onChange={e => setFormData(prev => ({ ...prev, store_name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Slogan</Label>
                    <Textarea value={formData.tagline ?? ''} onChange={e => setFormData(prev => ({ ...prev, tagline: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    {formData.logo_url && <img src={formData.logo_url} alt="Logo" className="h-16 object-contain mb-2" />}
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} className="text-sm text-neutral-600" />
                  </div>
                  <div className="space-y-2">
                    <Label>Banner</Label>
                    {formData.hero_image_url && <img src={formData.hero_image_url} alt="Banner" className="h-24 object-cover w-full rounded mb-2" />}
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'hero_image_url')} className="text-sm text-neutral-600" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><Instagram size={14} /> Instagram</Label>
                      <Input value={formData.instagram ?? ''} onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))} placeholder="@suamarca" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1"><MessageCircle size={14} /> WhatsApp</Label>
                      <Input value={formData.whatsapp ?? ''} onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="5511999999999" />
                    </div>
                  </div>
                  <Button onClick={handleSave}><Save size={16} className="mr-2" />Salvar</Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Produtos ({products.length})</CardTitle>
                <Link to="/add-product"><Button><Plus size={16} className="mr-1" /> Novo</Button></Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.length === 0 && (
                  <p className="text-neutral-500 py-8 text-center">Nenhum produto cadastrado</p>
                )}
                {products.map(p => (
                  <div key={p.id} className="flex gap-4 border border-neutral-100 p-4 rounded-lg">
                    <div className="w-16 h-20 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="object-cover w-full h-full" />
                        : <Image size={20} className="text-neutral-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-sm text-neutral-500">R$ {p.price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex gap-2 mt-1">
                        {p.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Destaque</span>}
                        {p.stock !== undefined && <span className="text-xs text-neutral-400">Estoque: {p.stock}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to={`/add-product?id=${p.id}`}>
                        <Button variant="outline" size="icon"><Pencil size={14} /></Button>
                      </Link>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(p.id)}>
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}