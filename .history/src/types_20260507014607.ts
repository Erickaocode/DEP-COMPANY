export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  sizes?: string[];
  category?: 'camiseta' | 'camisa' | 'polo' | 'regata';
  featured?: boolean;
  stock?: number;
};

export type CartItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  size: string;
  quantity: number;
};

export type StoreSettings = {
  store_name: string;
  logo_url?: string;
  hero_image_url?: string;
  tagline?: string;
  instagram?: string;
  whatsapp?: string;
};