"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, Category } from '@/services/wooCommerceApi';
import { useRouter } from 'next/navigation';

import { Wrench, Filter, Brush, Package } from 'lucide-react';

const PartsAccessoriesSection = () => {
  const navigate = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parts and Accessories categories
  const fallbackCategories:any = [
    {
      id: 1,
      name: "Cleaning Brush",
      link: "https://uae.jimmy.me/en/shop/?yith_wcan=1&s=Brush&post_type=product&product_cat=parts-and-accessories",
      image: "/uploads/cleaning-brush.webp",
      gridClass: "col-span-2 row-span-1"
    },
    {
      id: 2,
      name: "Battery",
      link: "https://uae.jimmy.me/en/shop/?yith_wcan=1&s=Battery&post_type=product&product_cat=parts-and-accessories",
      image: "/uploads/battery.webp",
      gridClass: "col-span-1 row-span-1"
    },
    {
      id: 3,
      name: "Water Tank",
      link: "https://uae.jimmy.me/en/shop/?yith_wcan=1&s=tank&post_type=product&product_cat=parts-and-accessories",
      image: "/uploads/water-tank.png",
      gridClass: "col-span-1 row-span-1"
    },
    {
      id: 4,
      name: "HEPA Filter",
      link: "https://uae.jimmy.me/en/shop/?yith_wcan=1&s=Filter&post_type=product&product_cat=parts-and-accessories",
      image: "/uploads/hepa-filter.webp",
      gridClass: "col-span-1 row-span-1"
    },
    {
      id: 5,
      name: "Chargers",
      link: "https://uae.jimmy.me/en/shop/?yith_wcan=1&s=charger&post_type=product&product_cat=parts-and-accessories",
      image: "/uploads/charger.png",
      gridClass: "col-span-1 row-span-1"
    },
    {
      id: 6,
      name: "All Accessories",
      link: "https://uae.jimmy.me/product-category/parts-and-accessories/",
      image: null,
      gridClass: "col-span-1 row-span-1"
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const partsCategories = data.filter(cat => 
          cat.name.toLowerCase().includes('parts') || 
          cat.name.toLowerCase().includes('accessories') ||
          cat.name.toLowerCase().includes('attachment') ||
          cat.name.toLowerCase().includes('filter') ||
          cat.name.toLowerCase().includes('brush')
        );
        
        if (partsCategories.length === 0) {
          setCategories(fallbackCategories);
        } else {
          setCategories(partsCategories);
        }
      } catch (error) {
        console.error('Error fetching parts categories:', error);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    navigate.push(`/collections/${category.slug}`);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 animate-pulse rounded w-80 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Media Grid Layout - mimicking jimmy.eu exactly */}
        <div className="grid grid-cols-4 gap-4 h-[300px]" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
          
          {/* Metal Tube - Column 1, Rows 1-2 */}
          <div 
            className="relative col-span-1 row-span-2 bg-white cursor-pointer group overflow-hidden"
            onClick={() => handleCategoryClick(categories[0] || fallbackCategories[0])}
          >
            <div className="absolute inset-0">
              <img 
                src={categories[0]?.image?.src || fallbackCategories[0].image.src}
                alt={categories[0]?.image?.alt || fallbackCategories[0].image.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4 text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {categories[0]?.name || fallbackCategories[0].name}
              </h4>
              <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Shop Now 
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Battery - Column 2, Rows 1-2 */}
          <div 
            className="relative col-span-1 row-span-2 bg-white cursor-pointer group overflow-hidden"
            onClick={() => handleCategoryClick(categories[1] || fallbackCategories[1])}
          >
            <div className="absolute inset-0">
              <img 
                src={categories[1]?.image?.src || fallbackCategories[1].image.src}
                alt={categories[1]?.image?.alt || fallbackCategories[1].image.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4 text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {categories[1]?.name || fallbackCategories[1].name}
              </h4>
              <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Shop Now 
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Cleaning Brush - Columns 3-4, Row 1 */}
          <div 
            className="relative col-span-2 row-span-1 bg-white cursor-pointer group overflow-hidden"
            onClick={() => handleCategoryClick(categories[2] || fallbackCategories[2])}
          >
            <div className="absolute inset-0">
              <img 
                src={categories[2]?.image?.src || fallbackCategories[2].image.src}
                alt={categories[2]?.image?.alt || fallbackCategories[2].image.alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: '54.125% 60.25%' }}
              />
            </div>
            <div className="absolute top-4 left-4 text-left">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {categories[2]?.name || fallbackCategories[2].name}
              </h4>
              <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Shop Now 
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Additional categories in row 2 if available */}
          {categories.length > 3 || fallbackCategories.length > 3 ? (
            <div 
              className="relative col-span-2 row-span-1 bg-white cursor-pointer group overflow-hidden"
              onClick={() => handleCategoryClick(categories[3] || fallbackCategories[3])}
            >
              <div className="absolute inset-0">
                <img 
                  src={categories[3]?.image?.src || fallbackCategories[3].image.src}
                  alt={categories[3]?.image?.alt || fallbackCategories[3].image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 text-left">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {categories[3]?.name || fallbackCategories[3].name}
                </h4>
                <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Shop Now 
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="col-span-2 row-span-1"></div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PartsAccessoriesSection;
