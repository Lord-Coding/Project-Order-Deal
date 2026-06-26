import { useState } from "react";
import { Search, Star, Clock, Flame, Leaf, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { categories, allFoodItems } from "../lib/data/mockData";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const Explore = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 20]);
  const [minRating, setMinRating] = useState(0);
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  const filteredItems = allFoodItems
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      const matchesRating = item.rating >= minRating;
      const matchesSpicy = !onlySpicy || item.isSpicy;
      const matchesVegetarian = !onlyVegetarian || item.isVegetarian;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesSpicy && matchesVegetarian;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "rating":     return b.rating - a.rating;
        default:           return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
    });

  const activeFiltersCount = [
    priceRange[0] > 0 || priceRange[1] < 20,
    minRating > 0,
    onlySpicy,
    onlyVegetarian,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setPriceRange([0, 20]);
    setMinRating(0);
    setOnlySpicy(false);
    setOnlyVegetarian(false);
    setSortBy("popular");
  };

  return (
    <div className="explore-page">
      {/* ── Sticky header ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl mb-3">Explorer le Menu</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un plat..."
                className="pl-9 bg-muted/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Filtres
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Réinitialiser</Button>
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 mt-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Prix : {priceRange[0]}€ – {priceRange[1]}€</label>
                    <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={20} step={1} />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Note minimum</label>
                    <div className="flex flex-wrap gap-2">
                      {[0, 3, 4, 4.5].map((r) => (
                        <Button key={r} variant={minRating === r ? "default" : "outline"} size="sm" onClick={() => setMinRating(r)}>
                          {r === 0 ? "Tous" : <><Star className="w-3 h-3 mr-1 fill-current" />{r}+</>}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Prefs */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Préférences</label>
                    <div className="flex gap-2">
                      <Button variant={onlySpicy ? "default" : "outline"} size="sm" onClick={() => setOnlySpicy(!onlySpicy)}>
                        <Flame className="w-4 h-4 mr-1" /> Épicé
                      </Button>
                      <Button variant={onlyVegetarian ? "default" : "outline"} size="sm" onClick={() => setOnlyVegetarian(!onlyVegetarian)}>
                        <Leaf className="w-4 h-4 mr-1" /> Végétarien
                      </Button>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Trier par</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "popular",    label: "Populaire" },
                        { value: "rating",     label: "Note" },
                        { value: "price-asc",  label: "Prix ↑" },
                        { value: "price-desc", label: "Prix ↓" },
                      ].map((opt) => (
                        <Button
                          key={opt.value}
                          variant={sortBy === opt.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSortBy(opt.value as typeof sortBy)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <main className="explore-main">
        {/* ── Categories ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-base sm:text-lg font-bold font-display mb-3">Catégories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-muted/60 border-border hover:border-primary/40 text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Active filter chips ──────────────────────────────────── */}
        <AnimatePresence>
          {(selectedCategory || activeFiltersCount > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory(null)} className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  <Star className="w-3 h-3" /> {minRating}+
                  <button onClick={() => setMinRating(0)} className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {onlySpicy && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  <Flame className="w-3 h-3" /> Épicé
                  <button onClick={() => setOnlySpicy(false)} className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold font-display">
              {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "Tous les plats"}
            </h2>
            <Badge variant="secondary">{filteredItems.length} résultats</Badge>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    custom={i}
                  >
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-card transition-shadow">
                      <div className="relative aspect-square overflow-hidden bg-muted/40">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {item.isNew && (
                          <Badge className="absolute top-2 left-2 text-[10px] px-1.5">Nouveau</Badge>
                        )}
                        {item.isPopular && (
                          <Badge variant="coral" className="absolute top-2 right-2 text-[10px] px-1.5">🔥</Badge>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-3">
                        <h3 className="font-bold text-xs sm:text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted-foreground">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{item.rating}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{item.preparationTime}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="font-bold text-primary text-sm">{item.price.toFixed(2)}€</span>
                            {item.originalPrice && (
                              <span className="text-[10px] text-muted-foreground line-through ml-1">
                                {item.originalPrice.toFixed(2)}€
                              </span>
                            )}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => addItem(item)}
                            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg leading-none font-bold hover:bg-primary/90 transition-colors"
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="font-bold text-lg mb-1">Aucun résultat</h3>
                <p className="text-muted-foreground text-sm mb-4">Essayez de modifier vos critères</p>
                <Button onClick={clearFilters} variant="outline">Réinitialiser les filtres</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Explore;
