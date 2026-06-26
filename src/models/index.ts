// Export de tous les modèles
export * from './user.model';
export * from './menu.model';
export * from './order.model';
export * from './notification.model';
export * from './restaurant.model';

// Types utilitaires communs
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

// Types pour le panier (côté client uniquement)
export interface CartItem {
  menuItemId: string;
  menuItem: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: {
    customizationId: string;
    customizationName: string;
    selectedOptions: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
}

// États d'authentification
export interface AuthState {
  user: import('./user.model').AnyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// OTP verification
export interface OTPVerification {
  phone: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}
