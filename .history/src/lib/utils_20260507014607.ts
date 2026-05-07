export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    Home: '/',
    Products: '/products',
    Cart: '/cart',
    ProductDetail: '/product/:id',
    AdminSettings: '/admin',
    AddProduct: '/add-product',
  };

  return routes[pageName] ?? '/';
}
