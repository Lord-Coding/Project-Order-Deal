import { type Address, type GeoLocation, type Client, type Driver } from './user.model';
import { type MenuItem, type CustomizationOption } from './menu.model';

// Statut de commande
export type OrderStatus = 
  | "pending"      // En attente de confirmation
  | "confirmed"    // Confirmée
  | "preparing"    // En préparation
  | "ready"        // Prête
  | "on_the_way"   // En livraison
  | "delivered"    // Livrée
  | "cancelled";   // Annulée

// Type de commande
export type OrderType = "dine_in" | "pickup" | "delivery";

// Type de paiement
export type PaymentMethod = "cash" | "card" | "online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Commande principale
export interface Order {
  id: string;
  orderNumber: string; // Ex: "ORD-2024-001234"
  
  // Client
  clientId: string;
  client?: Partial<Client>; // Données dénormalisées
  
  // Type et livraison
  type: OrderType;
  deliveryAddress?: Address;
  deliveryInstructions?: string;
  
  // Livreur (si livraison)
  driverId?: string;
  driver?: Partial<Driver>;
  
  // Articles
  items: OrderItem[];
  
  // Prix
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  
  // Paiement
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  
  // Statut et suivi
  status: OrderStatus;
  statusHistory: OrderStatusChange[];
  
  // Temps
  createdAt: Date;
  updatedAt: Date;
  estimatedReadyAt?: Date;
  estimatedDeliveryAt?: Date;
  completedAt?: Date;
  
  // Notes
  customerNote?: string;
  kitchenNote?: string;
  
  // Évaluation
  rating?: OrderRating;
}

// Article dans une commande
export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: Partial<MenuItem>; // Données dénormalisées
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: OrderItemCustomization[];
  specialInstructions?: string;
}

export interface OrderItemCustomization {
  customizationId: string;
  customizationName: string;
  selectedOptions: CustomizationOption[];
  additionalPrice: number;
}

// Historique des changements de statut
export interface OrderStatusChange {
  status: OrderStatus;
  changedAt: Date;
  changedBy: string; // ID utilisateur
  changedByRole: string;
  note?: string;
}

// Évaluation de commande
export interface OrderRating {
  overall: number; // 1-5
  food: number;
  delivery?: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

// Suivi en temps réel (Realtime Database)
export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  driverLocation?: GeoLocation;
  estimatedArrival?: number; // minutes restantes
  lastUpdated: Date;
}

// DTO pour création de commande
export interface CreateOrderDTO {
  type: OrderType;
  items: {
    menuItemId: string;
    quantity: number;
    customizations?: {
      customizationId: string;
      optionIds: string[];
    }[];
    specialInstructions?: string;
  }[];
  deliveryAddressId?: string;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  customerNote?: string;
}

// DTO pour mise à jour de statut
export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string;
}
