
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/layout/Header';
import TopHeader from './components/layout/TopHeader';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/Footer';
import CartModal from './components/cart/CartModal';
import LoginModal from './components/auth/LoginModal';
import { Toaster } from './components/ui/sonner';

// Pages
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Support from './pages/Support';
import Bestsellers from './pages/Bestsellers';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import PaymentMethods from './pages/PaymentMethods';
import Security from './pages/Security';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ProductComparison from './pages/ProductComparison';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ProductCare from './pages/ProductCare';
import WarrantyGuide from './pages/WarrantyGuide';
import Troubleshooting from './pages/Troubleshooting';
import InstructionManual from './pages/InstructionManual';
import OrderTracking from './pages/OrderTracking';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CurrencyProvider>
            <LanguageProvider>
              <Router>
                <div className="App w-full min-h-screen">
                  <TopHeader />
                  <MainHeader />
                  <main className="w-full flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:slug" element={<ProductDetail />} />
                      <Route path="/category/:slug" element={<CategoryProducts />} />
                      <Route path="/collections/:slug" element={<CategoryProducts />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/bestsellers" element={<Bestsellers />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/addresses" element={<Addresses />} />
                      <Route path="/payment-methods" element={<PaymentMethods />} />
                      <Route path="/security" element={<Security />} />
                      <Route path="/blogs/news" element={<Blog />} />
                      <Route path="/blogs/news/:slug" element={<BlogPost />} />
                      <Route path="/pages/product-comparison" element={<ProductComparison />} />
                      <Route path="/pages/contact" element={<Contact />} />
                      <Route path="/pages/avada-faqs" element={<FAQ />} />
                      <Route path="/pages/product-care" element={<ProductCare />} />
                      <Route path="/pages/warranty-guide" element={<WarrantyGuide />} />
                      <Route path="/pages/trouble-shooting" element={<Troubleshooting />} />
                      <Route path="/pages/instruction-manual" element={<InstructionManual />} />
                      <Route path="/apps/track123" element={<OrderTracking />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <CartModal />
                  <LoginModal />
                  <Toaster />
                </div>
              </Router>
            </LanguageProvider>
          </CurrencyProvider>
        </Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
