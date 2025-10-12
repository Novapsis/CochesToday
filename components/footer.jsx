import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-foreground/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="CochesToday"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-foreground/60">
              La plataforma más confiable para comprar y vender coches en España. 
              Encuentra tu vehículo ideal entre miles de opciones verificadas.
            </p>
            <div className="flex space-x-4 text-foreground/60">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="hover:text-foreground transition-colors text-sm">
                  Explorar Coches
                </Link>
              </li>
              <li>
                <Link href="/publish" className="hover:text-foreground transition-colors text-sm">
                  Publicar mi Coche
                </Link>
              </li>
              <li>
                <Link href="/saved-cars" className="hover:text-foreground transition-colors text-sm">
                  Mis Favoritos
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Calle Principal 123<br />
                  28001 Madrid, España
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+34900123456" className="text-sm hover:text-foreground transition-colors">
                  +34 900 123 456
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:info@cochestoday.com" className="text-sm hover:text-foreground transition-colors">
                  info@cochestoday.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-12 pt-10 text-foreground/60 border-t border-accent/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {new Date().getFullYear()} CochesToday. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/sitemap" className="hover:text-foreground transition-colors">
                Mapa del Sitio
              </Link>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">
                Accesibilidad
              </Link>
              <Link href="/legal" className="hover:text-foreground transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
