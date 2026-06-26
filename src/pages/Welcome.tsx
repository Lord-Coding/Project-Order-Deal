import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Star, Truck, ShieldCheck,
  Zap, Clock, ChevronDown,
} from "lucide-react";
import LottiePlayer from "../components/LottiePlayer";

import deliveryAnimation from "../assets/lottie/delivery.json";
import heroFastFood      from "../assets/hero/Fast-food-design-Premium-vector-PNG.png";
import heroCheesesteak   from "../assets/hero/delicious-cheesesteak-sub-filled-with-grilled-steak-bell-peppers-onions-and-melted-cheese-on-fresh-hoagie-roll-against-black-background.png";

// ─────────────────────────────────────────────────────────────────────────────
const heroImages = [heroFastFood, heroCheesesteak];

const features = [
  { Icon: Truck,       label: "Livraison rapide" },
  { Icon: Clock,       label: "20-35 min" },
  { Icon: ShieldCheck, label: "Paiement sécurisé" },
  { Icon: Zap,         label: "Commande express" },
];

const stats = [
  { value: "4.9★", label: "Note app",   cls: "bg-amber-300 text-amber-900" },
  { value: "12k+", label: "Commandes",  cls: "bg-white text-orange-600" },
  { value: "98%",  label: "Satisfaits", cls: "bg-orange-600/80 text-white" },
];

const reviews = [
  { name: "Sophia M.", text: "Livraison ultra rapide, plats chauds !", stars: 5 },
  { name: "Karim B.",  text: "Interface top, tacos au top 🔥",          stars: 5 },
  { name: "Léa D.",    text: "Je recommande à 100% !",                   stars: 5 },
];

// ── lightweight canvas particles ─────────────────────────────────────────────
function ParticlesBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; a: number; dx: number; dy: number };
    const pts: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── shimmer CTA ───────────────────────────────────────────────────────────────
function ShimmerBtn({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-2xl bg-white text-orange-600 font-bold shadow-lg ${className}`}
    >
      <span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.8s_linear_infinite]"
        style={{ backgroundSize: "200% 100%" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
const Welcome = () => {
  const navigate = useNavigate();
  const [imgIndex,    setImgIndex]    = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showLottie,  setShowLottie]  = useState(true);

  useEffect(() => {
    const t1 = setInterval(() => setImgIndex(i => (i + 1) % heroImages.length), 3800);
    const t2 = setInterval(() => setReviewIndex(i => (i + 1) % reviews.length), 4500);
    const t3 = setTimeout(() => setShowLottie(false), 3000);
    return () => { clearInterval(t1); clearInterval(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col select-none text-white"
      style={{ background: "linear-gradient(135deg,hsl(24 95% 50%) 0%,hsl(4 92% 60%) 45%,hsl(38 96% 52%) 100%)" }}
    >
      {/* particles */}
      <ParticlesBg />

      {/* blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      {/* ── nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="font-display font-extrabold text-lg sm:text-xl">
            Order<span className="text-yellow-300">Deal</span>
          </span>
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="text-sm font-semibold text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors"
        >
          Déjà un compte ?
        </button>
      </motion.header>

      {/* ── main ── */}
      <main className="relative z-10 flex-1 w-full max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

        {/* LEFT */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 order-1">

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              Nouvelle expérience culinaire
            </span>
          </motion.div>

          {/* headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="space-y-1"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold leading-[1.05]">
              Vos plats
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold leading-[1.05]">
              <span className="relative inline-block bg-white text-orange-600 px-4 py-1 rounded-2xl">
                préférés
                {/* sparkle dots */}
                {["top-0 -right-2", "bottom-0 -left-2", "-top-1 left-1/2"].map((pos, i) => (
                  <motion.span
                    key={i}
                    className={`absolute ${pos} w-2 h-2 rounded-full bg-yellow-300`}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.4 }}
                  />
                ))}
              </span>
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold leading-[1.05]">
              en un clic.
            </h1>
          </motion.div>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="text-base sm:text-lg text-white/85 max-w-md leading-relaxed"
          >
            Tacos, burgers,{" "}
            <span
              className="font-bold"
              style={{
                backgroundImage: "linear-gradient(90deg,#fff 0%,hsl(48 96% 65%) 50%,#fff 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradient-shift 3s linear infinite",
              }}
            >
              cheesesteak
            </span>
            {" "}— livrés chauds en 20 min.
          </motion.p>

          {/* feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {features.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/15 text-xs font-semibold">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.5 }}
            className="w-full flex flex-col sm:flex-row gap-3 pt-1"
          >
            <ShimmerBtn
              onClick={() => navigate("/auth")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base"
            >
              Commencer maintenant
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </ShimmerBtn>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-white/35 text-white text-sm sm:text-base font-semibold backdrop-blur-sm hover:bg-white/12 transition-colors"
            >
              Explorer le menu
            </motion.button>
          </motion.div>

          {/* rotating review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.5 }}
            className="relative w-full max-w-sm"
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 relative overflow-hidden">
              {/* animated border */}
              <span className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none" />
              <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shrink-0 font-bold text-sm">
                {reviews[reviewIndex].name[0]}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {Array.from({ length: reviews[reviewIndex].stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    ))}
                    <span className="text-[11px] font-semibold ml-1 text-white/75">
                      {reviews[reviewIndex].name}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 truncate">{reviews[reviewIndex].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="relative flex-1 flex items-center justify-center order-2 w-full max-w-xs sm:max-w-sm lg:max-w-md">

          {/* card bg layers */}
          <motion.div
            initial={{ opacity: 0, rotate: 10 }}
            animate={{ opacity: 1, rotate: 8 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-4 rounded-[3rem] bg-white/10 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -4 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute inset-4 rounded-[3rem] bg-white/15"
          />

          {/* image / lottie */}
          <div className="relative z-10 w-full flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              {showLottie ? (
                <motion.div
                  key="lottie"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-[280px] sm:max-w-[340px]"
                >
                  <LottiePlayer
                    animationData={deliveryAnimation}
                    loop={false}
                    style={{ width: "100%", height: "auto" }}
                  />
                </motion.div>
              ) : (
                <motion.img
                  key={`img-${imgIndex}`}
                  src={heroImages[imgIndex]}
                  alt="Order Deal hero"
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -12 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-[280px] sm:max-w-[340px] drop-shadow-2xl animate-float"
                />
              )}
            </AnimatePresence>
          </div>

          {/* dots */}
          {!showLottie && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`transition-all duration-300 rounded-full ${i === imgIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
                />
              ))}
            </div>
          )}

          {/* stat cards */}
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.12, duration: 0.45 }}
              className={`absolute z-20 flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg backdrop-blur-sm font-bold ${s.cls} ${
                i === 0 ? "top-2 -left-2 sm:-left-6"
                : i === 1 ? "top-1/3 -right-2 sm:-right-6"
                : "bottom-12 -left-2 sm:-left-6"
              }`}
            >
              <span className="text-sm leading-none">{s.value}</span>
              <span className="text-[11px] opacity-80 font-semibold">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 flex justify-center pb-5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex flex-col items-center gap-1 opacity-50"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Découvrir</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 text-center pb-4 px-4"
      >
        <p className="text-[11px] text-white/40">
          © {new Date().getFullYear()} Order Deal — Tous droits réservés.
        </p>
      </motion.footer>
    </div>
  );
};

export default Welcome;
