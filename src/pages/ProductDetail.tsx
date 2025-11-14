import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingBag, Heart, ArrowLeft, Shield, Truck, RotateCcw, Award, ChevronRight, Plus, Minus, Check, X } from 'lucide-react';
import { getFeaturedProducts, getProductWithSeo, Product } from '../services/wooCommerceApi';
import { addToCart } from '../features/cart/cartSlice';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { Seo } from '../components/seo/Seo';
import { useYoastSeo } from '../hooks/useYoastSeo';
import { Price } from '../components/ui/price';

import '../assets/flickity/flickity.css';
// import '../assets/custom_css.css';
import '../assets/image-with-text-slideshow.css';
import '../assets/scrolling-images.css';
import '../assets/otherFixes.css';
import '../assets/app.css';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  useEffect(() => {
    // document.addEventListener('DOMContentLoaded',()=>{
    if (document.querySelector('iframe')) {
      document.querySelector('iframe').src = document.querySelector('iframe')?.getAttribute('data-src')
    }
  }, [product])

  useEffect(() => {

    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const products = await getFeaturedProducts(100);
        // const foundProduct = products.find(p => p.slug === slug);

        const foundProduct = await getProductWithSeo(slug);

        if (foundProduct) {
          setProduct(foundProduct);
          // Mock reviews data
          setReviews([
            {
              id: 1,
              author: "Sarah M.",
              rating: 5,
              comment: "Amazing vacuum! The suction power is incredible and the battery lasts longer than expected.",
              date: "2024-01-10",
              verified: true
            },
            {
              id: 2,
              author: "John D.",
              rating: 4,
              comment: "Great product overall. Easy to use and very effective on both carpets and hard floors.",
              date: "2024-01-05",
              verified: true
            }
          ]);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error loading product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const seoData = useYoastSeo({
    yoastData: product?.yoast_head_json,
    fallbackTitle: product?.name || 'Product',
    fallbackDescription: product?.short_description?.replace(/<[^>]*>/g, '') || product?.description?.replace(/<[^>]*>/g, '')?.substring(0, 160) || '',
    fallbackCanonical: window.location.href
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src || '/api/placeholder/300/300'
      }));
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product.id);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please sign in to submit a review');
      return;
    }

    const review: Review = {
      id: reviews.length + 1,
      author: `${user.first_name} ${user.last_name}`,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages = product.images.length > 0 ? product.images : [{ src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop' }];

  const productFeatures = [
    'Advanced HEPA Filtration System',
    'Cordless Design with 45-min Runtime',
    'LED Display with Smart Controls',
    'Self-Cleaning Brush Technology',
    '5-in-1 Cleaning Versatility',
    'Professional-Grade Suction Power'
  ];

  const specifications = [
    { label: 'Battery Life', value: '45 minutes' },
    { label: 'Charge Time', value: '4 hours' },
    { label: 'Dust Capacity', value: '0.6L' },
    { label: 'Weight', value: '3.2kg' },
    { label: 'Noise Level', value: '≤78dB' },
    { label: 'Warranty', value: '2 years' }
  ];

  const inTheBoxItems = [
    'PW11 Pro Max Main Unit',
    'Floor Brush Head',
    'Crevice Tool',
    'Upholstery Brush',
    'Wall Mount Bracket',
    'Charging Adapter',
    'User Manual',
    'Quick Start Guide'
  ];

  const compatibleDevices = [
    'All Floor Types (Hardwood, Carpet, Tile)',
    'Stairs and Steps',
    'Car Interiors',
    'Furniture and Upholstery',
    'Pet Hair and Allergens',
    'Wet and Dry Surfaces'
  ];

  const accessories = [
    { name: 'Extra Battery Pack', price: '99.99', image: '/api/placeholder/100/100' },
    { name: 'Pet Hair Brush', price: '29.99', image: '/api/placeholder/100/100' },
    { name: 'Replacement HEPA Filter', price: '19.99', image: '/api/placeholder/100/100' },
    { name: 'Extension Wand', price: '39.99', image: '/api/placeholder/100/100' }
  ];

  return (
    <>
      <Seo {...seoData} />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100">
                <img
                  src={productImages[selectedImageIndex]?.src}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{product.name}</h1>

                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(parseFloat(product.average_rating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.average_rating} ({reviews.length} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>SKU: PW11-PRO-MAX</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    <span className={`font-medium ${product.stock_status === 'instock' ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-baseline gap-3 mb-2">
                  <Price amount={product.price} size="lg" className="text-gray-900 font-bold text-4xl" />
                  {product.on_sale && product.regular_price && (
                    <>
                      <Price
                        amount={product.regular_price}
                        size="md"
                        className="text-gray-500 line-through text-2xl"
                      />
                      <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
                        {Math.round(((parseFloat(product.regular_price) - parseFloat(product.price)) / parseFloat(product.regular_price)) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Price inclusive of VAT</p>
                <p className="text-sm text-green-600 font-medium">Free shipping on orders over AED 200</p>
              </div>

              {/* Product Variations */}
              {product.linked_variations && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variations</h3>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.linked_variations['html'].replace(/(http|https)\:\/\/uae\.jimmy\.me\/(en|ar)\/product/ig, '/products') }}
                  />
                </div>
              )}

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_status === 'outofstock'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={handleWishlistToggle}
                      className={`w-full py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 border ${isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Free Delivery</div>
                    <div>Orders over AED 200</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Easy Returns</div>
                    <div>30-day return policy</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Secure Payment</div>
                    <div>SSL encrypted checkout</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">2 Year Warranty</div>
                    <div>Full manufacturer warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'in-the-box', label: 'In the Box' },
                  { id: 'compatible-devices', label: 'Compatible Devices' },
                  { id: 'accessories', label: 'Accessories' },
                  { id: 'reviews', label: `Reviews (${reviews.length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'overview' && (
                <div className="prose prose-lg max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description || product.short_description || 'No description available.'
                    }}
                  />
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{spec.label}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'in-the-box' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inTheBoxItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-900">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'compatible-devices' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compatibleDevices.map((device, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-900">{device}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'accessories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {accessories.map((accessory, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img
                        src={accessory.image}
                        alt={accessory.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h4 className="font-medium text-gray-900 mb-2">{accessory.name}</h4>
                      <p className="text-lg font-bold text-blue-600 mb-3">${accessory.price}</p>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Add Review Form */}
                  {isAuthenticated ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Share your experience with this product..."
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600 mb-4">Please sign in to write a review</p>
                      <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{review.author}</span>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600">Be the first to review this product</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
