
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "JV35",
    subtitle: "Killing Mites by UV & High Temperature",
    description: "Advanced UV sterilization technology combined with high-temperature cleaning for the ultimate mattress hygiene solution.",
    image: "https://jimmy.eu/cdn/shop/files/JIMMY_JV35_UV_Bed_Vacuum_-2800_1200-2.jpg?v=1737450830",
    cta: "Shop Now",
    badge: "Certified by Allergy UK Foundation",
    price: "€199.99"
  },
  {
    id: 2,
    title: "HF9 Hair Multi-styler",
    subtitle: "Unlock Your Best Look",
    description: "Professional-grade hair styling with multiple attachments for salon-quality results at home.",
    image: "https://jimmy.eu/cdn/shop/files/Jimmy_HF9_Hair_Multi-styler_Banner-250108-2800-1.jpg?v=1736325797",
    cta: "Shop Now",
    badge: "New Arrival",
    price: "€149.99"
  },
  {
    id: 3,
    title: "PW11 Series",
    subtitle: "The Ultimate All-In-One House Cleaning Solution",
    description: "Cordless wet & dry vacuum cleaner with powerful suction and versatile cleaning capabilities.",
    image: "https://jimmy.eu/cdn/shop/files/PW11_Series_Cordless_Wet_Dry_Vacuum_Cleaner-2800-240801.jpg?v=1722501511",
    cta: "Shop Now",
    badge: "Cordless Wet & Dry",
    price: "€299.99"
  },
  {
    id: 4,
    title: "H10 Flex",
    subtitle: "Powerful Suction, Long Runtime, Smart Clean!",
    description: "245AW powerful suction with flexible design for comprehensive home cleaning.",
    image: "https://jimmy.eu/cdn/shop/files/JIMMY_H10_Flex_Cordless_Stick_Vacuum_Cleaner-2800-1200-0220.jpg?v=1708414372",
    cta: "Shop Now",
    badge: "245AW Strong Suction",
    price: "€249.99"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentSlideData.image})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-full">
          <div className="max-w-2xl">
            {/* Badge */}
            {currentSlideData.badge && (
              <div className="mb-6">
                <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                  {currentSlideData.badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed drop-shadow-md">
              {currentSlideData.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-white/80 mb-8 leading-relaxed drop-shadow-md max-w-xl">
              {currentSlideData.description}
            </p>

            {/* Price & CTA */}
            <div className="flex items-center space-x-6">
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {currentSlideData.price}
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                {currentSlideData.cta}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
