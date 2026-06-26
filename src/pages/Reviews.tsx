import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { mockReviews, restaurantInfo } from "../lib/data/mockData";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import BottomNav from "../components/BottomNav";

const Reviews = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<number | null>(null);

  const filteredReviews = filter 
    ? mockReviews.filter(r => r.rating === filter)
    : mockReviews;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.rating === rating).length,
    percentage: (mockReviews.filter(r => r.rating === rating).length / mockReviews.length) * 100,
  }));

  return (
    <div className="reviews-page">
      {/* Header */}
      <header className="reviews-header">
        <div className="reviews-header__content">
          <button onClick={() => navigate(-1)} className="reviews-header__back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="reviews-header__icon">
            <Star className="w-5 h-5" />
          </div>
          <h1 className="reviews-header__title">Avis Clients</h1>
        </div>
      </header>

      <main className="reviews-main">
        {/* Rating Summary */}
        <Card className="reviews-summary">
          <div className="reviews-summary__content">
            <div className="reviews-summary__score">
              <div className="reviews-summary__number">{restaurantInfo.rating}</div>
              <div className="reviews-summary__stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`reviews-summary__star ${
                      star <= Math.round(restaurantInfo.rating) ? 'reviews-summary__star--filled' : ''
                    }`}
                  />
                ))}
              </div>
              <p className="reviews-summary__count">{restaurantInfo.reviewCount} avis</p>
            </div>
            
            <div className="reviews-summary__distribution">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="reviews-summary__bar">
                  <span className="reviews-summary__rating">{rating}</span>
                  <Star className="reviews-summary__bar-star" />
                  <Progress value={percentage} className="reviews-summary__progress" />
                  <span className="reviews-summary__bar-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Write Review CTA */}
        <Card className="reviews-cta">
          <div className="reviews-cta__content">
            <div>
              <p className="reviews-cta__title">Partagez votre expérience!</p>
              <p className="reviews-cta__subtitle">Votre avis nous aide à nous améliorer</p>
            </div>
            <ReviewForm 
              orderId="demo"
              trigger={
                <Button variant="secondary" className="reviews-cta__button">
                  <MessageSquare className="w-4 h-4" />
                  Écrire
                </Button>
              }
            />
          </div>
        </Card>

        {/* Filters */}
        <div className="reviews-filters">
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            Tous ({mockReviews.length})
          </Button>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = mockReviews.filter(r => r.rating === rating).length;
            if (count === 0) return null;
            return (
              <Button
                key={rating}
                variant={filter === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(rating)}
                className="reviews-filters__button"
              >
                <Star className="w-3 h-3" />
                {rating} ({count})
              </Button>
            );
          })}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {filteredReviews.length === 0 ? (
            <Card className="reviews-empty">
              <Star className="reviews-empty__icon" />
              <p>Aucun avis avec cette note</p>
            </Card>
          ) : (
            filteredReviews.map((review, index) => (
              <div 
                key={review.id}
                className="reviews-list__item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ReviewCard review={review} />
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reviews;
