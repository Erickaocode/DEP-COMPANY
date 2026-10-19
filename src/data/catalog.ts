import { Product, StoreSettings } from '@/types'

// =====================================================================
// Catálogo da loja — editar aqui para mudar o site.
//
// Fotos: coloque o arquivo em public/products/ e use o caminho
// começando com /products/ (ex.: '/products/camiseta-preta.jpg').
// Banner do hero e logo: public/ (ex.: '/hero.jpg').
// =====================================================================

export const STORE_SETTINGS: StoreSettings = {
  store_name: 'DEP LOW',
  logo_url: '',
  hero_image_url: '',
  tagline: '',
  instagram: '',
  whatsapp: '',
}

// A ordem aqui é a ordem em que aparecem no site.
export const PRODUCTS: Product[] = [
  // Exemplo:
  // {
  //   id: 'camiseta-preta',            // único, vira a URL: /product/camiseta-preta
  //   name: 'Camiseta Preta',
  //   description: 'Algodão 100%, modelagem oversized.',
  //   price: 89.9,
  //   image_url: '/products/camiseta-preta.jpg',
  //   sizes: ['P', 'M', 'G', 'GG'],
  //   category: 'camiseta',            // camiseta | camisa | polo | regata | calca | bermuda
  //   featured: true,                  // aparece em "Destaques" na Home
  // },
]
