import { Star, Clock } from "lucide-react";
import {
  Location, Star1, Clock as ClockIcon,
  ArrowRight, Truck
} from "iconsax-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

import pizzaImg    from "../assets/pizza.png";
import burgerImg   from "../assets/hero-burger.png";
import chickenImg  from "../assets/chicken.png";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  deliveryFee: string;
  isOpen: boolean;
  tags: string[];
}

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burger Palace",
    image: burgerImg,
    cuisine: "American, Burgers",
    rating: 4.8,
    deliveryTime: "15-25 min",
    distance: "1.2 km",
    deliveryFee: "Free",
    isOpen: true,
    tags: ["Fast Food", "Burgers"],
  },
  {
    id: "2",
    name: "Pizza Heaven",
    image: pizzaImg,
    cuisine: "Italian, Pizza",
    rating: 4.9,
    deliveryTime: "20-30 min",
    distance: "2.0 km",
    deliveryFee: "$1.99",
    isOpen: true,
    tags: ["Italian", "Pizza"],
  },
  {
    id: "3",
    name: "Crispy Chicken Co.",
    image: chickenImg,
    cuisine: "American, Chicken",
    rating: 4.7,
    deliveryTime: "15-20 min",
    distance: "0.8 km",
    deliveryFee: "Free",
    isOpen: true,
    tags: ["Fried Chicken", "Fast Food"],
  },
];

const NearbyRestaurants = () => {
  return (
    <section className="py-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold font-display">Restaurants proches</h2>
        <button className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
          >
            <Card variant="interactive" className="flex overflow-hidden">
              {/* Image */}
              <div className="relative w-24 sm:w-32 lg:w-40 shrink-0 bg-muted/50">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.deliveryFee === "Free" && (
                  <Badge variant="success" className="absolute bottom-2 left-1.5 text-[10px]">
                    Gratuit
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-3 sm:p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold font-display text-sm sm:text-base truncate">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-accent/20 shrink-0">
                    <Star1 size={14} color="hsl(var(--accent-foreground))" variant="Bold" />
                    <span className="text-xs font-bold">{restaurant.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <ClockIcon size={14} color="currentColor" variant="Outline" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Location size={14} color="currentColor" variant="Outline" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {restaurant.tags.map((tag) => (
                    <Badge key={tag} variant="muted" className="text-[10px] px-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NearbyRestaurants;
