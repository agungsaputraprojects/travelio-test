'use client';

import React from 'react';
import { BookCard } from '@/components/shared/BookCard';
import { Book } from '@/lib/types';
import { BookOpen, Search, Sparkles, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookGridProps {
  books: Book[];
  wishlistIds: Set<string>;
  onWishlistToggle: (book: Book, isAdding: boolean) => Promise<void>;
  onBookPreview?: (book: Book) => void;
  isLoading?: boolean;
  searchQuery?: string;
  totalItems?: number;
  onLoadMore?: () => void;
  hasMoreItems?: boolean;
  className?: string;
  onResetToHome?: () => void; // NEW: Reset to homepage callback
}

// Skeleton loader component
const BookCardSkeleton = () => (
  <div className="animate-shimmer bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="aspect-[3/4] bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex items-center gap-2">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  </div>
);

export function BookGrid({ 
  books, 
  wishlistIds, 
  onWishlistToggle,
  onBookPreview,
  isLoading = false,
  searchQuery = '',
  totalItems = 0,
  onLoadMore,
  hasMoreItems = false,
  className,
  onResetToHome // NEW: Reset callback
}: BookGridProps) {
  
  // Loading state
  if (isLoading && books.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // No results state
  if (books.length === 0 && searchQuery) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8">
          <Search className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">No books found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
          We could not find any books matching &quot;<span className="font-semibold text-blue-600">{searchQuery}</span>&quot;. 
          Try different keywords or explore our suggestions below.
        </p>

        {/* NEW: Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {onResetToHome && (
            <Button
              onClick={onResetToHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Homepage
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-xl hover:bg-gray-50"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </div>
        
        <div className="bg-white rounded-xl p-6 max-w-lg mx-auto shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Search Tips
          </h4>
          <ul className="space-y-2 text-left text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Try broader keywords like &quot;programming&quot; instead of specific terms
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Search by author name like &quot;Stephen King&quot; or &quot;J.K. Rowling&quot;
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Use category terms like &quot;science fiction&quot;, &quot;history&quot;, or &quot;cooking&quot;
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Check your spelling and try alternative spellings
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Empty state (no search performed)
  if (books.length === 0 && !searchQuery) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8">
          <BookOpen className="w-16 h-16 text-blue-500" />
        </div>
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Amazing Books
        </h3>
        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
          Search for any book, author, or topic to start exploring millions of books from around the world.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['JavaScript', 'React', 'Python', 'Design', 'History', 'Fiction'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              onClick={() => {
                // This would trigger a search for the suggestion
                console.log(`Search for: ${suggestion}`);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results header */}
      {searchQuery && (
        <div className="text-center bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Search className="w-5 h-5 text-green-500" />
            <span className="text-lg font-semibold text-gray-900">
              Found {totalItems > 0 ? totalItems.toLocaleString() : books.length} books
            </span>
          </div>
          <p className="text-gray-600">
            Search results for &quot;<span className="font-semibold text-blue-600">{searchQuery}</span>&quot;
          </p>
          {totalItems > books.length && (
            <p className="text-sm text-gray-500 mt-1">
              Showing first {books.length} results
            </p>
          )}
          
          {/* NEW: Reset option in results header */}
          {onResetToHome && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetToHome}
                className="text-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              >
                <Home className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Books grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isInWishlist={wishlistIds.has(book.id)}
            onWishlistToggle={onWishlistToggle}
            onPreview={onBookPreview}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoading && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMoreItems && onLoadMore && !isLoading && (
        <div className="text-center py-8">
          <Button
            onClick={onLoadMore}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Load More Books
          </Button>
        </div>
      )}

      {/* End of results message */}
      {books.length >= 40 && !hasMoreItems && (
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">🎉 You have seen all the results!</p>
            <p className="text-sm text-gray-500 mb-4">
              Try a different search term to discover more books.
            </p>
            
            {/* NEW: Reset button at end of results */}
            {onResetToHome && (
              <Button
                variant="outline"
                onClick={onResetToHome}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              >
                <Home className="w-4 h-4 mr-2" />
                Start New Search
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}