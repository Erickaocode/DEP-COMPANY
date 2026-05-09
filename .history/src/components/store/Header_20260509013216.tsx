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

function DepLowLogo({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="52" height="40" viewBox="0 0 104 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="52"
        y="34"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Arial Bold', sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={color}
        letterSpacing="-1"
      >
        DEP
      </text>
      <line x1="4" y1="38" x2="100" y2="38" stroke={color} strokeWidth="2.5"/>
      <text
        x="52"
        y="68"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Arial Bold', sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={color}
        letterSpacing="-1"
      >
        LOW
      </text>
      <polygon points="52,80 40,72 64,72" fill={color}/>
    </svg>
  )
}

export default function Header({
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center">
            <DepLowLogo color="white" />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs text-zinc-400 hover:text-white transition-colors tracking-widest uppercase font-mono"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Cart')} className="relative p-1.5">
              <ShoppingBag size={20} strokeWidth={1.5} className="text-zinc-400 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-1.5 text-zinc-400 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              key="mobile-nav"
              className="fixed top-16 left-0 right-0 z-50 bg-black border-b border-zinc-800 px-6 py-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xl text-white font-black tracking-tighter uppercase"
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