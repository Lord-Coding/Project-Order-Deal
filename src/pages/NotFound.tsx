import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    console.error("404 — route inexistante :", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Animated 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-6"
      >
        <p
          className="text-[120px] sm:text-[160px] font-display font-extrabold leading-none select-none"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(24 95% 53%) 0%, hsl(4 92% 62%) 55%, hsl(48 96% 53%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>
        {/* floating emoji */}
        <motion.span
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 text-4xl sm:text-5xl"
        >
          🍔
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-2 mb-8"
      >
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          Page introuvable
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto">
          On a cherché partout, mais cette page n'existe pas. Elle a peut-être été livrée au mauvais endroit 🛵
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
      >
        <Button onClick={() => navigate(-1)} variant="outline" className="flex-1 gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Button>
        <Button onClick={() => navigate("/")} className="flex-1 gap-2">
          <Home className="w-4 h-4" /> Accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
