import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/src/store/StoreProvider'; // 1. Import the Provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mastery Tiers',
  description: 'Track your skill progression',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap the children */}
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
