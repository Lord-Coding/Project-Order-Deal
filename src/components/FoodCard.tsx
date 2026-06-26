import { Star, Clock } from "lucide-react";
import { Heart, Add } from "iconsax-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { type FoodItem } from "../lib/data/mockData";

interface FoodCardProps {
  item: FoodItem;
  onAddToCart?: (item: FoodItem) => void;
  variant?: "default" | "compact";
}

const FoodCard = ({ item, onAddToCart, variant = "default" }: FoodCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const handleCardClick = () => navigate(`/food/${item.id}`);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  if (variant === "compact") {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <Card
          variant="interactive"
          className="flex items-center gap-3 p-3 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted/50">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{item.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-xs font-medium">{item.rating}</span>
              <span className="text-muted-foreground">•</span>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.preparationTime}</span>
            </div>
            <p className="font-bold text-primary mt-1">{item.price.toFixed(2)}€</p>
          </div>
          <Button size="icon-sm" onClick={handleAdd} className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Card variant="interactive" className="overflow-hidden group cursor-pointer h-full" onClick={handleCardClick}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.isPopular && <Badge variant="coral" className="text-[10px] px-2">🔥 Populaire</Badge>}
            {item.isNew     && <Badge variant="success" className="text-[10px] px-2">✨ Nouveau</Badge>}
            {discount       && <Badge variant="accent" className="text-[10px] px-2">-{discount}%</Badge>}
          </div>

          {/* Favourite button */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              "bg-card/80 backdrop-blur-sm shadow-card hover:scale-110",
              isFavorite && "bg-coral/20"
            )}
          >
            <Heart
              size={16}
              color={isFavorite ? "hsl(var(--coral))" : "currentColor"}
              variant={isFavorite ? "Bold" : "Outline"}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="font-bold font-display text-sm sm:text-base line-clamp-1">{item.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-accent text-accent" />
              <span className="text-xs sm:text-sm font-semibold">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs">{item.preparationTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-primary">{item.price.toFixed(2)}€</span>
              {item.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{item.originalPrice.toFixed(2)}€</span>
              )}
            </div>
            <motion.div whileTap={{ scale: 0.85 }} animate={added ? { scale: [1, 1.25, 1] } : {}}>
              <Button
                size="icon-sm"
                onClick={handleAdd}
                className={cn("transition-colors", added && "bg-success text-success-foreground")}
              >
                <Add size={16} color="currentColor" variant="Bold" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FoodCard;
