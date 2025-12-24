"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductsByCategory, getCategories, getProducts, Product, Category } from '@/services/wooCommerceApi';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Seo } from '@/components/seo/Seo';
import { useYoastSeo } from '@/hooks/useYoastSeo';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Category slug mappings for collections routes
  const categoryMappings: { [key: string]: string } = {
    'parts-accessories': 'parts',
    'anti-mite-vacuums': 'bed-vacuum',
    'cordless-vacuums': 'stick-vacuum', 
    'wet-dry-vacuums': 'wet-dry',
    'countertop-water-purifier': 'water-purifier',
    'hair-dryer': 'hair-styler',
    'trending-products': 'trending'
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!slug) {
        setError('No category specified');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching category products for slug:', slug);
        setIsLoading(true);
        setError(null);
        
        const [categories, allProducts] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        
        console.log('All categories:', categories);
        console.log('All products:', allProducts);
        
        const mappedSlug = categoryMappings[slug] || slug;
        console.log('Mapped slug:', mappedSlug);
        
        // Try to find category by various matching methods
        let foundCategory = categories.find(cat => {
          const nameMatch = cat.name.toLowerCase().replace(/\s+/g, '-') === slug;
          const slugMatch = cat.slug === slug || cat.slug === mappedSlug;
          const nameIncludes = cat.name.toLowerCase().includes(mappedSlug.replace('-', ' '));
          
          console.log(`Category ${cat.name}: nameMatch=${nameMatch}, slugMatch=${slugMatch}, nameIncludes=${nameIncludes}`);
          
          return nameMatch || slugMatch || nameIncludes;
        });

        console.log('Found category:', foundCategory);

        // If no category found, create a virtual one with all required properties
        if (!foundCategory) {
          foundCategory = {
            id: 999,
            name: slug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            slug: slug,
            description: `Products in the ${slug.replace(/-/g, ' ')} category`,
            parent: 0,
            count: 0,
            display: "default",
            menu_order: 0,
            image: undefined
          };
        }
        
        setCategory(foundCategory);
        
        let categoryProducts: Product[] = [];
        
        // If we have a real category, try to get products by category
        if (foundCategory.id !== 999) {
          try {
            console.log('Fetching products for category ID:', foundCategory.id);
            categoryProducts = await getProductsByCategory(foundCategory.id.toString());
            console.log('Products from category API:', categoryProducts);
          } catch (err) {
            console.log('Category API failed, falling back to filtering all products');
            // Fallback to filtering all products
            categoryProducts = allProducts.filter(product => 
              product.categories?.some(cat => cat.id === foundCategory.id)
            );
          }
        }
        
        // If no products found or virtual category, search by name/description
        if (categoryProducts.length === 0) {
          console.log('No products found, searching by keywords');
          const searchTerms = [
            mappedSlug.replace('-', ' ').toLowerCase(),
            slug.replace('-', ' ').toLowerCase(),
            foundCategory.name.toLowerCase()
          ];
          
          categoryProducts = allProducts.filter(product => {
            const productName = product.name.toLowerCase();
            const productDesc = product.short_description.toLowerCase();
            const productFullDesc = product.description.toLowerCase();
            
            return searchTerms.some(term => 
              productName.includes(term) || 
              productDesc.includes(term) || 
              productFullDesc.includes(term)
            );
          });
        }
        
        console.log('Final category products:', categoryProducts);
        setProducts(categoryProducts);
        
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Error loading category products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage, productsPerPage]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // SEO configuration
  const seoData = useYoastSeo({
    yoastData: category?.yoast_head_json,
    fallbackTitle: category?.name || 'Category',
    fallbackDescription: category?.description?.replace(/<[^>]*>/g, '') || `Browse our ${category?.name} collection`,
    fallbackCanonical: window.location.href
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The category you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate.push('/products')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo {...seoData} />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <button
              onClick={() => navigate.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-xl text-blue-100" dangerouslySetInnerHTML={{ __html: category.description }}></p>
            )}
            <div className="mt-4">
              <p className="text-blue-100">
                {products.length} products found
              </p>
              {products.length > 0 && totalPages > 1 && (
                <p className="text-blue-200 text-sm mt-1">
                  Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h2>
              <p className="text-gray-600 mb-6">There are currently no products in this category.</p>
              <button
                onClick={() => navigate.push('/products')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                          />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
