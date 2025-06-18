'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { Button } from '@/components/ui/button';
import { Book } from '@/lib/types';
import { formatAuthors, getBookThumbnail, formatDate } from '@/lib/utils';
import { Calendar, BookOpen, ExternalLink, Eye, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  isInWishlist: boolean;
  onWishlistToggle: (book: Book, isAdding: boolean) => Promise<void>;
  onPreview?: (book: Book) => void;
  className?: string;
}

const truncateCategory = (category: string, maxLength: number = 15): string => {
  if (category.length <= maxLength) return category;
  return category.substring(0, maxLength - 3) + '...';
};

export function BookCard({ 
  book, 
  isInWishlist, 
  onWishlistToggle, 
  onPreview,
  className 
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const thumbnail = getBookThumbnail(book.imageLinks);
  const authors = formatAuthors(book.authors);
  const rating = book.averageRating || 0;
  const publishedYear = book.publishedDate ? formatDate(book.publishedDate) : null;

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreview) {
      onPreview(book);
    } else if (book.previewLink) {
      window.open(book.previewLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (book.infoLink) {
      window.open(book.infoLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-xl transition-all duration-300 h-full overflow-hidden hover:-translate-y-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Book Cover Section */}
        <div className="relative">
          <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {!imageError ? (
              <Image
                src={thumbnail}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                onError={handleImageError}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOiXWGaRmknyejFskzSvyiOg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-center p-4">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500 line-clamp-2">{book.title}</p>
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-black/40 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Action buttons overlay - IMPROVED */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex flex-col gap-2 px-4">
                {book.previewLink && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handlePreviewClick}
                    className="bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm border-0 font-medium transition-all duration-200 hover:scale-105 w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (book.infoLink) {
                      window.open(book.infoLink, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm border-0 font-medium transition-all duration-200 hover:scale-105 w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>
          </div>
          
          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <WishlistButton
              book={book}
              isInWishlist={isInWishlist}
              onToggle={onWishlistToggle}
              className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              size="sm"
            />
          </div>

          {/* Category Badge - IMPROVED */}
          {book.categories && book.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg max-w-[120px]"
                title={book.categories[0]}
              >
                <span className="block truncate">
                  {truncateCategory(book.categories[0])}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Book Information */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title - IMPROVED TRUNCATION */}
          <h3 className="font-bold text-sm mb-2 group-hover:text-blue-600 transition-colors leading-tight min-h-[2.5rem]">
            <span className="line-clamp-2" title={book.title}>
              {book.title}
            </span>
          </h3>
          
          {/* Author - IMPROVED */}
          <div className="flex items-center gap-1 mb-4">
            <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground line-clamp-1 flex-1" title={authors}>
              {authors}
            </p>
          </div>
          
          {/* Bottom section */}
          <div className="mt-auto space-y-2">
            {/* Rating - IMPROVED */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <StarRating rating={rating} size="sm" showRating={false} />
                {rating > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {rating.toFixed(1)}
                  </span>
                )}
              </div>
              {book.ratingsCount && book.ratingsCount > 0 ? (
                <span className="text-xs text-muted-foreground">
                  ({book.ratingsCount})
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No reviews
                </span>
              )}
            </div>
            
            {/* Date & Page Count - NEW LAYOUT */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {publishedYear ? (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{publishedYear}</span>
                </div>
              ) : (
                <div></div>
              )}
              
              {book.pageCount && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 flex-shrink-0" />
                  <span>{book.pageCount} pages</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}