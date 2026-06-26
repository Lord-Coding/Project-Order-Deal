import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import CategoryGrid from "../components/CategoryGrid";
import PopularItems from "../components/PopularItems";
import BottomNav from "../components/BottomNav";
import { HomeSkeleton } from "../components/skeletons/HomeSkeletons";
import { useCart } from "../contexts/CartContext";
import { type FoodItem } from "../lib/data/mockData";

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const Index = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = (item: FoodItem) => addItem(item, 1);

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HomeSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={pageVariants}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              <motion.div variants={sectionVariants} className="home-search">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </motion.div>

              <motion.div variants={sectionVariants}>
                <HeroBanner />
              </motion.div>

              <motion.div variants={sectionVariants}>
                <CategoryGrid />
              </motion.div>

              <motion.div variants={sectionVariants}>
                <PopularItems onAddToCart={handleAddToCart} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
