import React, { createContext, useContext, useState, useCallback } from "react";
import { type CartItem, type FoodItem, type Promo } from "../lib/data/mockData";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedPromo: Promo | null;
  addItem: (item: FoodItem, quantity?: number, options?: CartItem["selectedOptions"]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (promo: Promo) => void;
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);

  const deliveryFee = 2.99;

  const addItem = useCallback((item: FoodItem, quantity = 1, options?: CartItem["selectedOptions"]) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      return [...prev, { ...item, quantity, selectedOptions: options }];
    });
    
    toast.success(`${item.name} ajouté au panier`, {
      description: `${quantity}x - ${(item.price * quantity).toFixed(2)}€`,
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    toast.success("Article retiré du panier");
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
  }, []);

  const applyPromo = useCallback((promo: Promo) => {
    setAppliedPromo(promo);
    toast.success(`Code promo "${promo.code}" appliqué!`);
  }, []);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    toast.success("Code promo retiré");
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const optionsPrice = item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0;
    return sum + (item.price + optionsPrice) * item.quantity;
  }, 0);

  const discount = appliedPromo
    ? appliedPromo.discountType === "percentage"
      ? Math.min((subtotal * appliedPromo.discount) / 100, appliedPromo.maxDiscount || Infinity)
      : appliedPromo.discount
    : 0;

  const total = subtotal + deliveryFee - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedPromo,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
