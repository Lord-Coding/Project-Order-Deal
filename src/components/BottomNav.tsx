import { Home, Search, Heart, User, ShoppingCart } from "lucide-react";
import { cn } from "../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "home",      label: "Accueil",  path: "/" },
  { id: "explore",   label: "Explorer", path: "/explore" },
  { id: "cart",      label: "Panier",   path: "/cart" },
  { id: "favorites", label: "Favoris",  path: "/favorites" },
  { id: "profile",   label: "Profil",   path: "/profile" },
] as const;

type NavId = typeof navItems[number]["id"];

const BottomNav = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { itemCount } = useCart();

  const getActiveId = () =>
    navItems.find((i) => i.path === location.pathname)?.id ?? "home";

  const activeId = getActiveId();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
      <div className="w-full max-w-md sm:max-w-lg mx-auto">
        <div className="flex items-center justify-around py-1.5 sm:py-2 px-1">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            const isCart   = item.id === "cart";

            return (
              <button
                key={item.id}
                onClick={() =>
                  navigate(item.path, item.id === "cart" ? { state: { fromDetail: false } } : undefined)
                }
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1.5 px-3 sm:px-5 rounded-2xl transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-2xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative z-10 p-1.5 rounded-xl">
                  <motion.div
                    animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {item.id === "home"      && <Home      className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />}
                    {item.id === "explore"   && <Search    className="w-5 h-5" />}
                    {item.id === "cart"      && <ShoppingCart className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />}
                    {item.id === "favorites" && <Heart     className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />}
                    {item.id === "profile"   && <User      className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />}
                  </motion.div>

                  <AnimatePresence>
                    {isCart && itemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-4 min-w-4 flex items-center justify-center text-[9px] px-1 rounded-full">
                          {itemCount > 9 ? "9+" : itemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <span className={cn("text-[10px] font-semibold relative z-10", isActive && "text-primary")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
