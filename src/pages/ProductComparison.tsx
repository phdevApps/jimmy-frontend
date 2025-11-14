
import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Minus } from 'lucide-react';
import { Seo } from '../components/seo/Seo';
import { getProducts, Product } from '../services/wooCommerceApi';

interface ProductFeature {
  power?: string;
  uvCleaning?: boolean;
  hotAir?: boolean;
  ledDisplay?: boolean;
  dustSensor?: boolean;
  allergyUK?: boolean;
  weight?: string;
  batteryLife?: string;
  dustCapacity?: string;
  noiseLevel?: string;
  warranty?: string;
}

interface ComparisonProduct extends Product {
  features?: ProductFeature;
}

const ProductComparison = () => {
  const [allProducts, setAllProducts] = useState<ComparisonProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching products for comparison from WooCommerce API...');
        
        const productsData = await getProducts();
        console.log('Fetched products for comparison:', productsData);
        
        // Transform products and add feature data (this would ideally come from product meta fields)
        const transformedProducts = productsData.map((product, index) => ({
          ...product,
          features: extractProductFeatures(product, index)
        }));
        
        setAllProducts(transformedProducts);
        // Set first 3 products as initially selected
        setSelectedProducts(transformedProducts.slice(0, 3).map(p => p.id));
        setError(null);
      } catch (error) {
        console.error('Error fetching products for comparison:', error);
        setError('Failed to load products');
        
        // Fallback to sample data
        const fallbackProducts = [
          {
            id: 1,
            name: "BX8 Bed Vacuum Cleaner",
            images: [{ src: "https://jimmy.eu/cdn/shop/files/Jimmy_Bed_Vacuum_Cleaner-250115-1.png?v=1736926396&width=300" }],
            price: "199.00",
            regular_price: "249.00",
            average_rating: "4.8",
            rating_count: 124,
            stock_status: "instock",
            features: {
              power: "600W",
              uvCleaning: true,
              hotAir: true,
              ledDisplay: true,
              dustSensor: true,
              allergyUK: true,
              weight: "2.5kg",
              batteryLife: "25 minutes",
              dustCapacity: "0.4L",
              noiseLevel: "65dB",
              warranty: "2 years"
            }
          }
        ] as ComparisonProduct[];
        
        setAllProducts(fallbackProducts);
        setSelectedProducts([1]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract features from product data (this would ideally be stored in product meta fields)
  const extractProductFeatures = (product: Product, index: number): ProductFeature => {
    // This is a simplified feature extraction - in a real app, this would come from product meta fields
    const sampleFeatures = [
      {
        power: "600W",
        uvCleaning: true,
        hotAir: true,
        ledDisplay: true,
        dustSensor: true,
        allergyUK: true,
        weight: "2.5kg",
        batteryLife: "25 minutes",
        dustCapacity: "0.4L",
        noiseLevel: "65dB",
        warranty: "2 years"
      },
      {
        power: "450W",
        uvCleaning: false,
        hotAir: false,
        ledDisplay: true,
        dustSensor: true,
        allergyUK: false,
        weight: "2.8kg",
        batteryLife: "60 minutes",
        dustCapacity: "0.6L",
        noiseLevel: "72dB",
        warranty: "2 years"
      },
      {
        power: "500W",
        uvCleaning: false,
        hotAir: false,
        ledDisplay: true,
        dustSensor: false,
        allergyUK: false,
        weight: "3.2kg",
        batteryLife: "35 minutes",
        dustCapacity: "0.8L",
        noiseLevel: "68dB",
        warranty: "3 years"
      }
    ];
    
    return sampleFeatures[index % sampleFeatures.length];
  };

  const displayedProducts = allProducts.filter(product => 
    selectedProducts.includes(product.id)
  );

  const availableProducts = allProducts.filter(product => 
    !selectedProducts.includes(product.id)
  );

  const addProduct = (productId: number) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const removeProduct = (productId: number) => {
    if (selectedProducts.length > 2) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(numRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getProductImage = (product: ComparisonProduct) => {
    return product.images?.[0]?.src || "https://jimmy.eu/cdn/shop/files/Jimmy_Bed_Vacuum_Cleaner-250115-1.png?v=1736926396&width=300";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Comparison</h1>
              <p className="text-xl text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Product Comparison - Jimmy EU"
        description="Compare Jimmy vacuum cleaners to find the perfect cleaning solution for your needs"
        canonical="https://uae.jimmy.me/pages/product-comparison"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Comparison</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Compare Jimmy products side by side to find the perfect cleaning solution for your needs. 
                Select up to 4 products to compare their features, specifications, and prices.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{error}. Showing sample content.</p>
            </div>
          )}

          {/* Product Selector */}
          {availableProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
              <h3 className="text-lg font-semibold mb-4">Add Products to Compare</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableProducts.slice(0, 8).map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-32 object-contain mb-3"
                    />
                    <h4 className="font-medium text-sm mb-2">{product.name}</h4>
                    <p className="text-blue-600 font-bold mb-3">€{product.price}</p>
                    <button
                      onClick={() => addProduct(product.id)}
                      disabled={selectedProducts.length >= 4}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {displayedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-6 font-semibold text-gray-900 min-w-[200px]">
                        Compare Products
                      </th>
                      {displayedProducts.map((product) => (
                        <th key={product.id} className="text-center p-6 min-w-[280px]">
                          <div className="flex flex-col items-center relative">
                            {selectedProducts.length > 2 && (
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-32 h-32 object-contain mb-4"
                            />
                            <h3 className="font-semibold text-gray-900 mb-2 text-center">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {renderStars(product.average_rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                ({product.rating_count} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-2xl font-bold text-blue-600">€{product.price}</p>
                              {product.regular_price && product.regular_price !== product.price && (
                                <p className="text-lg text-gray-500 line-through">€{product.regular_price}</p>
                              )}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock_status === 'instock'
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Feature comparison rows */}
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">Power</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6 font-semibold">
                          {product.features?.power || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">UV Cleaning</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6">
                          {product.features?.uvCleaning ? (
                            <Check className="h-6 w-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-6 w-6 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">Hot Air Technology</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6">
                          {product.features?.hotAir ? (
                            <Check className="h-6 w-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-6 w-6 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">LED Display</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6">
                          {product.features?.ledDisplay ? (
                            <Check className="h-6 w-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-6 w-6 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">Weight</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6 font-semibold">
                          {product.features?.weight || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-6 font-medium bg-gray-50">Battery Life</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6 font-semibold">
                          {product.features?.batteryLife || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 font-medium bg-gray-50">Warranty</td>
                      {displayedProducts.map((product) => (
                        <td key={product.id} className="text-center p-6 font-semibold">
                          {product.features?.warranty || '1 year'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {displayedProducts.length > 0 && (
            <div className="mt-8">
              <div className={`grid grid-cols-1 lg:grid-cols-${displayedProducts.length} gap-6`}>
                {displayedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-4">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">€{product.price}</p>
                    <div className="space-y-3">
                      <button
                        disabled={product.stock_status !== 'instock'}
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                          product.stock_status === 'instock'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.stock_status === 'instock' ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayedProducts.length === 0 && !isLoading && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products selected</h3>
              <p className="text-gray-600">Select products from the list above to start comparing.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductComparison;
