"use client";

import { X, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: "XS", chest: "84-88", waist: "72-76", hip: "86-90" },
  { size: "S", chest: "88-92", waist: "76-80", hip: "90-94" },
  { size: "M", chest: "92-96", waist: "80-84", hip: "94-98" },
  { size: "L", chest: "96-100", waist: "84-88", hip: "98-102" },
  { size: "XL", chest: "100-104", waist: "88-92", hip: "102-106" },
  { size: "XXL", chest: "104-108", waist: "92-96", hip: "106-110" },
];

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl glass rounded-[32px] overflow-hidden animate-fade-in-up">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-brand-500 dark:text-brand-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] transition-colors">Panduan Ukuran</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed transition-colors">
            Gunakan tabel di bawah ini untuk menentukan ukuran yang paling sesuai dengan tubuh Anda. Semua ukuran dalam centimeter (cm).
          </p>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--subtle-border)]">
                  <th className="py-4 text-sm font-bold text-[var(--text-secondary)] transition-colors">Ukuran</th>
                  <th className="py-4 text-sm font-bold text-[var(--text-secondary)] transition-colors">Lingkar Dada</th>
                  <th className="py-4 text-sm font-bold text-[var(--text-secondary)] transition-colors">Lingkar Pinggang</th>
                  <th className="py-4 text-sm font-bold text-[var(--text-secondary)] transition-colors">Lingkar Pinggul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--subtle-border)]">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-4 text-sm font-bold text-brand-600 dark:text-brand-300">{row.size}</td>
                    <td className="py-4 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{row.chest} cm</td>
                    <td className="py-4 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{row.waist} cm</td>
                    <td className="py-4 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{row.hip} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-300 mb-2">Tips Pengukuran:</h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-2 list-disc pl-4 transition-colors">
              <li>Ukur dengan pita meteran dalam keadaan tegak.</li>
              <li>Pastikan pita meteran tidak terlalu kencang namun menempel pada tubuh.</li>
              <li>Jika ukuran Anda berada di antara dua pilihan, pilih ukuran yang lebih besar untuk kenyamanan.</li>
            </ul>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 btn-primary"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
