import Link from "next/link";
import { ArrowRight, ShoppingBag, Clock, Scissors, Star, ShieldCheck, Zap, MapPin } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { MOCK_PRODUCTS, MOCK_TAILORS } from "@/lib/mock-data";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
  const topTailors = MOCK_TAILORS.slice(0, 3);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" /> Revolusi Fashion Digital
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                <span className="gradient-text">FitStyle</span> <br />
                <span className="text-3xl md:text-5xl block mt-4 text-[var(--text-primary)] transition-colors">The Future of Fashion <br /> Creation & Rental</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed mb-10 max-w-xl transition-colors">
                Ekosistem Fashion Terlengkap di Indonesia untuk Ekspresikan Gayamu Tanpa Batas
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/explore" className="btn-primary text-center flex items-center justify-center gap-2 py-4 px-8">
                  Mulai Jelajahi <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tailor" className="btn-outline text-center flex items-center justify-center gap-2 py-4 px-8">
                  Cari Penjahit <Scissors className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 transition-all">
                <div className="flex flex-col italic">
                  <span className="text-2xl font-bold text-[var(--text-primary)] transition-colors">10K+</span>
                  <span className="text-xs uppercase tracking-tighter text-[var(--text-secondary)]">Pengguna</span>
                </div>
                <div className="flex flex-col italic">
                  <span className="text-2xl font-bold text-[var(--text-primary)] transition-colors">500+</span>
                  <span className="text-xs uppercase tracking-tighter text-[var(--text-secondary)]">Vendor</span>
                </div>
                <div className="flex flex-col italic">
                  <span className="text-2xl font-bold text-[var(--text-primary)] transition-colors">50+</span>
                  <span className="text-xs uppercase tracking-tighter text-[var(--text-secondary)]">Brand</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in hidden lg:block">
              <div className="relative z-10 rounded-3xl overflow-hidden glass p-2 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                  alt="Fashion Experience"
                  className="rounded-2xl w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-40 h-40 glass rounded-2xl p-4 animate-pulse-glow z-20 -rotate-12">
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <Star className="w-8 h-8 text-yellow-500 mb-2 fill-yellow-500" />
                  <p className="text-xs font-bold text-[var(--text-primary)]">Rating 4.9/5</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Kepuasan Pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Unggulan</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Kami menyediakan solusi fashion lengkap mulai dari pakaian siap pakai hingga desain kustom impian Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl card-hover border-b-4 border-blue-500/50">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Beli Langsung</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">Dapatkan koleksi terbaru dari brand fashion ternama dan lokal dengan kualitas terbaik.</p>
            <Link href="/explore?cat=buy" className="text-blue-500 dark:text-blue-400 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Mulai Belanja <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass p-8 rounded-3xl card-hover border-b-4 border-emerald-500/50">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Sewa Pakaian</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">Tampil mewah di setiap acara spesial tanpa harus keluar banyak biaya. Sewa gaun & jas premium.</p>
            <Link href="/explore?cat=rent" className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Sewa Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass p-8 rounded-3xl card-hover border-b-4 border-amber-500/50">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
              <Scissors className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Custom Tailor</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">Buat pakaian yang didesain khusus hanya untuk Anda. Ukuran pas, desain personal, kualitas penjahit lokal.</p>
            <Link href="/explore?cat=custom" className="text-amber-500 dark:text-amber-400 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Request Custom <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[var(--surface-card-bg)] py-20 border-y border-[var(--color-surface-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Produk Terpopuler</h2>
              <p className="text-[var(--text-secondary)]">Lihat koleksi yang paling banyak diminati minggu ini.</p>
            </div>
            <Link href="/explore" className="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 font-semibold flex items-center gap-2 hidden sm:flex">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-10 sm:hidden">
            <Link href="/explore" className="btn-outline w-full text-center block">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Top Tailors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Penjahit Ahli Kami</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Kami bekerja sama dengan vendor dan penjahit lokal terverifikasi untuk memastikan kualitas terbaik.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topTailors.map(t => (
            <div key={t.id} className="glass rounded-3xl p-6 card-hover">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/30" />
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="font-bold text-[var(--text-primary)] transition-colors">{t.name}</h4>
                    {t.isVerified && <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-brand-400" />}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 transition-colors">
                    <MapPin className="w-3 h-3 text-brand-500 dark:text-brand-400" /> {t.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {t.specialties.slice(0, 3).map(s => (
                  <span key={s} className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--border-primary)] text-[10px] text-[var(--text-secondary)] font-bold transition-all">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-[var(--border-primary)]">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">{t.rating}</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-medium transition-colors">{t.completedOrders}+ Pesanan</span>
              </div>
              <Link href={`/tailor/${t.id}`} className="btn-outline w-full text-center block text-sm py-2">
                Lihat Profil
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tailor" className="btn-primary inline-flex items-center gap-2">
            Lihat Semua Penjahit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-brand rounded-[40px] p-12 relative overflow-hidden text-center md:text-left">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Mulai Perjalanan Fashion Anda Hari Ini
              </h2>
              <p className="text-brand-100/80 text-lg mb-8 max-w-lg">
                Gabung dengan ribuan pecinta fashion lainnya dan rasakan pengalaman "One-Stop Fashion" yang sesungguhnya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register" className="bg-white text-brand-700 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-50 transition-colors">
                  Daftar Sekarang
                </Link>
                <Link href="/explore" className="bg-brand-800 text-white border border-brand-400/30 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-900 transition-colors">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="w-full max-w-sm aspect-square glass-light rounded-3xl p-4 rotate-6">
                 <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
                  alt="Join FitStyle"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
