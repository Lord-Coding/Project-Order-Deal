// Code promotionnel
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories?: string[];
  applicableItems?: string[];
  excludedItems?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Utilisation de code promo
export interface PromoUsage {
  id: string;
  promoCodeId: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  usedAt: Date;
}

// Avis client
export interface Review {
  id: string;
  orderId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  overallRating: number;
  foodRating: number;
  deliveryRating?: number;
  comment?: string;
  images?: string[];
  restaurantResponse?: {
    message: string;
    respondedAt: Date;
    respondedBy: string;
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Paramètres du restaurant
export interface RestaurantSettings {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  openingHours: {
    [key in DayOfWeek]: {
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    };
  };
  delivery: {
    isEnabled: boolean;
    baseFee: number;
    freeDeliveryMinimum: number;
    estimatedTime: number;
    maxRadius: number;
  };
  pickup: {
    isEnabled: boolean;
    estimatedTime: number;
  };
  dineIn: {
    isEnabled: boolean;
  };
  payment: {
    cashEnabled: boolean;
    cardEnabled: boolean;
    onlineEnabled: boolean;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  updatedAt: Date;
}

export type DayOfWeek = 
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Statistiques du tableau de bord
export interface DashboardStats {
  today: {
    orders: number;
    revenue: number;
    newCustomers: number;
    averageOrderValue: number;
  };
  week: {
    orders: number;
    revenue: number;
    ordersChange: number; // % par rapport à la semaine précédente
    revenueChange: number;
  };
  month: {
    orders: number;
    revenue: number;
    topItems: {
      itemId: string;
      itemName: string;
      quantity: number;
      revenue: number;
    }[];
  };
  ratings: {
    average: number;
    total: number;
    distribution: {
      [key: number]: number; // 1-5 étoiles
    };
  };
}

// DTO pour création de code promo
export interface CreatePromoCodeDTO {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  validFrom: Date;
  validUntil: Date;
  applicableCategories?: string[];
  applicableItems?: string[];
  excludedItems?: string[];
}

// DTO pour mise à jour des paramètres
export interface UpdateRestaurantSettingsDTO extends Partial<Omit<RestaurantSettings, 'id' | 'updatedAt'>> {}
