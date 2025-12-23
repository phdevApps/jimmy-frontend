"use client";
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, Loader2, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'react-router-dom';
import { addToCart } from '@/features/cart/cartSlice';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getWishlistItems, removeFromWishlist, WishlistItem } from '@/services/wooCommerceApi';
import { toast } from '@/components/ui/sonner';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  
  
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => user?.id ? getWishlistItems(user.id) : Promise.resolve([]),
    enabled: !!user?.id && !!isAuthenticated,
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: number; productId: number }) =>
      removeFromWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast.success("Item has been removed from your wishlist");
    },
    onError: () => {
      toast.error("Failed to remove item from wishlist");
    },
  });

  const handleProductClick = (productSlug: string) => {
    navigate.push(`/products/${productSlug}`);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your wishlist.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleRemoveFromWishlist = (productId: number) => {
    if (user?.id) {
      removeFromWishlistMutation.mutate({ userId: user.id, productId });
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(addToCart({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0]?.src || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
    }));
    toast.success(`${item.product.name} has been added to your cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-8 w-8" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Saved Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading your wishlist...</span>
                  </div>
                ) : wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div 
                          className="relative overflow-hidden bg-gray-50 cursor-pointer"
                          onClick={() => handleProductClick(item.product.slug)}
                        >
                          <img
                            src={item.product.images[0]?.src || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'}
                            alt={item.product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.product.on_sale && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              SALE
                            </div>
                          )}
                        </div>

                        <div className="p-4 pb-2">
                          <h3 
                            className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" 
                            style={{ minHeight: '3rem' }}
                            onClick={() => handleProductClick(item.product.slug)}
                          >
                            {item.product.name}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(parseFloat(item.product.average_rating || '0'))
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              ({item.product.rating_count || 0})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                €{item.product.price}
                              </span>
                              {item.product.on_sale && item.product.regular_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  €{item.product.regular_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Buttons at bottom */}
                        <div className="px-4 pb-4">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              disabled={item.product.stock_status === 'outofstock'}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                              style={{ width: '80%' }}
                            >
                              <ShoppingCart className="h-4 w-4 inline mr-2" />
                              Add to Cart
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromWishlist(item.product.id);
                              }}
                              disabled={removeFromWishlistMutation.isPending}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors duration-200"
                              style={{ width: '20%' }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
