import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, ChevronDown, ChevronRight, Heart, Search } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleCart } from '../../features/cart/cartSlice';
import { logout } from '../../features/auth/authSlice';
import { getCategories, getProducts, Category, Product } from '../../services/wooCommerceApi';
import { useWishlist } from '../../hooks/useWishlist';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CurrencySymbol } from '../ui/currency-symbol';
import { CurrencyDropdown } from '../ui/currency-dropdown';
import LanguageSwitcher from '../language/LanguageSwitcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SearchSidePanel } from '../search/SearchSidePanel';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useTypedSelector(state => state.cart);
  const { isAuthenticated, user } = useTypedSelector(state => state.auth);
  const { wishlistItems } = useWishlist();
  const { currency } = useCurrency();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories(categoriesData);
        setFeaturedProducts(productsData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    console.log('Header: Logging out');
    dispatch(logout());
    navigate('/');
  };

  // Product images for mega menu (matching uae.jimmy.me)
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
        {/* Top Bar */}
        <div className="bg-black text-white text-sm py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <span>Free shipping on orders over €39.99</span>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <CurrencyDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="https://jimmy.eu/cdn/shop/files/Jimmy-Logo-512.png?v=1685779383" 
                  alt="uae.jimmy.me" 
                  className="h-12 w-auto"
                  width="512" 
                  height="178"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              
              {/* Bestsellers Mega Menu - Updated to redirect to shop */}
              <div 
                className="relative group"
                onMouseEnter={() => handleMenuEnter('bestsellers')}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/shop" className="text-gray-900 hover:text-blue-600 font-medium flex items-center transition-colors">
                  All Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                {activeMenu === 'bestsellers' && (
                  <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-2xl rounded-lg border border-gray-200 z-[9999] transform -translate-x-1/4">
                    <div className="p-8">
                      <div className="grid grid-cols-12 gap-8">
                        {/* Categories Section */}
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
                            <li>
                              <Link to="/pages/product-comparison" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/item">
                                <span>Product Comparison</span>
                                <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Product Images Section */}
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
                        <li>
                          <Link to="/pages/product-care" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Product Care
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/warranty-guide" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Warranty Guide
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/trouble-shooting" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Troubleshooting
                          </Link>
                        </li>
                        <li>
                          <Link to="/pages/instruction-manual" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">
                            Instruction Manual
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
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon Button */}
              <button 
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-6 w-6" />
              </button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                      <User className="h-6 w-6" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/addresses')}>
                      Addresses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/payment-methods')}>
                      Payment Methods
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/security')}>
                      Security
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={handleUserIconClick}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
              )}
              
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              <div className="relative mb-4">
                <button 
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-left"
                >
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-500 flex-1">Search for anything</span>
                </button>
              </div>
              
              <Link to="/" className="block py-2 text-gray-900 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/shop" className="block py-2 text-gray-900 hover:text-blue-600 font-medium">All Products</Link>
              <Link to="/collections/parts-accessories" className="block py-2 text-gray-900 hover:text-blue-600 font-medium">Parts & Accessories</Link>
              <Link to="/support" className="block py-2 text-gray-900 hover:text-blue-600 font-medium">Support</Link>
              <Link to="/blogs/news" className="block py-2 text-gray-900 hover:text-blue-600 font-medium">Blog</Link>
              
              {/* Social Links */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/JIMMY-EU-107782334790209" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600">
                    Facebook
                  </a>
                  <a href="https://x.com/JimmyTech_EU" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600">
                    Twitter
                  </a>
                  <a href="https://www.instagram.com/jimmy_eu/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600">
                    Instagram
                  </a>
                  <a href="https://www.youtube.com/@JIMMY_EU" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600">
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Side Panel */}
      <SearchSidePanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
