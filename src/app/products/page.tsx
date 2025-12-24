// "use client";

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { getProducts, getCategories, Product, Category } from '@/services/wooCommerceApi';
// import { useRouter } from 'next/navigation';
// import { Filter } from 'lucide-react';
// import ProductCard from '@/components/product/ProductCard';
// import { useLanguage } from '@/contexts/LanguageContext';

// const Products = () => {
//   const navigate = useRouter();
//   const searchParams = useSearchParams();
//   const { currentLang } = useLanguage();
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [sortBy, setSortBy] = useState<string>('name');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

  
//   const searchQuery = searchParams.get('q') || '';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [productsData, categoriesData] = await Promise.all([
//           getProducts(),
//           getCategories()
//         ]);

//         let filteredProducts = productsData;

//         // Filter by search query if present
//         if (searchQuery) {
//           filteredProducts = productsData.filter(product =>
//             product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             product.description.toLowerCase().includes(searchQuery.toLowerCase())
//           );
//         }

//         setProducts(filteredProducts);
//         setCategories(categoriesData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchQuery]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-blue-600 text-white py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-bold mb-4">
//             {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
//           </h1>
//           <p className="text-xl text-blue-100">
//             {searchQuery ? `Found ${products.length} products` : 'Discover our complete range of cleaning solutions'}
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:w-64 space-y-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
//                 <Filter className="h-5 w-5 mr-2" />
//                 Filters
//               </h3>

//               {/* Categories */}
//               <div className="space-y-2">
//                 <h4 className="font-medium text-gray-700">Categories</h4>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="category"
//                       value=""
//                       checked={selectedCategory === ''}
//                       onChange={(e) => setSelectedCategory(e.target.value)}
//                       className="text-blue-600"
//                     />
//                     <span className="ml-2 text-sm text-gray-600">All Products</span>
//                   </label>
//                   {categories?.slice(0, 8).map((category) => (
//                     <label key={category.id} className="flex items-center">
//                       <input
//                         type="radio"
//                         name="category"
//                         value={category.id.toString()}
//                         checked={selectedCategory === category.id.toString()}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="text-blue-600"
//                       />
//                       <span className="ml-2 text-sm text-gray-600">{category.name}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid */}
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-gray-600">
//                 {products?.length || 0} products found
//               </p>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price">Sort by Price</option>
//                 <option value="rating">Sort by Rating</option>
//               </select>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products?.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {products?.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">
//                   {searchQuery ? 'No products found matching your search.' : 'No products available.'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;


'use client';
import { Suspense } from 'react';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts, getCategories, Product, Category } from '@/services/wooCommerceApi';
import { Filter } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

function ProductsClient() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        let filteredProducts = productsData;

        // Filter by search query if present
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filteredProducts = productsData.filter(
            (product) =>
              product.name.toLowerCase().includes(q) ||
              product.description.toLowerCase().includes(q)
          );
        }

        // Optional: client-side sort (kept minimal, adjust if your data has rating fields)
        if (sortBy === 'name') {
          filteredProducts = [...filteredProducts].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else if (sortBy === 'price') {
          filteredProducts = [...filteredProducts].sort(
            (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
          );
        }
        // If you have rating data (e.g., product.rating), you can enable:
        // else if (sortBy === 'rating') {
        //   filteredProducts = [...filteredProducts].sort(
        //     (a, b) => (b.rating || 0) - (a.rating || 0)
        //   );
        // }

        setProducts(filteredProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-xl text-blue-100">
            {searchQuery
              ? `Found ${products.length} products`
              : 'Discover our complete range of cleaning solutions'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">All Products</span>
                  </label>
                  {categories?.slice(0, 8).map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id.toString()}
                        checked={selectedCategory === category.id.toString()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{products?.length || 0} products found</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? 'No products found matching your search.'
                    : 'No products available.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




// import ProductsClient from './ProductsClient';

// Uncomment one of the following if the page must always render dynamically:
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600">Loading products…</p>
          </div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
