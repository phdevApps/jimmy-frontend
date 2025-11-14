
import React from 'react';
import { Truck, Shield, Headphones, CreditCard, Award, Recycle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'Orders over €39.99',
      description: 'Fast and reliable delivery across Europe'
    },
    {
      icon: Shield,
      title: '2 Years Warranty',
      subtitle: 'Complete Protection',
      description: 'Comprehensive coverage for peace of mind'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      subtitle: '24/7 Available',
      description: 'Professional assistance whenever you need it'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      subtitle: '100% Protected',
      description: 'Safe and encrypted payment processing'
    },
    {
      icon: Award,
      title: 'Award Winning',
      subtitle: 'Global Recognition',
      description: 'Industry-leading design and innovation'
    },
    {
      icon: Recycle,
      title: 'Eco-Friendly',
      subtitle: 'Sustainable Choice',
      description: 'Environmentally conscious manufacturing'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Jimmy
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our commitment to quality, innovation, and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <feature.icon className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-lg font-semibold text-blue-600 mb-3">{feature.subtitle}</p>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
