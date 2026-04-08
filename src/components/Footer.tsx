import Link from "next/link";
import { Scissors, Globe, MessageCircle, Share2, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--color-surface-border)] pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-lg">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">FitStyle</span>
            </Link>
            <p className="text-[var(--footer-text)] text-sm leading-relaxed mb-6 transition-colors">
              Platform Fashion masa depan yang mengintegrasikan pembelian, penyewaan, dan pembuatan pakaian kustom dalam satu ekosistem digital.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 glass-light rounded-lg text-[var(--footer-muted)] hover:text-brand-500 dark:hover:text-brand-300 transition-colors" aria-label="Globe">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 glass-light rounded-lg text-[var(--footer-muted)] hover:text-brand-500 dark:hover:text-brand-300 transition-colors" aria-label="Message">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 glass-light rounded-lg text-[var(--footer-muted)] hover:text-brand-500 dark:hover:text-brand-300 transition-colors" aria-label="Share">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--footer-heading)] font-semibold mb-6 transition-colors">Layanan</h4>
            <ul className="space-y-4">
              <li><Link href="/explore?cat=buy" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Pembelian Pakaian</Link></li>
              <li><Link href="/explore?cat=rent" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Penyewaan Pakaian</Link></li>
              <li><Link href="/tailor" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Custom Tailoring</Link></li>
              <li><Link href="/explore" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Jelajahi Produk</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[var(--footer-heading)] font-semibold mb-6 transition-colors">Perusahaan</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Tentang Kami</Link></li>
              <li><Link href="/blogs" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Blog Fashion</Link></li>
              <li><Link href="/careers" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Karir</Link></li>
              <li><Link href="/contact" className="text-[var(--footer-text)] hover:text-brand-600 dark:hover:text-white transition-colors text-sm">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--footer-heading)] font-semibold mb-6 transition-colors">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[var(--footer-text)] transition-colors">
                <MapPin className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0" />
                <span>Jl. Merdeka No. 123, Jakarta Selatan, 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--footer-text)] transition-colors">
                <Phone className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--footer-text)] transition-colors">
                <Mail className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0" />
                <span>hello@fitstyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-surface-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--footer-muted)] text-xs text-center md:text-left transition-colors">
            © 2024 FitStyle. All rights reserved. Made with ❤️ for the future of fashion.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-[var(--footer-muted)] hover:text-[var(--footer-heading)] text-xs transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-[var(--footer-muted)] hover:text-[var(--footer-heading)] text-xs transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
