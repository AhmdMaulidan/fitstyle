"use client";

import Link from "next/link";
import { Star, MapPin, ShieldCheck, ArrowRight, Scissors, Briefcase, Award } from "lucide-react";
import type { Tailor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TailorCardProps {
  tailor: Tailor;
  className?: string;
}

export default function TailorCard({ tailor, className }: TailorCardProps) {
  return (
    <article className={cn("glass rounded-[32px] p-6 lg:p-8 card-hover flex flex-col h-full", className)}>
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={tailor.avatar} 
              alt={tailor.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20" 
            />
            {tailor.isVerified && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center border-4 border-[var(--bg-surface)] shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)] transition-colors">{tailor.name}</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm flex items-center gap-1.5 transition-colors">
              <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" /> {tailor.location}
            </p>
          </div>
        </div>
        <div className="glass-light px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-[var(--text-primary)] transition-colors">{tailor.rating}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-light p-3 rounded-2xl flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-brand-500 dark:text-brand-300" />
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-tighter transition-colors">Pengalaman</p>
            <p className="text-xs font-bold text-[var(--text-primary)] transition-colors">{tailor.experience} Tahun</p>
          </div>
        </div>
        <div className="glass-light p-3 rounded-2xl flex items-center gap-3">
          <Award className="w-4 h-4 text-brand-500 dark:text-brand-300" />
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-tighter transition-colors">Selesai</p>
            <p className="text-xs font-bold text-[var(--text-primary)] transition-colors">{tailor.completedOrders}+ Order</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex-1">
        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 transition-colors">Spesialisasi</p>
        <div className="flex flex-wrap gap-2">
          {tailor.specialties.map((s) => (
            <span 
              key={s} 
              className="px-3 py-1.5 rounded-xl bg-[var(--subtle-bg)] border border-[var(--subtle-border)] text-xs text-[var(--text-secondary)] font-medium hover:bg-brand-500/10 hover:border-brand-500/30 transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--subtle-border)]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest transition-colors">Estimasi Biaya</span>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-300 transition-colors">{tailor.priceRange}</span>
        </div>
        <Link 
          href={`/tailor/${tailor.id}`} 
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 group"
        >
          Lihat Profil Lengkap <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
