export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    Home: '/',
    Products: '/products',
    Cart: '/cart',
    About: '/#sobre',
    Contact: '/#contato',
    ProductDetail: '/product/:id',
  };

  return routes[pageName] ?? '/';
}

// Mantém só os dígitos (wa.me não aceita +, espaços, parênteses ou traços)
export function whatsappUrl(phone?: string, message?: string): string | null {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

// Aceita "@marca", "marca" ou a URL completa do perfil
export function instagramUrl(handle?: string): string | null {
  const value = (handle ?? '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://instagram.com/${value.replace(/^@/, '')}`;
}