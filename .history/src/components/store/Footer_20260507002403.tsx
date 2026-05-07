import { Instagram, MessageCircle } from "lucide-react";

type FooterProps = {
  storeName?: string;
  instagram?: string;
  whatsapp?: string;
};

export default function Footer({
  storeName,
  instagram,
  whatsapp,
}: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
              {storeName || "MINHA MARCA"}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Estilo e qualidade em cada peça. Vista-se com confiança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
              Navegação
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Coleção
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Carrinho
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <p className="text-center text-xs text-neutral-500 tracking-wider">
            © {new Date().getFullYear()} {storeName || "MINHA MARCA"}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
