import { NextRequest, NextResponse } from 'next/server';
import { GoogleBooksResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const startIndex = parseInt(searchParams.get('startIndex') || '0');
  const maxResults = parseInt(searchParams.get('maxResults') || '40');

  if (!query) {
    return NextResponse.json({ 
      success: false,
      error: 'Query parameter is required' 
    }, { status: 400 });
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=${startIndex}&maxResults=${maxResults}&printType=books&orderBy=relevance`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BookSearchApp/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Google Books API error:', response.status, response.statusText);
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data: GoogleBooksResponse = await response.json();
    
    // Transform and filter the data
    const books = data.items?.map(item => ({
      ...item.volumeInfo,
      id: item.id
    })).filter(book => {
      // Filter out books without essential data
      return book.title && book.title.trim() !== '';
    }) || [];

    return NextResponse.json({ 
      success: true,
      data: {
        books, 
        totalItems: data.totalItems || 0,
        query: query,
        startIndex,
        maxResults,
        hasMore: books.length === maxResults && data.totalItems > (startIndex + maxResults)
      }
    });
    
  } catch (error) {
    console.error('Error fetching books:', error);
    
    // Return more specific error messages
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json({
        success: false,
        error: 'Unable to connect to Google Books API. Please check your internet connection.'
      }, { status: 503 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch books. Please try again later.'
    }, { status: 500 });
  }
}