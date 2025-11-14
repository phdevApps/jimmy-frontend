
import React, { useState, useEffect } from 'react';
import { getFeaturedProducts, Product } from '../../services/wooCommerceApi';
import { useCurrency } from '../../hooks/useCurrency';

const DetailedFeaturedSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { formatCurrencySync } = useCurrency();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts(2);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Discover our latest innovations</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="relative bg-gray-50 rounded-2xl overflow-hidden group">
              {/* New Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New
                </span>
              </div>
              
              {/* Product Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.images?.[0]?.src || '/api/placeholder/600/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Product Details */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
                
                {/* Product Specs */}
                <div className="mb-6">
                  <div 
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                </div>
                
                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrencySync(product.price)}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedFeaturedSection;
