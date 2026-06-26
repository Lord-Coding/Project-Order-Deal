import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bell, Package, Truck, Gift,
  Star, CheckCircle2, Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/BottomNav";

interface Notification {
  id: string;
  type: "order" | "delivery" | "promo" | "review" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  orderId?: string;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "delivery", title: "Commande en route !", message: "Votre livreur Lucas est en chemin. Arrivée estimée : 15 min", time: "Il y a 5 min", read: false, orderId: "ORD-001" },
  { id: "n2", type: "order",    title: "Commande confirmée",  message: "Votre commande #ORD-001 a été confirmée et est en préparation", time: "Il y a 20 min", read: false, orderId: "ORD-001" },
  { id: "n3", type: "promo",    title: "🔥 Offre spéciale !",  message: "-20% sur tous les tacos ce weekend avec le code TACOS20", time: "Il y a 2h", read: true },
  { id: "n4", type: "review",   title: "Donnez votre avis",   message: "Comment était votre commande d'hier ? Laissez un avis !", time: "Hier", read: true, orderId: "ORD-098" },
  { id: "n5", type: "system",   title: "Bienvenue chez Order Deal !", message: "Découvrez nos spécialités et profitez de -15% sur votre première commande", time: "Il y a 3 jours", read: true },
];

const iconMap: Record<Notification["type"], React.ElementType> = {
  order:    Package,
  delivery: Truck,
  promo:    Gift,
  review:   Star,
  system:   Bell,
};

const colorMap: Record<Notification["type"], string> = {
  order:    "bg-primary/10 text-primary",
  delivery: "bg-coral/15 text-coral",
  promo:    "bg-accent/20 text-accent-foreground",
  review:   "bg-warning/15 text-warning",
  system:   "bg-muted text-muted-foreground",
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.25 } },
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead      = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead   = ()           => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const deleteNotif     = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id));

  const handleClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.orderId) navigate(`/tracking/${notif.orderId}`);
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary">
            <Bell className="w-5 h-5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <h1 className="font-display font-bold text-lg flex-1">Notifications</h1>

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
              >
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Tout lu
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <main className="notifications-main">
        <AnimatePresence mode="wait">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl mb-4"
              >
                🔔
              </motion.div>
              <h2 className="font-display font-bold text-xl mb-2">Aucune notification</h2>
              <p className="text-muted-foreground text-sm">Vos notifications apparaîtront ici</p>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-2.5">
              <AnimatePresence>
                {notifications.map((notif, i) => {
                  const Icon = iconMap[notif.type];
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      whileHover={{ y: -1 }}
                    >
                      <Card
                        onClick={() => handleClick(notif)}
                        className={cn(
                          "p-3 sm:p-4 flex gap-3 cursor-pointer transition-all hover:shadow-card",
                          !notif.read && "border-primary/30 bg-primary/[0.03]"
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0",
                          colorMap[notif.type]
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-semibold text-sm leading-snug">{notif.title}</p>
                            {!notif.read && (
                              <span className="mt-0.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                            {!notif.read && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Delete */}
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          className="shrink-0 self-start p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;
