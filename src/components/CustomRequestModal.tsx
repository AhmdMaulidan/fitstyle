"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  Upload,
  ImagePlus,
  Trash2,
  Scissors,
  Ruler,
  Palette,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FileText,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_TAILORS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { CustomRequest, CartItem, Order, ProductSize } from "@/lib/types";
import { useRouter } from "next/navigation";

interface CustomRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomRequestData) => void;
  initialTailorId?: string;
}

export interface CustomRequestData {
  clothingType: string;
  description: string;
  budget: string;
  deadline: string;
  measurements: Record<string, string>;
  referenceImages: string[];
  preferredTailorId: string;
  fabricPreference: string;
  notes: string;
}

const MEASUREMENT_CONFIG: Record<string, { key: string; label: string }[]> = {
  kebaya: [
    { key: "chest", label: "Lingkar Dada" },
    { key: "waist", label: "Lingkar Pinggang" },
    { key: "shoulder", label: "Lebar Bahu" },
    { key: "sleeve", label: "Panjang Lengan" },
    { key: "length", label: "Panjang Kebaya" },
  ],
  jas: [
    { key: "chest", label: "Lingkar Dada" },
    { key: "shoulder", label: "Lebar Bahu" },
    { key: "sleeve", label: "Panjang Lengan" },
    { key: "waist", label: "Lingkar Perut" },
    { key: "length", label: "Panjang Jas" },
  ],
  dress: [
    { key: "chest", label: "Lingkar Dada" },
    { key: "waist", label: "Lingkar Pinggang" },
    { key: "hips", label: "Lingkar Pinggul" },
    { key: "length", label: "Panjang Dress" },
  ],
  kemeja: [
    { key: "chest", label: "Lingkar Dada" },
    { key: "shoulder", label: "Lebar Bahu" },
    { key: "sleeve", label: "Panjang Lengan" },
    { key: "length", label: "Panjang Kemeja" },
  ],
  celana: [
    { key: "waist", label: "Lingkar Pinggang" },
    { key: "hips", label: "Lingkar Pinggul" },
    { key: "thigh", label: "Lingkar Paha" },
    { key: "length", label: "Panjang Celana" },
    { key: "knee", label: "Lingkar Lutut" },
  ],
  default: [
    { key: "chest", label: "Dada" },
    { key: "waist", label: "Pinggang" },
    { key: "hips", label: "Pinggul" },
    { key: "length", label: "Panjang" },
  ],
};

const CLOTHING_TYPES = [
  { id: "kebaya", label: "Kebaya", emoji: "👘" },
  { id: "jas", label: "Jas / Blazer", emoji: "🤵" },
  { id: "dress", label: "Gaun / Dress", emoji: "👗" },
  { id: "batik", label: "Batik", emoji: "🎨" },
  { id: "kemeja", label: "Kemeja", emoji: "👔" },
  { id: "celana", label: "Celana", emoji: "👖" },
  { id: "adat", label: "Baju Adat", emoji: "🏛️" },
  { id: "lainnya", label: "Lainnya", emoji: "✨" },
];

const BUDGET_RANGES = [
  "< Rp 500.000",
  "Rp 500.000 – Rp 1.000.000",
  "Rp 1.000.000 – Rp 2.500.000",
  "Rp 2.500.000 – Rp 5.000.000",
  "> Rp 5.000.000",
];

export default function CustomRequestModal({
  isOpen,
  onClose,
  onSubmit,
  initialTailorId,
}: CustomRequestModalProps) {
  const { state, addCustomRequest, setPendingOrder, addOrder } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tailorSearchQuery, setTailorSearchQuery] = useState("");

  const [formData, setFormData] = useState<CustomRequestData>({
    clothingType: "",
    description: "",
    budget: "",
    deadline: "",
    measurements: {},
    referenceImages: [],
    preferredTailorId: "",
    fabricPreference: "",
    notes: "",
  });

  // Sync initialTailorId
  useEffect(() => {
    if (initialTailorId && isOpen) {
      setFormData(prev => ({ ...prev, preferredTailorId: initialTailorId }));
    }
  }, [initialTailorId, isOpen]);

  const totalSteps = 3;

  const updateField = <K extends keyof CustomRequestData>(
    key: K,
    value: CustomRequestData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newImages: string[] = [];

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        if (formData.referenceImages.length + newImages.length >= 5) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, result],
          }));
        };
        reader.readAsDataURL(file);
      });
    },
    [formData.referenceImages.length]
  );

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleImageUpload(e.dataTransfer.files);
    },
    [handleImageUpload]
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: CustomRequest = {
        id: `REQ-${Math.floor(Math.random() * 100000)}`,
        userId: state.user?.id || "guest",
        ...formData,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      
      addCustomRequest(newRequest);
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmit?.(formData);
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setFormData({
      clothingType: "",
      description: "",
      budget: "",
      deadline: "",
      measurements: {},
      referenceImages: [],
      preferredTailorId: "",
      fabricPreference: "",
      notes: "",
    });
    onClose();
  };

  const canProceed = () => {
    if (step === 1) {
      const hasMeasurements = Object.values(formData.measurements).some(v => v.trim() !== "");
      return formData.clothingType && formData.description && hasMeasurements;
    }
    if (step === 2) return true; // images optional
    return formData.budget && formData.deadline;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] glass border border-brand-500/20 shadow-2xl shadow-brand-500/10 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] transition-colors">
                Request Custom
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Buat pakaian impian Anda
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        {!isSubmitted && (
          <div className="px-8 pb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 rounded-full flex-1 transition-all duration-500",
                      s <= step
                        ? "gradient-brand"
                        : "bg-white/10"
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 1 ? "text-brand-300" : "text-gray-600")}>Detail</span>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 2 ? "text-brand-300" : "text-gray-600")}>Referensi</span>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", step >= 3 ? "text-brand-300" : "text-gray-600")}>Budget</span>
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-8 pb-8 scrollbar-thin">
          {isSubmitted ? (
            /* Success State */
            <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mb-6 animate-pulse-glow">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 transition-colors">
                Permintaan Terkirim! 🎉
              </h3>
              <p className="text-[var(--text-secondary)] max-w-sm mb-8 transition-colors">
                Tim penjahit kami akan meninjau permintaan Anda dan menghubungi dalam 1×24 jam.
              </p>
              <button 
                onClick={() => {
                  const cleanBudget = formData.budget.split(' – ')[0].replace(/[^0-9]/g, "");
                  const budgetNumber = parseInt(cleanBudget) || 500000;

                  const newRequest: CustomRequest = {
                    id: `REQ-${Math.floor(1000 + Math.random() * 9000).toString()}`,
                    userId: state.user?.id || "guest",
                    clothingType: formData.clothingType,
                    description: formData.description,
                    budget: formData.budget, // Original range string
                    deadline: formData.deadline,
                    measurements: formData.measurements,
                    referenceImages: formData.referenceImages,
                    preferredTailorId: formData.preferredTailorId,
                    fabricPreference: formData.fabricPreference,
                    notes: formData.notes,
                    status: "sent",
                    createdAt: new Date().toISOString()
                  };

                  addCustomRequest(newRequest);
                  handleClose();
                  router.push("/orders?tab=custom");
                }} 
                className="btn-primary px-8 py-3"
              >
                Lihat Status Pesanan
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Detail */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Clothing Type */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      <Palette className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      Jenis Pakaian
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {CLOTHING_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            updateField("clothingType", type.id);
                            // Clear manual note if switching back from lainnya
                            if (type.id !== "lainnya") {
                              updateField("notes", formData.notes.replace(/^\[Jenis: .*?\] /, ""));
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all text-sm font-semibold",
                            formData.clothingType === type.id
                              ? "gradient-brand text-[var(--text-primary)] shadow-lg shadow-brand-500/30 scale-105"
                              : "glass-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--subtle-bg)]"
                          )}
                        >
                          <span className="text-xl">{type.emoji}</span>
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Clothing Type Input */}
                    {formData.clothingType === "lainnya" && (
                      <div className="mt-4 animate-fade-in">
                        <input
                          type="text"
                          placeholder="Masukkan jenis pakaian yang Anda inginkan..."
                          className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm"
                          onChange={(e) => {
                            // We can store this in descriptions or a prefix for now
                            // but better to just keep it as clothingType in the UI label
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      <FileText className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      Deskripsi Permintaan
                    </label>
                    <textarea
                      placeholder="Jelaskan detail pakaian yang Anda inginkan... contoh: Kebaya modern warna pastel untuk wisuda, dengan bordir bunga di bagian dada dan lengan panjang transparan..."
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={4}
                      className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm resize-none"
                    />
                  </div>

                  {/* Fabric Preference */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      Preferensi Bahan (opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Katun, Sutra, Brokat, Tile..."
                      value={formData.fabricPreference}
                      onChange={(e) =>
                        updateField("fabricPreference", e.target.value)
                      }
                      className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      <Ruler className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      Ukuran Badan (opsional)
                    </label>
                    
                    {formData.clothingType === "lainnya" ? (
                      <div className="animate-fade-in">
                        <textarea
                          placeholder="Masukkan detail ukuran Anda secara manual (contoh: Lingkar Lengan 30cm, Bahu 40cm, dll...)"
                          value={formData.measurements.manual || ""}
                          onChange={(e) =>
                            updateField("measurements", {
                              ...formData.measurements,
                              manual: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm resize-none"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(MEASUREMENT_CONFIG[formData.clothingType as keyof typeof MEASUREMENT_CONFIG] || MEASUREMENT_CONFIG.default).map((m) => (
                          <div key={m.key} className="relative">
                            <input
                              type="number"
                              placeholder={m.label}
                              value={formData.measurements[m.key] || ""}
                              onChange={(e) =>
                                updateField("measurements", {
                                  ...formData.measurements,
                                  [m.key]: e.target.value,
                                })
                              }
                              className="w-full p-3 glass-light rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-[11px] text-center"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)] font-bold">
                              cm
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Reference Images */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
                      <ImagePlus className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      Upload Referensi Foto
                    </label>
                    <p className="text-xs text-[var(--text-muted)] mb-4">
                      Upload hingga 5 foto referensi desain yang Anda inginkan. Format: JPG, PNG, WebP.
                    </p>

                    {/* Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[180px]",
                        isDragging
                          ? "border-brand-400 bg-brand-500/10 scale-[1.02]"
                          : "border-[var(--subtle-border)] hover:border-brand-500/40 hover:bg-white/[0.02]"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                      />
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                          isDragging
                            ? "bg-brand-500/30"
                            : "bg-[var(--subtle-bg)]"
                        )}
                      >
                        <Upload
                          className={cn(
                            "w-7 h-7 transition-colors",
                            isDragging ? "text-brand-300" : "text-[var(--text-muted)]"
                          )}
                        />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                        {isDragging
                          ? "Lepaskan di sini..."
                          : "Klik atau seret foto ke sini"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        JPG, PNG, WebP • Maks 5 foto
                      </p>
                    </div>
                  </div>

                  {/* Preview Grid */}
                  {formData.referenceImages.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                        Foto Terupload ({formData.referenceImages.length}/5)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {formData.referenceImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-2xl overflow-hidden group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={`Referensi ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(idx);
                                }}
                                className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-[var(--text-primary)]" />
                              </button>
                            </div>
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full glass flex items-center justify-center text-[10px] font-bold text-[var(--text-primary)]">
                              {idx + 1}
                            </div>
                          </div>
                        ))}

                        {/* Add more button */}
                        {formData.referenceImages.length < 5 && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-[var(--subtle-border)] hover:border-brand-500/40 flex flex-col items-center justify-center gap-1 transition-colors"
                          >
                            <ImagePlus className="w-5 h-5 text-[var(--text-muted)]" />
                            <span className="text-[10px] text-[var(--text-muted)] font-bold">
                              Tambah
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      Catatan Tambahan (opsional)
                    </label>
                    <textarea
                      placeholder="Ada detail khusus yang ingin disampaikan? contoh: warna persis seperti di foto referensi ke-2..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      rows={3}
                      className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Tailor */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Budget */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      💰 Kisaran Budget
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => updateField("budget", range)}
                          className={cn(
                            "p-4 rounded-2xl text-sm font-semibold text-left transition-all",
                            formData.budget === range
                              ? "gradient-brand text-[var(--text-primary)] shadow-lg shadow-brand-500/25"
                              : "glass-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--subtle-bg)]"
                          )}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
                      📅 Target Selesai
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateField("deadline", e.target.value)}
                      className="w-full p-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] text-sm [color-scheme:dark]"
                    />
                  </div>

                  {/* Preferred Tailor */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest block">
                        <Scissors className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                        Pilih Penjahit (opsional)
                      </label>
                      <div className="relative w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          placeholder="Cari penjahit..."
                          value={tailorSearchQuery}
                          onChange={(e) => setTailorSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 glass-light rounded-lg outline-none focus:ring-1 focus:ring-brand-500/50 text-[10px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => updateField("preferredTailorId", "")}
                        className={cn(
                          "w-full p-4 rounded-2xl text-sm font-semibold text-left transition-all flex items-center gap-3",
                          !formData.preferredTailorId
                            ? "gradient-brand text-[var(--text-primary)] shadow-lg shadow-brand-500/25"
                            : "glass-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--subtle-bg)]"
                        )}
                      >
                        <Sparkles className="w-5 h-5" />
                        <div>
                          <p className="font-bold">Auto-match</p>
                          <p className="text-xs opacity-70">
                            Biarkan kami memilihkan penjahit terbaik
                          </p>
                        </div>
                      </button>
                      {MOCK_TAILORS.filter((t) => 
                        (t.isVerified) && 
                        (t.name.toLowerCase().includes(tailorSearchQuery.toLowerCase()) || 
                         t.specialties.some(s => s.toLowerCase().includes(tailorSearchQuery.toLowerCase())))
                      )
                        .slice(0, 4)
                        .map((tailor) => (
                          <button
                            key={tailor.id}
                            onClick={() =>
                              updateField("preferredTailorId", tailor.id)
                            }
                            className={cn(
                              "w-full p-4 rounded-2xl text-sm text-left transition-all flex items-center gap-3",
                              formData.preferredTailorId === tailor.id
                                ? "gradient-brand text-[var(--text-primary)] shadow-lg shadow-brand-500/25"
                                : "glass-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--subtle-bg)]"
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tailor.avatar}
                              alt={tailor.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold truncate">
                                {tailor.name}
                              </p>
                              <p className="text-xs opacity-70 truncate">
                                {tailor.specialties.slice(0, 2).join(", ")} •{" "}
                                ⭐ {tailor.rating}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--subtle-border)]">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl glass-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--subtle-bg)] transition-all font-semibold text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
                      canProceed()
                        ? "btn-primary"
                        : "bg-[var(--subtle-bg)] text-[var(--text-muted)] cursor-not-allowed"
                    )}
                  >
                    Lanjut
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
                      canProceed() && !isSubmitting
                        ? "btn-primary"
                        : "bg-[var(--subtle-bg)] text-[var(--text-muted)] cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Permintaan
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
