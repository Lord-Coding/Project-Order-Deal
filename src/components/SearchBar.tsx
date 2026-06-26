import { SearchNormal1, Setting4, CloseCircle } from "iconsax-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Rechercher un plat, un restaurant…",
}: SearchBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Search input */}
      <div className="relative flex-1">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <SearchNormal1 size={18} color="hsl(var(--muted-foreground))" variant="Outline" />
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-9 rounded-2xl bg-muted/60 border border-border/60 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => onChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Effacer"
            >
              <CloseCircle size={18} color="hsl(var(--muted-foreground))" variant="Bold" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter button */}
      <motion.div whileTap={{ scale: 0.88 }}>
        <Button
          variant="icon"
          size="icon"
          aria-label="Filtres"
          onClick={() => navigate("/explore")}
          className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
        >
          <Setting4 size={20} color="#fff" variant="Bold" />
        </Button>
      </motion.div>
    </div>
  );
};

export default SearchBar;
