"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Package, 
  ChevronRight, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Scissors,
  Calendar,
  Wallet,
  ImageIcon,
  MessageSquare,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { OrderStatus, CustomRequestStatus, CartItem } from "@/lib/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: any; cls: string; bg: string }> = {
  pending: { label: "Menunggu", icon: Clock, cls: "text-amber-500 dark:text-amber-400", bg: "bg-amber-400/10" },
  awaiting_approval: { label: "Menunggu Review", icon: Clock, cls: "text-amber-600 dark:text-amber-500", bg: "bg-amber-500/10" },
  confirmed: { label: "Dikonfirmasi", icon: CheckCircle2, cls: "text-blue-500 dark:text-blue-400", bg: "bg-blue-400/10" },
  processing: { label: "Diproses", icon: Package, cls: "text-brand-600 dark:text-brand-300", bg: "bg-brand-300/10" },
  shipped: { label: "Dikirim", icon: Truck, cls: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-400/10 transition-colors" },
  delivered: { label: "Tiba", icon: CheckCircle2, cls: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-500/10 transition-colors" },
  completed: { label: "Selesai", icon: ShieldCheck, cls: "text-[var(--text-secondary)]", bg: "bg-black/5 dark:bg-white/5 transition-colors" },
  cancelled: { label: "Dibatalkan", icon: AlertCircle, cls: "text-red-500 dark:text-red-400", bg: "bg-red-400/10 transition-colors" },
};

const CUSTOM_STATUS_CONFIG: Record<CustomRequestStatus, { label: string; icon: any; cls: string; bg: string }> = {
  sent: { label: "Terkirim", icon: Clock, cls: "text-amber-500 dark:text-amber-400", bg: "bg-amber-400/10" },
  reviewing: { label: "Ditinjau", icon: Package, cls: "text-blue-500 dark:text-blue-400", bg: "bg-blue-400/10" },
  accepted: { label: "Diterima", icon: CheckCircle2, cls: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-400/10 transition-colors" },
  rejected: { label: "Ditolak", icon: AlertCircle, cls: "text-red-500 dark:text-red-400", bg: "bg-red-400/10 transition-colors" },
  completed: { label: "Selesai", icon: ShieldCheck, cls: "text-[var(--text-secondary)]", bg: "bg-black/5 dark:bg-white/5 transition-colors" },
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-primary)]">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { state, setPendingOrder } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "custom">("orders");
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "custom") {
      setActiveTab("custom");
    } else if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [searchParams]);

  const { orders: allOrders, customRequests } = state;
  
  const orders = allOrders.filter(o => 
    o.items.some(item => item.type === "buy" || item.type === "rent") && 
    o.status !== "awaiting_approval"
  );

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (!state.isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-[32px] glass-light flex items-center justify-center mb-8">
          <AlertCircle className="w-10 h-10 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Silakan Masuk</h1>
        <p className="text-[var(--text-secondary)] text-center max-w-xs mb-8">
          Anda harus masuk ke akun FitStyle untuk melihat riwayat pesanan Anda.
        </p>
        <Link href="/auth/login" className="btn-primary px-8">Masuk Sekarang</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div className="animate-fade-in">
             <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 transition-colors">
                Aktivitas <span className="gradient-text">Saya</span>
             </h1>
             <p className="text-[var(--text-secondary)] transition-colors">Pantau status pesanan dan permintaan kustom Anda.</p>
          </div>
          <Link href="/explore" className="text-sm font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center gap-2 transition-colors">
             <ArrowLeft className="w-4 h-4" /> Cari Produk Lain
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 glass rounded-2xl mb-12 w-full sm:w-fit animate-fade-in" style={{ animationDelay: "100ms" }}>
           <button 
             onClick={() => setActiveTab("orders")}
             className={cn(
               "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
               activeTab === "orders" ? "gradient-brand text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             )}
           >
             <ShoppingBag className="w-4 h-4" />
             Pesanan
             {orders.length > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">{orders.length}</span>}
           </button>
           <button 
             onClick={() => setActiveTab("custom")}
             className={cn(
               "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none",
               activeTab === "custom" ? "gradient-brand text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             )}
           >
             <Scissors className="w-4 h-4" />
             Request Custom
             {customRequests.length > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">{customRequests.length}</span>}
           </button>
        </div>

        {activeTab === "orders" ? (
          /* Orders Tab Content */
          orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order, idx) => {
                const status = STATUS_CONFIG[order.status];
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={order.id} 
                    className="glass rounded-[32px] overflow-hidden animate-fade-in-up" 
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Order Header */}
                     <div className="p-6 sm:p-8 bg-black/5 dark:bg-white/5 border-b border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <div className={cn("px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold", status.bg, status.cls)}>
                             <StatusIcon className="w-4 h-4" />
                             {status.label}
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/10">
                            Lunas
                          </span>
                          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest transition-colors">No. Pesanan: <span className="text-[var(--text-primary)] transition-colors">{order.id}</span></span>
                       </div>
                       <p className="text-xs text-[var(--text-muted)] font-medium transition-colors">{formatDate(order.createdAt)}</p>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 sm:p-8 space-y-6">
                       {order.items.map((item) => (
                         <div key={`${item.productId}-${item.size}`} className="flex gap-6 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 glass-light">
                               <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-sm font-bold text-[var(--text-primary)] truncate mb-1 transition-colors">{item.product.name}</h4>
                               <div className="flex gap-3">
                                  <span className="text-[10px] font-medium text-[var(--text-muted)] transition-colors">Ukuran: <span className="text-[var(--text-secondary)] transition-colors">{item.size}</span></span>
                                  <span className="text-[10px] font-medium text-[var(--text-muted)] transition-colors">Qty: <span className="text-[var(--text-secondary)] transition-colors">{item.quantity}</span></span>
                               </div>
                            </div>
                            <div className="text-right hidden sm:block">
                               <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">
                                  {formatPrice((item.type === "rent" ? (item.product.rentalPrice || 0) * (item.rentalDays || 1) : item.product.price) * item.quantity)}
                               </p>
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Order Footer */}
                    <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors">
                         <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                         Dikirim ke <span className="font-bold text-[var(--text-secondary)] transition-colors">{order.shippingAddress.city}</span>
                      </div>
                      
                       <div className="flex items-center gap-6 w-full sm:w-auto">
                          <div className="text-right">
                             <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-1 transition-colors">Total Pembayaran</p>
                             <p className="text-xl font-black text-[var(--text-primary)] transition-colors">{formatPrice(order.total)}</p>
                          </div>
                          <Link 
                            href={`/orders/${order.id}`}
                            className="btn-outline py-3 px-6 text-xs flex items-center justify-center gap-2 flex-1 sm:flex-none"
                          >
                             Detail <ChevronRight className="w-4 h-4" />
                          </Link>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
               <div className="w-24 h-24 rounded-[32px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] flex items-center justify-center mb-8">
                  <ShoppingBag className="w-10 h-10 text-[var(--text-muted)]" />
               </div>
               <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 transition-colors">Belum Ada Pesanan</h2>
               <p className="text-[var(--text-muted)] max-w-xs mb-10 transition-colors">
                  Sepertinya Anda belum melakukan transaksi apapun. Yuk mulai belanja!
               </p>
               <Link href="/explore" className="btn-primary px-10">Mulai Jelajahi</Link>
            </div>
          )
        ) : (
          /* Custom Requests Tab Content */
          customRequests.length > 0 ? (
            <div className="space-y-8">
              {customRequests.map((request, idx) => {
                const status = CUSTOM_STATUS_CONFIG[request.status];
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={request.id} 
                    className="glass rounded-[32px] overflow-hidden animate-fade-in-up" 
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Header */}
                    <div className="p-6 sm:p-8 bg-black/5 dark:bg-white/5 border-b border-[var(--subtle-border)] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                         <div className={cn("px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold", status.bg, status.cls)}>
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                         </div>
                         <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest transition-colors">{request.id}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-medium transition-colors">{formatDate(request.createdAt)}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Summary Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3 transition-colors">
                            <Scissors className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                            {request.clothingType}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 line-clamp-3 transition-colors">
                            {request.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)]">
                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors">
                                   <Wallet className="w-3 h-3 text-brand-500 dark:text-brand-300" /> Anggaran
                                </div>
                                <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">{request.budget}</p>
                             </div>
                             <div className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)]">
                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors">
                                   <Calendar className="w-3 h-3 text-brand-500 dark:text-brand-300" /> Deadline
                                </div>
                                <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">{formatDate(request.deadline)}</p>
                             </div>
                          </div>
                        </div>

                        {/* Reference Images */}
                        {request.referenceImages.length > 0 && (
                          <div className="md:w-64 shrink-0">
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 transition-colors">
                               <ImageIcon className="w-3 h-3" /> Referensi Foto
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                               {request.referenceImages.slice(0, 4).map((img, i) => (
                                 <div key={i} className="aspect-square rounded-xl overflow-hidden glass-light border border-[var(--subtle-border)]">
                                    <img src={img} alt="Reference" className="w-full h-full object-cover" />
                                 </div>
                               ))}
                               {request.referenceImages.length > 4 && (
                                 <div className="aspect-square rounded-xl overflow-hidden glass-light border border-[var(--subtle-border)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                                   +{request.referenceImages.length - 4}
                                 </div>
                               )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 sm:p-8 pt-0 flex flex-wrap justify-between items-center gap-4">
                       <Link 
                         href={`/custom-request/${request.id}`}
                         className="text-xs font-bold text-[var(--text-muted)] hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                       >
                          Lihat Detail Permintaan
                       </Link>

                       <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button className="btn-outline py-2.5 px-5 text-[10px] flex-1 sm:flex-none flex items-center justify-center gap-2">
                             <MessageSquare className="w-3.5 h-3.5" /> Hubungi Penjahit
                          </button>
                          
                          {request.status === "accepted" ? (
                            <button 
                              onClick={() => {
                                const confirmedPrice = 4000000;
                                const cartItem: CartItem = {
                                  productId: `custom-prod-${request.id}`,
                                  product: {
                                    id: `custom-prod-${request.id}`,
                                    name: `Custom ${request.clothingType}`,
                                    category: "custom",
                                    price: confirmedPrice,
                                    image: request.referenceImages[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=300",
                                    images: request.referenceImages,
                                    description: request.description,
                                    brand: "Penjahit Pilihan",
                                    sizes: ["Custom"],
                                    rating: 5,
                                    reviewCount: 0,
                                    stock: 1,
                                    tags: ["custom"]
                                  },
                                  quantity: 1,
                                  size: "Custom",
                                  type: "buy"
                                };
                                setPendingOrder([cartItem]);
                                router.push("/checkout");
                              }}
                              className="btn-primary py-2.5 px-6 text-[10px] flex-1 sm:flex-none flex items-center justify-center gap-2 font-black shadow-lg shadow-brand-500/20"
                            >
                               Setujui & Bayar <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button 
                              disabled 
                              className="bg-[var(--subtle-bg)] text-[var(--text-muted)] border border-[var(--subtle-border)] py-2.5 px-6 text-[10px] rounded-xl flex-1 sm:flex-none flex items-center justify-center gap-2 cursor-not-allowed"
                            >
                               Menunggu Harga <Clock className="w-3.5 h-3.5" />
                            </button>
                          )}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
               <div className="w-24 h-24 rounded-[32px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] flex items-center justify-center mb-8">
                  <Scissors className="w-10 h-10 text-[var(--text-muted)]" />
               </div>
               <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 transition-colors">Belum Ada Request Custom</h2>
               <p className="text-[var(--text-muted)] max-w-xs mb-10 transition-colors">
                  Punya desain impian? Buat permintaan kustom pertama Anda sekarang!
               </p>
               <Link href="/explore" className="btn-primary px-10">Mulai Request Custom</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
