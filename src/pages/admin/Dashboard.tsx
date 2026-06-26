import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  Star,
  Clock,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { 
  mockDashboardStats, 
  mockOrders, 
  allFoodItems, 
  categories, 
  mockUsers,
} from "../../lib/data/mockData";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = mockDashboardStats;
  const pendingOrders = mockOrders.filter(o => o.status === "pending");

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="text-xl font-bold font-display">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.name || "Admin"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {pendingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {pendingOrders.length}
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6 grid grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-2">
              <Menu className="w-4 h-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Équipe
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.todayOrders}</p>
                    <p className="text-xs text-muted-foreground">Commandes aujourd'hui</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-xl">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.todayRevenue.toFixed(0)}€</p>
                    <p className="text-xs text-muted-foreground">CA aujourd'hui</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
                    <p className="text-xs text-muted-foreground">Note moyenne</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-coral/10 rounded-xl">
                    <Users className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    <p className="text-xs text-muted-foreground">Clients</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Chiffre d'affaires (7 jours)</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {stats.revenueByDay.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary animate-fade-in"
                      style={{ 
                        height: `${(day.revenue / 1500) * 100}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Items */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Plats populaires</h3>
              <div className="space-y-3">
                {stats.popularItems.map((item, index) => (
                  <div key={item.item.id} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                      <img src={item.item.image} alt={item.item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.count} vendus</p>
                    </div>
                    <span className="font-bold text-primary">{item.item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pending Orders Alert */}
            {pendingOrders.length > 0 && (
              <Card className="p-4 border-coral/50 bg-coral/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-coral animate-pulse" />
                    <div>
                      <p className="font-semibold">{pendingOrders.length} commandes en attente</p>
                      <p className="text-sm text-muted-foreground">Nécessitent une confirmation</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setActiveTab("orders")}>
                    Voir <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Toutes les commandes</h2>
              <Badge variant="secondary">{mockOrders.length} total</Badge>
            </div>
            {mockOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <Badge variant={
                    order.status === "delivered" ? "success" :
                    order.status === "cancelled" ? "destructive" :
                    order.status === "on_the_way" ? "default" : "secondary"
                  }>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                  </span>
                  <span className="font-bold text-primary">{order.total.toFixed(2)}€</span>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Gestion du menu</h2>
              <Button size="sm" onClick={() => toast.info("Fonctionnalité à venir!")}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un plat
              </Button>
            </div>
            
            {categories.map(cat => {
              const items = allFoodItems.filter(i => i.category === cat.id);
              if (items.length === 0) return null;
              
              return (
                <Card key={cat.id} className="p-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.name}
                    <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
                  </h3>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}€</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon-sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon-sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Équipe</h2>
              <Button size="sm" onClick={() => toast.info("Fonctionnalité à venir!")}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un membre
              </Button>
            </div>
            
            {mockUsers.filter(u => u.role !== "client").map(member => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">
                    {member.role === "admin" ? "👑" : member.role === "personnel" ? "👨‍🍳" : "🛵"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
