import { ArrowRight2 } from "iconsax-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import tacoImg from "../assets/french-tacos.png";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate overflow-hidden rounded-3xl p-6 sm:p-8 my-4 shadow-glow"
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsl(24 95% 53%) 0%, hsl(4 92% 62%) 55%, hsl(38 96% 55%) 100%)",
        backgroundColor: "hsl(24 95% 53%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -left-12 w-44 h-44 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 w-44 h-44 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(250,204,21,0.45)" }}
      />

      <div className="relative flex items-center justify-between gap-4">
        {/* Text side */}
        <div className="flex-1 z-10 max-w-[60%] sm:max-w-[55%]">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-[11px] font-extrabold tracking-wider uppercase rounded-full backdrop-blur-md ring-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              color: "hsl(24 95% 40%)",
              boxShadow: "0 6px 20px -6px rgba(0,0,0,0.25)",
            }}
          >
            🚀 Livraison gratuite
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
          >
            Découvrez nos
            <br />
            <span
              className="inline-block"
              style={{
                color: "hsl(48 100% 70%)",
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}
            >
              French Tacos
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="text-sm sm:text-base mb-4 max-w-[260px] text-white/95 font-medium"
          >
            Commandez maintenant et profitez de -20% sur votre 1ère commande
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              variant="secondary"
              className="gap-2 font-bold shadow-elevated hover:scale-105 transition-transform"
              onClick={() => navigate("/explore")}
            >
              Commander
              <ArrowRight2 size={16} color="currentColor" variant="Bold" />
            </Button>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -right-6 -bottom-6 w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80 pointer-events-none"
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          <img
            src={tacoImg}
            alt="French Tacos délicieux"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
