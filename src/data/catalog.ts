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
  hero_image_url: '/hero.png',
  tagline: '',
  instagram: '@deplow.br',
  whatsapp: '5511994842434',
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
  {
    id: 'polo-essential',
    name: 'Camisa polo Dep low',
    description:
      'DEP LOW — Polo Essential\n\n' +
      'Minimalista, versátil e atemporal.\n' +
      'A Polo Essential da DEP LOW foi criada para quem carrega estilo sem precisar chamar atenção. Com visual clean e identidade urbana, a peça combina conforto, presença e autenticidade em cada detalhe.\n\n' +
      'O logo discreto no peito reforça a essência da marca:\n' +
      'base, foco, constância e evolução.\n\n' +
      'Confeccionada com tecido premium e caimento moderno, entrega conforto no dia a dia sem perder a estética streetwear minimalista.\n\n' +
      'Detalhes\n' +
      'Modelagem confortável\n' +
      'Gola polo estruturada\n' +
      'Logo frontal minimalista\n' +
      'Acabamento premium\n' +
      'Identidade discreta e urbana\n' +
      'Preto e branco monocromático\n\n' +
      'DEP LOW — Mais que roupa. Um estilo de vida.',
    price: 110,
    image_url: '/products/polo-essential.png',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'polo',
    featured: true,
  },
]
