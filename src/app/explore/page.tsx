"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, PackageSearch, Scissors, Sparkles, ArrowRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCategory } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import CustomRequestModal from "@/components/CustomRequestModal";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const { state, showToast } = useApp();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 transition-colors">
            Jelajahi <span className="gradient-text">Koleksi</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl transition-colors">
            Temukan ribuan pilihan pakaian untuk dibeli, disewa, atau dipesan melalui Request Custom sesuai ukuran Anda.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 animate-fade-in-up">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors" />
            <input
              type="text"
              placeholder="Cari produk, brand, atau penjahit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all",
              showFilters ? "gradient-brand text-white" : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Category Quick Filter */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CategoryFilter 
            selected={selectedCategory} 
            onChange={setSelectedCategory} 
          />
        </div>

        {/* Custom Request CTA Banner - when "Request Custom" is selected */}
        {selectedCategory === "custom" && (
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="relative overflow-hidden rounded-[28px] p-[1px]">
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500 opacity-60" style={{ backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
              <div className="relative rounded-[27px] bg-[var(--bg-surface)] p-8 md:p-10 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-brand-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500/10 rounded-full blur-[60px] -ml-10 -mb-10" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center shadow-xl shadow-brand-500/30 animate-pulse-glow">
                      <Scissors className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent-500 dark:text-accent-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-accent-500 dark:text-accent-400">Fitur Custom</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] mb-2 transition-colors">
                      Punya Desain Sendiri? Buat di Sini!
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-lg mb-6 md:mb-0 transition-colors">
                      Jelaskan pakaian impian Anda, upload foto referensi, dan kami akan mencarikan penjahit terbaik sesuai kebutuhan Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!state.isLoggedIn) {
                        showToast("Silakan masuk terlebih dahulu untuk membuat permintaan kustom.");
                        router.push("/auth/login?redirect=/explore");
                        return;
                      }
                      setShowCustomModal(true);
                    }}
                    className="flex-shrink-0 btn-primary px-8 py-4 flex items-center gap-2 group text-base"
                  >
                    <Scissors className="w-5 h-5" />
                    Buat Request Custom
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Info & Grid - Hidden for Request Custom since it uses the banner CTA */}
        {selectedCategory !== "custom" && (
          <>
            <div className="flex justify-between items-center mb-8 border-b border-[var(--subtle-border)] pb-6">
              <p className="text-sm text-[var(--text-secondary)] font-medium transition-colors">
                Menampilkan <span className="text-[var(--text-primary)] font-bold transition-colors">{filteredProducts.length}</span> produk
              </p>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest hidden sm:inline transition-colors">Urutkan:</span>
                 <select className="bg-transparent text-sm font-bold text-[var(--text-secondary)] outline-none cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                   <option value="featured">Paling Sesuai</option>
                   <option value="newest">Terbaru</option>
                   <option value="price-low">Harga Terendah</option>
                   <option value="price-high">Harga Tertinggi</option>
                 </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, idx) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 rounded-[32px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] flex items-center justify-center mb-6">
                  <PackageSearch className="w-10 h-10 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 transition-colors">Produk Tidak Ditemukan</h3>
                <p className="text-[var(--text-muted)] max-w-xs transition-colors">
                  Maaf, kata kunci yang Anda cari tidak tersedia. Coba kata kunci lain atau reset filter.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-8 text-brand-500 dark:text-brand-400 font-bold hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom Request Modal */}
      <CustomRequestModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={() => {
          showToast("Permintaan kustom berhasil dikirim! 🎉");
        }}
      />
    </div>
  );
}
