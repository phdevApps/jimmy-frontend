
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleCart } from '../../features/cart/cartSlice';
import { useWishlist } from '../../hooks/useWishlist';
import { SearchSidePanel } from '../search/SearchSidePanel';
import { Button } from '../ui/button';

const MainHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { items } = useTypedSelector(state => state.cart);
  const { isAuthenticated } = useTypedSelector(state => state.auth);
  const { wishlistItems } = useWishlist();
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMenuEnter = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/wishlist');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Product images for mega menu
  const megaMenuProducts = [
    {
      name: 'Bed Vacuum Cleaner',
      image: 'https://jimmy.eu/cdn/shop/files/Jimmy_Bed_Vacuum_Cleaner-250115-1.png?v=1736926396&width=670',
      url: '/collections/anti-mite-vacuums'
    },
    {
      name: 'Stick Vacuum Cleaner', 
      image: 'https://jimmy.eu/cdn/shop/files/Jimmy_Cordless_Stick_Vacuum_Cleaner-250115-1.png?v=1736926721&width=670',
      url: '/collections/cordless-vacuums'
    },
    {
      name: 'Wet Dry Vacuum Cleaner',
      image: 'https://jimmy.eu/cdn/shop/files/Jimmy_Wet_Dry_Vacuum_Cleaner-250115-1.png?v=1736923337&width=670',
      url: '/collections/wet-dry-vacuums'
    },
    {
      name: 'Hair Multi-Styler',
      image: 'https://jimmy.eu/cdn/shop/files/Jimmy_Hair_Dryer_-250115-1.png?v=1736927068&width=670',
      url: '/products/hf9-hair-multi-styler'
    }
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="https://jimmy.eu/cdn/shop/files/Jimmy-Logo-512.png?v=1685779383" 
                  alt="Jimmy" 
                  className="h-10 w-auto"
                  width="512" 
                  height="178"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleWishlistClick}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              >
                <Heart className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="border-t border-gray-100">
            <div className="flex items-center space-x-8 py-3">
              <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              
              {/* All Products Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMenuEnter('products')}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/shop" className="text-gray-900 hover:text-blue-600 font-medium flex items-center transition-colors">
                  All Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                
                {activeMenu === 'products' && (
                  <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-2xl rounded-lg border border-gray-200 z-[9999] transform -translate-x-1/4">
                    <div className="p-8">
                      <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4">
                          <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                            Shop by Category
                          </h3>
                          <ul className="space-y-3">
                            <li>
                              <Link to="/collections/anti-mite-vacuums" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Bed Vacuum Cleaner</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/collections/cordless-vacuums" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Stick Vacuum Cleaner</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/collections/wet-dry-vacuums" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Wet Dry Vacuum Cleaner</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/collections/countertop-water-purifier" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Countertop Water Purifier</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/collections/hair-dryer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Hair Multi-Styler</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="col-span-8">
                          <div className="grid grid-cols-4 gap-4">
                            {megaMenuProducts.map((product, index) => (
                              <div key={index} className="group">
                                <Link to={product.url} className="block">
                                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <h6 className="text-sm font-medium text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                  </h6>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/collections/parts-accessories" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                Parts & Accessories
              </Link>

              {/* Support Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMenuEnter('support')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="text-gray-900 hover:text-blue-600 font-medium flex items-center transition-colors">
                  Support
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {activeMenu === 'support' && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-[9999]">
                    <div className="p-4">
                      <ul className="space-y-2">
                        <li>
                          <Link to="/pages/product-comparison" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Product Comparison
                          </Link>
                        </li>
                        <li>
                          <Link to="/apps/track123" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Order Tracking
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/contact" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Contact
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/avada-faqs" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            FAQs
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/blogs/news" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                Blog
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <SearchSidePanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default MainHeader;
