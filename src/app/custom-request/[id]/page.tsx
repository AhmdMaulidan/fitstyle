"use client";

import { use, useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Scissors, 
  Clock, 
  Calendar, 
  Wallet, 
  ImageIcon, 
  User, 
  MessageSquare, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  Ruler,
  Palette,
  CheckCircle2,
  Package,
  AlertCircle,
  FileText,
  Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CustomRequest, CustomRequestStatus, Order, CartItem, Product } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CUSTOM_STATUS_STEPS = [
  { id: "sent", label: "Terkirim", icon: Send, desc: "Permintaan telah terkirim ke penjahit" },
  { id: "reviewing", label: "Ditinjau", icon: Package, desc: "Penjahit sedang meninjau detail permintaan Anda" },
  { id: "accepted", label: "Diproses", icon: CheckCircle2, desc: "Penjahit telah memberikan penawaran harga" },
];



export default function CustomRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { state, addOrder, showToast, setPendingOrder } = useApp();
  const router = useRouter();
  
  const request = state.customRequests.find(r => r.id === id);

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (!request) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 transition-colors">Permintaan Tidak Ditemukan</h1>
        <Link href="/orders?tab=custom" className="btn-primary px-8">Kembali ke Daftar Request</Link>
      </div>
    );
  }

  const confirmedPrice = 4000000;

  const handleApproveAndPay = () => {
    const customProduct: Product = {
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
    };

    const cartItem: CartItem = {
      productId: customProduct.id,
      product: customProduct,
      quantity: 1,
      size: "Custom",
      type: "buy"
    };

    setPendingOrder([cartItem]);
    router.push(`/checkout`);
  };

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Link href="/orders?tab=custom" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-brand-500 dark:hover:text-brand-400 transition-colors uppercase tracking-widest mb-6">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-black text-[var(--text-primary)] transition-colors">Detail <span className="gradient-text">Permintaan</span></h1>
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/20 transition-colors">
                  {request.status === "sent" ? "Menunggu Review" : "Dalam Negosiasi"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)] transition-colors">
                <p className="flex items-center gap-2">ID Request: <span className="text-[var(--text-primary)] font-bold transition-colors">{request.id}</span></p>
                <p className="flex items-center gap-2">Tgl. Kirim: <span className="text-[var(--text-primary)] font-bold transition-colors">{formatDate(request.createdAt)}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation Panel */}
        <section className="glass rounded-[40px] p-8 md:p-12 mb-10 border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-transparent relative overflow-hidden animate-fade-in-up">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
           <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
              <div className="w-24 h-24 rounded-[32px] gradient-brand flex items-center justify-center shrink-0 shadow-2xl shadow-brand-500/20">
                 <Scissors className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                 <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 transition-colors">Konfirmasi Tim Penjahit 🧵</h3>
                 <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 max-w-xl transition-colors">
                    Tim kami telah meninjau detail permintaan Anda. Berdasarkan spesifikasi yang diberikan, berikut adalah rincian biaya dan waktu pengerjaan:
                 </p>
                 <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                    <div className="p-4 rounded-2xl glass-light border border-[var(--subtle-border)] min-w-[160px]">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">Anggaran Anda</p>
                       <p className="text-lg font-bold text-[var(--text-secondary)] transition-colors">{request.budget}</p>
                    </div>
                    <div className="p-4 rounded-2xl glass-light border border-brand-500/30 bg-brand-500/5 min-w-[160px]">
                       <p className="text-[10px] text-brand-500 dark:text-brand-400 font-bold uppercase tracking-widest mb-1 transition-colors">Harga Penjahit</p>
                       <p className="text-xl font-black text-[var(--text-primary)] transition-colors">{formatPrice(confirmedPrice)}</p>
                    </div>
                    <div className="p-4 rounded-2xl glass-light border border-[var(--subtle-border)] min-w-[160px]">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1 transition-colors">Durasi Kerja</p>
                       <p className="text-lg font-bold text-[var(--text-primary)] transition-colors">10 - 14 Hari</p>
                    </div>
                 </div>
              </div>
              <div className="shrink-0 w-full lg:w-auto">
                 <button 
                  onClick={handleApproveAndPay}
                  className="w-full btn-primary px-10 py-5 rounded-2xl flex items-center justify-center gap-3 group shadow-2xl shadow-brand-500/30 font-black text-lg transition-transform hover:scale-105 active:scale-95"
                 >
                    Setujui & Bayar <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Detailed Request Info */}
           <div className="lg:col-span-2 space-y-10">
              {/* Core Information */}
              <section className="glass rounded-[32px] p-8 md:p-10 border-[var(--subtle-border)] animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3 transition-colors">
                    <FileText className="w-6 h-6 text-brand-500 dark:text-brand-300" /> Detail Permintaan
                 </h3>
                 <div className="space-y-8">
                    <div>
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-2 transition-colors">Tipe Pakaian</p>
                       <p className="text-xl font-black text-[var(--text-primary)] transition-colors">{request.clothingType}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-2 transition-colors">Deskripsi Produk</p>
                       <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic transition-colors">"{request.description}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pb-8 border-b border-[var(--subtle-border)]">
                       <div>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-2 transition-colors">Preferensi Bahan</p>
                          <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold transition-colors">
                             <Palette className="w-4 h-4 text-brand-500 dark:text-brand-300" /> {request.fabricPreference || "-"}
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-2 transition-colors">Deadline Harapan</p>
                          <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold transition-colors">
                             <Calendar className="w-4 h-4 text-brand-500 dark:text-brand-300" /> {formatDate(request.deadline)}
                          </div>
                       </div>
                    </div>
                    
                    {/* Measurements Section */}
                    <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-6 mt-8 flex items-center gap-2 uppercase tracking-widest transition-colors">
                           <Ruler className="w-4 h-4 text-brand-500 dark:text-brand-300" /> Ukuran Tubuh
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                           {Object.entries(request.measurements).map(([key, val]) => (
                              <div key={key} className="p-4 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)]">
                                 <p className="text-[10px] text-[var(--text-muted)] font-medium capitalize mb-1 transition-colors">{key.replace("_", " ")}</p>
                                 <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">{val} cm</p>
                              </div>
                           ))}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    {request.notes && (
                      <div className="p-6 rounded-2xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)]">
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-3 transition-colors">Catatan Tambahan</p>
                        <p className="text-sm text-[var(--text-secondary)] transition-colors">{request.notes}</p>
                      </div>
                    )}
                 </div>
              </section>

              {/* Photos Section */}
              {request.referenceImages.length > 0 && (
                <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                   <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
                      <ImageIcon className="w-6 h-6 text-brand-500 dark:text-brand-300" /> Referensi Foto
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {request.referenceImages.map((img, i) => (
                        <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden glass border border-[var(--subtle-border)] group relative">
                           <img src={img} alt={`Reference ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <span className="text-white text-xs font-bold">Foto Referensi {i+1}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>

           {/* Sidebar - Vendor/Tailor Info */}
           <div className="space-y-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
              {/* Tailor Profile Card */}
              <section className="glass rounded-[32px] p-8 border-[var(--subtle-border)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-[40px] -mr-12 -mt-12" />
                 <h3 className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors">
                    <User className="w-4 h-4" /> Penjahit Pilihan
                 </h3>
                 
                 <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-24 h-24 rounded-[32px] glass-light p-1 mb-6">
                       <img 
                        src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&q=80&w=200" 
                        alt="Tailor" 
                        className="w-full h-full object-cover rounded-[28px]" 
                       />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <h4 className="text-xl font-black text-[var(--text-primary)] transition-colors">Ahmad Maulidan</h4>
                       <ShieldCheck className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)] font-medium transition-colors">Banjarmasin, Kalimantan Selatan</p>
                 </div>

                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center bg-[var(--subtle-bg)] p-4 rounded-2xl">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors">Status</p>
                       <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 transition-colors">Online</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-2xl border border-[var(--subtle-border)]">
                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none transition-colors">Respon</p>
                       <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">Cepat (&lt; 1 Jam)</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <button className="btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold group">
                       <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" /> Chat Sekarang
                    </button>
                    <button className="btn-outline py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                       <Phone className="w-4 h-4" /> Hubungi Bantuan
                    </button>
                 </div>
              </section>

              {/* Safety/Guarantee info */}
              <section className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20">
                 <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide transition-colors">FitStyle Protection</h4>
                       <p className="text-xs text-[var(--text-muted)] leading-relaxed transition-colors">
                          Pembayaran Anda aman. Dana hanya akan diteruskan ke penjahit setelah barang Anda selesai dan dikirim sesuai pesanan.
                       </p>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}
