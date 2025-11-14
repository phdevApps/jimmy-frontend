
import React, { useState } from 'react';
import { Play, Volume2 } from 'lucide-react';

const FeaturedVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See Jimmy in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power, innovation, and superior performance of Jimmy products through our demonstration videos
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <div 
                className="relative w-full h-full bg-cover bg-center cursor-pointer group"
                style={{ 
                  backgroundImage: `url(https://jimmy.eu/cdn/shop/files/JIMMY_JV35_UV_Bed_Vacuum_-2800_1200-2.jpg?v=1737450830)`
                }}
                onClick={handlePlayVideo}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                    <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-2">JV35 UV Bed Vacuum Demo</h3>
                    <p className="text-white/80 mb-4">Watch how UV technology eliminates 99.9% of dust mites and allergens</p>
                    <div className="flex items-center space-x-4 text-white/70">
                      <span className="flex items-center">
                        <Volume2 className="w-4 h-4 mr-2" />
                        HD Quality
                      </span>
                      <span>•</span>
                      <span>3:24 min</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                poster="https://jimmy.eu/cdn/shop/files/JIMMY_JV35_UV_Bed_Vacuum_-2800_1200-2.jpg?v=1737450830"
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Watch More Videos
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideoSection;
