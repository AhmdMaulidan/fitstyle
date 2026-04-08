import type { Product, Tailor, Order, User } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Batik Tulis Modern Premium",
    category: "buy",
    price: 485000,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    description: "Batik tulis premium dengan motif modern yang memadukan keanggunan tradisional dengan sentuhan kontemporer. Dibuat oleh pengrajin batik berpengalaman menggunakan bahan katun berkualitas tinggi.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 142,
    brand: "Batik Nusantara",
    stock: 25,
    tags: ["batik", "formal", "premium"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "p2",
    name: "Dress Pesta Mewah Sequin",
    category: "rent",
    price: 2500000,
    rentalPrice: 350000,
    rentalDuration: "3 hari",
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    ],
    description: "Gaun pesta mewah berbahan sequin berkilau, sempurna untuk gala dinner, pernikahan, atau acara formal. Tersedia dalam berbagai ukuran.",
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 87,
    brand: "LuxeWear",
    stock: 5,
    tags: ["pesta", "formal", "mewah", "sewa"],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Setelan Jas Kasual Pria",
    category: "buy",
    price: 750000,
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    ],
    description: "Setelan jas kasual modern untuk pria yang tampil percaya diri. Bahan wool blend berkualitas dengan potongan slim fit yang elegan.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 63,
    brand: "StyleMan",
    stock: 18,
    tags: ["jas", "kasual", "pria"],
    isNew: false,
    isFeatured: false,
  },

  {
    id: "p5",
    name: "Kemeja Flanel Kasual",
    category: "buy",
    price: 189000,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    ],
    description: "Kemeja flanel kasual dengan motif kotak-kotak yang trendi. Nyaman dipakai sehari-hari, cocok untuk berbagai aktivitas santai.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.4,
    reviewCount: 215,
    brand: "CasualCo",
    stock: 50,
    tags: ["kemeja", "kasual", "flanel"],
    isNew: false,
    isFeatured: false,
  },
  {
    id: "p6",
    name: "Gaun Pengantin Sewa Premium",
    category: "rent",
    price: 8000000,
    rentalPrice: 1200000,
    rentalDuration: "2 hari",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    ],
    description: "Gaun pengantin mewah dengan detail renda dan payet yang indah. Tersedia untuk disewa lengkap dengan aksesoris.",
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviewCount: 28,
    brand: "Bridal House",
    stock: 3,
    tags: ["pengantin", "pernikahan", "mewah", "sewa"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "p7",
    name: "Kaos Polos Premium Combed 30s",
    category: "buy",
    price: 95000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    ],
    description: "Kaos polos premium bahan combed 30s yang lembut dan breathable. Tersedia dalam berbagai warna pilihan.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviewCount: 432,
    brand: "BasicLux",
    stock: 100,
    tags: ["kaos", "basic", "kasual"],
    isNew: false,
    isFeatured: false,
  },

  {
    id: "p9",
    name: "Blazer Wanita Elegan",
    category: "buy",
    price: 420000,
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
    ],
    description: "Blazer wanita dengan potongan elegan dan modern. Cocok untuk meeting, kerja, atau acara semi-formal.",
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.5,
    reviewCount: 89,
    brand: "ProfessaWear",
    stock: 30,
    tags: ["blazer", "wanita", "formal", "kerja"],
    isNew: false,
    isFeatured: false,
  },
  {
    id: "p10",
    name: "Kostum Cosplay Custom",
    category: "rent",
    price: 0,
    rentalPrice: 250000,
    rentalDuration: "3 hari",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    ],
    description: "Sewa kostum cosplay berbagai karakter populer. Bersih, terawat, dan siap pakai untuk event atau pemotretan.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviewCount: 57,
    brand: "CosRent",
    stock: 8,
    tags: ["cosplay", "kostum", "sewa", "event"],
    isNew: false,
    isFeatured: false,
  },
  {
    id: "p11",
    name: "Celana Chino Slim Fit",
    category: "buy",
    price: 275000,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    ],
    description: "Celana chino slim fit dengan bahan berkualitas tinggi. Cocok dipadukan dengan kemeja atau kaos untuk tampilan kasual chic.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 178,
    brand: "UrbanStyle",
    stock: 45,
    tags: ["celana", "chino", "pria", "kasual"],
    isNew: false,
    isFeatured: false,
  },

];

export const MOCK_TAILORS: Tailor[] = [
  {
    id: "t1",
    name: "Bu Siti Rahayuningsih",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
    location: "Yogyakarta, DIY",
    specialties: ["Kebaya", "Batik", "Baju Adat", "Dress Wanita"],
    rating: 4.9,
    reviewCount: 128,
    priceRange: "Rp 300.000 – Rp 2.000.000",
    experience: 15,
    completedOrders: 342,
    isVerified: true,
    bio: "Penjahit spesialis pakaian tradisional dan formal wanita. Berpengalaman 15 tahun dalam pembuatan kebaya, batik, dan gaun pesta dengan sentuhan modern.",
    portfolio: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80",
    ],
    workHistory: [
      { id: "pj1", title: "Kebaya Pengantin Klasik", description: "Kebaya brokat putih dengan ekor panjang 2 meter untuk pernikahan adat Jawa.", year: "2023", category: "Pernikahan", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
      { id: "pj2", title: "Seragam Batik Kantor", description: "Pembuatan 50 set batik tulis untuk staff perbankan.", year: "2023", category: "Korporasi", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80" },
      { id: "pj3", title: "Dress Pesta Modern", description: "Gaun cocktail dengan aksen bordir bunga tangan.", year: "2022", category: "Formal", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80" }
    ]
  },
  {
    id: "t2",
    name: "Pak Budi Santoso",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80",
    location: "Jakarta Selatan, DKI Jakarta",
    specialties: ["Jas Pria", "Tuxedo", "Setelan", "Hem Formal"],
    rating: 4.8,
    reviewCount: 94,
    priceRange: "Rp 500.000 – Rp 5.000.000",
    experience: 20,
    completedOrders: 215,
    isVerified: true,
    bio: "Tailor pria berpengalaman 20 tahun, spesialis jas dan tuxedo untuk acara formal dan pernikahan. Menggunakan teknik jahit tangan premium.",
    portfolio: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80",
    ],
    workHistory: [
      { id: "pj4", title: "Setelan Tuxedo Black-Tie", description: "Tuxedo wol premium dengan kerah velvet untuk gala dinner.", year: "2024", category: "Formal", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80" },
      { id: "pj5", title: "Jas Pengantin Slim Fit", description: "Jas wedding warna navy dengan cutting modern.", year: "2023", category: "Pernikahan", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80" }
    ]
  },
  {
    id: "t3",
    name: "Ibu Dewi Kusuma",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    location: "Solo, Jawa Tengah",
    specialties: ["Baju Adat", "Pakaian Tradisional", "Kebaya Modern"],
    rating: 5.0,
    reviewCount: 67,
    priceRange: "Rp 800.000 – Rp 3.000.000",
    experience: 25,
    completedOrders: 189,
    isVerified: true,
    bio: "Ahli pakaian adat Jawa dan Nusantara selama 25 tahun. Dipercaya untuk seragam acara kenegaraan dan pernikahan adat.",
    portfolio: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80",
    ],
    workHistory: [
      { id: "pj6", title: "Beskap Keraton Solo", description: "Pembuatan beskap pakem untuk acara adat keraton.", year: "2023", category: "Tradisional", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80" }
    ]
  },
  {
    id: "t4",
    name: "Kak Rizky Fashionista",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    location: "Bandung, Jawa Barat",
    specialties: ["Streetwear", "Kaos Custom", "Hoodie", "Casual Wear"],
    rating: 4.7,
    reviewCount: 203,
    priceRange: "Rp 150.000 – Rp 700.000",
    experience: 8,
    completedOrders: 520,
    isVerified: false,
    bio: "Designer muda spesialis streetwear dan custom clothing. Melayani pembuatan kaos, hoodie, jaket, dan outfit kasual sesuai desain kustom.",
    portfolio: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    ],
    workHistory: [
      { id: "pj7", title: "Custom Bomber Jacket", description: "Jaket bomber dengan bordir custom untuk komunitas motor.", year: "2023", category: "Streetwear", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" }
    ]
  },
  {
    id: "t5",
    name: "Ms. Augusta Chen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    location: "Surabaya, Jawa Timur",
    specialties: ["Evening Gown", "Bridal", "Cocktail Dress", "Party Wear"],
    rating: 4.9,
    reviewCount: 156,
    priceRange: "Rp 1.000.000 – Rp 8.000.000",
    experience: 12,
    completedOrders: 298,
    isVerified: true,
    bio: "Fashion designer spesialis gaun malam dan gaun pengantin. Karya-karya telah tampil di berbagai runway dan editorial fashion Indonesia.",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80",
    ],
    workHistory: [
      { id: "pj8", title: "Couture Wedding Gown", description: "Gaun pengantin detail Swarovski untuk fashion show.", year: "2023", category: "Couture", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" }
    ]
  },
  {
    id: "t6",
    name: "Pak Ahmad Tailor",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    location: "Medan, Sumatera Utara",
    specialties: ["Seragam Kantor", "Kemeja Formal", "Baju Batik"],
    rating: 4.5,
    reviewCount: 88,
    priceRange: "Rp 200.000 – Rp 1.200.000",
    experience: 10,
    completedOrders: 430,
    isVerified: true,
    bio: "Spesialis pembuatan seragam kantor dan pakaian formal dengan harga terjangkau dan kualitas terjamin. Melayani pemesanan dalam partai besar.",
    portfolio: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80",
    ],
    workHistory: [
      { id: "pj9", title: "Seragam Bank Daerah", description: "Pembuatan 200 kemeja seragam staff perbankan.", year: "2023", category: "Korporasi", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80" }
    ]
  },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Ahmad Maulidan",
  email: "ahmd.maulidanngmail.com@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
  phone: "081234567890",
  address: {
    fullName: "Ahmad Maulidan",
    phone: "081234567890",
    street: "Jl. Merdeka No. 10",
    city: "Banjarmasin",
    province: "Kalimantan Selatan",
    postalCode: "70111",
  },
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "u1",
    items: [
      {
        productId: "p1",
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        size: "L",
        type: "buy",
      },
    ],
    status: "delivered",
    total: 485000,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
    shippingAddress: MOCK_USER.address!,
    paymentMethod: "ewallet_gopay",
    trackingNumber: "JNE-123456789",
  },
  {
    id: "ORD-2024-002",
    userId: "u1",
    items: [
      {
        productId: "p2",
        product: MOCK_PRODUCTS[1],
        quantity: 1,
        size: "M",
        type: "rent",
        rentalDays: 3,
      },
    ],
    status: "processing",
    total: 350000,
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:30:00Z",
    shippingAddress: MOCK_USER.address!,
    paymentMethod: "bank_transfer",
  },
];

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getTailorById(id: string): Tailor | undefined {
  return MOCK_TAILORS.find((t) => t.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}
