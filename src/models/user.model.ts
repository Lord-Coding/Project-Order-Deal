// Types pour les rôles utilisateur
export type UserRole = "client" | "admin" | "kitchen" | "driver";

// Interface utilisateur de base
export interface User {
  id: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Client - authentification par téléphone + OTP
export interface Client extends User {
  role: "client";
  phone: string;
  phoneVerified: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  addresses: Address[];
  defaultAddressId?: string;
  favoriteItems: string[]; // IDs des plats favoris
  loyaltyPoints: number;
  notificationPreferences: NotificationPreferences;
}

// Personnel cuisine - ajouté par admin
export interface KitchenStaff extends User {
  role: "kitchen";
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  passwordChangedAt?: Date;
  addedBy: string; // ID admin qui l'a ajouté
}

// Livreur - ajouté par admin
export interface Driver extends User {
  role: "driver";
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  vehicleType: "bike" | "scooter" | "car";
  vehiclePlate?: string;
  isOnline: boolean;
  currentLocation?: GeoLocation;
  passwordChangedAt?: Date;
  addedBy: string; // ID admin qui l'a ajouté
  stats: DriverStats;
}

// Admin
export interface Admin extends User {
  role: "admin";
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  permissions: AdminPermission[];
}

// Types auxiliaires pour les utilisateurs
export interface Address {
  id: string;
  label: string; // "Maison", "Bureau", etc.
  street: string;
  city: string;
  postalCode: string;
  country: string;
  location?: GeoLocation;
  instructions?: string;
  isDefault: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export interface DriverStats {
  totalDeliveries: number;
  todayDeliveries: number;
  totalEarnings: number;
  todayEarnings: number;
  averageRating: number;
  totalRatings: number;
}

export type AdminPermission = 
  | "manage_menu"
  | "manage_orders"
  | "manage_staff"
  | "manage_drivers"
  | "view_analytics"
  | "manage_promotions"
  | "manage_settings";

// Type union pour tous les utilisateurs
export type AnyUser = Client | KitchenStaff | Driver | Admin;

// DTO pour la création d'utilisateurs
export interface CreateClientDTO {
  phone: string;
}

export interface CreateStaffDTO {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "kitchen" | "driver";
  phone?: string; // Requis pour driver
  vehicleType?: "bike" | "scooter" | "car"; // Requis pour driver
  vehiclePlate?: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
