import { Product, CartItem, StoreSettings } from '@/types';

// ========================
// KEYS do localStorage
// ========================
const KEYS = {
  products: 'dep_low:products',
  cart: 'dep_low:cart',
  settings: 'dep_low:settings',
};

// ========================
// Helpers
// ========================
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
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ========================
// Products
// ========================
export const productApi = {
  list(filters?: { featured?: boolean; category?: string }): Product[] {
    let products = getItem<Product>(KEYS.products);

    if (filters?.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }

    return products;
  },

  get(id: string): Product | null {
    const products = getItem<Product>(KEYS.products);
    return products.find(p => p.id === id) ?? null;
  },

  create(data: Omit<Product, 'id'>): Product {
    const products = getItem<Product>(KEYS.products);
    const newProduct: Product = { ...data, id: generateId() };
    setItem(KEYS.products, [...products, newProduct]);
    return newProduct;
  },

  update(id: string, data: Partial<Omit<Product, 'id'>>): Product | null {
    const products = getItem<Product>(KEYS.products);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated = { ...products[index], ...data };
    products[index] = updated;
    setItem(KEYS.products, products);
    return updated;
  },

  delete(id: string): boolean {
    const products = getItem<Product>(KEYS.products);
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    setItem(KEYS.products, filtered);
    return true;
  },
};

// ========================
// Cart
// ========================
export const cartApi = {
  list(): CartItem[] {
    return getItem<CartItem>(KEYS.cart);
  },

  add(data: Omit<CartItem, 'id'>): CartItem {
    const cart = getItem<CartItem>(KEYS.cart);

    // Se já existe o mesmo produto + tamanho, aumenta a quantidade
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
  },

  remove(id: string): boolean {
    const cart = getItem<CartItem>(KEYS.cart);
    const filtered = cart.filter(item => item.id !== id);
    if (filtered.length === cart.length) return false;
    setItem(KEYS.cart, filtered);
    return true;
  },

  clear(): void {
    setItem(KEYS.cart, []);
  },

  count(): number {
    return getItem<CartItem>(KEYS.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  },
};

// ========================
// Store Settings
// ========================
export const settingsApi = {
  get(): StoreSettings | null {
    return getObject<StoreSettings>(KEYS.settings);
  },

  save(data: StoreSettings): StoreSettings {
    setItem(KEYS.settings, data);
    return data;
  },
};

// ========================
// API unificada (compatível com api.get / api.post / api.put / api.delete)
// ========================
type ApiResponse<T> = Promise<{ data: T }>;

function ok<T>(data: T): { data: T } {
  return { data };
}

export const api = {
  async get(url: string, options?: { params?: Record<string, unknown> }): ApiResponse<unknown> {
    const params = options?.params ?? {};

    if (url === '/settings') {
      return ok(settingsApi.get() ?? ({} as StoreSettings));
    }

    if (url === '/products') {
      return ok(productApi.list(params as { featured?: boolean; category?: string }));
    }

    if (url.startsWith('/products/')) {
      const id = url.replace('/products/', '');
      return ok(productApi.get(id));
    }

    if (url === '/cart') {
      return ok(cartApi.list());
    }

    throw new Error(`[api] Rota não encontrada: GET ${url}`);
  },

  async post(url: string, body: unknown): ApiResponse<unknown> {
    if (url === '/products') {
      return ok(productApi.create(body as Omit<Product, 'id'>));
    }

    if (url === '/cart') {
      return ok(cartApi.add(body as Omit<CartItem, 'id'>));
    }

    if (url === '/settings') {
      return ok(settingsApi.save(body as StoreSettings));
    }

    throw new Error(`[api] Rota não encontrada: POST ${url}`);
  },

  async put(url: string, body: unknown): ApiResponse<unknown> {
    if (url.startsWith('/products/')) {
      const id = url.replace('/products/', '');
      return ok(productApi.update(id, body as Partial<Product>));
    }

    if (url === '/settings') {
      return ok(settingsApi.save(body as StoreSettings));
    }

    throw new Error(`[api] Rota não encontrada: PUT ${url}`);
  },

  async delete(url: string): ApiResponse<unknown> {
    if (url.startsWith('/products/')) {
      const id = url.replace('/products/', '');
      return ok(productApi.delete(id));
    }

    if (url.startsWith('/cart/')) {
      const id = url.replace('/cart/', '');
      return ok(cartApi.remove(id));
    }

    throw new Error(`[api] Rota não encontrada: DELETE ${url}`);
  },
};