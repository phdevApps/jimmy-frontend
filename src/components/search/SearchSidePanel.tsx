
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { getProducts, getCategories, Product, Category } from '../../services/wooCommerceApi';
import { useNavigate } from 'react-router-dom';
import { Price } from '../ui/price';

interface SearchSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchSidePanel: React.FC<SearchSidePanelProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Bed Vacuum Cleaner',
    'Stick Vacuum',
    'Hair Dryer',
    'Water Purifier',
    'Wet Dry Vacuum'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const searchProducts = async () => {
        setIsLoading(true);
        try {
          const products = await getProducts();
          const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.categories?.some(cat => 
              cat.name.toLowerCase().includes(query.toLowerCase())
            )
          ).slice(0, 8);
          setResults(filtered);
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const debounceTimer = setTimeout(searchProducts, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.slug}`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(query);
                  }
                }}
                className="flex-1 text-base outline-none placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </SheetHeader>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto">
            {query.length === 0 ? (
              <div className="p-4 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <span className="text-gray-700">{search}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending Searches
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(`/category/${category.slug}`);
                          onClose();
                        }}
                        className="block w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 mb-3">
                      {results.length} products found
                    </div>
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].src}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <Price amount={product.price} size="sm" />
                            {product.stock_status === 'instock' && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    >
                      View all results for "{query}"
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products found for "{query}"</p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Search anyway
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
