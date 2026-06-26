import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Minus, Plus, ChevronRight,
  CreditCard, Banknote, Smartphone,
} from "lucide-react";
import {
  Trash, Tag, Location, ShoppingCart as ShoppingCartIcon,
  Money, Mobile,
} from "iconsax-react";
import LottiePlayer from "../components/LottiePlayer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { mockPromos, mockCurrentUser, type PaymentMethod } from "../lib/data/mockData";
import BottomNav from "../components/BottomNav";
import { toast } from "sonner";
import emptyCartAnimation from "../assets/lottie/empty-cart.json";
import successAnimation from "../assets/lottie/success.json";

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 24, transition: { duration: 0.25 } },
};

const Cart = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const navState  = (location.state ?? null) as { fromDetail?: boolean } | null;
  const showBack  = navState?.fromDetail === true;

  const {
    items, subtotal, deliveryFee, discount, total, appliedPromo,
    updateQuantity, removeItem, applyPromo, removePromo, clearCart,
  } = useCart();

  const [promoCode, setPromoCode]         = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [checkedOut, setCheckedOut]       = useState(false);
  const [selectedAddress] = useState(mockCurrentUser.addresses?.find((a) => a.isDefault));

  const handleApplyPromo = () => {
    const promo = mockPromos.find((p) => p.code.toLowerCase() === promoCode.toLowerCase());
    if (!promo) return toast.error("Code promo invalide");
    if (subtotal < promo.minOrder) return toast.error(`Commande minimum : ${promo.minOrder}€`);
    applyPromo(promo);
  };

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      toast.success("Commande passée !", { description: "Vous pouvez suivre votre commande." });
      clearCart();
      setCheckedOut(false);
      navigate("/orders");
    }, 2200);
  };

  return (
    <div className="cart-page">
      {/* ── Success overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {checkedOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
          >
            <LottiePlayer
              animationData={successAnimation}
              loop={false}
              style={{ width: 160, height: 160 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-1"
            >
              <h2 className="font-display font-extrabold text-2xl">Commande confirmée !</h2>
              <p className="text-muted-foreground text-sm">Redirection vers le suivi…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" aria-label="Retour">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary">
              <ShoppingCart size={20} color="hsl(var(--primary))" variant="Bold" />
            </div>
          )}
          <h1 className="font-display font-bold text-lg flex-1">Mon Panier</h1>
          {items.length > 0 && (
            <span className="text-sm text-muted-foreground">{items.length} article{items.length > 1 ? "s" : ""}</span>
          )}
        </div>
      </motion.header>

      {/* ── Content ──────────────────────────────────────────────── */}
      <main className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4 pb-40">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              {/* Lottie empty cart */}
              <LottiePlayer
                animationData={emptyCartAnimation}
                loop
                style={{ width: 180, height: 180 }}
              />
              <h2 className="font-display font-bold text-xl mb-2 mt-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">Ajoutez des plats délicieux !</p>
              <Button onClick={() => navigate("/")}>Voir le menu</Button>
            </motion.div>
          ) : (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Cart items */}
              <div className="space-y-3">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div key={item.id} layout variants={itemVariants} initial="hidden" animate="show" exit="exit" custom={i}>
                      <Card className="p-3 sm:p-4">
                        <div className="flex gap-3">
                          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" aria-label="Retirer">
                                <Trash size={16} variant="Bold" />
                              </motion.button>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-primary">{(item.price * item.quantity).toFixed(2)}€</span>
                              <div className="flex items-center gap-1.5 bg-muted rounded-full p-1">
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors">
                                  <Minus className="w-3 h-3" />
                                </motion.button>
                                <span className="text-sm font-bold min-w-[1.25rem] text-center">{item.quantity}</span>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors">
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Promo */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Tag size={20} color="hsl(var(--primary))" variant="Bold" className="shrink-0" />
                    <Input placeholder="Code promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo}>Appliquer</Button>
                  </div>
                  <AnimatePresence>
                    {appliedPromo && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between mt-2 p-2 bg-success/10 text-success rounded-lg text-sm">
                        <span>✓ {appliedPromo.title}</span>
                        <button onClick={removePromo} className="hover:underline text-xs">Retirer</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Address */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                <Card className="p-3 sm:p-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate("/addresses")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Location size={20} color="hsl(var(--primary))" variant="Bold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Livrer à</p>
                      <p className="font-semibold text-sm line-clamp-1">{selectedAddress?.address || "Ajouter une adresse"}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </motion.div>

              {/* Payment */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}>
                <Card className="p-3 sm:p-4">
                  <h3 className="font-semibold mb-3">Moyen de paiement</h3>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="space-y-2">
                    {[
                      { value: "card",   label: "Carte bancaire",         Icon: CreditCard,   className: "text-primary" },
                      { value: "cash",   label: "Espèces à la livraison", Icon: Banknote,     className: "text-success" },
                      { value: "online", label: "Paiement en ligne",      Icon: Smartphone,   className: "text-coral"   },
                    ].map((opt) => (
                      <div key={opt.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label htmlFor={opt.value} className="flex items-center gap-2 flex-1 cursor-pointer">
                          <opt.Icon className={`w-5 h-5 ${opt.className}`} />
                          <span className="text-sm">{opt.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              </motion.div>

              {/* Summary */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
                <Card className="p-3 sm:p-4">
                  <h3 className="font-semibold mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{subtotal.toFixed(2)}€</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{deliveryFee.toFixed(2)}€</span></div>
                    <AnimatePresence>
                      {discount > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex justify-between text-success">
                          <span>Réduction</span><span>-{discount.toFixed(2)}€</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex justify-between pt-2 mt-2 border-t border-border font-bold text-base">
                      <span>Total</span><span className="text-primary">{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Sticky checkout bar ───────────────────────────────────── */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 340, damping: 28 }} className="fixed bottom-16 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border">
            <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-3">
              <Button className="w-full h-12 text-base font-bold shadow-glow" onClick={handleCheckout} disabled={checkedOut}>
                Commander • {total.toFixed(2)}€
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Cart;
