import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    minimumFractionDigits: 0 
  }).format(n);
}

/**
 * Calculates rental price based on base price (usually for 3 days) and tiered discounts
 * @param basePrice Price for the default 3-day rental
 * @param days Selected duration in days
 */
export function calculateRentalPrice(basePrice: number, days: number): number {
  if (days <= 3) return basePrice;
  
  const dailyRate = basePrice / 3;
  
  if (days <= 7) {
    // 7 days: 2x base price (approx 15% discount vs daily)
    return basePrice * 2;
  }
  
  if (days <= 14) {
    // 14 days: 3.5x base price (approx 25% discount vs daily)
    return basePrice * 3.5;
  }
  
  if (days <= 30) {
    // 30 days: 6x base price (approx 40% discount vs daily)
    return basePrice * 6;
  }
  
  // Custom manual calculation for > 30 days
  return dailyRate * days * 0.5; // 50% discount for long term
}
