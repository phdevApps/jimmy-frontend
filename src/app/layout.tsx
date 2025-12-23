"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';

import TopHeader from '@/components/layout/TopHeader';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/cart/CartModal';
import LoginModal from '@/components/auth/LoginModal';
import { Toaster } from '@/components/ui/sonner';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <CurrencyProvider>
                <LanguageProvider>
                  <div className="App w-full min-h-screen">
                    <TopHeader />
                    <MainHeader />
                    <main className="w-full flex-1">
                      {children}
                    </main>
                    <Footer />
                    <CartModal />
                    <LoginModal />
                    <Toaster />
                  </div>
                </LanguageProvider>
              </CurrencyProvider>
            </Provider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
