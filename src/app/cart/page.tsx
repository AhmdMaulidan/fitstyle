"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  CheckCircle2,
  Package,
  Clock,
  Scissors
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn, calculateRentalPrice } from "@/lib/utils";
import { PaymentMethod, Order } from "@/lib/types";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, cartTotal, clearCart, addOrder, showToast, setPendingOrder } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bank_transfer");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  };

  const handleCheckout = () => {
    if (!state.isLoggedIn) {
      showToast("Silakan login terlebih dahulu untuk melanjutkan checkout.");
      return;
    }
    setPendingOrder(state.cart);
    router.push("/checkout");
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: state.user?.id || "guest",
        items: [...state.cart],
        status: "pending",
        total: cartTotal + 25000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: state.user?.address || {
          fullName: "Guest User",
          phone: "081234567890",
          street: "Jl. Merdeka No. 10",
          city: "Jakarta",
          province: "DKI Jakarta",
          postalCode: "12345"
        },
        paymentMethod: selectedPayment,
      };

      addOrder(newOrder);
      clearCart();
      setStep("success");
      setIsProcessing(false);
      showToast("Pesanan Anda berhasil dibuat!");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full text-center px-4">
          <div className="w-24 h-24 rounded-[40px] gradient-brand flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight transition-colors">Pesanan Berhasil!</h1>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed transition-colors">
            Terima kasih telah berbelanja di FitStyle. Pesanan Anda sedang kami proses dan akan segera dikirim.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/orders" className="btn-primary py-4 flex items-center justify-center gap-2">
              Lihat Status Pesanan <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/explore" className="text-brand-500 dark:text-brand-400 font-bold hover:text-brand-600 dark:hover:text-brand-300 transition-colors py-2">
              Kembali Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 transition-colors">
              {step === "cart" ? "Keranjang" : "Checkout"} <span className="gradient-text">Belanja</span>
            </h1>
            <p className="text-[var(--text-secondary)] transition-colors">
              {step === "cart" ? "Tinjau produk pilihan Anda sebelum melanjutkan pembayaran." : "Lengkapi detail pengiriman dan pilih metode pembayaran."}
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
             <div className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", step === "cart" ? "gradient-brand text-white" : "glass text-emerald-600 dark:text-emerald-400")}>1. Keranjang</div>
             <div className="w-4 h-[1px] bg-[var(--subtle-border)]" />
             <div className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", step === "checkout" ? "gradient-brand text-white" : "glass text-[var(--text-muted)]")}>2. Checkout</div>
          </div>
        </div>

        {state.cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Items or Form */}
            <div className="lg:col-span-8 space-y-6">
              {step === "cart" ? (
                <div className="space-y-4 animate-fade-in-up">
                  {state.cart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="glass rounded-[32px] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                      <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                               <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 transition-colors">{item.product.brand}</p>
                               <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{item.product.name}</h3>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.productId, item.size)}
                              className="p-2 text-[var(--text-muted)] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2">
                             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-light text-[10px] font-bold text-[var(--text-secondary)] transition-colors">
                                Ukuran: <span className="text-brand-600 dark:text-brand-300">{item.size}</span>
                             </div>
                             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-light text-[10px] font-bold text-[var(--text-secondary)] transition-colors">
                                {item.type === "rent" ? (
                                  <><Clock className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Sewa ({item.rentalDays} hari)</>
                                ) : item.product.category === "custom" ? (
                                  <><Scissors className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Request Custom</>
                                ) : (
                                  <><ShoppingBag className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Beli</>
                                )}
                             </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-6">
                          <div className="flex items-center glass rounded-xl overflow-hidden p-1">
                             <button 
                               onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                               className="p-2 hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
                             >
                               <Minus className="w-4 h-4" />
                             </button>
                             <span className="w-10 text-center font-bold text-[var(--text-primary)] text-sm transition-colors">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                               className="p-2 hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
                             >
                               <Plus className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-[var(--text-muted)] font-medium mb-1 transition-colors">Total</p>
                             <p className="text-xl font-black text-[var(--text-primary)] transition-colors">
                                {formatPrice((item.type === "rent" && item.product.rentalPrice ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3) : item.product.price) * item.quantity)}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Checkout Form Mock */
                <div className="space-y-8 animate-fade-in-up">
                  <section className="glass rounded-[32px] p-8">
                     <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                       <MapPin className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Alamat Pengiriman
                     </h3>
                     <div className="p-6 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex justify-between items-start gap-4">
                        <div>
                           <p className="font-bold text-[var(--text-primary)] mb-2 transition-colors">{state.user?.address?.fullName || "Ahmad Maulidan"}</p>
                           <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm transition-colors">
                             {state.user?.address?.street || "Jl. Merdeka No. 10"}, {state.user?.address?.city || "Banjarmasin"}, {state.user?.address?.province || "Kalimantan Selatan"}, {state.user?.address?.postalCode || "70111"}
                           </p>
                           <p className="text-xs text-[var(--text-muted)] mt-2 transition-colors">{state.user?.address?.phone || "081234567890"}</p>
                        </div>
                        <button className="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300">Ubah</button>
                     </div>
                  </section>

                  <section className="glass rounded-[32px] p-8">
                     <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                       <CreditCard className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Metode Pembayaran
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: "bank_transfer", label: "Transfer Bank" },
                          { id: "ewallet_gopay", label: "GoPay" },
                          { id: "ewallet_ovo", label: "OVO / DANA" },
                          { id: "credit_card", label: "Kartu Kredit" },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                            className={cn(
                              "p-4 rounded-2xl border text-left flex items-center justify-between group transition-all",
                              selectedPayment === method.id 
                                ? "bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/10" 
                                : "glass border-transparent hover:border-brand-500/30"
                            )}
                          >
                            <span className={cn("text-sm font-bold", selectedPayment === method.id ? "text-brand-600 dark:text-brand-300" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")}>
                                {method.label}
                            </span>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedPayment === method.id ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-700"
                            )}>
                               {selectedPayment === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        ))}
                     </div>
                  </section>

                  <section className="glass rounded-[32px] p-8">
                     <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                       <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Proteksi Pesanan
                     </h3>
                     <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <p>FitStyle menjamin keamanan transaksi Anda. Uang Anda baru akan diteruskan ke penjual/penjahit setelah Anda mengonfirmasi pesanan diterima dengan baik.</p>
                     </div>
                  </section>
                </div>
              )}
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
              <div className="glass rounded-[40px] p-8 shadow-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 border-b border-[var(--subtle-border)] pb-4 transition-colors">Ringkasan Pesanan</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)] font-medium transition-colors">Subtotal</span>
                    <span className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)] font-medium transition-colors">Ongkos Kirim</span>
                    <span className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(25000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)] font-medium transition-colors">Asuransi & Biaya Layanan</span>
                    <span className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(5000)}</span>
                  </div>
                  {step === "checkout" && (
                     <div className="flex justify-between text-sm pt-4 border-t border-[var(--subtle-border)]">
                        <span className="text-[var(--text-muted)] font-medium transition-colors">Metode Pembayaran</span>
                        <span className="text-brand-500 dark:text-brand-400 font-bold">{selectedPayment.replace("_", " ")}</span>
                     </div>
                  )}
                </div>

                <div className="flex justify-between items-end mb-8 pt-6 border-t border-[var(--subtle-border)]">
                  <span className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] transition-colors">Total Bayar</span>
                  <span className="text-3xl font-black gradient-text">{formatPrice(cartTotal + 30000)}</span>
                </div>

                <div className="space-y-4">
                  {step === "cart" ? (
                    <button 
                      onClick={handleCheckout}
                      className="w-full btn-primary py-5 flex items-center justify-center gap-2 group shadow-xl shadow-brand-500/20"
                    >
                      Lanjut ke Pembayaran <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full btn-primary py-5 flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/20"
                      >
                        {isProcessing ? (
                           <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                           <> Konfirmasi & Bayar <ShieldCheck className="w-5 h-5" /> </>
                        )}
                      </button>
                      <button 
                        onClick={() => setStep("cart")}
                        disabled={isProcessing}
                        className="w-full py-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Kembali ke Keranjang
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Secure Info */}
              <div className="px-4 flex items-center justify-center gap-3 opacity-40">
                <Truck className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Fast & Free Shipping available</span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="py-32 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-32 h-32 rounded-[48px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] flex items-center justify-center mb-8">
               <Package className="w-16 h-16 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight transition-colors">Keranjang Kosong</h2>
            <p className="text-[var(--text-muted)] max-w-sm mb-10 leading-relaxed transition-colors">
              Wah, keranjang belanjaanmu masih kosong nih. Yuk, cari pakaian impianmu sekarang!
            </p>
            <Link href="/explore" className="btn-primary px-10 py-4 flex items-center gap-2">
               Jelajahi Produk <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
