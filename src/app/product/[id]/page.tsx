"use client";

import { use, useState } from "react";
import { 
  Star, 
  ShoppingBag, 
  Clock, 
  Scissors, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Share2, 
  Heart,
  ChevronRight,
  Info,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn, formatPrice, calculateRentalPrice } from "@/lib/utils";
import SizeGuide from "@/components/SizeGuide";
import { ProductSize, CartItem } from "@/lib/types";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const { state, addToCart, showToast, setPendingOrder } = useApp();
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDays, setCustomDays] = useState("10");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return notFound();

  const handleAddToCart = () => {
    if (!state.isLoggedIn) {
      showToast("Silakan masuk terlebih dahulu untuk membeli atau menyewa.");
      router.push(`/auth/login?redirect=/product/${product.id}`);
      return;
    }

    if (!selectedSize && product.category !== "custom") {
      showToast("Silakan pilih ukuran terlebih dahulu!");
      return;
    }

    const checkoutItem: CartItem = {
      productId: product.id,
      product: product,
      quantity: 1,
      size: selectedSize || "Custom",
      type: product.category === "rent" ? "rent" : "buy",
      rentalDays: product.category === "rent" ? (isCustomDuration ? parseInt(customDays) || 3 : selectedDuration) : undefined
    };
    
    // Set as pending order for checkout page
    setPendingOrder([checkoutItem]);
    router.push("/checkout");
  };

  const currentDays = isCustomDuration ? parseInt(customDays) || 3 : selectedDuration;
  const finalPrice = product.category === "rent" && product.rentalPrice
    ? calculateRentalPrice(product.rentalPrice, currentDays)
    : product.price;

  return (
    <div className="min-h-screen pb-20 pt-6">
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none transition-colors">
          <Link href="/" className="hover:text-brand-500 dark:hover:text-brand-300 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/explore" className="hover:text-brand-500 dark:hover:text-brand-300 transition-colors">Jelajahi</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-secondary)] truncate max-w-[200px] transition-colors">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative glass rounded-[40px] overflow-hidden aspect-square group">
                <img 
                  src={product.images[selectedImage] || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 animate-fade-in">
                   <div className="tag-backplate">
                      {product.isNew && (
                        <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xl tag-new">Baru</span>
                      )}
                      <span className={cn(
                        "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xl flex items-center gap-2",
                        product.category === "buy" ? "tag-buy" : 
                        product.category === "rent" ? "tag-rent" : "tag-custom"
                      )}>
                         {product.category === "buy" ? <ShoppingBag className="w-3.5 h-3.5" /> : 
                          product.category === "rent" ? <Clock className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
                         {product.category === "buy" ? "Untuk Dibeli" : 
                          product.category === "rent" ? "Untuk Disewa" : "Request Custom"}
                      </span>
                   </div>
                </div>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-6 right-6 p-4 rounded-2xl glass-light hover:bg-white/10 transition-all group/btn active:scale-90"
                >
                  <Heart className={cn("w-6 h-6 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
                </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "relative w-24 h-24 rounded-2xl overflow-hidden glass shrink-0 transition-all border-2",
                    selectedImage === idx ? "border-brand-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} shadow-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-6">
              <p className="text-sm font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest mb-2 transition-colors">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight transition-colors">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 glass-light px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">{product.rating}</span>
                </div>
                <span className="text-sm text-[var(--text-muted)] font-medium transition-colors">({product.reviewCount} ulasan)</span>
              </div>
            </div>

            <div className="mb-8 p-6 glass rounded-3xl border-brand-500/20">
              <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-2 transition-colors">Harga</p>
              {product.category === "rent" && product.rentalPrice ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)] transition-colors">{formatPrice(finalPrice)}</span>
                    <span className="text-[var(--text-secondary)] font-medium path-prefix transition-colors">/ {currentDays} Hari</span>
                  </div>
                  {currentDays > 3 && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider transition-colors">Hemat s/d {Math.round((1 - (finalPrice / (product.rentalPrice/3 * currentDays))) * 100)}% dengan durasi lebih lama!</p>
                  )}
                </div>
              ) : (
                <span className="text-4xl font-extrabold text-[var(--text-primary)] transition-colors">
                  {product.category === "custom" ? "Mulai " : ""}
                  {formatPrice(finalPrice)}
                </span>
              )}
            </div>

            {/* Rental Duration Selection */}
            {product.category === "rent" && (
              <div className="mb-8 animate-fade-in">
                <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors">
                   <Calendar className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Durasi Sewa
                </p>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[3, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        setSelectedDuration(days);
                        setIsCustomDuration(false);
                      }}
                      className={cn(
                        "py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-all border shrink-0",
                        !isCustomDuration && selectedDuration === days 
                          ? "bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/10 scale-105 z-10" 
                          : "glass border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-60"
                      )}
                    >
                      <span className={cn("text-sm font-black leading-none", !isCustomDuration && selectedDuration === days ? "text-brand-700 dark:text-white" : "text-[var(--text-secondary)]")}>{days}</span>
                      <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-0.5">Hari</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustomDuration(true)}
                    className={cn(
                      "py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-all border shrink-0",
                      isCustomDuration 
                        ? "bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/10 scale-105 z-10" 
                        : "glass border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-60"
                    )}
                  >
                    <span className={cn("text-xs font-black leading-none", isCustomDuration ? "text-brand-700 dark:text-white" : "text-[var(--text-secondary)]")}>Lainnya</span>
                  </button>
                </div>

                {isCustomDuration && (
                  <div className="animate-fade-in-up">
                    <div className="relative group">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="Masukkan jumlah hari..."
                        className="w-full pl-6 pr-16 py-4 glass rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] font-bold"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">HARI</div>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 ml-2 italic">* Minimal 1 hari, maksimal 90 hari</p>
                  </div>
                )}
              </div>
            )}

            {/* Size Selection */}
            {product.category !== "custom" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest transition-colors">Pilih Ukuran</p>
                  <button 
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" /> Panduan Ukuran
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm transition-all animate-fade-in",
                        selectedSize === size 
                          ? "gradient-brand text-white shadow-lg ring-2 ring-brand-400/50" 
                          : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-500/10"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-4 border-t border-[var(--subtle-border)]">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-5 flex items-center justify-center gap-3 active:scale-95"
              >
                {product.category === "custom" ? (
                  <> <Scissors className="w-5 h-5" /> Request Custom </>
                ) : product.category === "rent" ? (
                  <> <Clock className="w-5 h-5" /> Sewa Sekarang </>
                ) : (
                  <> <ShoppingBag className="w-5 h-5" /> Beli Sekarang </>
                )}
              </button>
              <button className="px-6 py-5 glass hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] rounded-2xl transition-all active:scale-95">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 glass-light rounded-2xl">
                 <Truck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                 <div>
                   <p className="text-xs font-bold text-[var(--text-primary)] transition-colors">Gratis Ongkir</p>
                   <p className="text-[10px] text-[var(--text-muted)] transition-colors">Min. Rp 500rb</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 p-4 glass-light rounded-2xl">
                 <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                 <div>
                   <p className="text-xs font-bold text-[var(--text-primary)] transition-colors">Garansi Pas</p>
                   <p className="text-[10px] text-[var(--text-muted)] transition-colors">Bisa Tukar Size</p>
                 </div>
              </div>
            </div>

            {/* Description Tab */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 transition-colors">Deskripsi Produk</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 transition-colors">
                {product.description}
              </p>
              <ul className="space-y-3">
                {product.tags.map(tag => (
                  <li key={tag} className="flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
