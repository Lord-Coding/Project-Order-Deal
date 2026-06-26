import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Package,
  Bell,
  LogOut,
  Timer,
  UtensilsCrossed,
  Truck,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { mockOrders, type Order, type OrderStatus } from "../../lib/data/mockData";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
};

type OrderSegment = "sur_place" | "a_emporter" | "livraison";

const KitchenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [activeSegment, setActiveSegment] = useState<OrderSegment>("sur_place");
  const [isPaused, setIsPaused] = useState(false);
  
  // Filter orders by segment (mock: using orderType or deliveryType)
  const getOrdersBySegment = (segment: OrderSegment) => {
    return orders.filter(o => {
      if (segment === "livraison") return o.deliveryType === "delivery";
      if (segment === "a_emporter") return o.deliveryType === "pickup";
      return o.deliveryType === "dine_in" || !o.deliveryType;
    });
  };

  const segmentOrders = getOrdersBySegment(activeSegment);
  const pendingOrders = segmentOrders.filter(o => o.status === "pending" || o.status === "confirmed");
  const preparingOrders = segmentOrders.filter(o => o.status === "preparing");
  const readyOrders = segmentOrders.filter(o => o.status === "ready");

  // Global counts for badges
  const allPending = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
  const allPreparing = orders.filter(o => o.status === "preparing").length;
  const allReady = orders.filter(o => o.status === "ready").length;

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast.success(`Commande mise à jour: ${statusLabels[newStatus] || newStatus}`);
  };

  const OrderCard = ({ order, actions }: { order: Order; actions: React.ReactNode }) => (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">{order.customerName}</p>
        </div>
        <div className="text-right">
          <Badge variant="secondary">{statusLabels[order.status]}</Badge>
          <p className="text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3 inline mr-1" />
            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
            <span className="font-bold text-primary">{item.quantity}x</span>
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>

      {order.specialInstructions && (
        <div className="p-2 bg-accent/10 rounded-lg mb-4 text-sm">
          <span className="font-semibold">Note:</span> {order.specialInstructions}
        </div>
      )}

      <div className="flex gap-2">
        {actions}
      </div>
    </Card>
  );

  const getSegmentIcon = (segment: OrderSegment) => {
    switch(segment) {
      case "sur_place": return <UtensilsCrossed className="w-4 h-4" />;
      case "a_emporter": return <Package className="w-4 h-4" />;
      case "livraison": return <Truck className="w-4 h-4" />;
    }
  };

  const getSegmentLabel = (segment: OrderSegment) => {
    switch(segment) {
      case "sur_place": return "Sur place";
      case "a_emporter": return "À emporter";
      case "livraison": return "Livraison";
    }
  };

  const getSegmentCount = (segment: OrderSegment) => {
    return getOrdersBySegment(segment).filter(o => 
      o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👨‍🍳</span>
            <div>
              <h1 className="text-xl font-bold font-display">Cuisine</h1>
              <p className="text-sm text-muted-foreground">{user?.name || "Personnel"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {allPending > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                  {allPending}
                </span>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-coral">{allPending}</div>
            <p className="text-sm text-muted-foreground">En attente</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{allPreparing}</div>
            <p className="text-sm text-muted-foreground">En préparation</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{allReady}</div>
            <p className="text-sm text-muted-foreground">Prêtes</p>
          </Card>
        </div>

        {/* Segment Tabs */}
        <Tabs value={activeSegment} onValueChange={(v) => setActiveSegment(v as OrderSegment)} className="mb-6">
          <TabsList className="w-full grid grid-cols-3">
            {(["sur_place", "a_emporter", "livraison"] as OrderSegment[]).map(segment => (
              <TabsTrigger key={segment} value={segment} className="relative flex items-center gap-2">
                {getSegmentIcon(segment)}
                {getSegmentLabel(segment)}
                {getSegmentCount(segment) > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {getSegmentCount(segment)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Kanban-style columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-coral" />
              En attente ({pendingOrders.length})
            </h2>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Aucune commande en attente
                </Card>
              ) : (
                pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actions={
                      <Button 
                        className="w-full"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        <ChefHat className="w-4 h-4 mr-2" />
                        Commencer
                      </Button>
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary animate-pulse" />
              En préparation ({preparingOrders.length})
            </h2>
            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Aucune préparation en cours
                </Card>
              ) : (
                preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actions={
                      <Button 
                        className="w-full bg-success hover:bg-success/90"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Prête!
                      </Button>
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div>
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Prêtes ({readyOrders.length})
            </h2>
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  Aucune commande prête
                </Card>
              ) : (
                readyOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actions={
                      <div className="w-full text-center p-2 bg-success/10 rounded-lg text-success text-sm font-medium">
                        {activeSegment === "livraison" ? "✓ En attente du livreur" : 
                         activeSegment === "a_emporter" ? "✓ Prête pour retrait" : 
                         "✓ Prête à servir"}
                      </div>
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KitchenDashboard;