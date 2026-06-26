import { Star } from "lucide-react";
import { Card } from "./ui/card";
import { type Review } from "../lib/data/mockData";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{review.userName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-bold text-sm">{review.rating}</span>
        </div>
      </div>

      {/* Rating Details */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          🍽️ {review.foodRating}/5
        </span>
        <span className="flex items-center gap-1">
          🛵 {review.deliveryRating}/5
        </span>
      </div>

      {/* Comment */}
      <p className="mt-3 text-sm">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, index) => (
            <div key={index} className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <img src={img} alt="Review" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Restaurant Response */}
      {review.response && (
        <div className="mt-4 p-3 bg-primary/5 rounded-xl border-l-4 border-primary">
          <p className="text-xs font-semibold text-primary mb-1">Réponse du restaurant</p>
          <p className="text-sm text-muted-foreground">{review.response.text}</p>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;
