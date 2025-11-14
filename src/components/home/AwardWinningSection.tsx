
import React from 'react';
import { Award, Star } from 'lucide-react';

const AwardWinningSection = () => {
  const awards = [
    { 
      name: 'Red Dot Design Award 2024', 
      image: 'https://jimmy.eu/cdn/shop/files/award-red-dot.png?v=1736926396&width=200',
      year: '2024'
    },
    { 
      name: 'iF Design Award', 
      image: 'https://jimmy.eu/cdn/shop/files/award-if-design.png?v=1736926396&width=200',
      year: '2024'
    },
    { 
      name: 'Good Housekeeping Seal', 
      image: 'https://jimmy.eu/cdn/shop/files/award-good-housekeeping.png?v=1736926396&width=200',
      year: '2023'
    },
    { 
      name: 'Consumer Choice Award', 
      image: 'https://jimmy.eu/cdn/shop/files/award-consumer-choice.png?v=1736926396&width=200',
      year: '2023'
    },
    { 
      name: 'Innovation Excellence', 
      image: 'https://jimmy.eu/cdn/shop/files/award-innovation.png?v=1736926396&width=200',
      year: '2024'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Award className="h-12 w-12 text-yellow-500 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Award-Winning Innovation</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recognized globally for excellence in design, innovation, and performance
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Awards Won</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-blue-600">4.9</span>
                <Star className="w-8 h-8 text-yellow-400 fill-current ml-2" />
              </div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>

        {/* Awards Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-12 py-8">
            {[...awards, ...awards].map((award, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 min-w-[280px]"
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{award.name}</h3>
                  <p className="text-blue-600 font-semibold">{award.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardWinningSection;
