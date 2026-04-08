export type ProductCategory = "buy" | "rent" | "custom";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Custom";

export type OrderStatus =
  | "pending"
  | "awaiting_approval"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rentalPrice?: number;
  rentalDuration?: string;
  image: string;
  images: string[];
  description: string;
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  brand: string;
  stock: number;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  tailorId?: string;
}

export interface TailorProject {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
}

export interface Tailor {
  id: string;
  name: string;
  avatar: string;
  location: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  experience: number;
  completedOrders: number;
  isVerified: boolean;
  bio: string;
  portfolio: string[];
  workHistory: TailorProject[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size: ProductSize;
  type: "buy" | "rent";
  rentalDays?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "ewallet_gopay"
  | "ewallet_ovo"
  | "ewallet_dana"
  | "cod";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: Address;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CustomRequestStatus = "sent" | "reviewing" | "accepted" | "rejected" | "completed";

export interface CustomRequest {
  id: string;
  userId: string;
  clothingType: string;
  description: string;
  budget: string;
  deadline: string;
  measurements: Record<string, string>;
  referenceImages: string[];
  preferredTailorId?: string;
  fabricPreference?: string;
  notes?: string;
  status: CustomRequestStatus;
  createdAt: string;
}
