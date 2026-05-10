import { Product, CartItem, StoreSettings } from '@/types';

const KEYS = {
  products: 'dep_low:products',
  cart: 'dep_low:cart',
  settings: 'dep_low:settings',
};

function getItem<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function getObject<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('storage'));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getProducts(): Product[] {
  return getItem<Product>(KEYS.products);
}

export function getProduct(id: string): Product | null {
  return getProducts().find(p => p.id === id) ?? null;
}

export function saveProduct(data: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newProduct: Product = { ...data, id: generateId() };
  setItem(KEYS.products, [...products, newProduct]);
  return newProduct;
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  const updated = { ...products[index], ...data };
  products[index] = updated;
  setItem(KEYS.products, products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  setItem(KEYS.products, filtered);
  return true;
}

export function getCartItems(): CartItem[] {
  return getItem<CartItem>(KEYS.cart);
}

export function addCartItem(data: Omit<CartItem, 'id'>): CartItem {
  const cart = getCartItems();
  const existing = cart.find(
    item => item.product_id === data.product_id && item.size === data.size
  );
  if (existing) {
    existing.quantity += data.quantity;
    setItem(KEYS.cart, cart);
    return existing;
  }
  const newItem: CartItem = { ...data, id: generateId() };
  setItem(KEYS.cart, [...cart, newItem]);
  return newItem;
}

export function removeCartItem(id: string): boolean {
  const cart = getCartItems();
  const filtered = cart.filter(item => item.id !== id);
  if (filtered.length === cart.length) return false;
  setItem(KEYS.cart, filtered);
  return true;
}

export function clearCart(): void {
  setItem(KEYS.cart, []);
}

export function getStoreSettings(): StoreSettings | null {
  return getObject<StoreSettings>(KEYS.settings);
}

export function saveStoreSettings(data: StoreSettings): StoreSettings {
  setItem(KEYS.settings, data);
  return data;
}