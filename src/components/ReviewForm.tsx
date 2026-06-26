import { useState } from "react";
import { Star, Send, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

interface ReviewFormProps {
  orderId: string;
  onSubmit?: (review: {
    rating: number;
    foodRating: number;
    deliveryRating: number;
    comment: string;
  }) => void;
  trigger?: React.ReactNode;
}

const ReviewForm = ({ orderId, onSubmit, trigger }: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Veuillez donner une note globale");
      return;
    }

    const review = {
      rating,
      foodRating: foodRating || rating,
      deliveryRating: deliveryRating || rating,
      comment,
    };

    onSubmit?.(review);
    toast.success("Merci pour votre avis! 🎉");
    setOpen(false);
    
    // Reset form
    setRating(0);
    setFoodRating(0);
    setDeliveryRating(0);
    setComment("");
  };

  const StarRating = ({ 
    value, 
    onChange, 
    size = "normal",
    label 
  }: { 
    value: number; 
    onChange: (v: number) => void;
    size?: "normal" | "large";
    label?: string;
  }) => {
    const [hovered, setHovered] = useState(0);
    const starSize = size === "large" ? "w-10 h-10" : "w-6 h-6";

    return (
      <div>
        {label && <p className="text-sm text-muted-foreground mb-2">{label}</p>}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`${starSize} transition-colors ${
                  star <= (hovered || value)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Star className="w-4 h-4" />
            Laisser un avis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Votre avis compte! ⭐</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div className="text-center">
            <p className="font-semibold mb-3">Note globale</p>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size="large" />
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
                {rating === 5 && "Excellent! 🎉"}
                {rating === 4 && "Très bien! 👍"}
                {rating === 3 && "Correct 🙂"}
                {rating === 2 && "Peut mieux faire 😐"}
                {rating === 1 && "Déçu 😞"}
              </p>
            )}
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-3">
              <StarRating 
                value={foodRating} 
                onChange={setFoodRating} 
                label="🍽️ Nourriture" 
              />
            </Card>
            <Card className="p-3">
              <StarRating 
                value={deliveryRating} 
                onChange={setDeliveryRating} 
                label="🛵 Livraison" 
              />
            </Card>
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Votre commentaire (optionnel)</p>
            <Textarea
              placeholder="Partagez votre expérience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Photo Button */}
          <Button variant="outline" className="w-full" onClick={() => toast.info("Fonctionnalité à venir!")}>
            <Camera className="w-4 h-4 mr-2" />
            Ajouter une photo
          </Button>

          {/* Submit */}
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer mon avis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
