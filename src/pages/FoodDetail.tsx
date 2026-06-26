import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Minus, Heart, Share2,
  Clock, Flame, Leaf, Star, ShoppingCart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { allFoodItems } from "../lib/data/mockData";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const item = allFoodItems.find((f) => f.id === id);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">🍽️</span>
        <p className="font-display font-bold text-lg">Produit non trouvé</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
      </div>
    );
  }

  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    addItem(item, quantity);
    setAdded(true);
    toast.success(`${item.name} ajouté au panier 🛒`);
    setTimeout(() => navigate(-1), 600);
  };

  return (
    <div className="food-detail-page bg-background min-h-screen pb-36">
      {/* ── Hero image ─────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/7] max-h-[420px] overflow-hidden bg-muted">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* top action bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 sm:px-6">
          <motion.div whileTap={{ scale: 0.88 }}>
            <Button
              variant="secondary"
              size="icon"
              className="bg-card/80 backdrop-blur-sm shadow-card"
              onClick={() => navigate(-1)}
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>

          <div className="flex gap-2">
            <motion.div whileTap={{ scale: 0.88 }}>
              <Button
                variant="secondary"
                size="icon"
                className="bg-card/80 backdrop-blur-sm shadow-card"
                onClick={() => {
                  navigator.share?.({ title: item.name, url: window.location.href });
                }}
                aria-label="Partager"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.88 }}>
              <Button
                variant="secondary"
                size="icon"
                className={`bg-card/80 backdrop-blur-sm shadow-card transition-colors ${isFavorite ? "text-coral" : ""}`}
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Favoris"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-coral text-coral" : ""}`} />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* badges bottom-left */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {item.isPopular    && <Badge variant="coral">🔥 Populaire</Badge>}
          {item.isNew        && <Badge variant="success">✨ Nouveau</Badge>}
          {item.isSpicy      && <Badge variant="destructive"><Flame className="w-3 h-3 mr-1" />Épicé</Badge>}
          {item.isVegetarian && <Badge variant="secondary"><Leaf className="w-3 h-3 mr-1" />Végé</Badge>}
        </div>
      </div>

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <main className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Name + price */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
                  {item.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-primary text-xl sm:text-2xl">
                  {item.price.toFixed(2)}€
                </p>
                {item.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {item.originalPrice.toFixed(2)}€
                  </p>
                )}
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{item.rating}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
                <Clock className="w-3.5 h-3.5" />
                {item.preparationTime}
              </span>
              {item.calories && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
                  🔥 {item.calories} kcal
                </span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Ingredients */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5">
            <h2 className="font-display font-bold text-base sm:text-lg mb-3">Ingrédients</h2>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                >
                  <Badge variant="secondary" className="text-xs">{ing}</Badge>
                </motion.span>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Customization options */}
        {item.customizations && item.customizations.length > 0 && (
          <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="show">
            <Card className="p-4 sm:p-5">
              <h2 className="font-display font-bold text-base sm:text-lg mb-3">Personnalisation</h2>
              <div className="space-y-4">
                {item.customizations.map((custom) => (
                  <div key={custom.name}>
                    <p className="text-sm font-semibold mb-2">{custom.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {custom.options.map((opt) => (
                        <button
                          key={opt.label}
                          className="px-3 py-1.5 rounded-full text-xs border border-border hover:border-primary hover:bg-primary/5 transition-colors font-medium"
                        >
                          {opt.label}
                          {opt.price > 0 && (
                            <span className="ml-1 text-primary">+{opt.price.toFixed(2)}€</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Special instructions */}
        <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5">
            <h2 className="font-display font-bold text-base sm:text-lg mb-3">
              Instructions spéciales
            </h2>
            <Textarea
              placeholder="Ex: Sans oignons, bien cuit, sauce à part…"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none text-sm"
              rows={3}
            />
          </Card>
        </motion.div>
      </main>

      {/* ── Sticky footer ──────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 340, damping: 28 }}
        className="fixed bottom-16 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 bg-muted rounded-full p-1 shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <span className="text-sm font-bold min-w-[1.5rem] text-center">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Add to cart */}
          <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
            <Button
              className={`w-full h-12 text-base font-bold shadow-glow gap-2 transition-all ${added ? "bg-success text-success-foreground" : ""}`}
              onClick={handleAddToCart}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    ✓ Ajouté !
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter • {totalPrice.toFixed(2)}€
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default FoodDetail;
