import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Clock,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { restaurantInfo, allFoodItems, categories, mockReviews } from "../lib/data/mockData";
import { useCart } from "../contexts/CartContext";

const Restaurant = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const groupedMenu = categories.map((category) => ({
    name: category.name,
    icon: category.icon,
    items: allFoodItems.filter((item) => item.category === category.id),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-56 bg-gradient-hero">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl">🌮</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2 bg-card/80 backdrop-blur-sm rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 bg-card/80 backdrop-blur-sm rounded-xl">
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-coral text-coral" : ""}`} />
            </button>
            <button className="p-2 bg-card/80 backdrop-blur-sm rounded-xl">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="container max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <Card className="p-6">
          <h1 className="text-2xl font-bold font-display">{restaurantInfo.name}</h1>
          <p className="text-muted-foreground mt-1">{restaurantInfo.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-bold">{restaurantInfo.rating}</span>
              <span className="text-muted-foreground">({restaurantInfo.reviewCount} avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto text-primary" />
              <p className="text-sm font-semibold mt-1">{restaurantInfo.estimatedDelivery}</p>
              <p className="text-xs text-muted-foreground">Livraison</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{restaurantInfo.minOrder}€</div>
              <p className="text-xs text-muted-foreground">Minimum</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{restaurantInfo.deliveryFee}€</div>
              <p className="text-xs text-muted-foreground">Livraison</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="menu" className="flex-1">Menu</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Avis</TabsTrigger>
            <TabsTrigger value="info" className="flex-1">Infos</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            {groupedMenu.map((category) => (
              <section key={category.name}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-primary">{item.price.toFixed(2)}€</span>
                              {item.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">{item.originalPrice.toFixed(2)}€</span>
                              )}
                            </div>
                            <Button size="icon-sm" onClick={() => addItem(item)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card className="p-6 text-center">
              <div className="text-5xl font-bold text-primary">{restaurantInfo.rating}</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(restaurantInfo.rating) ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-muted-foreground mt-1">{restaurantInfo.reviewCount} avis</p>
            </Card>
            {mockReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                {review.response && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg text-sm">
                    <p className="font-semibold text-primary">Réponse du restaurant:</p>
                    <p className="text-muted-foreground">{review.response.text}</p>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Adresse</h3>
              <p className="text-muted-foreground">{restaurantInfo.address}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Horaires</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(restaurantInfo.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Phone className="w-5 h-5 text-primary" />Contact</h3>
              <p className="text-muted-foreground">{restaurantInfo.phone}</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Restaurant;
