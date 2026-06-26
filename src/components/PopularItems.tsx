import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { allFoodItems, type FoodItem } from "../lib/data/mockData";
import { FoodCardSkeleton } from "./skeletons/HomeSkeletons";

const popularItems = allFoodItems.filter((item) => item.isPopular).slice(0, 8);

interface PopularItemsProps {
  onAddToCart?: (item: FoodItem) => void;
  loading?: boolean;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const PopularItems = ({ onAddToCart, loading = false }: PopularItemsProps) => {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold font-display">Populaires 🔥</h2>
        <button className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {popularItems.slice(0, 4).map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <FoodCard item={item} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default PopularItems;
