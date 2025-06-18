'use client';

import React, { useState } from 'react';
import { Heart, Loader2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Book } from '@/lib/types';

interface WishlistButtonProps {
  book: Book;
  isInWishlist: boolean;
  onToggle: (book: Book, isAdding: boolean) => Promise<void>;
  className?: string;
  variant?: 'icon' | 'button' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function WishlistButton({ 
  book, 
  isInWishlist, 
  onToggle, 
  className,
  variant = 'icon',
  size = 'md',
  showText = false
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(book, !isInWishlist);
      
      // Show success state briefly
      if (!isInWishlist) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getButtonContent = () => {
    if (isLoading) {
      return <Loader2 className={cn(iconSizeClasses[size], 'animate-spin')} />;
    }

    if (justAdded) {
      return <Check className={cn(iconSizeClasses[size], 'text-green-600')} />;
    }

    if (isInWishlist) {
      return <Heart className={cn(iconSizeClasses[size], 'fill-current text-red-500')} />;
    }

    return variant === 'floating' ? 
      <Plus className={cn(iconSizeClasses[size])} /> :
      <Heart className={cn(iconSizeClasses[size])} />;
  };

  const getTooltipText = () => {
    if (isLoading) return 'Loading...';
    if (justAdded) return 'Added to wishlist!';
    return isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
  };

  // Button variant
  if (variant === 'button') {
    return (
      <Button
        variant={isInWishlist ? "default" : "outline"}
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'transition-all duration-300 transform hover:scale-105',
          isInWishlist && 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
          justAdded && 'bg-green-50 border-green-200 text-green-700',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {getButtonContent()}
          {showText && (
            <span className="text-sm font-medium">
              {justAdded ? 'Added!' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </span>
          )}
        </div>
      </Button>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'fixed bottom-6 right-6 z-50 rounded-full shadow-lg',
          'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600',
          'text-white border-0 transition-all duration-300 transform hover:scale-110',
          sizeClasses[size],
          justAdded && 'bg-gradient-to-r from-green-500 to-emerald-500',
          className
        )}
        title={getTooltipText()}
      >
        {getButtonContent()}
      </Button>
    );
  }

  // Icon variant (default)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        'rounded-full transition-all duration-300 transform hover:scale-110',
        'hover:bg-red-50 hover:text-red-600',
        isInWishlist && 'text-red-600 bg-red-50',
        justAdded && 'text-green-600 bg-green-50',
        'group relative',
        className
      )}
      title={getTooltipText()}
    >
      {getButtonContent()}
      
      {/* Ripple effect */}
      <div className={cn(
        'absolute inset-0 rounded-full opacity-0 group-active:opacity-20',
        'bg-gradient-to-r from-pink-400 to-red-400 transition-opacity duration-150'
      )} />
    </Button>
  );
}