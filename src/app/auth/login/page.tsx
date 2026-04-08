"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scissors, Mail, Lock, Eye, EyeOff, Code2, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-primary)]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mockLogin, showToast } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      mockLogin();
      showToast("Selamat datang kembali di FitStyle!");
      router.push(redirectPath);
      setIsLoading(false);
    }, 1500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      mockLogin();
      showToast("Masuk sebagai tamu belanja.");
      router.push(redirectPath === "/" ? "/explore" : redirectPath);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -ml-20 -mb-20 animate-pulse" />

      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl gradient-text tracking-tight">FitStyle</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 transition-colors">Selamat Datang Kembali</h1>
          <p className="text-[var(--text-secondary)] transition-colors">Masuk untuk melanjutkan pengalaman fashion Anda.</p>
        </div>

        <div className="glass rounded-[40px] p-8 md:p-12 shadow-2xl relative">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 transition-colors">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest transition-colors">Password</label>
                <Link href="/auth/forgot" className="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 glass-light rounded-2xl outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-brand-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Masuk ke Akun <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /> </>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4 text-[var(--text-muted)]">
            <div className="flex-1 h-[1px] bg-[var(--subtle-border)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest transition-colors">Atau masuk dengan</span>
            <div className="flex-1 h-[1px] bg-[var(--subtle-border)]" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-3 py-4 glass-light hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all font-bold text-xs text-[var(--text-primary)]">
              <Globe className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 glass-light hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all font-bold text-xs text-[var(--text-primary)]">
              <Code2 className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-4 transition-colors">Ingin mencoba tanpa register?</p>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-3 glass hover:bg-brand-500/20 text-brand-600 dark:text-brand-300 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Jalankan Mock Login (Guest)
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-[var(--text-muted)] text-sm transition-colors">
          Belum punya akun? <Link href="/auth/register" className="text-brand-500 dark:text-brand-400 font-bold hover:text-brand-600 dark:hover:text-brand-300 transition-colors">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}
