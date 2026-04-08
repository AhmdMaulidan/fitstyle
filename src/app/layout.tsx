import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitStyle | The Future of Fashion Creation & Rental",
  description: "One-Stop Fashion platform for buying, renting, and custom tailoring clothes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased transition-colors duration-300`}>
        <AppProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
