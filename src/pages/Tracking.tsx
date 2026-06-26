import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageSquare, MapPin,
  Clock, CheckCircle2, Circle, Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { mockOrders, restaurantInfo, type OrderStatus } from "../lib/data/mockData";

const statusLabels: Record<OrderStatus, string> = {
  pending:    "En attente",
  confirmed:  "Confirmée",
  preparing:  "En préparation",
  ready:      "Prête",
  picked_up:  "Récupérée",
  on_the_way: "En livraison",
  delivered:  "Livrée",
  cancelled:  "Annulée",
};

const statusOrder: OrderStatus[] = [
  "pending", "confirmed", "preparing", "ready", "picked_up", "on_the_way", "delivered",
];

const steps = [
  { id: 1, status: "confirmed"  as OrderStatus, label: "Commande confirmée", emoji: "✅" },
  { id: 2, status: "preparing"  as OrderStatus, label: "En préparation",     emoji: "👨‍🍳" },
  { id: 3, status: "ready"      as OrderStatus, label: "Prête",              emoji: "📦" },
  { id: 4, status: "on_the_way" as OrderStatus, label: "En livraison",       emoji: "🛵" },
  { id: 5, status: "delivered"  as OrderStatus, label: "Livrée",             emoji: "🏠" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Tracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">📦</span>
        <p className="font-display font-bold text-lg">Commande introuvable</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(order.status);

  const getStepState = (step: typeof steps[0]) => {
    const idx = statusOrder.indexOf(step.status);
    if (order.status === "cancelled") return "cancelled";
    if (idx <= currentStatusIndex) return "done";
    if (idx === currentStatusIndex + 1) return "current";
    return "pending";
  };

  return (
    <div className="tracking-page min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-lg leading-none">Suivi de Commande</h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{order.orderNumber}</p>
          </div>
          <Badge
            variant={
              order.status === "on_the_way" || order.status === "picked_up" ? "default"
              : order.status === "delivered" ? "success"
              : order.status === "cancelled" ? "destructive"
              : "secondary"
            }
          >
            {statusLabels[order.status]}
          </Badge>
        </div>
      </motion.header>

      <main className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Map placeholder */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="overflow-hidden">
            <div className="relative h-36 sm:h-48 bg-gradient-to-br from-muted to-muted/60 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-8 h-8 text-primary" />
              <p className="text-sm font-medium">Carte de suivi en direct</p>
              {order.status === "on_the_way" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-sm shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">Arrivée dans ~15 min</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{order.estimatedDelivery}</span>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Progress steps */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5">
            <h2 className="font-display font-bold text-base sm:text-lg mb-5">Progression</h2>
            <div className="space-y-0">
              {steps.map((step, index) => {
                const state = getStepState(step);
                const timelineItem = order.timeline.find((t) => t.status === step.status);
                const isDone    = state === "done";
                const isCurrent = state === "current";

                return (
                  <div key={step.id} className="flex gap-3">
                    {/* Indicator column */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + index * 0.1 }}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                            className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </motion.div>
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground/40 shrink-0" />
                        )}
                      </motion.div>
                      {index < steps.length - 1 && (
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                          className={`w-0.5 h-8 my-1 rounded-full origin-top ${isDone ? "bg-success" : "bg-muted"}`}
                        />
                      )}
                    </div>

                    {/* Label column */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm">{step.emoji}</span>
                        <p className={`text-sm font-semibold ${!isDone && !isCurrent ? "text-muted-foreground/50" : ""}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-[10px] px-1.5">En cours</Badge>
                        )}
                      </div>
                      {timelineItem && (
                        <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                          {new Date(timelineItem.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Driver info */}
        {order.driverName && order.status === "on_the_way" && (
          <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="show">
            <Card className="p-4 sm:p-5">
              <h3 className="font-display font-bold text-base mb-3">Votre livreur</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  🛵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{order.driverName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-xs font-medium">4.9</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <motion.div whileTap={{ scale: 0.88 }}>
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.88 }}>
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order summary */}
        <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5">
            <h3 className="font-display font-bold text-base mb-3">Détails de la commande</h3>

            {/* Restaurant */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-4">
              <span className="text-2xl">🌮</span>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{restaurantInfo.name}</p>
                <p className="text-xs text-muted-foreground truncate">{restaurantInfo.address}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span><span>{order.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span><span>{order.deliveryFee.toFixed(2)}€</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Réduction</span><span>-{order.discount.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{order.total.toFixed(2)}€</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Delivery address */}
        <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="show">
          <Card className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Adresse de livraison</p>
              <p className="font-semibold text-sm">{order.deliveryAddress.address}</p>
              <p className="text-xs text-muted-foreground">
                {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Help button */}
        <motion.div custom={5} variants={sectionVariants} initial="hidden" animate="show">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/support")}
          >
            Besoin d'aide ?
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Tracking;
