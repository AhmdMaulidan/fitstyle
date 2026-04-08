"use client";

import { use, useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  User, 
  ChevronRight, 
  ShieldCheck,
  Calendar,
  Phone,
  MessageSquare,
  ShoppingBag,
  Scissors,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn, calculateRentalPrice } from "@/lib/utils";
import { OrderStatus, CartItem } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TIMELINE_STEPS = [
  { id: "awaiting_approval", label: "Menunggu Konfirmasi", icon: Clock, desc: "Penjahit sedang meninjau permintaan Anda" },
  { id: "pending", label: "Pesanan Dibuat", icon: ShoppingBag, desc: "Sistem menerima pesanan Anda" },
  { id: "confirmed", label: "Diproses", icon: Package, desc: "Penjahit/Vendor menyiapkan barang" },
  { id: "shipped", label: "Dalam Perjalanan", icon: Truck, desc: "Paket sedang dibawa oleh kurir" },
  { id: "delivered", label: "Pesanan Tiba", icon: CheckCircle2, desc: "Paket telah sampai di tujuan" },
];

const STATUS_ORDER: OrderStatus[] = ["awaiting_approval", "pending", "confirmed", "processing", "shipped", "delivered", "completed"];

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { state, setPendingOrder } = useApp();
  const router = useRouter();
  const order = state.orders.find(o => o.id === id);

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getEstimation = (createdAt: string) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 transition-colors">Pesanan Tidak Ditemukan</h1>
        <Link href="/orders" className="btn-primary px-8">Kembali ke Daftar Pesanan</Link>
      </div>
    );
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Link href="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-brand-500 dark:hover:text-brand-400 transition-colors uppercase tracking-widest mb-6">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-black text-[var(--text-primary)] transition-colors">Detail <span className="gradient-text">Pesanan</span></h1>
                {order.status === "awaiting_approval" ? (
                  <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-colors">
                    Menunggu Konfirmasi
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 shadow-lg shadow-emerald-500/5 transition-colors">
                    Lunas
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)] transition-colors">
                <p className="flex items-center gap-2">No. Pesanan: <span className="text-[var(--text-primary)] font-bold transition-colors">{order.id}</span></p>
                <p className="flex items-center gap-2">Tgl. Pesanan: <span className="text-[var(--text-primary)] font-bold transition-colors">{formatDate(order.createdAt)}</span></p>
              </div>
            </div>
            <div className="p-4 glass rounded-2xl border-brand-500/10 w-full md:w-auto">
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">Estimasi Tiba</p>
              <p className="text-lg font-black text-brand-600 dark:text-brand-300 transition-colors">{getEstimation(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <section className="glass rounded-[40px] p-8 md:p-12 mb-10 overflow-hidden relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
           <h3 className="text-xl font-bold text-[var(--text-primary)] mb-10 flex items-center gap-3 relative z-10 transition-colors">
             <Truck className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Status Pengiriman
           </h3>
           
           <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10 pt-4">
              {/* Connecting line for desktop */}
              <div className="absolute top-9 left-6 right-6 h-[2px] bg-[var(--subtle-border)] hidden md:block" />
              
              {TIMELINE_STEPS.map((step, idx) => {
                 const stepIdx = STATUS_ORDER.indexOf(step.id as OrderStatus);
                 const isCompleted = currentStatusIdx > stepIdx || order.status === "completed";
                 const isActive = order.status === step.id;
                 const StepIcon = step.icon;

                 return (
                    <div key={step.id} className="relative flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0 flex-1 group">
                       <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 shrink-0",
                          isCompleted ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : 
                          isActive ? "gradient-brand text-white shadow-xl shadow-brand-500/20 scale-110" : 
                          "bg-[var(--subtle-bg)] text-[var(--text-muted)] grayscale"
                       )}>
                          <StepIcon className={cn("w-6 h-6", isActive && "animate-pulse")} />
                       </div>
                       
                       <div className="md:text-center mt-0 md:mt-6">
                          <p className={cn(
                             "text-sm font-black mb-1 transition-colors",
                             (isCompleted || isActive) ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                          )}>
                             {step.label}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] leading-tight md:max-w-[120px] mx-auto transition-colors">
                             {isActive ? step.desc : isCompleted ? "Aktivitas selesai" : "Belum dimulai"}
                          </p>
                       </div>

                       {/* Mobile line */}
                       {idx < TIMELINE_STEPS.length - 1 && (
                          <div className={cn(
                             "absolute left-[23px] top-12 w-[2px] h-12 block md:hidden",
                             isCompleted ? "bg-emerald-500" : "bg-[var(--subtle-border)]"
                          )} />
                       )}
                       
                       {/* Desktop line active state */}
                       {idx < TIMELINE_STEPS.length - 1 && (
                          <div className={cn(
                             "absolute top-9 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2.5px] hidden md:block transition-all duration-1000",
                             isCompleted ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-transparent"
                          )} />
                       )}
                    </div>
                 );
              })}
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Details */}
           <div className="lg:col-span-2 space-y-10">
              {/* Product List */}
              <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 transition-colors">Daftar Produk</h3>
                 <div className="glass rounded-[32px] overflow-hidden border-[var(--subtle-border)]">
                    <div className="divide-y divide-[var(--subtle-border)]">
                       {order.items.map((item, idx) => (
                          <div key={idx} className="p-6 sm:p-8 flex gap-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                             <div className="w-20 h-24 rounded-2xl overflow-hidden glass-light shrink-0">
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest mb-1 transition-colors">{item.product.brand}</p>
                                <h4 className="text-lg font-black text-[var(--text-primary)] group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors mb-4">{item.product.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                   <span className="px-3 py-1 rounded-lg glass-light text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--subtle-border)] uppercase transition-colors">
                                      Ukuran: <span className="text-[var(--text-primary)] transition-colors">{item.size}</span>
                                   </span>
                                   <span className="px-3 py-1 rounded-lg glass-light text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--subtle-border)] flex items-center gap-1.5 uppercase tracking-wider transition-colors">
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
                             <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[var(--text-primary)] mb-1 transition-colors">
                                   {formatPrice((item.type === "rent" && item.product.rentalPrice ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3) : item.product.price) * item.quantity)}
                                </p>
                                <p className="text-[10px] text-[var(--text-muted)] transition-colors">{item.quantity}x {formatPrice(item.type === "rent" && item.product.rentalPrice ? calculateRentalPrice(item.product.rentalPrice, item.rentalDays ?? 3) : item.product.price)}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </section>

              {/* Shipping & Address */}
              {order.status !== "awaiting_approval" && (
                <section className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass rounded-[32px] p-8 border-[var(--subtle-border)]">
                         <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-widest transition-colors">
                            <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Alamat Tujuan
                         </h3>
                         <div className="space-y-4">
                            <p className="text-base font-black text-[var(--text-primary)] transition-colors">{order.shippingAddress.fullName}</p>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed transition-colors">
                               {order.shippingAddress.street}<br/>
                               {order.shippingAddress.city}, {order.shippingAddress.province}<br/>
                               {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] font-mono font-bold transition-colors">{order.shippingAddress.phone}</p>
                         </div>
                      </div>
                      <div className="glass rounded-[32px] p-8 border-[var(--subtle-border)]">
                         <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-widest transition-colors">
                            <Truck className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Informasi Pengiriman
                         </h3>
                         <div className="space-y-6">
                            <div>
                               <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">Jasa Kirim</p>
                               <p className="text-base font-black text-[var(--text-primary)] transition-colors">Ekspres (Premium)</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">Nomor Resi</p>
                               <div className="flex items-center gap-3">
                                  <p className="text-base font-bold text-brand-600 dark:text-brand-300 font-mono transition-colors">{order.trackingNumber || "JS-9921102281"}</p>
                                  <button className="text-[10px] font-bold text-[var(--text-primary)] bg-[var(--subtle-bg)] px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors">Salin</button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </section>
              )}

              {/* Negotiation / Action Panel */}
              {order.status === "awaiting_approval" && (
                <section className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                   <div className="glass rounded-[32px] p-8 md:p-10 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                         <div className="w-20 h-20 rounded-[28px] gradient-brand flex items-center justify-center shrink-0 shadow-xl shadow-brand-500/20">
                            <Scissors className="w-10 h-10 text-white" />
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 transition-colors">Penawaran Penjahit Ready! 🧵</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 transition-colors">
                               Penjahit telah meninjau permintaan kustom Anda. Silakan tinjau rincian biaya dan waktu pengerjaan di bawah ini.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                               <div className="px-4 py-2 rounded-xl glass-light border border-[var(--subtle-border)]">
                                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors">Harga Disepakati</p>
                                  <p className="text-lg font-black text-[var(--text-primary)] transition-colors">{formatPrice(order.total)}</p>
                               </div>
                               <div className="px-4 py-2 rounded-xl glass-light border border-[var(--subtle-border)]">
                                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors">Estimasi Selesai</p>
                                  <p className="text-lg font-black text-brand-600 dark:text-brand-300 transition-colors">14 Hari Kerja</p>
                               </div>
                            </div>
                         </div>
                         <div className="shrink-0 w-full md:w-auto pt-6 md:pt-0">
                            <button
                              onClick={() => {
                                setPendingOrder(order.items);
                                router.push("/checkout");
                              }}
                              className="w-full btn-primary px-10 py-5 rounded-2xl flex items-center justify-center gap-2 group shadow-2xl shadow-brand-500/30 font-black"
                            >
                              Setujui & Bayar <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                         </div>
                      </div>
                   </div>
                </section>
              )}
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {/* Payment Info */}
              <section className="glass rounded-[32px] p-8 md:p-10 border-[var(--subtle-border)] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-2 h-full bg-accent-500" />
                 <h3 className="text-sm font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2 uppercase tracking-widest transition-colors">
                    <CreditCard className="w-4 h-4 text-accent-500 dark:text-accent-400" /> Pembayaran
                 </h3>
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center bg-[var(--subtle-bg)] p-4 rounded-2xl">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors">Status</p>
                       {order.status === "awaiting_approval" ? (
                         <span className="text-xs font-black text-amber-500 dark:text-amber-400 uppercase tracking-tighter transition-colors">MENUNGGU KONFIRMASI</span>
                       ) : (
                         <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-tighter transition-colors">LUNAS</span>
                       )}
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-2xl border border-[var(--subtle-border)]">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors">Metode</p>
                       <span className="text-sm font-bold text-[var(--text-primary)] uppercase transition-colors">{order.paymentMethod.replace("_", " ")}</span>
                    </div>
                 </div>
                 <div className="space-y-4 pt-6 border-t border-[var(--subtle-border)] mb-8">
                    <div className="flex justify-between items-center text-xs">
                       <p className="text-[var(--text-secondary)] transition-colors">Subtotal</p>
                       <p className="text-[var(--text-primary)] font-bold transition-colors">{formatPrice(order.total - 15000)}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <p className="text-[var(--text-secondary)] transition-colors">Ongkos Kirim</p>
                       <p className="text-[var(--text-primary)] font-bold transition-colors">Rp 10.000</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <p className="text-[var(--text-secondary)] transition-colors">Biaya Layanan</p>
                       <p className="text-[var(--text-primary)] font-bold transition-colors">Rp 5.000</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-6 border-t border-[var(--subtle-border)]">
                    <p className="text-sm font-black text-[var(--text-primary)] transition-colors">Total Akhir</p>
                    <p className="text-2xl font-black text-brand-600 dark:text-brand-300 transition-colors">{formatPrice(order.total)}</p>
                 </div>
              </section>

              {/* Contact Seller */}
              <section className="glass rounded-[32px] p-8 border-[var(--subtle-border)]">
                 <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-widest transition-colors">
                    <User className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Hubungi Penjual
                 </h3>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                       <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <p className="text-sm font-black text-[var(--text-primary)] transition-colors">FitStyle Official Store</p>
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest transition-colors">Toko Terverifikasi</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    <button className="btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-xs">
                       <MessageSquare className="w-4 h-4" /> Chat Sekarang
                    </button>
                    <button className="btn-outline py-3 rounded-xl flex items-center justify-center gap-2 text-xs">
                       <Phone className="w-4 h-4" /> Hubungi Bantuan
                    </button>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}
