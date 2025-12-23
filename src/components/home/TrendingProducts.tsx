
"use client";
import React, { useState, useEffect } from 'react';
import { getProducts, Product } from '@/services/wooCommerceApi';
import ProductCard from '@/components/product/ProductCard';

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);

  const filterOptions = [
    { key: 'trending', label: 'Trending' },
    { key: 'bestselling', label: 'Best Selling' },
    { key: 'new', label: 'New Arrivals' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let params: any = { per_page: 8 };
        
        switch (activeFilter) {
          case 'bestselling':
            params.orderby = 'popularity';
            break;
          case 'new':
            params.orderby = 'date';
            break;
          default:
            params.featured = true;
        }
        
        const data = await getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilter]);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
          <div className="flex space-x-4">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-80">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;
