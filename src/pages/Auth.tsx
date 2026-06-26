import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  ArrowLeft2, Mobile, Sms, Lock1, User as UserIcon,
  Flash,
} from "iconsax-react";
import LottiePlayer from "../components/LottiePlayer";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet";

import Particles from "../components/magicui/particles";
import ShimmerButton from "../components/magicui/shimmer-button";
import SparklesText from "../components/magicui/sparkles-text";
import AnimatedGradientText from "../components/magicui/animated-gradient-text";
import BorderBeam from "../components/magicui/border-beam";

import deliveryAnimation from "../assets/lottie/delivery.json";
import successAnimation  from "../assets/lottie/success.json";
import loadingAnimation  from "../assets/lottie/loading.json";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// ── animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── trust badges shown on the left panel ─────────────────────────────────────
const trustBadges = [
  { emoji: "🔒", text: "Paiement 100% sécurisé" },
  { emoji: "⚡", text: "Livraison express" },
  { emoji: "✅", text: "Satisfait ou remboursé" },
];

// ── OTP digit squares ─────────────────────────────────────────────────────────
const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {digits.map((d, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className={`relative w-11 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
            d ? "border-primary bg-primary/5" : "border-border bg-muted/40"
          }`}
        >
          {d || (i === value.length ? (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-0.5 h-5 bg-primary rounded-full"
            />
          ) : null)}
        </motion.div>
      ))}
      {/* hidden real input */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute opacity-0 w-full h-full inset-0 cursor-pointer"
        aria-label="Code OTP"
      />
    </div>
  );
};

// ── PhoneField ────────────────────────────────────────────────────────────────
const PhoneField = ({
  phone,
  setPhone,
}: {
  phone: string;
  setPhone: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-semibold">Numéro de téléphone</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Mobile size={18} color="hsl(var(--muted-foreground))" variant="Outline" />
      </span>
      <Input
        type="tel"
        className="pl-10 h-12 rounded-xl bg-muted/50 border-border/60 focus:border-primary/50"
        placeholder="+33 6 12 34 56 78"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const Auth = () => {
  const navigate = useNavigate();
  const { login, loginWithOTP, verifyOTP, isLoading } = useAuth();

  const [tab,  setTab]  = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"input" | "otp" | "success">("input");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp,  setOtp]  = useState("");

  const [staffOpen,     setStaffOpen]     = useState(false);
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);

  const STAFF_SECRET_DIGITS = "242066803415";

  // ── handlers ────────────────────────────────────────────────────────────────
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly === STAFF_SECRET_DIGITS) { setStaffOpen(true); setPhone(""); return; }
    if (tab === "signup" && name.trim().length < 2) {
      toast.error("Prénom requis", { description: "Merci de saisir au moins 2 caractères." });
      return;
    }
    if (!digitsOnly) {
      toast.error("Numéro requis", { description: "Veuillez renseigner votre numéro." });
      return;
    }
    if (digitsOnly.length < 9) {
      toast.error("Numéro invalide", { description: "Au moins 9 chiffres requis." });
      return;
    }
    const ok = await loginWithOTP(phone);
    if (ok) { setStep("otp"); toast.success("Code envoyé !", { description: "Démo : 123456" }); }
    else toast.error("Envoi impossible", { description: "Vérifiez votre numéro." });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { toast.error("Code incomplet", { description: "6 chiffres requis." }); return; }
    const ok = await verifyOTP(phone, otp);
    if (ok) {
      setStep("success");
      toast.success(tab === "signup" ? `Bienvenue ${name || ""} !` : "Heureux de vous revoir !");
      setTimeout(() => navigate("/"), 1800);
    } else {
      toast.error("Code incorrect", { description: "Démo : 123456." });
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      toast.error("Email invalide"); return;
    }
    if (!password || password.length < 4) {
      toast.error("Mot de passe trop court"); return;
    }
    const { user: loggedUser, ok } = await login(emailTrim, password);
    if (!ok || !loggedUser) { toast.error("Identifiants incorrects"); return; }
    if (loggedUser.role === "client") { toast.error("Accès refusé"); return; }
    toast.success("Connexion réussie", { description: `Bienvenue ${loggedUser.role}.` });
    setStaffOpen(false);
    if (loggedUser.role === "admin")     navigate("/admin");
    else if (loggedUser.role === "personnel") navigate("/kitchen");
    else if (loggedUser.role === "livreur")   navigate("/delivery");
    else navigate("/");
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">

      {/* ═══════════════════════════════════════════
          LEFT — brand / visual panel (desktop only)
          ═══════════════════════════════════════════ */}
      <motion.aside
        variants={slideIn}
        initial="hidden"
        animate="show"
        className="relative hidden lg:flex lg:w-[46%] xl:w-5/12 flex-col justify-between overflow-hidden p-10 xl:p-14"
        style={{
          background: "linear-gradient(135deg, hsl(24 95% 50%) 0%, hsl(4 92% 60%) 45%, hsl(38 96% 52%) 100%)",
        }}
      >
        {/* Particles */}
        <Particles className="absolute inset-0 z-0" quantity={55} ease={85} color="#ffffff" />

        {/* Blobs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        {/* Back button */}
        <motion.button
          variants={fadeUp} initial="hidden" animate="show" custom={0.3}
          onClick={() => navigate("/welcome")}
          className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white w-fit transition-colors"
        >
          <ArrowLeft2 size={16} color="currentColor" variant="Bold" />
          Retour à l'accueil
        </motion.button>

        {/* Headline */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0.15}
          className="relative z-10 space-y-6"
        >
          {/* logo pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-widest text-white">
            <Flash size={13} color="hsl(48 96% 60%)" variant="Bold" />
            Order Deal
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl xl:text-5xl font-display font-extrabold leading-[1.07] text-white">
              Commandez vos<br />plats{" "}
              <SparklesText
                text="préférés"
                className="bg-white/95 text-primary px-3 py-0.5 rounded-xl"
                sparklesCount={5}
                colors={{ first: "hsl(24 95% 53%)", second: "hsl(48 96% 53%)" }}
              />
            </h1>
            <p className="text-base text-white/80 leading-relaxed max-w-sm">
              Tacos, burgers,{" "}
              <AnimatedGradientText className="font-bold">cheesesteak</AnimatedGradientText>
              {" "}— livrés chauds en 20 min.
            </p>
          </div>

          {/* Trust badges */}
          <div className="space-y-2.5">
            {trustBadges.map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-white/90">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-base">
                  {emoji}
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* Lottie delivery */}
          <div className="mt-2">
            <LottiePlayer
              animationData={deliveryAnimation}
              loop
              style={{ width: 200, height: 100 }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={0.5}
          className="relative z-10 text-xs text-white/50"
        >
          © {new Date().getFullYear()} Order Deal — Tous droits réservés.
        </motion.p>
      </motion.aside>

      {/* ═══════════════════════════════════════════
          RIGHT — form panel
          ═══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:hidden flex items-center justify-between px-4 py-3.5 border-b border-border bg-card/90 backdrop-blur-sm"
        >
          <button
            onClick={() => navigate("/welcome")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft2 size={16} color="currentColor" variant="Bold" />
            Retour
          </button>
          <div className="flex items-center gap-1.5">
            <Flash size={16} color="hsl(var(--primary))" variant="Bold" />
            <span className="text-sm font-display font-extrabold">
              <span className="text-primary">Order</span>Deal
            </span>
          </div>
        </motion.header>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >

            {/* ── Success state ─────────────────────────────── */}
            <AnimatePresence mode="wait">
              {step === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <LottiePlayer
                    animationData={successAnimation}
                    loop={false}
                    style={{ width: 140, height: 140 }}
                  />
                  <div className="space-y-1">
                    <h2 className="font-display font-extrabold text-2xl">
                      {tab === "signup" ? `Bienvenue ${name || ""} !` : "Heureux de vous revoir !"}
                    </h2>
                    <p className="text-muted-foreground text-sm">Redirection en cours…</p>
                  </div>
                  <LottiePlayer
                    animationData={loadingAnimation}
                    loop
                    style={{ width: 60, height: 30 }}
                  />
                </motion.div>

              ) : step === "otp" ? (
                /* ── OTP step ─────────────────────────────────── */
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-7"
                >
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
                      Vérification 🔐
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Code envoyé au{" "}
                      <span className="font-bold text-foreground">{phone}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    {/* OTP squares */}
                    <div className="relative space-y-2">
                      <Label className="text-sm font-semibold text-center block">
                        Saisissez le code à 6 chiffres
                      </Label>
                      <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <ShimmerButton
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      borderRadius="0.875rem"
                      shimmerColor="rgba(255,255,255,0.4)"
                      className="w-full h-13 text-sm sm:text-base font-bold justify-center py-3.5"
                    >
                      {isLoading
                        ? <LottiePlayer animationData={loadingAnimation} loop style={{ width: 48, height: 24 }} />
                        : "Vérifier et continuer"
                      }
                    </ShimmerButton>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => { setStep("input"); setOtp(""); }}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft2 size={14} color="currentColor" variant="Bold" />
                        Changer de numéro
                      </button>
                      <button type="button" className="text-primary font-semibold hover:underline">
                        Renvoyer le code
                      </button>
                    </div>
                  </form>

                  {/* Demo hint */}
                  <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-muted/60 border border-border overflow-hidden">
                    <BorderBeam size={100} duration={6} colorFrom="hsl(24 95% 53%)" colorTo="hsl(48 96% 53%)" borderWidth={1} />
                    <span className="text-xl">💡</span>
                    <p className="text-xs text-muted-foreground">
                      Mode démo — utilisez le code <span className="font-bold text-foreground">123456</span>
                    </p>
                  </div>
                </motion.div>

              ) : (
                /* ── Input step ───────────────────────────────── */
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
                      {tab === "login" ? "Bon retour 👋" : "Créer un compte ✨"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {tab === "login"
                        ? "Entrez votre numéro pour vous connecter"
                        : "Quelques infos et c'est parti !"}
                    </p>
                  </div>

                  {/* Tabs */}
                  <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
                    <TabsList className="grid grid-cols-2 w-full bg-muted rounded-xl h-12">
                      <TabsTrigger value="login"  className="rounded-lg font-semibold">Connexion</TabsTrigger>
                      <TabsTrigger value="signup" className="rounded-lg font-semibold">Inscription</TabsTrigger>
                    </TabsList>

                    {/* Login tab */}
                    <TabsContent value="login" className="mt-5">
                      <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <PhoneField phone={phone} setPhone={setPhone} />
                        <ShimmerButton
                          type="submit"
                          disabled={isLoading}
                          borderRadius="0.875rem"
                          shimmerColor="rgba(255,255,255,0.4)"
                          className="w-full h-13 text-sm sm:text-base font-bold justify-center py-3.5"
                        >
                          {isLoading
                            ? <LottiePlayer animationData={loadingAnimation} loop style={{ width: 48, height: 24 }} />
                            : "Recevoir le code SMS"
                          }
                        </ShimmerButton>
                      </form>
                    </TabsContent>

                    {/* Signup tab */}
                    <TabsContent value="signup" className="mt-5">
                      <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold">Prénom</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <UserIcon size={18} color="hsl(var(--muted-foreground))" variant="Outline" />
                            </span>
                            <Input
                              className="pl-10 h-12 rounded-xl bg-muted/50 border-border/60 focus:border-primary/50"
                              placeholder="Marie"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                        <PhoneField phone={phone} setPhone={setPhone} />
                        <ShimmerButton
                          type="submit"
                          disabled={isLoading}
                          borderRadius="0.875rem"
                          shimmerColor="rgba(255,255,255,0.4)"
                          className="w-full h-13 text-sm sm:text-base font-bold justify-center py-3.5"
                        >
                          {isLoading
                            ? <LottiePlayer animationData={loadingAnimation} loop style={{ width: 48, height: 24 }} />
                            : "Créer mon compte"
                          }
                        </ShimmerButton>
                        <p className="text-xs text-muted-foreground text-center">
                          En continuant, vous acceptez nos{" "}
                          <span className="text-primary font-semibold cursor-pointer hover:underline">
                            conditions générales
                          </span>
                          .
                        </p>
                      </form>
                    </TabsContent>
                  </Tabs>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">ou</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Demo hint card */}
                  <div className="relative flex items-start gap-3 p-4 rounded-2xl bg-muted/50 border border-border overflow-hidden">
                    <BorderBeam size={120} duration={8} colorFrom="hsl(24 95% 53%)" colorTo="hsl(48 96% 53%)" borderWidth={1} />
                    <span className="text-2xl leading-none mt-0.5">🎭</span>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p className="font-bold text-foreground text-sm">Mode démo</p>
                      <p>N'importe quel numéro fonctionne.</p>
                      <p>Code OTP : <span className="font-bold text-primary">123456</span></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════
          Staff hidden sheet
          ═══════════════════════════════════════════ */}
      <Sheet open={staffOpen} onOpenChange={setStaffOpen}>
        <SheetContent
          side="bottom"
          className="sm:max-w-md sm:mx-auto rounded-t-3xl bg-card text-card-foreground border-border pb-8"
        >
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2 font-display text-lg">
              <Flash size={18} color="hsl(var(--primary))" variant="Bold" />
              Espace équipe
            </SheetTitle>
            <SheetDescription>
              Connexion réservée au personnel Order Deal.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Email professionnel</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Sms size={18} color="hsl(var(--muted-foreground))" variant="Outline" />
                </span>
                <Input
                  type="email"
                  className="pl-10 h-12 rounded-xl bg-muted/50"
                  placeholder="vous@orderdeal.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Mot de passe</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock1 size={18} color="hsl(var(--muted-foreground))" variant="Outline" />
                </span>
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-11 h-12 rounded-xl bg-muted/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <ShimmerButton
              type="submit"
              disabled={isLoading}
              borderRadius="0.875rem"
              shimmerColor="rgba(255,255,255,0.4)"
              className="w-full h-12 font-bold justify-center"
            >
              {isLoading
                ? <LottiePlayer animationData={loadingAnimation} loop style={{ width: 48, height: 24 }} />
                : "Se connecter"
              }
            </ShimmerButton>

            <p className="text-[11px] text-center text-muted-foreground">
              Démo : n'importe quel email / mot de passe fonctionne.
            </p>
          </form>
        </SheetContent>
      </Sheet>

    </div>
  );
};

export default Auth;
