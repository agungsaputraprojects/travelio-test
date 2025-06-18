'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/shared/SearchBar';
import { BookGrid } from '@/components/shared/BookGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Book, WishlistItem, SearchState } from '@/lib/types';
import { wishlistStorage } from '@/lib/utils';
import { 
  Heart, 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Sparkles,
  Star,
  Users,
  Globe,
  Home,
  RotateCcw
} from 'lucide-react';

export default function HomePage() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    books: [],
    isLoading: false,
    error: null,
    hasSearched: false,
    totalItems: 0
  });
  
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    const loadedWishlist = wishlistStorage.getWishlist();
    setWishlist(loadedWishlist);
    setWishlistIds(wishlistStorage.getWishlistIds());
  }, []);

  const searchBooks = async (query: string, loadMore = false) => {
    const startIndex = loadMore ? searchState.books.length : 0;
    
    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      query: loadMore ? prev.query : query,
      hasSearched: true
    }));

    setShowWishlist(false);

    try {
      const response = await fetch(
        `/api/books?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=24`
      );
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to search books');
      }

      const { data } = result;
      
      setSearchState(prev => ({
        ...prev,
        books: loadMore ? [...prev.books, ...data.books] : data.books,
        totalItems: data.totalItems,
        isLoading: false,
        hasSearched: true
      }));

    } catch (error) {
      console.error('Error searching books:', error);
      setSearchState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to search books',
        books: loadMore ? prev.books : [],
        isLoading: false
      }));
    }
  };

  const resetToHomepage = useCallback(() => {
    setSearchState({
      query: '',
      books: [],
      isLoading: false,
      error: null,
      hasSearched: false,
      totalItems: 0
    });
    setShowWishlist(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (searchState.query && !searchState.isLoading) {
      searchBooks(searchState.query, true);
    }
  }, [searchState.query, searchState.isLoading]);

  const handleWishlistToggle = useCallback(async (book: Book, isAdding: boolean) => {
    try {
      if (isAdding) {
        wishlistStorage.addToWishlist(book);
        const updatedWishlist = wishlistStorage.getWishlist();
        setWishlist(updatedWishlist);
        setWishlistIds(prev => new Set([...Array.from(prev), book.id]));
      } else {
        wishlistStorage.removeFromWishlist(book.id);
        const updatedWishlist = wishlistStorage.getWishlist();
        setWishlist(updatedWishlist);
        setWishlistIds(prev => {
          const newArray = Array.from(prev).filter(id => id !== book.id);
          return new Set(newArray);
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }, []);

  const toggleWishlistView = () => {
    setShowWishlist(!showWishlist);
    setSearchState(prev => ({ ...prev, error: null }));
  };

  const wishlistBooks: Book[] = wishlist.map(item => ({
    id: item.id,
    title: item.title,
    authors: item.authors,
    imageLinks: item.thumbnail ? {
      thumbnail: item.thumbnail
    } : undefined,
    averageRating: item.rating,
    previewLink: item.previewLink,
    infoLink: item.infoLink,
    publishedDate: item.publishedDate,
    pageCount: item.pageCount,
    categories: item.categories,
    ratingsCount: item.ratingsCount,
    publisher: item.publisher
  }));

  const hasMoreItems = searchState.totalItems > searchState.books.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={resetToHomepage}
                title="Back to Homepage"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={resetToHomepage}
                >
                  BookFinder
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Discover your next great read</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Reset button - show when user has searched or viewing wishlist */}
              {(searchState.hasSearched || showWishlist) && (
                <Button
                  variant="outline"
                  onClick={resetToHomepage}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                  title="Back to Homepage"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              )}
              
              <Button
                variant={showWishlist ? "default" : "outline"}
                onClick={toggleWishlistView}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  showWishlist 
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg' 
                    : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${showWishlist ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Wishlist</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!showWishlist && !searchState.hasSearched && (
          <div className="text-center mb-12">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover Your Next
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Great Read
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Search through millions of books and create your personal reading wishlist. 
                Find your next adventure, learn something new, or escape into fiction.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Millions of books</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Rated & reviewed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Trusted community</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        {!showWishlist && (
          <div className="mb-12">
            <SearchBar 
              onSearch={(query) => searchBooks(query, false)} 
              isLoading={searchState.isLoading}
              initialQuery={searchState.query}
              onClear={resetToHomepage}
            />
          </div>
        )}

        {/* Wishlist Header - FIXED */}
        {showWishlist && (
          <div className="mb-8">
            {/* Back button - Separated */}
            <div className="mb-6">
              <Button
                variant="outline" 
                onClick={() => setShowWishlist(false)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
            
            {/* Centered Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Wishlist
              </h2>
              <p className="text-gray-600">
                {wishlist.length} book{wishlist.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
          </div>
        )}

        {/* Featured Categories */}
        {!showWishlist && !searchState.hasSearched && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Popular Categories
              </h3>
              <p className="text-gray-600">Explore books by category</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Programming', icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
                { name: 'Fiction', icon: '📚', gradient: 'from-purple-500 to-pink-500' },
                { name: 'Science', icon: '🔬', gradient: 'from-green-500 to-emerald-500' },
                { name: 'History', icon: '🏛️', gradient: 'from-orange-500 to-red-500' },
                { name: 'Business', icon: '💼', gradient: 'from-gray-600 to-gray-800' },
                { name: 'Design', icon: '🎨', gradient: 'from-pink-500 to-rose-500' }
              ].map((category) => (
                <Card
                  key={category.name}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  onClick={() => searchBooks(category.name.toLowerCase(), false)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      {category.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error Message with Reset Option */}
        {searchState.error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Search Error</h3>
                    <p className="text-red-700">{searchState.error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={resetToHomepage}
                  className="flex items-center gap-2 hover:bg-red-100 border-red-300 text-red-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty Wishlist State */}
        {showWishlist && wishlist.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mb-8">
                <Heart className="w-16 h-16 text-red-400" />
              </div>
              <CardTitle className="mb-4 text-2xl">Your wishlist is empty</CardTitle>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Start searching for books and add them to your wishlist to save for later reading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowWishlist(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Start Searching Books
                </Button>
                <Button 
                  variant="outline"
                  onClick={resetToHomepage}
                  className="px-8 py-3 rounded-xl hover:bg-gray-50"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books Display - FIXED: No load more for wishlist */}
        <BookGrid
          books={showWishlist ? wishlistBooks : searchState.books}
          wishlistIds={wishlistIds}
          onWishlistToggle={handleWishlistToggle}
          isLoading={searchState.isLoading}
          searchQuery={showWishlist ? '' : searchState.query}
          totalItems={searchState.totalItems}
          onLoadMore={!showWishlist ? handleLoadMore : undefined}
          hasMoreItems={!showWishlist ? hasMoreItems : false}
          onResetToHome={resetToHomepage}
        />

        {/* Statistics */}
        {!showWishlist && searchState.books.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {searchState.books.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Books Found</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                      {wishlist.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">In Wishlist</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {searchState.totalItems > 1000 ? '1M+' : searchState.totalItems.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div 
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={resetToHomepage}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                onClick={resetToHomepage}
              >
                BookFinder
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Powered by Google Books API • Built with Next.js 14 & Tailwind CSS
            </p>
            <p className="text-sm text-gray-500">
              © 2024 BookFinder. Made with ❤️ for book lovers everywhere.
            </p>
            
            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}