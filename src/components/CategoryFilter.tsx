"use client";

import { ShoppingBag, Clock, Scissors, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCategory } from "@/lib/types";

interface CategoryFilterProps {
  selected: ProductCategory | "all";
  onChange: (category: ProductCategory | "all") => void;
}

const CATEGORIES = [
  { id: "all", label: "Semua", icon: LayoutGrid },
  { id: "buy", label: "Beli", icon: ShoppingBag },
  { id: "rent", label: "Sewa", icon: Clock },
  { id: "custom", label: "Request Custom", icon: Scissors },
] as const;

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-semibold text-sm",
              isActive
                ? "gradient-brand text-white shadow-lg shadow-brand-500/30 scale-105"
                : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[var(--text-muted)]")} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
