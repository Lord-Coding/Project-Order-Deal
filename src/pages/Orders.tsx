import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Box, Truck, ArrowLeft2 } from "iconsax-react";
import LottiePlayer from "../components/LottiePlayer";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { mockOrders, type Order, type OrderStatus, restaurantInfo } from "../lib/data/mockData";
import BottomNav from "../components/BottomNav";
import deliveryAnimation from "../assets/lottie/delivery.json";
import loadingAnimation from "../assets/lottie/loading.json";

const statusConfig: Record<
  OrderStatus,
  { label: string; badge: "default" | "secondary" | "success" | "destructive" }
> = {
  pending:    { label: "En attente",     badge: "secondary"    },
  confirmed:  { label: "Confirmée",      badge: "secondary"    },
  preparing:  { label: "En préparation", badge: "secondary"    },
  ready:      { label: "Prête",          badge: "success"      },
  picked_up:  { label: "Récupérée",      badge: "default"      },
  on_the_way: { label: "En livraison",   badge: "default"      },
  delivered:  { label: "Livrée",         badge: "success"      },
  cancelled:  { label: "Annulée",        badge: "destructive"  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
};

const OrderCard = ({ order, onClick, index }: { order: Order; onClick: () => void; index: number }) => {
  const status = statusConfig[order.status];
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
    >
      <Card
        onClick={onClick}
        className="p-3 sm:p-4 cursor-pointer hover:shadow-card transition-shadow"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-bold text-sm sm:text-base">{restaurantInfo.name}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{order.orderNumber}</p>
          </div>
          <Badge variant={status.badge} className="shrink-0">{status.label}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-muted shrink-0">
            {order.status === "on_the_way" || order.status === "picked_up" ? (
              <LottiePlayer animationData={deliveryAnimation} loop style={{ width: "100%", height: "100%" }} />
            ) : order.status === "preparing" ? (
              <LottiePlayer animationData={loadingAnimation} loop style={{ width: "100%", height: "100%" }} />
            ) : (
              <img src={order.items[0]?.image} alt="Order" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-primary text-sm sm:text-base">
                {order.total.toFixed(2)}€
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </Card>
    </motion.div>
  );
};

const EmptyState = ({
  animation,
  title,
  message,
}: {
  animation: object;
  title: string;
  message: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <LottiePlayer
      animationData={animation}
      loop
      style={{ width: 160, height: 160 }}
    />
    <h2 className="font-display font-bold text-xl mb-2">{title}</h2>
    <p className="text-muted-foreground text-sm">{message}</p>
  </motion.div>
);

const Orders = () => {
  const navigate = useNavigate();

  const activeOrders = mockOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "ready", "picked_up", "on_the_way"].includes(o.status)
  );
  const pastOrders = mockOrders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );

  return (
    <div className="orders-page">
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
            aria-label="Retour"
          >
            <ArrowLeft2 size={20} color="currentColor" variant="Bold" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Box size={20} color="hsl(var(--primary))" variant="Bold" />
            </div>
            <h1 className="font-display font-bold text-lg">Mes Commandes</h1>
          </div>
        </div>
      </motion.header>

      <main className="orders-main">
        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-2 w-full bg-muted">
            <TabsTrigger value="active">En cours ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="past">Historique ({pastOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-3">
            <AnimatePresence>
              {activeOrders.length === 0 ? (
                <EmptyState
                  animation={deliveryAnimation}
                  title="Pas de commande en cours"
                  message="Vos commandes actives apparaîtront ici"
                />
              ) : (
                activeOrders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} onClick={() => navigate(`/tracking/${order.id}`)} />
                ))
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-3">
            <AnimatePresence>
              {pastOrders.length === 0 ? (
                <EmptyState
                  animation={loadingAnimation}
                  title="Pas d'historique"
                  message="Votre historique de commandes apparaîtra ici"
                />
              ) : (
                pastOrders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} onClick={() => navigate(`/tracking/${order.id}`)} />
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
