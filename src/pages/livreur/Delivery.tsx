import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bike,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Package,
  LogOut,
  Star,
  MessageSquare,
  Layers,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { mockDriverStats, mockOrders, type Order, type OrderStatus } from "../../lib/data/mockData";
import { toast } from "sonner";

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [isOnline, setIsOnline] = useState(true);

  const stats = mockDriverStats;
  const readyOrders = orders.filter(o => o.status === "ready" && o.deliveryType === "delivery");
  const activeDeliveries = orders.filter(o => o.status === "on_the_way" || o.status === "picked_up");

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    
    const statusMessages: Record<OrderStatus, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      preparing: "En préparation",
      ready: "Prête",
      picked_up: "Commande récupérée!",
      on_the_way: "En route!",
      delivered: "Livrée avec succès!",
      cancelled: "Annulée",
    };
    
    toast.success(statusMessages[newStatus]);
  };

  const acceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, "on_the_way");
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? "Vous êtes maintenant hors ligne" : "Vous êtes maintenant en ligne");
  };

  const DeliveryCard = ({ delivery, isActive }: { delivery: Order; isActive?: boolean }) => (
    <Card className={`p-4 animate-fade-in ${isActive ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            🌮
          </div>
          <div>
            <p className="font-bold">{delivery.orderNumber}</p>
            <p className="text-sm text-muted-foreground">{delivery.customerName}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={isActive ? "default" : "secondary"}>
            {delivery.status === "picked_up" ? "Récupérée" : 
             delivery.status === "on_the_way" ? "En route" : "Prête"}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {delivery.items.length} articles • {delivery.total.toFixed(2)}€
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg mb-3 text-sm">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 truncate">
          <p className="font-medium truncate">{delivery.deliveryAddress.address}</p>
          <p className="text-xs text-muted-foreground">
            {delivery.deliveryAddress.postalCode} {delivery.deliveryAddress.city}
          </p>
        </div>
      </div>

      {isActive && (
        <>
          {/* Contact buttons */}
          <div className="flex items-center gap-2 mb-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              GPS
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {delivery.status === "picked_up" ? (
              <Button 
                className="flex-1 bg-success hover:bg-success/90"
                onClick={() => updateOrderStatus(delivery.id, "delivered")}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Livré!
              </Button>
            ) : (
              <Button 
                className="flex-1"
                onClick={() => updateOrderStatus(delivery.id, "picked_up")}
              >
                <Package className="w-4 h-4 mr-2" />
                Récupérer
              </Button>
            )}
          </div>
        </>
      )}

      {!isActive && (
        <Button 
          className="w-full"
          onClick={() => acceptOrder(delivery.id)}
        >
          <Bike className="w-4 h-4 mr-2" />
          Accepter
        </Button>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛵</span>
            <div>
              <h1 className="text-xl font-bold font-display">Livreur</h1>
              <p className="text-sm text-muted-foreground">{user?.name || "Livreur"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={isOnline ? "default" : "outline"} 
              size="sm"
              onClick={toggleOnline}
              className={isOnline ? "bg-success hover:bg-success/90" : ""}
            >
              {isOnline ? "🟢 En ligne" : "🔴 Hors ligne"}
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{stats.deliveriesToday}</div>
            <p className="text-xs text-muted-foreground">Livraisons</p>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-coral">{activeDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-success">{stats.earnings.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">Gains</p>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl font-bold text-accent flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-accent" />
              {stats.rating}
            </div>
            <p className="text-xs text-muted-foreground">Note</p>
          </Card>
        </div>

        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Livraisons en cours ({activeDeliveries.length})
            </h2>
            <div className="space-y-4">
              {activeDeliveries.map(delivery => (
                <DeliveryCard key={delivery.id} delivery={delivery} isActive />
              ))}
            </div>
          </div>
        )}

        {/* Available Orders */}
        <div>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Commandes disponibles ({readyOrders.length})
          </h2>
          
          {!isOnline ? (
            <Card className="p-8 text-center text-muted-foreground">
              <Bike className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Passez en ligne pour voir les commandes</p>
            </Card>
          ) : readyOrders.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucune commande disponible</p>
              <p className="text-sm">Les nouvelles commandes apparaîtront ici</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {readyOrders.map(order => (
                <DeliveryCard key={order.id} delivery={order} />
              ))}
            </div>
          )}
        </div>

        {/* Multi-delivery indicator */}
        {activeDeliveries.length > 1 && (
          <Card className="p-4 bg-accent/10 border-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Mode multi-livraisons</p>
                <p className="text-sm text-muted-foreground">
                  Vous avez {activeDeliveries.length} livraisons en cours. Optimisez votre parcours!
                </p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboard;