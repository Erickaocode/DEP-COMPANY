import { supabase } from '@/lib/supabase'
import { Product, CartItem, StoreSettings } from '@/types'

// ========================
// Products
// ========================
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error(error); return null }
  return data as Product
}

export async function saveProduct(data: Omit<Product, 'id'>): Promise<Product | null> {
  const { data: result, error } = await supabase
    .from('products')
    .insert(data)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return result as Product
}

export async function updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  const { data: result, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return result as Product
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) { console.error(error); return false }
  return true
}

// ========================
// Store Settings
// ========================
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) { return null }
  return data as StoreSettings
}

export async function saveStoreSettings(settings: StoreSettings): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .upsert({ ...settings, id: 1 })
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data as StoreSettings
}

// ========================
// Cart (por visitante, salvo no navegador)
// ========================
const CART_KEY = 'dep_low:cart'

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch (error) {
    console.error(error)
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  return readCart()
}

export async function addCartItem(item: Omit<CartItem, 'id'>): Promise<CartItem | null> {
  const cart = readCart()

  // Se já existe o mesmo produto + tamanho, soma a quantidade
  const existing = cart.find(i => i.product_id === item.product_id && i.size === item.size)
  if (existing) {
    const updated = { ...existing, quantity: existing.quantity + item.quantity }
    writeCart(cart.map(i => (i.id === existing.id ? updated : i)))
    return updated
  }

  const created: CartItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
  writeCart([...cart, created])
  return created
}

export async function removeCartItem(id: string): Promise<boolean> {
  const cart = readCart()
  const filtered = cart.filter(i => i.id !== id)
  writeCart(filtered)
  return filtered.length !== cart.length
}

export async function clearCart(): Promise<void> {
  writeCart([])
}

export function countCartItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// ========================
// Upload de imagem
// ========================
export async function uploadImage(file: File, bucket: string = 'images'): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { cacheControl: '3600', upsert: false })

  if (error) { console.error(error); return null }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}