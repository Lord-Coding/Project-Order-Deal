import { Notification, Flash } from "iconsax-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [hasNotif] = useState(true);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border"
    >
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6"
      >
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5">
          <Flash size={18} color="hsl(var(--primary))" variant="Bold" />
          <h1 className="font-display font-extrabold text-xl sm:text-2xl select-none">
            <span className="text-primary">Order</span>
            <span className="text-foreground">Deal</span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.87 }}>
            <Button
              variant="icon"
              size="icon-sm"
              className="relative"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <Notification size={20} color="currentColor" variant={hasNotif ? "Bold" : "Outline"} />
              {hasNotif && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-coral rounded-full ring-2 ring-card"
                />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
