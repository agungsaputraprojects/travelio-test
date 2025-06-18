import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showRating = true,
  className,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const clampedRating = Math.max(0, Math.min(rating, maxRating));
  const displayRating = hoverRating !== null ? hoverRating : clampedRating;

  const handleStarClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue: number) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= Math.floor(displayRating);
    const isHalfFilled = starNumber === Math.ceil(displayRating) && displayRating % 1 !== 0;

    return (
      <div 
        key={index} 
        className={cn(
          "relative flex-shrink-0",
          interactive && "cursor-pointer transition-transform hover:scale-110"
        )}
        onClick={() => handleStarClick(starNumber)}
        onMouseEnter={() => handleStarHover(starNumber)}
      >
        <Star
          className={cn(
            sizeClasses[size],
            'text-gray-300 transition-colors',
            className
          )}
        />
        {(isFilled || isHalfFilled) && (
          <div
            className={cn(
              'absolute top-0 left-0 overflow-hidden transition-all duration-200',
              isHalfFilled ? 'w-1/2' : 'w-full'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'text-yellow-400 fill-current transition-colors',
                interactive && hoverRating !== null && 'text-yellow-500',
                className
              )}
            />
          </div>
        )}
      </div>
    );
  });

  // Empty state (no rating)
  if (rating === 0 && !interactive && !showRating) {
    return (
      <div 
        className={cn("flex gap-0.5", interactive && "gap-1")}
        onMouseLeave={handleMouseLeave}
      >
        {stars}
      </div>
    );
  }

  // With rating display
  return (
    <div className="flex items-center gap-1">
      <div 
        className={cn("flex gap-0.5", interactive && "gap-1")}
        onMouseLeave={handleMouseLeave}
      >
        {stars}
      </div>
      {showRating && rating > 0 && (
        <span className={cn("text-muted-foreground ml-1", textSizeClasses[size])}>
          {displayRating.toFixed(1)}
        </span>
      )}
      {showRating && rating === 0 && (
        <span className={cn("text-muted-foreground ml-1", textSizeClasses[size])}>
          No rating
        </span>
      )}
    </div>
  );
}