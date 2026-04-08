"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Package,
  Scissors,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn, calculateRentalPrice } from "@/lib/utils";
import { PaymentMethod, Order, CartItem } from "@/lib/types";

const SHIPPING_METHODS = [
  { id: "std", name: "Standar (JNE/J&T)", desc: "3-5 Hari Kerja", price: 20000 },
  { id: "exp", name: "Ekspres (SiCepat Best)", desc: "1-2 Hari Kerja", price: 35000 },
  { id: "inst", name: "Instan (GoSend/Grab)", desc: "3-6 Jam", price: 50000 },
];

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Transfer Bank", sub: "Manual Verifikasi" },
  { id: "ewallet_gopay", label: "GoPay", sub: "Instan" },
  { id: "ewallet_ovo", label: "DANA / OVO", sub: "Instan" },
  { id: "credit_card", label: "Kartu Kredit", sub: "Visa / Mastercard" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, addOrder, clearCart, clearPendingOrder, showToast } = useApp();
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("bank_transfer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"checkout" | "success">("checkout");

  const items = state.pendingOrder || [];
  const isCustomOrder = items.some(item => item.product.category === "custom");

  useEffect(() => {
    if (items.length === 0 && step === "checkout") {
      router.push("/explore");
    }
  }, [items, router, step]);

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.type === "rent" && item.product.rentalPrice
        ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3)
        : item.product.price;
    return sum + (unitPrice * item.quantity);
  }, 0);

  const total = subtotal + selectedShipping.price + 5000; // + service fee

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  };

  const handlePlaceOrder = () => {
    if (!state.user) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000).toString()}`,
        userId: state.user!.id,
        items: [...items],
        status: "pending",
        total: total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: state.user!.address || {
          fullName: "Ahmad Maulidan",
          phone: "081234567890",
          street: "Jl. Merdeka No. 10",
          city: "Banjarmasin",
          province: "Kalimantan Selatan",
          postalCode: "70111"
        },
        paymentMethod: selectedPayment,
      };

      addOrder(newOrder);
      clearPendingOrder();
      
      setStep("success");
      setIsProcessing(false);
      showToast(isCustomOrder ? "Permintaan kustom berhasil terkirim!" : "Pesanan Anda berhasil dikonfirmasi!");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center animate-fade-in px-4">
        <div className="max-w-md w-full glass rounded-[48px] p-12 text-center border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
          <div className="w-24 h-24 rounded-[40px] gradient-brand flex items-center justify-center mx-auto mb-10 shadow-xl animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-4 transition-colors">
            {isCustomOrder ? "Permintaan Terkirim!" : "Pembayaran Berhasil!"}
          </h1>
          <p className="text-[var(--text-secondary)] mb-12 leading-relaxed transition-colors">
            {isCustomOrder 
              ? "Penjahit pilihan Anda akan meninjau permintaan ini dan memberikan penawaran harga segera. Cek berkala di menu Aktivitas." 
              : "Pesanan Anda sedang kami siapkan. Anda akan menerima notifikasi otomatis saat paket dikirim."
            }
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => router.push("/orders")}
              className="btn-primary py-5 rounded-2xl flex items-center justify-center gap-2 group"
            >
              Cek Status Pesanan <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <Link href="/" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <div className="animate-fade-in">
              <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-brand-500 dark:hover:text-brand-400 transition-colors uppercase tracking-widest mb-6">
                 <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4 transition-colors">
                Konfirmasi <span className="gradient-text">{isCustomOrder ? "Permintaan" : "Pesanan"}</span>
              </h1>
              <p className="text-[var(--text-secondary)] transition-colors">Pastikan semua detail pesanan Anda sudah benar.</p>
           </div>
           
           <div className="flex items-center gap-4 glass p-2 rounded-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="px-4 py-2 rounded-xl text-xs font-extrabold glass text-emerald-600 dark:text-emerald-400 flex items-center gap-2 transition-colors">
                 <CheckCircle2 className="w-4 h-4" /> Item Pilihan
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              <div className="px-4 py-2 rounded-xl text-xs font-extrabold gradient-brand text-white shadow-lg">
                 {isCustomOrder ? "Kirim Permintaan" : "Pembayaran"}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Left Column: Forms */}
           <div className="lg:col-span-8 space-y-10">
              {/* Order Details Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Detail Pesanan
                 </h3>
                 <div className="glass rounded-[32px] overflow-hidden border-[var(--subtle-border)]">
                    <div className="divide-y divide-[var(--subtle-border)]">
                       {items.map((item, idx) => {
                          const itemPrice = item.type === "rent" && item.product.rentalPrice 
                            ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3) 
                            : item.product.price;
                          
                          return (
                             <div key={idx} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                <div className="w-full sm:w-24 aspect-square rounded-2xl overflow-hidden glass shrink-0">
                                   <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div>
                                         <p className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest mb-1 transition-colors">{item.product.brand}</p>
                                         <h4 className="text-lg font-black text-[var(--text-primary)] group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{item.product.name}</h4>
                                         <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="px-3 py-1 rounded-lg glass-light text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--subtle-border)] transition-colors">
                                               Ukuran: <span className="text-[var(--text-primary)] transition-colors">{item.size}</span>
                                            </span>
                                            <span className="px-3 py-1 rounded-lg glass-light text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--subtle-border)] flex items-center gap-1.5 transition-colors">
                                               {item.type === "rent" ? (
                                                  <><Clock className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Sewa ({item.rentalDays} Hari)</>
                                               ) : item.product.category === "custom" ? (
                                                  <><Scissors className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Request Custom</>
                                               ) : (
                                                  <><ShoppingBag className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Beli</>
                                               )}
                                            </span>
                                         </div>
                                      </div>
                                      <div className="text-right sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--subtle-border)]">
                                         <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">
                                           {item.product.category === "custom" ? "Budget Awal" : "Subtotal"}
                                         </p>
                                         <p className="text-xl font-black text-[var(--text-primary)] transition-colors">{formatPrice(itemPrice * item.quantity)}</p>
                                         {item.product.category === "custom" && (
                                           <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase mt-1 italic transition-colors">Harga Final ditentukan penjahit</p>
                                         )}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              </section>

              {/* Address Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3 transition-colors">
                       <MapPin className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Alamat Penjemputan/Tujuan
                    </h3>
                    <button className="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors underline decoration-brand-500/30 underline-offset-4">Tambah Alamat Baru</button>
                 </div>
                 <div className="glass rounded-[32px] p-8 border-brand-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-500/10 transition-colors" />
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase transition-colors">Utama</span>
                             <p className="font-black text-[var(--text-primary)] text-lg transition-colors">{state.user?.address?.fullName || "Ahmad Maulidan"}</p>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md transition-colors">
                             {state.user?.address?.street || "Jl. Merdeka No. 10"}, {state.user?.address?.city || "Banjarmasin"}, {state.user?.address?.province || "Kalimantan Selatan"}, {state.user?.address?.postalCode || "70111"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] font-mono font-bold tracking-tight transition-colors">{state.user?.address?.phone || "081234567890"}</p>
                       </div>
                       <button className="btn-outline px-6 py-2.5 rounded-xl text-xs">Pilih Alamat Lain</button>
                    </div>
                 </div>
              </section>

              {/* Shipping Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: "250ms" }}>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                    <Truck className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Pilih Jasa Pengiriman
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SHIPPING_METHODS.map((method) => (
                       <button
                         key={method.id}
                         onClick={() => setSelectedShipping(method)}
                         className={cn(
                           "p-6 rounded-[28px] border text-left flex flex-col justify-between transition-all group relative overflow-hidden",
                           selectedShipping.id === method.id 
                             ? "bg-brand-500/10 border-brand-500 shadow-xl shadow-brand-500/10" 
                             : "glass border-[var(--subtle-border)] hover:border-brand-500/30"
                         )}
                       >
                         {selectedShipping.id === method.id && (
                            <div className="absolute top-0 right-0 p-3">
                               <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                               </div>
                            </div>
                         )}
                         <p className={cn("text-sm font-black mb-1 transition-colors", selectedShipping.id === method.id ? "text-brand-600 dark:text-brand-300" : "text-[var(--text-primary)]")}>{method.name}</p>
                         <p className="text-xs text-[var(--text-muted)] mb-6 font-medium transition-colors">{method.desc}</p>
                         <p className="text-base font-black text-[var(--text-primary)] transition-colors">{formatPrice(method.price)}</p>
                       </button>
                    ))}
                 </div>
              </section>

              {/* Payment Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                    <CreditCard className="w-6 h-6 text-brand-500 dark:text-brand-400" /> {isCustomOrder ? "Metode Pembayaran (Setelah Konfirmasi)" : "Metode Pembayaran"}
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                       <div 
                         key={method.id}
                         onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                         className={cn(
                           "p-6 rounded-[28px] border cursor-pointer flex items-center gap-5 transition-all relative group",
                           selectedPayment === method.id 
                             ? "bg-accent-500/10 border-accent-500 shadow-xl shadow-accent-500/10" 
                             : "glass border-[var(--subtle-border)] hover:border-accent-500/30"
                         )}
                       >
                         <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            selectedPayment === method.id ? "bg-accent-500 text-white" : "bg-[var(--subtle-bg)] text-[var(--text-muted)] group-hover:bg-black/5 dark:group-hover:bg-white/10"
                         )}>
                            <CreditCard className="w-6 h-6" />
                         </div>
                         <div>
                            <p className={cn("text-base font-black leading-none mb-1 transition-colors", selectedPayment === method.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")}>{method.label}</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] transition-colors">{method.sub}</p>
                         </div>
                         {selectedPayment === method.id && (
                           <div className="absolute right-6 top-1/2 -translate-y-1/2">
                              <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_12px_#38bdf8]" />
                           </div>
                         )}
                       </div>
                    ))}
                 </div>
              </section>

              {/* Protection Badge */}
              <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10 flex flex-col sm:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: "350ms" }}>
                 <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/5">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 tracking-tight transition-colors">Perlindungan Pembeli FitStyle</h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed transition-colors">Nikmati garansi kenyamanan berbelanja. Uang belanja Anda aman dan baru akan diserahkan ke penjahit/vendor jika pesanan telah sampai dan sesuai ekspektasi Anda.</p>
                 </div>
              </div>
           </div>

           {/* Right Column: Order Summary */}
           <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8 animate-fade-in" style={{ animationDelay: "350ms" }}>
              <div className="glass rounded-[48px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-full h-[6px] gradient-brand" />
                 <h3 className="text-xl font-black text-[var(--text-primary)] mb-10 pb-4 border-b border-[var(--subtle-border)] uppercase tracking-tight transition-colors">
                    {isCustomOrder ? "Ringkasan Permintaan" : "Rincian Pembayaran"}
                 </h3>

                 {/* Minimal Items List */}
                 <div className="space-y-6 mb-10 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin">
                    {items.map((item, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden glass shrink-0">
                             <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-xs font-bold text-[var(--text-primary)] truncate mb-1 transition-colors">{item.product.name}</h4>
                             <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors">
                                {item.type === "rent" ? (
                                   <><Clock className="w-3 h-3 inline mr-1 text-emerald-500 dark:text-emerald-400" /> Sewa</>
                                ) : item.product.category === "custom" ? (
                                   <><Scissors className="w-3 h-3 inline mr-1 text-amber-500 dark:text-amber-400" /> Request Custom</>
                                ) : (
                                   <><ShoppingBag className="w-3 h-3 inline mr-1 text-blue-500 dark:text-blue-400" /> Beli</>
                                )}
                                <span className="mx-2">•</span> {item.quantity}x
                             </p>
                          </div>
                          <p className="text-xs font-black text-[var(--text-primary)] self-center transition-colors">
                             {formatPrice((item.type === "rent" && item.product.rentalPrice ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3) : item.product.price) * item.quantity)}
                          </p>
                       </div>
                    ))}
                 </div>

                 {/* Price Breakdown */}
                 <div className="space-y-4 mb-10 pt-8 border-t border-[var(--subtle-border)]">
                    <div className="flex justify-between text-sm">
                       <span className="text-[var(--text-muted)] font-medium tracking-tight transition-colors">Subtotal Produk</span>
                       <span className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-[var(--text-muted)] font-medium tracking-tight transition-colors">Biaya Pengiriman ({selectedShipping.name})</span>
                       <span className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(selectedShipping.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-[var(--text-muted)] font-medium tracking-tight transition-colors">Asuransi & Proteksi</span>
                       <span className="text-[var(--text-primary)] font-bold font-mono text-[11px] bg-[var(--subtle-bg)] px-2 py-0.5 rounded-md transition-colors">FREE</span>
                    </div>
                    <div className="flex justify-between text-base pt-6 border-t border-[var(--subtle-border)] mt-6">
                       <span className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs self-end mb-1 transition-colors">
                          {isCustomOrder ? "Total Estimasi" : "Total Pembayaran"}
                       </span>
                       <div className="text-right">
                          <span className="text-[28px] font-black gradient-text block">{formatPrice(total)}</span>
                          {isCustomOrder && (
                            <span className="text-[9px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-tighter transition-colors">Belum perlu bayar sekarang</span>
                          )}
                       </div>
                    </div>
                 </div>

                 <button
                   onClick={handlePlaceOrder}
                   disabled={isProcessing}
                   className="w-full btn-primary py-6 flex items-center justify-center gap-3 relative group overflow-hidden shadow-2xl shadow-brand-500/30"
                 >
                    {isProcessing ? (
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="font-bold">Memproses Pembayaran...</span>
                       </div>
                    ) : (
                       <>
                          <span className="font-black text-lg">
                             {isCustomOrder ? "Kirim Permintaan & Konfirmasi" : "Konfirmasi & Bayar"}
                          </span>
                          <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-2" />
                       </>
                    )}
                 </button>
                 
                 <p className="text-center text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2 transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Transaksi Terenkripsi 256-bit
                 </p>
              </div>

              {/* Need Help CTA */}
              <div className="p-8 rounded-[48px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] text-center space-y-4">
                 <h4 className="text-sm font-bold text-[var(--text-primary)] transition-colors">Butuh Bantuan?</h4>
                 <p className="text-xs text-[var(--text-muted)] transition-colors">Hubungi CS kami jika Anda memiliki kendala terkait pengiriman atau pembayaran.</p>
                 <button className="text-xs font-black text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors uppercase tracking-widest">Hubungi Kami</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
