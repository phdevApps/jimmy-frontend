"use client";
import React, { useState, useEffect } from 'react';
import { getFeaturedProducts, Product } from '@/services/wooCommerceApi';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/features/cart/cartSlice';
import { Star, ShoppingBag, TrendingUp, Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

const Bestsellers = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedProducts(16);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.src || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    }));
  };

  const handleWishlistToggle = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleProductClick = (productSlug: string) => {
    navigate.push(`/products/${productSlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Bestsellers</h1>
          </div>
          <p className="text-xl text-center text-green-100">Our most popular and highly-rated products</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Award-Winning Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
              >
                {/* Bestseller Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  #{index + 1} Bestseller
                </div>

                <div 
                  className="relative overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img
                    src={product.images[0]?.src || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.on_sale && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      SALE
                    </div>
                  )}
                  
                  {/* Wishlist and Cart buttons */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    {isAuthenticated && (
                      <button
                        onClick={(e) => handleWishlistToggle(product.id, e)}
                        className={`p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                          isInWishlist(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock_status === 'outofstock'}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" 
                    style={{ minHeight: '3rem' }}
                    onClick={() => handleProductClick(product.slug)}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(product.average_rating))
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.rating_count})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        €{product.price}
                      </span>
                      {product.on_sale && product.regular_price && (
                        <span className="text-sm text-gray-500 line-through">
                          €{product.regular_price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-2 text-center">
                    <span className={`text-xs ${
                      product.stock_status === 'instock' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bestsellers;
