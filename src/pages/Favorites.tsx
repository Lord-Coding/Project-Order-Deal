import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Clock, Trash2, Plus, ShoppingBag } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { mockFavoriteItems, type FoodItem } from "../lib/data/mockData";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.28 } },
};

const Favorites = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [favoriteItems, setFavoriteItems] = useState<FoodItem[]>(mockFavoriteItems);

  const removeFromFavorites = (id: string) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Retiré des favoris");
  };

  const handleAdd = (item: FoodItem) => {
    addItem(item, 1);
    toast.success(`${item.name} ajouté au panier 🛒`);
  };

  return (
    <div className="favorites-page">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-coral/15 text-coral">
            <Heart className="w-5 h-5 fill-coral" />
          </div>
          <h1 className="font-display font-bold text-lg flex-1">Mes Favoris</h1>
          {favoriteItems.length > 0 && (
            <Badge variant="secondary">{favoriteItems.length} plat{favoriteItems.length > 1 ? "s" : ""}</Badge>
          )}
        </div>
      </motion.header>

      <main className="favorites-main">
        <AnimatePresence mode="wait">
          {favoriteItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, -8, 8, 0] }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="text-6xl mb-4"
              >
                💔
              </motion.div>
              <h2 className="font-display font-bold text-xl mb-2">Pas encore de favoris</h2>
              <p className="text-muted-foreground text-sm mb-6">Ajoutez vos plats préférés ici !</p>
              <Button onClick={() => navigate("/explore")}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Explorer le menu
              </Button>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              <AnimatePresence>
                {favoriteItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <Card
                      className="overflow-hidden cursor-pointer hover:shadow-card transition-shadow"
                      onClick={() => navigate(`/food/${item.id}`)}
                    >
                      <div className="flex gap-3 p-3 sm:p-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted/50 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {item.isPopular && (
                            <span className="absolute top-1 left-1 text-[10px] bg-coral text-white rounded-full px-1.5 py-0.5 font-bold">
                              🔥
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm sm:text-base line-clamp-1">{item.name}</h3>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => { e.stopPropagation(); removeFromFavorites(item.id); }}
                              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                              aria-label="Retirer des favoris"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              <span className="font-semibold text-foreground">{item.rating}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.preparationTime}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-primary text-sm sm:text-base">
                                {item.price.toFixed(2)}€
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {item.originalPrice.toFixed(2)}€
                                </span>
                              )}
                            </div>
                            <motion.div whileTap={{ scale: 0.85 }}>
                              <Button
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                                className="gap-1 h-8 text-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Ajouter
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Favorites;
