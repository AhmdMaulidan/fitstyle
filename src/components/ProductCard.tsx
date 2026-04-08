"use client";

import Link from "next/link";
import { Star, ShoppingBag, Clock, Scissors } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG = {
  buy: { label: "Beli", icon: ShoppingBag, cls: "tag-buy" },
  rent: { label: "Sewa", icon: Clock, cls: "tag-rent" },
  custom: { label: "Request Custom", icon: Scissors, cls: "tag-custom" },
} as const;

interface ProductCardProps {
  product: Product;
  className?: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const cat = CATEGORY_CONFIG[product.category];
  const Icon = cat.icon;

  return (
    <Link href={`/product/${product.id}`} className={cn("block group", className)}>
      <article className="glass rounded-2xl overflow-hidden card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 left-2 animate-fade-in">
             <div className="tag-backplate">
                <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg", cat.cls)}>
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </span>
                {product.isNew && (
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg tag-new">
                    Baru
                  </span>
                )}
             </div>
          </div>

          {/* Rating overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-xs font-bold text-[var(--text-primary)]">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-0.5">{product.brand}</p>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <div>
              {product.category === "rent" && product.rentalPrice ? (
                <>
                  <p className="text-brand-600 dark:text-brand-300 font-bold text-base transition-colors">{formatPrice(product.rentalPrice)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">/ {product.rentalDuration}</p>
                </>
              ) : (
                <p className="text-brand-600 dark:text-brand-300 font-bold text-base transition-colors">
                  {product.category === "custom" ? "Mulai " : ""}
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
            <span className="text-xs text-[var(--text-secondary)]">
              ({product.reviewCount} ulasan)
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
