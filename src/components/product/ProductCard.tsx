
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { addToCart } from '../../features/cart/cartSlice';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { Price } from '../ui/price';
import { Product } from '../../services/wooCommerceApi';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.src || '/api/placeholder/300/300',
    }));
  };

  const handleWishlistToggle = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleProductClick = (productSlug: string) => {
    navigate(`/products/${productSlug}`);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
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
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            SALE
          </div>
        )}
      </div>

      <div className="p-4 pb-2">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Price amount={product.price} size="lg" className="text-gray-900 font-bold" />
            {product.on_sale && product.regular_price && (
              <Price 
                amount={product.regular_price} 
                size="sm" 
                className="text-gray-500 line-through" 
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock_status === 'outofstock'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
            style={{ width: '80%' }}
          >
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Add to Cart
          </button>
          {isAuthenticated && (
            <button
              onClick={(e) => handleWishlistToggle(product.id, e)}
              className={`py-2 px-3 rounded-lg transition-colors duration-200 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
              style={{ width: '20%' }}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
