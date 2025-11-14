
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const CustomerTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'London, UK',
      rating: 5,
      comment: 'The JV35 has completely transformed my cleaning routine. The UV technology gives me peace of mind knowing my mattress is truly clean and allergen-free.',
      product: 'JV35 UV Bed Vacuum',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Weber',
      location: 'Berlin, Germany',
      rating: 5,
      comment: 'Incredible suction power and the battery lasts much longer than my previous vacuum. The H10 Flex is worth every penny!',
      product: 'H10 Flex Cordless Vacuum',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Dubois',
      location: 'Paris, France',
      rating: 5,
      comment: 'The HF9 hair styler is amazing! Professional results at home. My hair has never looked better and it\'s so much faster than my old tools.',
      product: 'HF9 Hair Multi-styler',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    {
      id: 4,
      name: 'Marco Rossi',
      location: 'Milan, Italy',
      rating: 5,
      comment: 'The PW11 wet & dry vacuum is a game-changer. Perfect for my family with kids and pets. Cleans everything effortlessly!',
      product: 'PW11 Wet & Dry Vacuum',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-4 text-2xl font-bold">4.9 out of 5</span>
          </div>
          <p className="text-xl text-gray-300">Based on 15,847+ verified reviews</p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                      <Quote className="w-16 h-16 text-blue-400 mb-8 mx-auto" />
                      
                      <blockquote className="text-2xl md:text-3xl font-medium text-center mb-8 leading-relaxed">
                        "{testimonial.comment}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-6">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                        />
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <cite className="text-xl font-bold">{testimonial.name}</cite>
                          <p className="text-gray-300">{testimonial.location}</p>
                          <p className="text-blue-400 text-sm font-semibold mt-1">{testimonial.product}</p>
                          {testimonial.verified && (
                            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-12 space-x-6">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-400 scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
