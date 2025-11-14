
import React, { useState, useEffect } from 'react';
import { getCategories, Category } from '../../services/wooCommerceApi';
import { ArrowRight } from 'lucide-react';

const PromotionSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Filter for main product categories
        const mainCategories = data
          
        //   .filter(cat => 
        //   cat.name.includes('Vacuum') || 
        //   cat.name.includes('Hair') || 
        //   cat.name.includes('Water')
        // ).slice(0, 4);
        setCategories(mainCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.filter(category=>(category?.image?.src || category?.image?.alt)).map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 bg-white rounded-lg shadow-sm border p-6 min-w-[320px] hover:shadow-md transition-shadow cursor-pointer"
            >
              {category?.image?.src && (
                <div className="mb-4">
                  <img
                    src={category?.image?.src}
                    alt={category?.image?.alt || category.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.count} products available
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionSection;
