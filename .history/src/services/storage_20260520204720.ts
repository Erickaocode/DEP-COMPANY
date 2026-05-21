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
// Cart
// ========================
export async function getCartItems(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error(error); return [] }
  return data as CartItem[]
}

export async function addCartItem(item: Omit<CartItem, 'id'>): Promise<CartItem | null> {
  // Verifica se já existe o mesmo produto + tamanho
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('product_id', item.product_id)
    .eq('size', item.size)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + item.quantity })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) { console.error(error); return null }
    return data as CartItem
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert(item)
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data as CartItem
}

export async function removeCartItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
  if (error) { console.error(error); return false }
  return true
}

export async function clearCart(): Promise<void> {
  await supabase.from('cart_items').delete().neq('id', '')
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