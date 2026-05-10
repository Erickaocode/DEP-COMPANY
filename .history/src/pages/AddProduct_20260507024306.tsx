import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save, Upload, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Product } from '@/types'
import { getProduct, saveProduct, updateProduct } from '@/services/storage'

type FormData = {
  name: string
  description: string
  price: string
  image_url: string
  category: string
  sizes: string[]
  featured: boolean
  stock: number
}

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG']

const CATEGORIES = [
  { value: 'camiseta', label: 'Camisetas' },
  { value: 'camisa', label: 'Camisas' },
  { value: 'polo', label: 'Polo' },
  { value: 'regata', label: 'Regatas' },
]

export default function AddProduct() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('id')
  const isEditing = !!productId

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    stock: 0,
  })

  useEffect(() => {
    if (!productId) return
    const product = getProduct(productId)
    if (product) {
      setFormData({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price?.toString() ?? '',
        image_url: product.image_url ?? '',
        category: product.category ?? '',
        sizes: product.sizes ?? ['P', 'M', 'G', 'GG'],
        featured: !!product.featured,
        stock: product.stock ?? 0,
      })
    }
    setIsLoading(false)
  }, [productId])

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    let imageUrl: string | null = null
    try {
      setUploading(true)
      imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, image_url: imageUrl as string }))
      toast.success('Imagem carregada!')
    } catch {
      toast.error('Erro ao enviar imagem')
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (formData.image_url?.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image_url)
    }
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Preencha nome, preço e categoria.')
      return
    }

    const payload: Omit<Product, 'id'> = {
      ...formData,
      price: Number(formData.price),
      category: formData.category as Product['category'],
    }

    if (isEditing && productId) {
      updateProduct(productId, payload)
    } else {
      saveProduct(payload)
    }

    toast.success(isEditing ? 'Produto atualizado!' : 'Produto criado!')
    navigate('/admin')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Camiseta Básica Branca"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o produto..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={e => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Produto em destaque</p>
                    <p className="text-xs text-neutral-500">Exibe na seção principal da loja</p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={value => setFormData(prev => ({ ...prev, featured: value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tamanhos disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {ALL_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-14 h-14 rounded-md border text-sm font-medium transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagem do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.image_url ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-neutral-200">
                    <img
                      src={formData.image_url}
                      alt="Preview do produto"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors bg-neutral-50">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-500">Clique para enviar uma imagem</span>
                        <span className="text-xs text-neutral-400 mt-1">PNG, JPG até 10MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImage}
                      disabled={uploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pb-10">
              <Link to="/admin">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                {isEditing ? 'Salvar alterações' : 'Criar produto'}
              </Button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  )
}