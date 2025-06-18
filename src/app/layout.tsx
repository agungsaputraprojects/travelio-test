import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookFinder - Discover Your Next Great Read',
  description: 'Search and discover books with Google Books API. Create your personal wishlist and explore millions of books.',
  keywords: ['books', 'search', 'reading', 'library', 'wishlist', 'google books'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}