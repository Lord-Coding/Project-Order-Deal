import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

import tacoImg from "../assets/taco.png";
import frenchTacosImg from "../assets/french-tacos.png";
import chickenImg from "../assets/chicken.png";
import kebabImg from "../assets/kebab.png";
import groundBeefImg from "../assets/ground-beef.png";
import friesImg from "../assets/fries.png";

interface Category {
  id: string;
  name: string;
  image: string;
  color: string;
}

const categories: Category[] = [
  { id: "french-tacos", name: "French Tacos", image: frenchTacosImg, color: "category-orange" },
  { id: "tacos",        name: "Tacos",        image: tacoImg,         color: "category-yellow" },
  { id: "poulet",       name: "Poulet",       image: chickenImg,      color: "category-amber"  },
  { id: "kebab",        name: "Kebab",        image: kebabImg,        color: "category-red"    },
  { id: "viande",       name: "Viande",       image: groundBeefImg,   color: "category-rose"   },
  { id: "frites",       name: "Frites",       image: friesImg,        color: "category-gold"   },
];

interface CategoryGridProps {
  onSelect?: (category: string) => void;
}

const CategoryGrid = ({ onSelect }: CategoryGridProps) => {
  const [selected, setSelected] = useState<string>("french-tacos");
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <section className="py-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold font-display">Catégories</h2>
        <button
          className="text-sm text-primary font-semibold hover:underline"
          onClick={() => navigate("/explore")}
        >
          Voir tout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
        {categories.map((category, index) => {
          const isActive = selected === category.id;
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.93 }}
              whileHover={{ y: -4 }}
              onClick={() => handleSelect(category.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 p-3 rounded-2xl",
                "transition-colors duration-300 border-2",
                "active:scale-95",
                isActive
                  ? "border-primary shadow-glow ring-2 ring-primary/30"
                  : cn(category.color, "border-transparent hover:border-primary/40 hover:shadow-card")
              )}
              style={
                isActive
                  ? {
                      backgroundImage:
                        "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--coral)) 100%)",
                    }
                  : undefined
              }
              aria-pressed={isActive}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold transition-colors text-center leading-tight",
                  isActive
                    ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                    : "text-foreground"
                )}
              >
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
