import { Instagram, MessageCircle } from 'lucide-react'
import { instagramUrl, whatsappUrl } from '@/utils'

type FooterProps = {
  instagram?: string
  whatsapp?: string
}

export default function Footer({ instagram, whatsapp }: FooterProps) {
  const igUrl = instagramUrl(instagram)
  const waUrl = whatsappUrl(whatsapp)

  return (
    <footer id="contato" className="border-t border-zinc-800 bg-black px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold tracking-[0.3em]">
          DEP LOW
        </h1>

        {(igUrl || waUrl) && (
          <div className="flex items-center gap-6">
            {igUrl && (
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <Instagram size={16} /> Instagram
              </a>
            )}
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        )}

        <p className="text-zinc-400">
          © {new Date().getFullYear()} ERICK|DEV. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
