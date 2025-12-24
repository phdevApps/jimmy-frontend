import axios from 'axios';

const WC_BASE_URL = 'https://uae.jimmy.me/wp-json/wc/v3';
const WP_BASE_URL = 'https://uae.jimmy.me/wp-json/wp/v2';
const WC_CONSUMER_KEY = 'ck_200e907320090ef8cbf60657d798cb372c76a4d4';
const WC_CONSUMER_SECRET = 'cs_dd0e6b5b736d53f958961fcc3e56de14b2a0df65';

// JWT Token endpoint base URL (WooCommerce JWT Auth plugin)
const JWT_BASE_URL = 'https://uae.jimmy.me/wp-json/jwt-auth/v1';

// Create API instances with language support
const createApiInstance = (baseURL: string, auth?: any) => {
  const instance = axios.create({
    baseURL,
    ...(auth && { auth }),
  });

  // Add request interceptor to include language headers/params
  instance.interceptors.request.use((config) => {
    // Get current language from URL or context
    const currentLang = getCurrentLanguage();

    if (currentLang && currentLang !== 'en') {
      // Add language parameter for TranslatePress
      config.params = {
        ...config.params,
        _lang: currentLang
      };

      // Add Accept-Language header properly
      if (config.headers) {
        config.headers['Accept-Language'] = currentLang;
      }
    }

    return config;
  });

  return instance;
};

// Helper function to get current language from URL
const getCurrentLanguage = (): string => {
  const path = window.location.pathname;
  const supportedLanguages = ['en', 'ar', 'fr'];
  const langMatch = path.match(/^\/([a-z]{2})/);

  if (langMatch && supportedLanguages.includes(langMatch[1])) {
    return langMatch[1];
  }

  return 'en'; // default language
};

const wooCommerceApi = createApiInstance(WC_BASE_URL, {
  username: WC_CONSUMER_KEY,
  password: WC_CONSUMER_SECRET,
});

// WordPress API instance for posts and pages
const wordPressApi = createApiInstance(WP_BASE_URL);

// JWT API instance for authentication
const jwtApi = createApiInstance(JWT_BASE_URL);

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  password?: string;
  date_created?: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock';
  average_rating: string;
  rating_count: number;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  linked_variations?: string; // HTML content for variations
  yoast_head_json?: YoastSeoData;
  translations?: {
    [lang: string]: {
      name: string;
      description: string;
      short_description: string;
      slug: string;
      yoast_head_json?: YoastSeoData;
    };
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  image?: {
    id: number;
    src: string;
    alt: string;
  };
  count: number;
  display: string;
  menu_order: number;
  yoast_head_json?: YoastSeoData;
  translations?: {
    [lang: string]: {
      name: string;
      description: string;
      slug: string;
      yoast_head_json?: YoastSeoData;
    };
  };
}

export interface Order {
  id: number;
  status: string;
  currency: string;
  total: string;
  date_created: string;
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image?: {
      id: number;
      src: string;
      alt: string;
    };
  }>;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  date_added: string;
  product: Product;
}

export interface WooCommercePaymentGateway {
  id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  method_supports: string[];
  settings: Record<string, any>;
}

export interface WooCommerceCoupon {
  id: number;
  code: string;
  amount: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  description: string;
  date_expires: string | null;
  date_expires_gmt: string | null;
  usage_count: number;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit: number | null;
  usage_limit_per_user: number | null;
  limit_usage_to_x_items: number | null;
  free_shipping: boolean;
  product_categories: number[];
  excluded_product_categories: number[];
  exclude_sale_items: boolean;
  minimum_amount: string;
  maximum_amount: string;
  email_restrictions: string[];
  used_by: string[];
  meta_data: any[];
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: WooCommerceCoupon;
  discount?: number;
  error?: string;
}

export interface WooCommerceSettings {
  currency: string;
  currency_symbol: string;
  currency_position: 'left' | 'right' | 'left_space' | 'right_space';
  thousand_separator: string;
  decimal_separator: string;
  number_of_decimals: number;
}

export interface CreateOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_lines: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  coupon_lines?: Array<{
    code: string;
  }>;
}

// Store settings globally
let storeSettings: WooCommerceSettings | null = null;

// Custom currency symbol mapping
const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode.toUpperCase()) {
    case 'SAR': // Saudi Riyal
      return String.fromCodePoint(0xFFFFC);
    case 'AED': // UAE Dirham
      return String.fromCodePoint(0xFFFFD);
    case 'USD': // US Dollar
      return '$';
    default:
      return '$'; // Default to Dollar
  }
};

// Get store settings including currency from the correct WooCommerce endpoint
export const getStoreSettings = async (): Promise<WooCommerceSettings> => {
  try {
    if (storeSettings) {
      return storeSettings;
    }

    console.log('Fetching store settings from WooCommerce /settings/general endpoint');

    const response = await wooCommerceApi.get('/settings/general');
    console.log('Store settings response:', response.data);

    // Extract currency settings from the general settings response
    const settings = response.data;
    const currencySetting = settings.find((setting: any) => setting.id === 'woocommerce_currency');
    const currencyPositionSetting = settings.find((setting: any) => setting.id === 'woocommerce_currency_pos');
    const thousandSepSetting = settings.find((setting: any) => setting.id === 'woocommerce_price_thousand_sep');
    const decimalSepSetting = settings.find((setting: any) => setting.id === 'woocommerce_price_decimal_sep');
    const numDecimalsSetting = settings.find((setting: any) => setting.id === 'woocommerce_price_num_decimals');

    const currency = currencySetting?.value || 'AED';
    const currencyPosition = currencyPositionSetting?.value || 'left';

    const storeSettingsResponse: WooCommerceSettings = {
      currency: currency,
      currency_symbol: getCurrencySymbol(currency),
      currency_position: currencyPosition,
      thousand_separator: thousandSepSetting?.value || ',',
      decimal_separator: decimalSepSetting?.value || '.',
      number_of_decimals: parseInt(numDecimalsSetting?.value || '2')
    };

    storeSettings = storeSettingsResponse;
    console.log('Store settings loaded from API:', storeSettings);
    return storeSettings;
  } catch (error: any) {
    console.error('Error fetching store settings from API:', error);
    // Fallback to AED with custom symbol
    const fallbackSettings: WooCommerceSettings = {
      currency: 'AED',
      currency_symbol: getCurrencySymbol('AED'),
      currency_position: 'left',
      thousand_separator: ',',
      decimal_separator: '.',
      number_of_decimals: 2
    };
    storeSettings = fallbackSettings;
    console.log('Using fallback settings:', fallbackSettings);
    return fallbackSettings;
  }
};

// Format price with currency
export const formatPrice = async (price: string | number): Promise<string> => {
  const settings = await getStoreSettings();
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formattedNumber = numPrice.toFixed(settings.number_of_decimals);

  switch (settings.currency_position) {
    case 'left':
      return `${settings.currency_symbol}${formattedNumber}`;
    case 'right':
      return `${formattedNumber}${settings.currency_symbol}`;
    case 'left_space':
      return `${settings.currency_symbol} ${formattedNumber}`;
    case 'right_space':
      return `${formattedNumber} ${settings.currency_symbol}`;
    default:
      return `${settings.currency_symbol}${formattedNumber}`;
  }
};

// Customer functions
export const getCustomer = async (customerId: number): Promise<Customer> => {
  try {
    console.log('Fetching customer:', customerId);
    const response = await wooCommerceApi.get(`/customers/${customerId}`);
    console.log('Customer data received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
};

export const updateCustomer = async (customerId: number, customerData: Partial<Customer>): Promise<Customer> => {
  try {
    console.log('Updating customer:', customerId, customerData);
    const response = await wooCommerceApi.put(`/customers/${customerId}`, customerData);
    console.log('Customer updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};

export const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  try {
    console.log('Creating customer:', customerData);
    const response = await wooCommerceApi.post('/customers', customerData);
    console.log('Customer created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating customer:', error);
    throw new Error(error.response?.data?.message || 'Failed to create customer');
  }
};

// Authentication functions
export const authenticateCustomer = async (email: string, password: string): Promise<{ customer: Customer; token: string }> => {
  try {
    console.log('Authenticating customer with email:', email);

    // Use real JWT token endpoint
    const response = await jwtApi.post('/token', {
      username: email,
      password: password,
    });

    console.log('JWT authentication response:', response.data);

    if (!response.data.token) {
      throw new Error('No token received from authentication');
    }

    const token = response.data.token;
    const userEmail = response.data.user_email;
    const userDisplayName = response.data.user_display_name || '';

    // Try to fetch customer profile using the user email from JWT response
    let customer: Customer;
    try {
      customer = await getCustomerByEmail(userEmail, response.data);
      console.log('Existing customer found:', customer);
    } catch (error) {
      console.log('Customer not found in WooCommerce, creating new customer record');
      // If customer doesn't exist, create one
      const nameParts = userDisplayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      customer = await createCustomer({
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        username: response.data.user_nicename || userEmail,
      });
      console.log('New customer created:', customer);
    }

    console.log('Real authentication successful:', { customer, token });
    return { customer, token };
  } catch (error: any) {
    console.error('Error authenticating customer:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Authentication failed');
  }
};

// New function to get customer by email
export const getCustomerByEmail = async (email: string, res: any): Promise<Customer> => {
  // {
  //     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3VhZS5qaW1teS5tZSIsImlhdCI6MTc2MzEyNzQ2OCwibmJmIjoxNzYzMTI3NDY4LCJleHAiOjE3NjM3MzIyNjgsImRhdGEiOnsidXNlciI6eyJpZCI6IjIifX19.YZwe5gTrfFH7zvHwj9o6Y4lHauTFe098rHE8zWxgr_E",
  //     "user_email": "ahmed.fathy@amitintl.com",
  //     "user_nicename": "ahmed-abdelaziz",
  //     "user_display_name": "ahmed abdelaziz"
  // }

  // {
  //     "code": "[jwt_auth] invalid_email",
  //     "message": "Unknown email address. Check again or try your username.",
  //     "data": {
  //         "status": 403
  //     }
  // }

  // {
  //     "code": "[jwt_auth] incorrect_password",
  //     "message": "<strong>Error:<\/strong> The password you entered for the email address <strong>ahmed.fathy@amitintl.com<\/strong> is incorrect. <a href=\"https:\/\/uae.jimmy.me\/en\/my-account\/lost-password\/\">Lost your password?<\/a>",
  //     "data": {
  //         "status": 403
  //     }
  // }

  try {
    const {
      token,
      user_email,
      user_nicename,
      user_display_name,
    } = res

    if (token && user_email) {
      return { email: user_email } as any
    } else {
      console.log('Fetching customer by email:', email);

      const response = await wooCommerceApi.get('/customers', {
        params: {
          email: email,
          per_page: 1,
        },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Customer not found in WooCommerce');
      }

      const customer = response.data[0];
      console.log('Customer fetched by email:', customer);
      return customer;
    }


  } catch (error: any) {
    console.error('Error fetching customer by email:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
};

export const getUserProfile = async (token: string): Promise<Customer> => {
  try {
    console.log('Fetching user profile with JWT token');

    // Validate token first
    const isValid = await validateJWTToken(token);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }

    // Extract user email from the JWT payload by decoding it
    let userEmail = '';
    try {
      // Decode JWT token to get user info (payload is the middle part)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('JWT payload:', payload);

        // Try different paths where email might be stored
        userEmail = payload.data?.user?.user_email ||
          payload.user_email ||
          payload.email ||
          payload.sub || // sometimes email is in sub field
          '';
      }
    } catch (decodeError) {
      console.error('Error decoding JWT token:', decodeError);
    }

    if (!userEmail) {
      // If we can't decode the email, try to get it from token validation
      const validationResponse = await jwtApi.post('/token/validate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Token validation full response:', validationResponse.data);

      // The validation might return user info
      if (validationResponse.data.data && validationResponse.data.data.user) {
        userEmail = validationResponse.data.data.user.user_email || '';
      }
    }

    if (!userEmail) {
      throw new Error('No user email found in JWT token');
    }

    console.log('Extracted user email from JWT:', userEmail);

    // Fetch customer data using email
    const customer = await getCustomerByEmail(userEmail,{});
    console.log('Profile fetched successfully:', customer);
    return customer;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

// JWT token validation
export const validateJWTToken = async (token: string): Promise<boolean> => {
  try {
    console.log('Validating JWT token');

    const response = await jwtApi.post('/token/validate', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Token validation response:', response.data);
    return response.data.code === 'jwt_auth_valid_token';
  } catch (error: any) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Add Yoast SEO interface
export interface YoastSeoData {
  title?: string;
  description?: string;
  canonical?: string;
  opengraph_title?: string;
  opengraph_description?: string;
  opengraph_image?: string;
  opengraph_url?: string;
  opengraph_site_name?: string;
  opengraph_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: object | object[];
  breadcrumb?: object;
}

export interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: YoastSeoData;
  translations?: {
    [lang: string]: {
      title: { rendered: string };
      excerpt: { rendered: string };
      content: { rendered: string };
      slug: string;
      yoast_head_json?: YoastSeoData;
    };
  };
}

// Enhanced multilingual product functions
export const getProducts = async (params?: any, lang?: string): Promise<Product[]> => {
  try {
    console.log('Fetching products with params:', params, 'language:', lang);
    // const response = await wooCommerceApi.get('/products', { params });
    const response = await wooCommerceApi.get('/products', {
      params: {
        per_page: 100,
        status: 'publish'
      }
    });

    console.log('Products received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProductWithSeo = async (slug: string, lang?: string): Promise<Product> => {
  try {
    console.log('Fetching product with SEO data:', slug, 'language:', lang);
    const response = await wooCommerceApi.get(`/products`, { params: { slug } });
    console.log('Product with SEO received:', response.data);
    return response.data[0];
  } catch (error: any) {
    console.error('Error fetching product with SEO:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    console.log('Fetching featured products, limit:', limit);
    const response = await wooCommerceApi.get('/products', {
      params: {
        featured: true,
        per_page: limit,
        status: 'publish'
      }
    });
    console.log('Featured products received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching featured products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    console.log('Fetching products for category:', categoryId);
    const response = await wooCommerceApi.get('/products', {
      params: {
        category: categoryId,
        status: 'publish'
      }
    });
    console.log('Category products received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching category products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category products');
  }
};

// Enhanced category functions with Yoast data
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories');
    const response = await wooCommerceApi.get('/products/categories', {
      params: {
        per_page: 100,
        hide_empty: true
      }
    });
    console.log('Categories received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const getCategoryWithSeo = async (id: string): Promise<Category> => {
  try {
    console.log('Fetching category with SEO data:', id);
    const response = await wooCommerceApi.get(`/products/categories/${id}`);
    console.log('Category with SEO received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching category with SEO:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

// WordPress/Blog functions
export const getBlogPosts = async (limit: number = 10): Promise<BlogPost[]> => {
  try {
    console.log('Fetching blog posts, limit:', limit);
    const response = await wordPressApi.get('/posts', {
      params: {
        per_page: limit,
        status: 'publish'
      }
    });
    console.log('Blog posts received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch blog posts');
  }
};

export const getBlogPostWithSeo = async (id: string): Promise<BlogPost> => {
  try {
    console.log('Fetching blog post with SEO data:', id);
    const response = await wordPressApi.get(`/posts/${id}`);
    console.log('Blog post with SEO received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blog post with SEO:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch blog post');
  }
};

// Home page SEO data (can be fetched from a specific page or settings)
export const getHomePageSeo = async (): Promise<YoastSeoData | null> => {
  try {
    console.log('Fetching home page SEO data');
    // This would typically fetch from a specific page ID or site settings
    // For now, return null and use fallbacks
    return null;
  } catch (error: any) {
    console.error('Error fetching home page SEO:', error);
    return null;
  }
};

// Order functions
export const getCustomerOrders = async (customerId: number): Promise<Order[]> => {
  try {
    console.log('Fetching orders for customer:', customerId);
    const response = await wooCommerceApi.get('/orders', {
      params: {
        customer: customerId,
        per_page: 100
      }
    });
    console.log('Customer orders received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer orders');
  }
};

// LocalStorage-based wishlist functions
const WISHLIST_STORAGE_KEY = 'jimmy_wishlist';

interface StoredWishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  date_added: string;
}

// Helper function to get wishlist from localStorage
const getWishlistFromStorage = (userId: number): StoredWishlistItem[] | null => {
  try {
    if (Boolean(localStorage ?? false)) return null;
  } catch (error) {
    return null;
  }
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const allWishlists = JSON.parse(stored);
    return allWishlists[userId] || [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (userId: number, wishlist: StoredWishlistItem[]): void => {
  try {
    if (Boolean(localStorage ?? false)) return;
  } catch (error) {
    return;
  }
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const allWishlists = stored ? JSON.parse(stored) : {};
    allWishlists[userId] = wishlist;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(allWishlists));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

// Wishlist functions with localStorage implementation
export const getWishlistItems = async (userId: number): Promise<WishlistItem[]> => {
  try {
    console.log('Fetching wishlist items for user:', userId);

    const storedItems = getWishlistFromStorage(userId) || [];
    console.log('Stored wishlist items:', storedItems);

    if ((storedItems??[]).length === 0) {
      return [];
    }

    // Fetch product details for each wishlist item
    const products = await getProducts();
    const wishlistItems: WishlistItem[] = [];

    for (const item of storedItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        wishlistItems.push({
          id: item.id,
          product_id: item.product_id,
          user_id: item.user_id,
          date_added: item.date_added,
          product: product
        });
      }
    }

    console.log('Wishlist items with products:', wishlistItems);
    return wishlistItems;
  } catch (error: any) {
    console.error('Error fetching wishlist items:', error);
    throw new Error('Failed to fetch wishlist items');
  }
};

export const addToWishlist = async (userId: number, productId: number): Promise<void> => {
  try {
    console.log('Adding to wishlist:', { userId, productId });

    const wishlist = getWishlistFromStorage(userId) || [];

    // Check if item already exists
    const existingItem = wishlist.find(item => item.product_id === productId);
    if (existingItem) {
      console.log('Item already in wishlist');
      return;
    }

    // Add new item
    const newItem: StoredWishlistItem = {
      id: Date.now(), // Use timestamp as ID
      product_id: productId,
      user_id: userId,
      date_added: new Date().toISOString()
    };

    wishlist.push(newItem);
    saveWishlistToStorage(userId, wishlist);

    console.log('Item added to wishlist successfully');
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    throw new Error('Failed to add to wishlist');
  }
};

export const removeFromWishlist = async (userId: number, productId: number): Promise<void> => {
  try {
    console.log('Removing from wishlist:', { userId, productId });

    const wishlist = getWishlistFromStorage(userId) || [];
    const updatedWishlist = wishlist.filter(item => item.product_id !== productId);

    saveWishlistToStorage(userId, updatedWishlist);

    console.log('Item removed from wishlist successfully');
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    throw new Error('Failed to remove from wishlist');
  }
};

export const isInWishlist = async (userId: number, productId: number): Promise<boolean> => {
  try {
    console.log('Checking if in wishlist:', { userId, productId });

    const wishlist = getWishlistFromStorage(userId) || [];
    const found = wishlist.some(item => item.product_id === productId);

    console.log('Item in wishlist:', found);
    return found;
  } catch (error: any) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Payment Gateway functions
export const getPaymentGateways = async (): Promise<WooCommercePaymentGateway[]> => {
  try {
    console.log('Fetching payment gateways from WooCommerce');
    const response = await wooCommerceApi.get('/payment_gateways');
    console.log('Payment gateways received:', response.data);

    // Filter only enabled gateways
    const enabledGateways = response.data.filter((gateway: WooCommercePaymentGateway) => gateway.enabled);
    console.log('Enabled payment gateways:', enabledGateways);

    return enabledGateways;
  } catch (error: any) {
    console.error('Error fetching payment gateways:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch payment gateways');
  }
};

// Coupon functions
export const getCouponByCode = async (code: string): Promise<WooCommerceCoupon> => {
  try {
    console.log('Fetching coupon by code:', code);

    // Special handling for atpark100 coupon
    if (code.toLowerCase() === 'atpark100') {
      const mockCoupon: WooCommerceCoupon = {
        id: 1,
        code: 'atpark100',
        amount: '100',
        date_created: new Date().toISOString(),
        date_created_gmt: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        date_modified_gmt: new Date().toISOString(),
        discount_type: 'fixed_cart',
        description: '100 AED discount for BX6 Lite Bed Vacuum Cleaner',
        date_expires: null,
        date_expires_gmt: null,
        usage_count: 0,
        individual_use: false,
        product_ids: [],
        excluded_product_ids: [],
        usage_limit: null,
        usage_limit_per_user: null,
        limit_usage_to_x_items: null,
        free_shipping: false,
        product_categories: [],
        excluded_product_categories: [],
        exclude_sale_items: false,
        minimum_amount: '0',
        maximum_amount: '',  // Remove maximum amount restriction
        email_restrictions: [],
        used_by: [],
        meta_data: []
      };

      console.log('Mock coupon found:', mockCoupon);
      return mockCoupon;
    }

    // Try to fetch from real API for other coupons
    const response = await wooCommerceApi.get(`/coupons`, {
      params: {
        code: code,
        per_page: 1
      }
    });

    if (response.data && response.data.length > 0) {
      console.log('Coupon found:', response.data[0]);
      return response.data[0];
    } else {
      throw new Error('Coupon not found');
    }
  } catch (error: any) {
    console.error('Error fetching coupon:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch coupon');
  }
};

export const validateCoupon = async (code: string): Promise<CouponValidationResult> => {
  try {
    console.log('Validating coupon code:', code);

    const coupon = await getCouponByCode(code);

    // Check if coupon is expired
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return {
        valid: false,
        error: 'Coupon has expired'
      };
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return {
        valid: false,
        error: 'Coupon usage limit reached'
      };
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = parseFloat(coupon.amount);
    } else if (coupon.discount_type === 'fixed_cart') {
      discount = parseFloat(coupon.amount);
    }

    console.log('Coupon validation successful:', { valid: true, coupon, discount });
    return {
      valid: true,
      coupon,
      discount
    };
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      error: error.message || 'Invalid coupon code'
    };
  }
};

// Order creation function
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    console.log('Creating order:', orderData);
    const response = await wooCommerceApi.post('/orders', orderData);
    console.log('Order created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};
