"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Scissors, Award, ShieldCheck, Filter, Navigation, ChevronDown } from "lucide-react";
import { MOCK_TAILORS } from "@/lib/mock-data";
import TailorCard from "@/components/TailorCard";
import { cn } from "@/lib/utils";

const SPECIALTIES = [
  "Semua",
  "Kebaya",
  "Jas Pria",
  "Dress Wanita",
  "Batik",
  "Baju Adat",
  "Streetwear",
  "Casual Wear",
  "Evening Gown"
];

const INDONESIA_PROVINCES = [
  "Semua",
  "Sekitar Anda",
  "Aceh",
  "Bali",
  "Banten",
  "Bengkulu",
  "DI Yogyakarta",
  "DKI Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara"
];

export default function TailorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua");

  const filteredTailors = useMemo(() => {
    return MOCK_TAILORS.filter((tailor) => {
      const matchesSearch = tailor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tailor.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "Semua" || 
                               tailor.specialties.some(s => s.includes(selectedSpecialty));
      let matchesLocation = true;
      if (selectedLocation === "Sekitar Anda") {
        matchesLocation = tailor.location.includes("DKI Jakarta") || tailor.location.includes("Jakarta");
      } else if (selectedLocation !== "Semua") {
        matchesLocation = tailor.location.includes(selectedLocation);
      }
      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [searchQuery, selectedSpecialty, selectedLocation]);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 animate-fade-in text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Scissors className="w-3.5 h-3.5" /> Tailor Connection System
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 transition-colors">
            Temukan <span className="gradient-text">Penjahit</span> Terbaik
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed transition-colors">
            Hubungkan diri Anda dengan vendor dan penjahit lokal terverifikasi. Buat pakaian kustom dengan kualitas butik langsung dari pengrajin ahli.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
               {/* Search Bar */}
               <div className="md:col-span-8 relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors" />
                 <input
                   type="text"
                   placeholder="Cari penjahit berdasarkan nama atau lokasi..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 glass rounded-3xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-xl"
                 />
               </div>

               {/* Province Dropdown */}
               <div className="md:col-span-4 relative group">
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors pointer-events-none z-10" />
                 <select
                   value={selectedLocation}
                   onChange={(e) => setSelectedLocation(e.target.value)}
                   className="w-full pl-16 pr-12 py-5 glass rounded-3xl outline-none focus:ring-2 focus:ring-accent-500/50 transition-all text-[var(--text-primary)] appearance-none cursor-pointer shadow-xl relative z-0"
                 >
                   {INDONESIA_PROVINCES.map(prov => (
                     <option key={prov} value={prov} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                        {prov === "Semua" ? "Seluruh Indonesia" : prov}
                     </option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none group-focus-within:text-accent-400 transition-colors z-10" />
               </div>
            </div>
            
            <div className="space-y-6">
              {/* Specialty Filter */}
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-4 ml-1 transition-colors">Pilih Spesialisasi</p>
                <div className="flex flex-wrap gap-2.5">
                  {SPECIALTIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpecialty(s)}
                      className={cn(
                        "px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border",
                        selectedSpecialty === s 
                          ? "gradient-brand text-white border-transparent scale-105 shadow-lg shadow-brand-500/20" 
                          : "glass text-[var(--text-muted)] border-[var(--subtle-border)] hover:border-brand-500/30 hover:text-[var(--text-primary)]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge (Desktop Side) */}
          <div className="lg:w-80 glass rounded-[32px] p-8 flex flex-col justify-center animate-fade-in group h-fit lg:mt-0 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider transition-colors">Terverifikasi</h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6 transition-colors">
              Semua penjahit berlabel bintang telah melewati kurasi ketat untuk menjamin kualitas jahitan dan ketepatan waktu.
            </p>
            <div className="flex items-center gap-2 text-brand-500 dark:text-brand-400 text-xs font-bold cursor-pointer hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
              Pelajari Standar Kualitas <Award className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-baseline gap-2 mb-8 animate-fade-in">
           <p className="text-[var(--text-secondary)] text-sm transition-colors">Menemukan</p>
           <span className="text-[var(--text-primary)] font-black text-2xl transition-colors">{filteredTailors.length}</span>
           <p className="text-[var(--text-secondary)] text-sm font-medium transition-colors">penjahit {selectedLocation !== "Semua" ? `di ${selectedLocation}` : "profesional"}</p>
        </div>

        {/* Tailor Grid */}
        {filteredTailors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTailors.map((tailor, idx) => (
              <div key={tailor.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <TailorCard tailor={tailor} />
                <div className="mt-4 px-6 flex items-center gap-4">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--bg-surface)] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={`https://i.pravatar.cc/100?u=${tailor.id}-${i}`} alt="user" className="w-full h-full object-cover" />
                       </div>
                     ))}
                   </div>
                   <span className="text-[10px] text-[var(--text-muted)] font-medium transition-colors">{10 + idx * 5} orang baru saja memesan</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
             <div className="w-24 h-24 rounded-[40px] bg-[var(--subtle-bg)] border border-[var(--subtle-border)] flex items-center justify-center mb-8">
               <MapPin className="w-12 h-12 text-[var(--text-muted)]" />
             </div>
             <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 transition-colors">Lokasi Belum Terjangkau</h3>
             <p className="text-[var(--text-muted)] max-w-xs mb-10 transition-colors">
               Maaf, saat ini belum ada penjahit terverifikasi di wilayah **{selectedLocation}**. Coba wilayah lain atau pilih seluruh Indonesia.
             </p>
             <button 
               onClick={() => { setSelectedLocation("Semua"); setSelectedSpecialty("Semua"); setSearchQuery(""); }}
               className="btn-primary px-10"
             >
               Kembali ke Seluruh Indonesia
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
