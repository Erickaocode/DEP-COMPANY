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
  storeName,
  logoUrl,
  cartCount = 0
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      {/* resto do código igual */}
    </header>
  )
}
