import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPageUrl } from '@/utils'

type HeaderProps = {
  storeName?: string
  logoUrl?: string
  cartCount?: number
}

export default function Header({
  storeName = 'minhaloja',
  logoUrl,
  cartCount = 0,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Início', href: createPageUrl('Home') },
    { label: 'Produtos', href: createPageUrl('Products') },
    { label: 'Sobre', href: createPageUrl('About') },
    { label: 'Contato', href: createPageUrl('Contact') },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to={createPageUrl('Home')} className="font-serif text-xl font-medium tracking-tight">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 w-auto" />
            ) : (
              <span>{storeName}</span>
            )}
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {/* Carrinho */}
            <Link to={createPageUrl('Cart')} className="relative p-1.5">
              <ShoppingBag size={22} strokeWidth={1.8} className="text-neutral-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Botão hamburger (mobile) */}
            <button
              className="md:hidden p-1.5 text-neutral-700"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile com animação */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              key="mobile-nav"
              className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-neutral-100 px-6 py-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-lg text-neutral-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}