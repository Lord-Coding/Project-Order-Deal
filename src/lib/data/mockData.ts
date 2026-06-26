import burgerImg from "../../assets/hero-burger.png";
import chickenImg from "../../assets/chicken.png";
import friesImg from "../../assets/fries.png";
import drinkImg from "../../assets/drink.png";
import tacoImg from "../../assets/taco.png";
import groundBeefImg from "../../assets/ground-beef.png";
import frenchTacosImg from "../../assets/french-tacos.png";
import nuggetsImg from "../../assets/nuggets.png";
import kebabImg from "../../assets/kebab.png";

// ============ RESTAURANT INFO ============
export const restaurantInfo = {
  id: "1",
  name: "Order Deal",
  description: "Le meilleur fast-food de la ville! Tacos, poulet croustillant et viande hachée maison.",
  address: "123 Avenue de la République, 75011 Paris",
  phone: "+33 1 23 45 67 89",
  email: "contact@tacorush.fr",
  openingHours: {
    lundi: "11:00 - 23:00",
    mardi: "11:00 - 23:00",
    mercredi: "11:00 - 23:00",
    jeudi: "11:00 - 23:00",
    vendredi: "11:00 - 00:00",
    samedi: "11:00 - 00:00",
    dimanche: "12:00 - 22:00",
  },
  rating: 4.8,
  reviewCount: 1247,
  deliveryFee: 2.99,
  minOrder: 12,
  estimatedDelivery: "20-35 min",
};

// ============ CATEGORIES ============
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const categories: Category[] = [
  { id: "tacos", name: "Tacos", icon: "🌮", color: "bg-orange-100", description: "French tacos généreux" },
  { id: "burgers", name: "Burgers", icon: "🍔", color: "bg-red-100", description: "Burgers maison" },
  { id: "poulet", name: "Poulet", icon: "🍗", color: "bg-yellow-100", description: "Poulet croustillant" },
  { id: "viande", name: "Viande Hachée", icon: "🥩", color: "bg-amber-100", description: "Steaks & grillades" },
  { id: "accompagnements", name: "Accompagnements", icon: "🍟", color: "bg-green-100", description: "Frites & sides" },
  { id: "boissons", name: "Boissons", icon: "🥤", color: "bg-blue-100", description: "Sodas & jus" },
  { id: "desserts", name: "Desserts", icon: "🍰", color: "bg-pink-100", description: "Douceurs sucrées" },
  { id: "menus", name: "Menus", icon: "📦", color: "bg-purple-100", description: "Formules complètes" },
];

// ============ FOOD ITEMS ============
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  preparationTime: string;
  isPopular?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  category: string;
  ingredients: string[];
  allergens?: string[];
  calories?: number;
  customizations?: {
    name: string;
    options: { label: string; price: number }[];
  }[];
}

export const allFoodItems: FoodItem[] = [
  // TACOS
  {
    id: "t1",
    name: "Tacos L Poulet",
    description: "French tacos avec poulet mariné, frites, sauce fromagère",
    price: 8.90,
    image: frenchTacosImg,
    rating: 4.9,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "tacos",
    ingredients: ["Poulet mariné", "Frites", "Sauce fromagère", "Salade", "Tomate"],
    calories: 750,
    customizations: [
      { name: "Taille", options: [{ label: "M", price: 0 }, { label: "L", price: 2 }, { label: "XL", price: 4 }] },
      { name: "Sauce", options: [{ label: "Fromagère", price: 0 }, { label: "Algérienne", price: 0 }, { label: "Samouraï", price: 0.50 }] },
    ],
  },
  {
    id: "t2",
    name: "Tacos L Viande Hachée",
    description: "French tacos avec viande hachée épicée, frites, sauce fromagère",
    price: 8.90,
    image: frenchTacosImg,
    rating: 4.8,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "tacos",
    ingredients: ["Viande hachée épicée", "Frites", "Sauce fromagère", "Oignons"],
    isSpicy: true,
    calories: 820,
  },
  {
    id: "t3",
    name: "Tacos XL Mixte",
    description: "Double portion: poulet + viande hachée + frites + double fromage",
    price: 12.90,
    originalPrice: 14.90,
    image: frenchTacosImg,
    rating: 4.9,
    preparationTime: "15-18 min",
    isPopular: true,
    isNew: true,
    category: "tacos",
    ingredients: ["Poulet", "Viande hachée", "Frites", "Double fromage", "Sauce spéciale"],
    calories: 1100,
  },
  {
    id: "t4",
    name: "Tacos Kebab",
    description: "French tacos avec viande kebab, oignons, sauce blanche",
    price: 9.50,
    image: kebabImg,
    rating: 4.7,
    preparationTime: "12-15 min",
    category: "tacos",
    ingredients: ["Viande kebab", "Frites", "Sauce blanche", "Oignons", "Salade"],
    calories: 780,
  },
  // BURGERS
  {
    id: "b1",
    name: "Classic Burger",
    description: "Steak haché 150g, cheddar, salade, tomate, oignons",
    price: 7.90,
    image: burgerImg,
    rating: 4.7,
    preparationTime: "10-12 min",
    isPopular: true,
    category: "burgers",
    ingredients: ["Steak 150g", "Cheddar", "Salade", "Tomate", "Oignons", "Sauce burger"],
    calories: 650,
  },
  {
    id: "b2",
    name: "Double Cheese Burger",
    description: "Double steak, double cheddar, bacon croustillant",
    price: 11.90,
    originalPrice: 13.90,
    image: burgerImg,
    rating: 4.9,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "burgers",
    ingredients: ["2x Steak 100g", "Double cheddar", "Bacon", "Sauce spéciale"],
    calories: 950,
  },
  {
    id: "b3",
    name: "Spicy Burger",
    description: "Steak haché, jalapeños, piment, sauce piquante maison",
    price: 9.50,
    image: burgerImg,
    rating: 4.6,
    preparationTime: "10-12 min",
    isSpicy: true,
    isNew: true,
    category: "burgers",
    ingredients: ["Steak 150g", "Jalapeños", "Piments", "Sauce piquante"],
    calories: 680,
  },
  // POULET
  {
    id: "p1",
    name: "Tenders Poulet x6",
    description: "6 morceaux de poulet pané croustillant, sauce au choix",
    price: 7.50,
    image: chickenImg,
    rating: 4.8,
    preparationTime: "8-10 min",
    isPopular: true,
    category: "poulet",
    ingredients: ["Poulet pané", "Épices secrètes"],
    calories: 480,
  },
  {
    id: "p2",
    name: "Bucket Poulet x12",
    description: "12 morceaux de poulet frit, idéal pour partager",
    price: 14.90,
    image: chickenImg,
    rating: 4.9,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "poulet",
    ingredients: ["Poulet frit", "Épices maison"],
    calories: 960,
  },
  {
    id: "p3",
    name: "Wings Épicées x8",
    description: "Ailes de poulet marinées sauce buffalo",
    price: 8.90,
    image: chickenImg,
    rating: 4.7,
    preparationTime: "10-12 min",
    isSpicy: true,
    category: "poulet",
    ingredients: ["Ailes de poulet", "Sauce buffalo", "Épices"],
    calories: 520,
  },
  {
    id: "p4",
    name: "Nuggets x9",
    description: "9 nuggets de poulet croustillants",
    price: 6.50,
    image: nuggetsImg,
    rating: 4.6,
    preparationTime: "6-8 min",
    category: "poulet",
    ingredients: ["Poulet pané"],
    calories: 380,
  },
  // VIANDE HACHÉE
  {
    id: "v1",
    name: "Assiette Viande Hachée",
    description: "Viande hachée grillée, frites, salade, sauce au choix",
    price: 10.90,
    image: groundBeefImg,
    rating: 4.8,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "viande",
    ingredients: ["Viande hachée 200g", "Frites", "Salade", "Sauce"],
    calories: 720,
  },
  {
    id: "v2",
    name: "Wrap Viande Hachée",
    description: "Tortilla garnie de viande hachée épicée, légumes frais",
    price: 7.90,
    image: tacoImg,
    rating: 4.7,
    preparationTime: "8-10 min",
    category: "viande",
    ingredients: ["Viande hachée épicée", "Tortilla", "Légumes", "Sauce"],
    isSpicy: true,
    calories: 580,
  },
  {
    id: "v3",
    name: "Box Viande Kefta",
    description: "Kefta maison aux épices orientales, riz, sauce yaourt",
    price: 11.50,
    image: groundBeefImg,
    rating: 4.9,
    preparationTime: "15-18 min",
    isNew: true,
    category: "viande",
    ingredients: ["Kefta", "Riz", "Sauce yaourt", "Épices orientales"],
    calories: 680,
  },
  // ACCOMPAGNEMENTS
  {
    id: "a1",
    name: "Frites Maison",
    description: "Frites fraîches croustillantes",
    price: 3.50,
    image: friesImg,
    rating: 4.6,
    preparationTime: "5-7 min",
    category: "accompagnements",
    ingredients: ["Pommes de terre", "Sel"],
    calories: 320,
  },
  {
    id: "a2",
    name: "Potatoes",
    description: "Quartiers de pommes de terre épicés",
    price: 4.00,
    image: friesImg,
    rating: 4.5,
    preparationTime: "6-8 min",
    category: "accompagnements",
    ingredients: ["Pommes de terre", "Épices"],
    calories: 350,
  },
  {
    id: "a3",
    name: "Onion Rings",
    description: "Rondelles d'oignon panées croustillantes",
    price: 4.50,
    image: friesImg,
    rating: 4.4,
    preparationTime: "5-7 min",
    category: "accompagnements",
    ingredients: ["Oignons", "Panure"],
    calories: 280,
  },
  // BOISSONS
  {
    id: "d1",
    name: "Coca-Cola 33cl",
    description: "Coca-Cola original",
    price: 2.50,
    image: drinkImg,
    rating: 4.5,
    preparationTime: "Immédiat",
    category: "boissons",
    ingredients: [],
    calories: 139,
  },
  {
    id: "d2",
    name: "Fanta Orange 33cl",
    description: "Fanta à l'orange",
    price: 2.50,
    image: drinkImg,
    rating: 4.4,
    preparationTime: "Immédiat",
    category: "boissons",
    ingredients: [],
    calories: 126,
  },
  {
    id: "d3",
    name: "Ice Tea Pêche 33cl",
    description: "Thé glacé à la pêche",
    price: 2.50,
    image: drinkImg,
    rating: 4.6,
    preparationTime: "Immédiat",
    category: "boissons",
    ingredients: [],
    calories: 95,
  },
  {
    id: "d4",
    name: "Eau Minérale 50cl",
    description: "Eau plate ou gazeuse",
    price: 1.50,
    image: drinkImg,
    rating: 4.3,
    preparationTime: "Immédiat",
    category: "boissons",
    ingredients: [],
    calories: 0,
  },
  // MENUS
  {
    id: "m1",
    name: "Menu Tacos",
    description: "Tacos L + Frites + Boisson 33cl",
    price: 11.90,
    originalPrice: 14.90,
    image: frenchTacosImg,
    rating: 4.9,
    preparationTime: "15-18 min",
    isPopular: true,
    category: "menus",
    ingredients: ["Tacos L au choix", "Frites", "Boisson"],
    calories: 1100,
  },
  {
    id: "m2",
    name: "Menu Burger",
    description: "Burger au choix + Frites + Boisson 33cl",
    price: 10.90,
    originalPrice: 13.40,
    image: burgerImg,
    rating: 4.8,
    preparationTime: "12-15 min",
    isPopular: true,
    category: "menus",
    ingredients: ["Burger au choix", "Frites", "Boisson"],
    calories: 950,
  },
  {
    id: "m3",
    name: "Menu Poulet",
    description: "Tenders x6 + Frites + Boisson + Sauce",
    price: 10.50,
    originalPrice: 12.50,
    image: chickenImg,
    rating: 4.7,
    preparationTime: "10-12 min",
    category: "menus",
    ingredients: ["Tenders x6", "Frites", "Boisson", "Sauce"],
    calories: 880,
  },
  // ============ 20+ NOUVEAUX PLATS ============
  { id: "n1", name: "Tacos XL Mixte", description: "French tacos XL poulet + viande hachée, double fromage", price: 12.90, image: frenchTacosImg, rating: 4.9, preparationTime: "15-18 min", isPopular: true, category: "tacos", ingredients: ["Poulet", "Viande hachée", "Double fromage", "Frites"], calories: 980 },
  { id: "n2", name: "Tacos Végétarien", description: "Légumes grillés, falafels, sauce harissa douce", price: 8.50, image: tacoImg, rating: 4.6, preparationTime: "10-12 min", isVegetarian: true, category: "tacos", ingredients: ["Falafels", "Légumes", "Sauce harissa"], calories: 620 },
  { id: "n3", name: "Tacos Spicy Chicken", description: "Poulet épicé, jalapeños, sauce samouraï feu", price: 9.50, image: frenchTacosImg, rating: 4.8, preparationTime: "12-15 min", isSpicy: true, category: "tacos", ingredients: ["Poulet épicé", "Jalapeños", "Sauce samouraï"], calories: 810 },
  { id: "n4", name: "Cheese Burger Deluxe", description: "Steak 180g, double cheddar, bacon, oignons frits", price: 10.90, image: burgerImg, rating: 4.9, preparationTime: "10-12 min", isPopular: true, category: "burgers", ingredients: ["Steak 180g", "Double cheddar", "Bacon", "Oignons"], calories: 860 },
  { id: "n5", name: "Chicken Burger BBQ", description: "Filet de poulet pané, sauce BBQ, salade", price: 8.90, image: burgerImg, rating: 4.7, preparationTime: "10-12 min", category: "burgers", ingredients: ["Poulet pané", "BBQ", "Salade"], calories: 720 },
  { id: "n6", name: "Veggie Burger", description: "Galette de légumes, avocat, tomate", price: 8.50, image: burgerImg, rating: 4.5, preparationTime: "8-10 min", isVegetarian: true, category: "burgers", ingredients: ["Galette légumes", "Avocat", "Tomate"], calories: 590 },
  { id: "n7", name: "Tenders x6", description: "6 aiguillettes de poulet panées maison", price: 7.90, image: chickenImg, rating: 4.7, preparationTime: "8-10 min", category: "poulet", ingredients: ["Poulet pané"], calories: 540 },
  { id: "n8", name: "Wings Buffalo x8", description: "8 ailes de poulet sauce buffalo", price: 9.50, image: chickenImg, rating: 4.8, preparationTime: "10-12 min", isSpicy: true, category: "poulet", ingredients: ["Ailes poulet", "Sauce buffalo"], calories: 680 },
  { id: "n9", name: "Bucket Famille", description: "12 morceaux de poulet, 4 sauces", price: 19.90, originalPrice: 24.90, image: chickenImg, rating: 4.9, preparationTime: "15-20 min", isPopular: true, category: "poulet", ingredients: ["Poulet x12", "Sauces x4"], calories: 1450 },
  { id: "n10", name: "Steak Haché Maison", description: "Steak haché 200g, pommes grenailles", price: 13.90, image: groundBeefImg, rating: 4.7, preparationTime: "12-15 min", category: "viande", ingredients: ["Steak 200g", "Pommes grenailles"], calories: 720 },
  { id: "n11", name: "Brochette de Bœuf", description: "Brochette grillée, frites, sauce poivre", price: 14.50, image: groundBeefImg, rating: 4.8, preparationTime: "15-18 min", category: "viande", ingredients: ["Bœuf", "Frites", "Sauce poivre"], calories: 810 },
  { id: "n12", name: "Kebab Assiette", description: "Viande de kebab, riz, salade, sauce blanche", price: 11.90, image: kebabImg, rating: 4.6, preparationTime: "10-12 min", category: "viande", ingredients: ["Kebab", "Riz", "Salade"], calories: 890 },
  { id: "n13", name: "Frites Maison", description: "Grandes frites fraîches", price: 3.50, image: friesImg, rating: 4.8, preparationTime: "5-7 min", category: "accompagnements", ingredients: ["Pommes de terre"], calories: 420 },
  { id: "n14", name: "Potatoes Épicées", description: "Pommes de terre rissolées épicées", price: 4.50, image: friesImg, rating: 4.7, preparationTime: "6-8 min", isSpicy: true, category: "accompagnements", ingredients: ["Potatoes", "Épices"], calories: 460 },
  { id: "n15", name: "Onion Rings x8", description: "Rondelles d'oignon panées", price: 4.90, image: friesImg, rating: 4.5, preparationTime: "5-7 min", isVegetarian: true, category: "accompagnements", ingredients: ["Oignons", "Panure"], calories: 380 },
  { id: "n16", name: "Mozzarella Sticks x6", description: "Bâtonnets de mozza panés, sauce tomate", price: 5.90, image: nuggetsImg, rating: 4.7, preparationTime: "6-8 min", isVegetarian: true, category: "accompagnements", ingredients: ["Mozzarella", "Sauce tomate"], calories: 510 },
  { id: "n17", name: "Coca-Cola 33cl", description: "Canette fraîche", price: 2.50, image: drinkImg, rating: 4.6, preparationTime: "1 min", category: "boissons", ingredients: ["Coca-Cola"], calories: 140 },
  { id: "n18", name: "Ice Tea Pêche 50cl", description: "Boisson au thé glacé pêche", price: 3.50, image: drinkImg, rating: 4.7, preparationTime: "1 min", category: "boissons", ingredients: ["Thé", "Pêche"], calories: 180 },
  { id: "n19", name: "Jus d'Orange Pressé", description: "100% pur jus pressé minute", price: 4.50, image: drinkImg, rating: 4.9, preparationTime: "3 min", isNew: true, category: "boissons", ingredients: ["Orange"], calories: 120 },
  { id: "n20", name: "Brownie Chocolat", description: "Brownie tiède, cœur fondant", price: 4.90, image: nuggetsImg, rating: 4.9, preparationTime: "4 min", isNew: true, category: "desserts", ingredients: ["Chocolat", "Beurre"], calories: 480 },
  { id: "n21", name: "Tiramisu Maison", description: "Tiramisu italien traditionnel", price: 5.50, image: nuggetsImg, rating: 4.8, preparationTime: "2 min", category: "desserts", ingredients: ["Mascarpone", "Café", "Cacao"], calories: 420 },
  { id: "n22", name: "Cookie Géant", description: "Cookie maison aux pépites de chocolat", price: 3.90, image: nuggetsImg, rating: 4.7, preparationTime: "2 min", category: "desserts", ingredients: ["Pépites chocolat"], calories: 380 },
  { id: "n23", name: "Menu Maxi Tacos", description: "Tacos L + frites + boisson", price: 13.90, originalPrice: 16.90, image: frenchTacosImg, rating: 4.9, preparationTime: "15-18 min", isPopular: true, category: "menus", ingredients: ["Tacos L", "Frites", "Boisson"], calories: 1150 },
  { id: "n24", name: "Menu Burger Duo", description: "2 burgers + 2 frites + 2 boissons", price: 19.90, originalPrice: 24.90, image: burgerImg, rating: 4.8, preparationTime: "12-15 min", category: "menus", ingredients: ["Burgers x2", "Frites x2", "Boissons x2"], calories: 1680 },
];

// ============ USER ROLES ============
export type UserRole = "client" | "admin" | "personnel" | "livreur";

export interface User {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  instructions?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "u1",
    phone: "+33 6 12 34 56 78",
    name: "Ahmed Benali",
    role: "client",
    avatar: burgerImg,
    addresses: [
      { id: "a1", label: "Maison", address: "15 Rue de la Paix", city: "Paris", postalCode: "75002", isDefault: true },
      { id: "a2", label: "Travail", address: "42 Avenue des Champs-Élysées", city: "Paris", postalCode: "75008", isDefault: false },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: "u2",
    email: "admin@tacorush.fr",
    name: "Sophie Martin",
    role: "admin",
    createdAt: "2023-06-01",
  },
  {
    id: "u3",
    email: "cuisine@tacorush.fr",
    name: "Karim Dupont",
    role: "personnel",
    createdAt: "2023-08-15",
  },
  {
    id: "u4",
    email: "livraison@tacorush.fr",
    name: "Lucas Bernard",
    role: "livreur",
    avatar: burgerImg,
    createdAt: "2023-09-20",
  },
];

export const mockCurrentUser = mockUsers[0];

// ============ CART ============
export interface CartItem extends FoodItem {
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: { name: string; option: string; price: number }[];
}

export const mockCartItems: CartItem[] = [
  { ...allFoodItems[0], quantity: 2 },
  { ...allFoodItems[14], quantity: 1 },
  { ...allFoodItems[18], quantity: 2 },
];

// ============ ORDERS ============
export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "ready" 
  | "picked_up" 
  | "on_the_way" 
  | "delivered" 
  | "cancelled";

export type PaymentMethod = "cash" | "card" | "online";

export type DeliveryType = "delivery" | "pickup" | "dine_in";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed";
  deliveryAddress: Address;
  deliveryType: DeliveryType;
  specialInstructions?: string;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  preparerId?: string;
  preparerName?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: { lat: number; lng: number };
  timeline: { status: OrderStatus; timestamp: string; note?: string }[];
}

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "TR-2024-001",
    customerId: "u1",
    customerName: "Ahmed Benali",
    customerPhone: "+33 6 12 34 56 78",
    items: [
      { ...allFoodItems[0], quantity: 2 },
      { ...allFoodItems[14], quantity: 1 },
    ],
    subtotal: 21.30,
    deliveryFee: 2.99,
    discount: 0,
    total: 24.29,
    status: "on_the_way",
    paymentMethod: "card",
    paymentStatus: "paid",
    deliveryAddress: { id: "a1", label: "Maison", address: "15 Rue de la Paix", city: "Paris", postalCode: "75002", isDefault: true },
    deliveryType: "delivery",
    createdAt: "2024-12-25T12:30:00",
    estimatedDelivery: "13:05",
    driverId: "u4",
    driverName: "Lucas Bernard",
    driverPhone: "+33 6 98 76 54 32",
    driverLocation: { lat: 48.8584, lng: 2.2945 },
    preparerId: "u3",
    preparerName: "Karim Dupont",
    timeline: [
      { status: "pending", timestamp: "2024-12-25T12:30:00" },
      { status: "confirmed", timestamp: "2024-12-25T12:31:00" },
      { status: "preparing", timestamp: "2024-12-25T12:35:00" },
      { status: "ready", timestamp: "2024-12-25T12:48:00" },
      { status: "picked_up", timestamp: "2024-12-25T12:50:00" },
      { status: "on_the_way", timestamp: "2024-12-25T12:52:00" },
    ],
  },
  {
    id: "o2",
    orderNumber: "TR-2024-002",
    customerId: "u1",
    customerName: "Ahmed Benali",
    customerPhone: "+33 6 12 34 56 78",
    items: [
      { ...allFoodItems[4], quantity: 1 },
      { ...allFoodItems[7], quantity: 1 },
      { ...allFoodItems[18], quantity: 1 },
    ],
    subtotal: 17.90,
    deliveryFee: 0,
    discount: 2.00,
    total: 15.90,
    status: "preparing",
    paymentMethod: "cash",
    paymentStatus: "pending",
    deliveryAddress: { id: "a2", label: "Sur place", address: "Table 5", city: "Paris", postalCode: "75008", isDefault: false },
    deliveryType: "dine_in",
    createdAt: "2024-12-25T13:00:00",
    estimatedDelivery: "13:20",
    preparerId: "u3",
    preparerName: "Karim Dupont",
    timeline: [
      { status: "pending", timestamp: "2024-12-25T13:00:00" },
      { status: "confirmed", timestamp: "2024-12-25T13:02:00" },
      { status: "preparing", timestamp: "2024-12-25T13:05:00" },
    ],
  },
  {
    id: "o3",
    orderNumber: "TR-2024-003",
    customerId: "c2",
    customerName: "Marie Leroy",
    customerPhone: "+33 6 11 22 33 44",
    items: [
      { ...allFoodItems[2], quantity: 1 },
      { ...allFoodItems[8], quantity: 1 },
    ],
    subtotal: 21.80,
    deliveryFee: 0,
    discount: 0,
    total: 21.80,
    status: "pending",
    paymentMethod: "online",
    paymentStatus: "paid",
    deliveryAddress: { id: "a3", label: "À emporter", address: "Retrait comptoir", city: "Paris", postalCode: "75015", isDefault: true },
    deliveryType: "pickup",
    createdAt: "2024-12-25T13:10:00",
    estimatedDelivery: "13:25",
    timeline: [
      { status: "pending", timestamp: "2024-12-25T13:10:00" },
    ],
  },
  {
    id: "o4",
    orderNumber: "TR-2024-004",
    customerId: "u1",
    customerName: "Ahmed Benali",
    customerPhone: "+33 6 12 34 56 78",
    items: [
      { ...allFoodItems[5], quantity: 2 },
    ],
    subtotal: 23.80,
    deliveryFee: 2.99,
    discount: 5.00,
    total: 21.79,
    status: "delivered",
    paymentMethod: "card",
    paymentStatus: "paid",
    deliveryAddress: { id: "a1", label: "Maison", address: "15 Rue de la Paix", city: "Paris", postalCode: "75002", isDefault: true },
    deliveryType: "delivery",
    createdAt: "2024-12-24T19:30:00",
    estimatedDelivery: "20:10",
    actualDelivery: "20:05",
    driverId: "u4",
    driverName: "Lucas Bernard",
    timeline: [
      { status: "pending", timestamp: "2024-12-24T19:30:00" },
      { status: "confirmed", timestamp: "2024-12-24T19:31:00" },
      { status: "preparing", timestamp: "2024-12-24T19:35:00" },
      { status: "ready", timestamp: "2024-12-24T19:50:00" },
      { status: "picked_up", timestamp: "2024-12-24T19:52:00" },
      { status: "on_the_way", timestamp: "2024-12-24T19:55:00" },
      { status: "delivered", timestamp: "2024-12-24T20:05:00" },
    ],
  },
  {
    id: "o5",
    orderNumber: "TR-2024-005",
    customerId: "c3",
    customerName: "Pierre Moreau",
    customerPhone: "+33 6 55 66 77 88",
    items: [
      { ...allFoodItems[1], quantity: 1 },
      { ...allFoodItems[15], quantity: 1 },
      { ...allFoodItems[19], quantity: 1 },
    ],
    subtotal: 14.90,
    deliveryFee: 2.99,
    discount: 0,
    total: 17.89,
    status: "ready",
    paymentMethod: "cash",
    paymentStatus: "pending",
    deliveryAddress: { id: "a4", label: "Bureau", address: "100 Avenue Victor Hugo", city: "Paris", postalCode: "75016", isDefault: true },
    deliveryType: "delivery",
    createdAt: "2024-12-25T12:45:00",
    estimatedDelivery: "13:20",
    preparerId: "u3",
    preparerName: "Karim Dupont",
    timeline: [
      { status: "pending", timestamp: "2024-12-25T12:45:00" },
      { status: "confirmed", timestamp: "2024-12-25T12:46:00" },
      { status: "preparing", timestamp: "2024-12-25T12:50:00" },
      { status: "ready", timestamp: "2024-12-25T13:05:00" },
    ],
  },
  {
    id: "o6",
    orderNumber: "TR-2024-006",
    customerId: "c4",
    customerName: "Sophie Martin",
    customerPhone: "+33 6 99 88 77 66",
    items: [
      { ...allFoodItems[3], quantity: 1 },
      { ...allFoodItems[10], quantity: 2 },
    ],
    subtotal: 18.50,
    deliveryFee: 0,
    discount: 0,
    total: 18.50,
    status: "pending",
    paymentMethod: "card",
    paymentStatus: "paid",
    deliveryAddress: { id: "a5", label: "Sur place", address: "Table 8", city: "Paris", postalCode: "75002", isDefault: true },
    deliveryType: "dine_in",
    createdAt: "2024-12-25T13:15:00",
    estimatedDelivery: "13:35",
    timeline: [
      { status: "pending", timestamp: "2024-12-25T13:15:00" },
    ],
  },
];

// ============ REVIEWS ============
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  orderId: string;
  rating: number;
  comment: string;
  foodRating: number;
  deliveryRating: number;
  images?: string[];
  createdAt: string;
  response?: {
    text: string;
    createdAt: string;
  };
}

export const mockReviews: Review[] = [
  {
    id: "r1",
    userId: "u1",
    userName: "Ahmed B.",
    orderId: "o4",
    rating: 5,
    comment: "Excellent! Les tacos sont incroyables, bien garnis et la sauce fromagère est parfaite. Livraison rapide!",
    foodRating: 5,
    deliveryRating: 5,
    createdAt: "2024-12-24T21:00:00",
    response: {
      text: "Merci beaucoup pour votre avis! À très bientôt chez TacoRush 🌮",
      createdAt: "2024-12-24T22:00:00",
    },
  },
  {
    id: "r2",
    userId: "c2",
    userName: "Marie L.",
    orderId: "o6",
    rating: 4,
    comment: "Très bon burger, bien copieux. Juste un peu d'attente sur la livraison.",
    foodRating: 5,
    deliveryRating: 3,
    createdAt: "2024-12-23T20:30:00",
  },
  {
    id: "r3",
    userId: "c4",
    userName: "Thomas D.",
    orderId: "o7",
    rating: 5,
    comment: "Le bucket de poulet est juste parfait! Croustillant à l'extérieur, tendre à l'intérieur. Je recommande!",
    foodRating: 5,
    deliveryRating: 5,
    images: [chickenImg],
    createdAt: "2024-12-22T19:45:00",
  },
  {
    id: "r4",
    userId: "c5",
    userName: "Emma P.",
    orderId: "o8",
    rating: 4,
    comment: "Super rapport qualité-prix pour le menu tacos. Les frites sont excellentes aussi.",
    foodRating: 4,
    deliveryRating: 4,
    createdAt: "2024-12-21T21:15:00",
  },
  {
    id: "r5",
    userId: "c6",
    userName: "Julien M.",
    orderId: "o9",
    rating: 5,
    comment: "Première commande et déjà conquis! Le tacos XL mixte est énorme et délicieux.",
    foodRating: 5,
    deliveryRating: 5,
    createdAt: "2024-12-20T20:00:00",
    response: {
      text: "Bienvenue dans la famille TacoRush! Merci pour ce super retour 🙌",
      createdAt: "2024-12-20T21:30:00",
    },
  },
];

// ============ PROMOS ============
export interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrder: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export const mockPromos: Promo[] = [
  {
    id: "p1",
    code: "BIENVENUE",
    title: "Bienvenue!",
    description: "20% de réduction sur votre première commande",
    discount: 20,
    discountType: "percentage",
    minOrder: 15,
    maxDiscount: 10,
    validFrom: "2024-01-01",
    validUntil: "2025-12-31",
    usageLimit: 1,
    usageCount: 0,
    isActive: true,
  },
  {
    id: "p2",
    code: "LIVRAISON",
    title: "Livraison offerte",
    description: "Livraison gratuite dès 20€ de commande",
    discount: 2.99,
    discountType: "fixed",
    minOrder: 20,
    validFrom: "2024-12-01",
    validUntil: "2025-01-31",
    usageCount: 156,
    isActive: true,
  },
  {
    id: "p3",
    code: "NOEL2024",
    title: "Offre de Noël",
    description: "5€ offerts sur les menus",
    discount: 5,
    discountType: "fixed",
    minOrder: 25,
    validFrom: "2024-12-20",
    validUntil: "2024-12-26",
    usageCount: 89,
    isActive: true,
  },
];

// ============ STATS (ADMIN) ============
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  activeDeliveries: number;
  averageRating: number;
  totalCustomers: number;
  popularItems: { item: FoodItem; count: number }[];
  revenueByDay: { day: string; revenue: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
}

export const mockDashboardStats: DashboardStats = {
  todayOrders: 47,
  todayRevenue: 892.50,
  pendingOrders: 3,
  activeDeliveries: 2,
  averageRating: 4.8,
  totalCustomers: 1247,
  popularItems: [
    { item: allFoodItems[0], count: 156 },
    { item: allFoodItems[2], count: 134 },
    { item: allFoodItems[4], count: 98 },
    { item: allFoodItems[7], count: 87 },
  ],
  revenueByDay: [
    { day: "Lun", revenue: 720 },
    { day: "Mar", revenue: 680 },
    { day: "Mer", revenue: 890 },
    { day: "Jeu", revenue: 750 },
    { day: "Ven", revenue: 1120 },
    { day: "Sam", revenue: 1350 },
    { day: "Dim", revenue: 980 },
  ],
  ordersByStatus: [
    { status: "pending", count: 3 },
    { status: "preparing", count: 5 },
    { status: "ready", count: 2 },
    { status: "on_the_way", count: 4 },
    { status: "delivered", count: 33 },
  ],
};

// ============ PERSONNEL STATS ============
export interface PersonnelStats {
  ordersToday: number;
  averagePrepTime: string;
  pendingOrders: Order[];
  preparingOrders: Order[];
  readyOrders: Order[];
}

export const mockPersonnelStats: PersonnelStats = {
  ordersToday: 23,
  averagePrepTime: "14 min",
  pendingOrders: mockOrders.filter(o => o.status === "pending"),
  preparingOrders: mockOrders.filter(o => o.status === "preparing"),
  readyOrders: mockOrders.filter(o => o.status === "ready"),
};

// ============ DRIVER STATS ============
export interface DriverStats {
  deliveriesToday: number;
  activeDelivery: Order | null;
  pendingPickups: Order[];
  completedToday: number;
  earnings: number;
  rating: number;
}

export const mockDriverStats: DriverStats = {
  deliveriesToday: 8,
  activeDelivery: mockOrders.find(o => o.status === "on_the_way") || null,
  pendingPickups: mockOrders.filter(o => o.status === "ready"),
  completedToday: 6,
  earnings: 48.50,
  rating: 4.9,
};

// ============ FAVORITES ============
export const mockFavoriteItems = allFoodItems.filter(item => item.isPopular);
