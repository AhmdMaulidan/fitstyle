"use client";

import { use, useState } from "react";
import { 
  Star, 
  MapPin, 
  Scissors, 
  Award, 
  ShieldCheck, 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  ChevronRight,
  Sparkles,
  Calendar,
  ExternalLink,
  MessageSquare,
  Share2,
  Globe
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getTailorById } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import CustomRequestModal from "@/components/CustomRequestModal";

export default function TailorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tailor = getTailorById(id);
  const { state, showToast } = useApp();
  const router = useRouter();
  const [showCustomModal, setShowCustomModal] = useState(false);

  if (!tailor) return notFound();

  const handleCustomRequestClick = () => {
    if (!state.isLoggedIn) {
      showToast("Silakan masuk terlebih dahulu untuk memesan desain kustom.");
      router.push(`/auth/login?redirect=/tailor/${tailor.id}`);
      return;
    }
    setShowCustomModal(true);
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none transition-colors">
          <Link href="/" className="hover:text-brand-500 dark:hover:text-brand-300 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/tailor" className="hover:text-brand-500 dark:hover:text-brand-300 transition-colors">Penjahit</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-primary)] truncate max-w-[200px] transition-colors">{tailor.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Profile Info */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Profile Header Card */}
            <div className="relative overflow-hidden rounded-[40px] glass p-8 sm:p-12">
               {/* Background Decorative Elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px] -ml-24 -mb-24" />
               
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="relative shrink-0">
                    <div className="w-40 h-40 rounded-[40px] overflow-hidden ring-4 ring-brand-500/20 shadow-2xl">
                       <img src={tailor.avatar} alt={tailor.name} className="w-full h-full object-cover" />
                    </div>
                    {tailor.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 gradient-brand rounded-2xl flex items-center justify-center border-4 border-surface-dark shadow-xl animate-pulse-glow">
                         <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                       <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] transition-colors">{tailor.name}</h1>
                       <div className="flex items-center justify-center gap-2 glass-light px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                         <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">{tailor.rating}</span>
                         <span className="text-xs text-[var(--text-muted)] transition-colors">({tailor.reviewCount} ulasan)</span>
                       </div>
                    </div>
                    
                    <p className="text-[var(--text-secondary)] text-sm flex items-center justify-center md:justify-start gap-1.5 mb-6 transition-colors">
                       <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" /> {tailor.location}
                    </p>
                    
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base max-w-2xl mb-8 transition-colors">
                       {tailor.bio}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                       <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-dark bg-gray-800 overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?u=${tailor.id}-${i}`} alt="user" className="w-full h-full object-cover" />
                           </div>
                         ))}
                         <div className="w-8 h-8 rounded-full border-2 border-surface-dark bg-[var(--subtle-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] backdrop-blur-md transition-colors">
                           +50
                         </div>
                       </div>
                       <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Dipercaya oleh 50+ Pelanggan
                       </span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="glass p-6 rounded-[32px] text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Briefcase className="w-6 h-6 text-brand-500 dark:text-brand-300" />
                  </div>
                  <p className="text-2xl font-black text-[var(--text-primary)] transition-colors">{tailor.experience}</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-1 transition-colors">Tahun Pengalaman</p>
               </div>
               <div className="glass p-6 rounded-[32px] text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Clock className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                  </div>
                  <p className="text-2xl font-black text-[var(--text-primary)] transition-colors">{tailor.completedOrders}</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-1 transition-colors">Order Selesai</p>
               </div>
               <div className="glass p-6 rounded-[32px] text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-300" />
                  </div>
                  <p className="text-2xl font-black text-[var(--text-primary)] transition-colors">{tailor.rating}</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-1 transition-colors">Bintang Rating</p>
               </div>
               <div className="glass p-6 rounded-[32px] text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Award className="w-6 h-6 text-emerald-500 dark:text-emerald-300" />
                  </div>
                  <p className="text-2xl font-black text-[var(--text-primary)] transition-colors">Top 1%</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-1 transition-colors">Elite Vendor</p>
               </div>
            </div>

            {/* Riwayat Pengerjaan (CV) Section */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-3 transition-colors">
                     <Scissors className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Riwayat Pengerjaan
                  </h2>
                  <div className="h-[1px] flex-1 mx-6 bg-[var(--subtle-border)] hidden sm:block" />
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest transition-colors">{tailor.workHistory.length} Proyek Unggulan</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tailor.workHistory.map((project, idx) => (
                    <div 
                      key={project.id} 
                      className="group glass rounded-[40px] overflow-hidden flex flex-col h-full animate-fade-in-up"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                       <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute top-4 left-4">
                             <span className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-brand-500/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                                {project.category}
                             </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                             <div className="flex items-center gap-2 text-white">
                                <Calendar className="w-4 h-4 text-brand-400" />
                                <span className="text-xs font-bold font-mono">Tahun {project.year}</span>
                             </div>
                          </div>
                       </div>
                       <div className="p-8 flex-1 flex flex-col">
                          <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors uppercase tracking-tight">{project.title}</h4>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 transition-colors">
                             {project.description}
                          </p>
                          <div className="mt-8 pt-6 border-t border-[var(--subtle-border)] flex items-center justify-between">
                             <button className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors">
                                Lihat Detail <ExternalLink className="w-3.5 h-3.5" />
                             </button>
                             <div className="flex items-center gap-1.5 glass-light px-2 py-1 rounded-lg">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-[10px] font-bold text-[var(--text-primary)] transition-colors">5.0</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right: Sidebar Actions */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8">
            {/* CTA Card */}
            <div className="glass rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[6px] gradient-brand" />
               
               <div className="mb-8">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-[0.2em] mb-3 transition-colors">Estimasi Biaya</p>
                  <p className="text-2xl font-black text-[var(--text-primary)] transition-colors">{tailor.priceRange}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 transition-colors">* Biaya final tergantung desain & bahan</p>
               </div>
               
               <div className="space-y-4">
                  <button 
                    onClick={handleCustomRequestClick}
                    className="w-full btn-primary py-5 flex items-center justify-center gap-3 group shadow-xl shadow-brand-500/20"
                  >
                    <Scissors className="w-5 h-5" />
                    Pesan Request Custom
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    onClick={() => {
                        if (!state.isLoggedIn) {
                            showToast("Silakan masuk terlebih dahulu untuk menghubungi penjahit.");
                            router.push(`/auth/login?redirect=/tailor/${tailor.id}`);
                            return;
                        }
                        showToast(`Pesan terkirim ke ${tailor.name}`);
                    }}
                    className="w-full glass-light py-5 rounded-2xl flex items-center justify-center gap-3 text-[var(--text-primary)] font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-all border border-[var(--subtle-border)]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Hubungi Penjahit
                  </button>
               </div>

               <div className="mt-8 pt-8 border-t border-[var(--subtle-border)] space-y-6">
                  <div>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-4 transition-colors">Layanan Unggulan</p>
                     <div className="flex flex-wrap gap-2">
                        {tailor.specialties.map(s => (
                          <span key={s} className="px-3 py-1.5 rounded-xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)] text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider transition-colors">
                             {s}
                          </span>
                        ))}
                     </div>
                  </div>
                  
                  <div>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-4 transition-colors">Sosial Media</p>
                     <div className="flex gap-4">
                        {[
                          { icon: Share2, color: "hover:text-pink-500" },
                          { icon: Globe, color: "hover:text-blue-400" },
                          { icon: MessageSquare, color: "hover:text-blue-600" }
                        ].map((social, i) => (
                          <button key={i} className={cn("p-2.5 rounded-xl glass-light transition-all", social.color)}>
                             <social.icon className="w-5 h-5" />
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Tips */}
            <div className="p-8 rounded-[40px] bg-brand-500/5 border border-brand-500/10 space-y-4">
               <h4 className="text-sm font-bold text-brand-600 dark:text-brand-300 flex items-center gap-2 transition-colors">
                  <Sparkles className="w-4 h-4" /> Tips Request Custom
               </h4>
               <ul className="space-y-3">
                  {[
                    "Siapkan foto referensi yang jelas",
                    "Diskusikan preferensi bahan",
                    "Berikan ukuran detail atau minta fitting",
                    "Sepakati tenggat waktu & DP"
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-xs text-[var(--text-secondary)] transition-colors">
                       <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                       {tip}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Request Modal */}
      <CustomRequestModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        initialTailorId={tailor.id}
        onSubmit={() => {
          showToast(`Permintaan kustom untuk ${tailor.name} berhasil dikirim!`);
        }}
      />
    </div>
  );
}
