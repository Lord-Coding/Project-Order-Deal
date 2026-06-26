import { useNavigate } from "react-router-dom";
import {
  MapPin, CreditCard, Bell, HelpCircle, LogOut,
  ChevronRight, Settings, Gift, Star, Edit3,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { mockCurrentUser, mockOrders } from "../lib/data/mockData";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import { toast } from "sonner";

const menuItems = [
  { icon: MapPin,      label: "Mes Adresses",        description: `${mockCurrentUser.addresses?.length || 0} adresses enregistrées`, href: "/addresses" },
  { icon: CreditCard,  label: "Moyens de Paiement",  description: "Carte, espèces",      href: "/payments" },
  { icon: Gift,        label: "Codes Promo",          description: "3 codes actifs",      href: "/promos" },
  { icon: Bell,        label: "Notifications",        description: "Gérer vos alertes",   href: "/notifications" },
  { icon: HelpCircle,  label: "Aide & Support",       description: "Chat avec notre équipe", href: "/support" },
  { icon: Settings,    label: "Paramètres",           description: "Préférences de l'app", href: "/settings" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const currentUser = user || mockCurrentUser;

  const completedOrders = mockOrders.filter((o) => o.status === "delivered").length;
  const totalSpent = mockOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const handleSwitchRole = (role: "client" | "admin" | "personnel" | "livreur") => {
    switchRole(role);
    switch (role) {
      case "admin":     navigate("/admin");    break;
      case "personnel": navigate("/kitchen");  break;
      case "livreur":   navigate("/delivery"); break;
      default:          navigate("/");
    }
  };

  const stats = [
    { value: completedOrders, label: "Commandes" },
    { value: `${totalSpent.toFixed(0)}€`, label: "Total dépensé" },
    { value: 5, label: "Avis" },
  ];

  return (
    <div className="profile-page">
      {/* ── Hero header ──────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, hsl(24 95% 53%) 0%, hsl(4 92% 62%) 55%, hsl(38 96% 55%) 100%)",
        }}
      >
        {/* Blobs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          {/* User info */}
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative shrink-0"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
            </motion.div>

            <div className="flex-1 min-w-0 text-white">
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-display font-extrabold text-xl sm:text-2xl truncate"
              >
                {currentUser.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="text-sm text-white/80 mt-0.5 truncate"
              >
                {currentUser.phone || currentUser.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="mt-2"
              >
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                  <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
                  Client Fidèle
                </Badge>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 shrink-0"
                onClick={() => navigate("/profile/edit")}
                aria-label="Modifier le profil"
              >
                <Edit3 className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="grid grid-cols-3 gap-3 mt-6"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-3 rounded-2xl bg-white/15 backdrop-blur-sm"
              >
                <p className="font-display font-extrabold text-lg sm:text-xl text-white">{s.value}</p>
                <p className="text-[11px] text-white/75 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4 pb-28"
      >
        {/* Quick actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {[
            { emoji: "📦", title: "Mes Commandes", sub: `${mockOrders.length} total`, href: "/orders" },
            { emoji: "❤️", title: "Favoris",        sub: "5 plats",                  href: "/favorites" },
          ].map((a) => (
            <motion.button
              key={a.title}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(a.href)}
              className="flex flex-col items-start gap-1.5 p-4 rounded-2xl border border-border bg-card hover:bg-muted/40 transition-colors text-left"
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="font-bold text-sm">{a.title}</span>
              <span className="text-xs text-muted-foreground">{a.sub}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Demo role switcher */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              🎭 Mode Démo — Changer de rôle
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { role: "client" as const,     label: "👤 Client"   },
                { role: "admin" as const,      label: "👑 Admin"    },
                { role: "personnel" as const,  label: "👨‍🍳 Cuisine" },
                { role: "livreur" as const,    label: "🛵 Livreur"  },
              ].map(({ role, label }) => (
                <Button
                  key={role}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleSwitchRole(role)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Notifications toggle */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Notifications Push</p>
                <p className="text-xs text-muted-foreground">Suivi de commande</p>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </motion.div>

        {/* Menu items */}
        <motion.div variants={itemVariants}>
          <Card className="divide-y divide-border overflow-hidden">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 p-3 sm:p-4 text-left transition-colors"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-foreground/70">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.button>
            ))}
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </motion.div>

        {/* Version */}
        <motion.p variants={itemVariants} className="text-center text-xs text-muted-foreground pb-2">
          Order Deal v1.0.0
        </motion.p>
      </motion.main>

      <BottomNav />
    </div>
  );
};

export default Profile;
