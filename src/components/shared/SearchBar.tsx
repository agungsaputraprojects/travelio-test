'use client';

import React, { useState, useRef } from 'react';
import { Search, Loader2, X, Clock, TrendingUp, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
  className?: string;
  onClear?: () => void;
}

const TRENDING_SEARCHES = [
  'JavaScript programming',
  'React development',
  'Data science',
  'Machine learning',
  'Web design',
  'Python basics'
];

const RECENT_SEARCHES_KEY = 'bookfinder_recent_searches';

export function SearchBar({ 
  onSearch, 
  isLoading = false, 
  initialQuery = '',
  className,
  onClear 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, []);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const saveToRecentSearches = (searchQuery: string) => {
    if (typeof window === 'undefined' || !searchQuery.trim()) return;
    
    const trimmedQuery = searchQuery.trim();
    const updatedRecents = [
      trimmedQuery,
      ...recentSearches.filter(item => item !== trimmedQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecents);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedRecents));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      const searchQuery = query.trim();
      saveToRecentSearches(searchQuery);
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveToRecentSearches(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setQuery('');
    setShowSuggestions(false);
    if (onClear) {
      onClear();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto relative", className)}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="text-muted-foreground w-5 h-5" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for books by title, author, or keyword..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={cn(
              "w-full h-14 pl-12 pr-32 rounded-xl border border-gray-200",
              "text-base placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "bg-white shadow-lg transition-all duration-200",
              "hover:shadow-xl focus:shadow-xl",
              isLoading && "cursor-wait"
            )}
            disabled={isLoading}
            autoComplete="off"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {/* NEW: Home/Reset button - show when there's a query or we're in search state */}
            {(query || initialQuery) && onClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0 hover:bg-blue-100 rounded-full"
                title="Back to Homepage"
              >
                <Home className="w-4 h-4 text-blue-600" />
              </Button>
            )}
            
            {query && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearQuery}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className={cn(
                "h-10 px-6 rounded-lg font-medium",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "hover:from-blue-700 hover:to-purple-700",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-md hover:shadow-lg transition-all duration-200"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((recent, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(recent)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-gray-700">Trending</span>
            </div>
            <div className="space-y-1">
              {TRENDING_SEARCHES.map((trending, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(trending)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors text-muted-foreground hover:text-gray-700"
                >
                  {trending}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Search Tips */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Try searching for specific topics like &quot;web development&quot;, author names, or book titles
        </p>
      </div>
    </div>
  );
}