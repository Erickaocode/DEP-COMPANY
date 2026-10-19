import { Link } from 'react-router-dom'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import { createPageUrl } from '@/utils'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-16 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 font-mono">ERRO 404 /</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Página não encontrada</h1>
        <Link
          to={createPageUrl('Products')}
          className="text-xs tracking-widest uppercase text-white border border-zinc-700 px-6 py-3 hover:border-white transition-colors"
        >
          Ver coleção
        </Link>
      </div>
      <Footer />
    </div>
  )
}
