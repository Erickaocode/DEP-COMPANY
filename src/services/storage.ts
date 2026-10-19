import { PRODUCTS, STORE_SETTINGS } from '@/data/catalog'
import { Product, CartItem, StoreSettings } from '@/types'

// ========================
// Products (catálogo estático em src/data/catalog.ts)
// ========================
export async function getProducts(): Promise<Product[]> {
  return PRODUCTS
}

export async function getProduct(id: string): Promise<Product | null> {
  return PRODUCTS.find(p => p.id === id) ?? null
}

// ========================
// Store Settings
// ========================
export async function getStoreSettings(): Promise<StoreSettings | null> {
  return STORE_SETTINGS
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
