"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeaturedProducts, Product, getHomePageSeo } from '@/services/wooCommerceApi';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PartsAccessoriesSection from '@/components/home/PartsAccessoriesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedVideoSection from '@/components/home/FeaturedVideoSection';
import AwardWinningSection from '@/components/home/AwardWinningSection';
import CustomerTestimonials from '@/components/home/CustomerTestimonials';
import FeaturedBlogs from '@/components/home/FeaturedBlogs';
import PromotionSection from '@/components/home/PromotionSection';
import { Seo } from '@/components/seo/Seo';
import { useYoastSeo,YoastSeoData } from '@/hooks/useYoastSeo';

const Index = () => {
  const { currentLang } = useLanguage();
  const [homePageSeo, setHomePageSeo] = useState<YoastSeoData | undefined>(undefined);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const seoData = await getHomePageSeo() as (YoastSeoData | undefined);
        setHomePageSeo(seoData);
      } catch (error) {
        console.error('Error fetching home page SEO data:', error);
      }
    };

    fetchSeoData();
  }, [currentLang]);

  const seoData = useYoastSeo({
    yoastData: homePageSeo,
    fallbackTitle: currentLang === 'ar' ? 'جيمي - حلول التنظيف المتميزة' : 
                   currentLang === 'fr' ? 'Jimmy - Solutions de Nettoyage Premium' :
                   'Jimmy - Premium Cleaning Solutions',
    fallbackDescription: currentLang === 'ar' ? 
      'اكتشف مجموعة جيمي الحائزة على جوائز من المكانس الكهربائية وأجهزة تنقية المياه وإكسسوارات التنظيف. تقنية متقدمة لمنزل أنظف وأكثر صحة.' :
      currentLang === 'fr' ? 
      'Découvrez la gamme primée de Jimmy d\'aspirateurs, purificateurs d\'eau et accessoires de nettoyage. Technologie avancée pour une maison plus propre et plus saine.' :
      'Discover Jimmy\'s award-winning range of vacuum cleaners, water purifiers, and cleaning accessories. Advanced technology for a cleaner, healthier home.',
    fallbackCanonical: '/'
  });

  return (
    <>
      <Seo {...seoData} />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection />

        {/* Promotion Section */}
        <PromotionSection />

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* Featured Video Section */}
        <FeaturedVideoSection />

        {/* Parts & Accessories Section */}
        <PartsAccessoriesSection />

        {/* Award Winning Section */}
        <AwardWinningSection />

        {/* Customer Testimonials */}
        <CustomerTestimonials />

        {/* Featured Blogs */}
        <FeaturedBlogs />

        {/* Features Section */}
        <FeaturesSection />
      </div>
    </>
  );
};

export default Index;
