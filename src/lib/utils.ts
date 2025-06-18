import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Book, WishlistItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAuthors(authors?: string[]): string {
  if (!authors || authors.length === 0) return "Unknown Author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  return `${authors[0]} & ${authors.length - 1} others`;
}

export function getBookThumbnail(imageLinks?: { thumbnail?: string; smallThumbnail?: string }): string {
  if (imageLinks?.thumbnail) {
    return imageLinks.thumbnail.replace('http://', 'https://');
  }
  if (imageLinks?.smallThumbnail) {
    return imageLinks.smallThumbnail.replace('http://', 'https://');
  }
  return "https://via.placeholder.com/150x200/f3f4f6/6b7280?text=No+Cover";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Unknown";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch {
    return dateString.split('-')[0] || "Unknown";
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export const wishlistStorage = {
  getWishlist: (): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const wishlist = localStorage.getItem('bookfinder_wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      return [];
    }
  },

  addToWishlist: (book: Book): void => {
    if (typeof window === 'undefined') return;
    try {
      const wishlist = wishlistStorage.getWishlist();
      const newItem: WishlistItem = {
        id: book.id,
        title: book.title,
        authors: book.authors,
        thumbnail: getBookThumbnail(book.imageLinks),
        rating: book.averageRating,
        addedAt: new Date().toISOString(),
      };
      
      const updatedWishlist = [newItem, ...wishlist.filter(item => item.id !== book.id)];
      localStorage.setItem('bookfinder_wishlist', JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  },

  removeFromWishlist: (bookId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const wishlist = wishlistStorage.getWishlist();
      const updatedWishlist = wishlist.filter(item => item.id !== bookId);
      localStorage.setItem('bookfinder_wishlist', JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  },

  isInWishlist: (bookId: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const wishlist = wishlistStorage.getWishlist();
      return wishlist.some(item => item.id === bookId);
    } catch {
      return false;
    }
  },

  getWishlistIds: (): Set<string> => {
    const wishlist = wishlistStorage.getWishlist();
    return new Set(wishlist.map(item => item.id));
  },

  getWishlistIdsArray: (): string[] => {
    const wishlist = wishlistStorage.getWishlist();
    return wishlist.map(item => item.id);
  }
};

export function generatePlaceholderImage(title: string, width = 150, height = 200): string {
  const encodedTitle = encodeURIComponent(title.substring(0, 20));
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedTitle}`;
}