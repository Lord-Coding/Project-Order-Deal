// Catégories de menu
export type FoodCategory = 
  | "french-tacos"
  | "tacos"
  | "chicken"
  | "kebab"
  | "meat"
  | "fries"
  | "drinks"
  | "desserts"
  | "sides";

// Plat du menu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string; // URL Cloudinary
  images?: string[]; // Galerie d'images
  isAvailable: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  preparationTime: number; // en minutes
  calories?: number;
  allergens?: string[];
  ingredients: Ingredient[];
  customizations: Customization[];
  createdAt: Date;
  updatedAt: Date;
}

// Ingrédient d'un plat
export interface Ingredient {
  id: string;
  name: string;
  isRemovable: boolean;
  isDefault: boolean;
}

// Personnalisation (taille, extras, etc.)
export interface Customization {
  id: string;
  name: string;
  type: "single" | "multiple"; // single = radio, multiple = checkbox
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // Prix supplémentaire
  isDefault: boolean;
}

// Catégorie pour affichage
export interface Category {
  id: FoodCategory;
  name: string;
  image: string;
  color: string;
  itemCount: number;
}

// DTO pour création/modification
export interface CreateMenuItemDTO {
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  images?: string[];
  preparationTime: number;
  calories?: number;
  allergens?: string[];
  ingredients: Omit<Ingredient, 'id'>[];
  customizations: Omit<Customization, 'id' | 'options'>[];
}

export interface UpdateMenuItemDTO extends Partial<CreateMenuItemDTO> {
  isAvailable?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
}
