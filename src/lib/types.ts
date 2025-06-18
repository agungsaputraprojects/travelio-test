export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  publishedDate?: string;
  categories?: string[];
  infoLink?: string;
  pageCount?: number;
  language?: string;
  publisher?: string;
  previewLink?: string;
}

export interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: Book;
  }>;
  totalItems: number;
}

export interface WishlistItem {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  rating?: number;
  addedAt: string;
}

export interface SearchState {
  query: string;
  books: Book[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  totalItems: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
