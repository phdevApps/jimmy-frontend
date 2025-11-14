
import React from 'react';
import { Award, Users, Globe, Heart, Zap, Shield } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Innovation",
      description: "Constantly pushing boundaries to create cutting-edge cleaning solutions that make life easier."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Care",
      description: "We care about your health, your home, and the environment. Every product is designed with love."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Quality",
      description: "Uncompromising quality standards ensure every Jimmy product delivers exceptional performance."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Community",
      description: "Building a community of satisfied customers who trust Jimmy for their cleaning needs."
    }
  ];

  const milestones = [
    { year: "2018", event: "Jimmy founded with a vision to revolutionize home cleaning" },
    { year: "2019", event: "First Jimmy vacuum cleaner launched" },
    { year: "2020", event: "Allergy UK certification received for our filtration technology" },
    { year: "2021", event: "Expanded to UAE market" },
    { year: "2022", event: "Over 100,000 satisfied customers worldwide" },
    { year: "2023", event: "Launched eco-friendly product line" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Jimmy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're passionate about creating innovative cleaning solutions that make your life easier, 
              healthier, and more comfortable. Our commitment to quality and customer satisfaction drives everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To empower families with innovative, high-quality cleaning solutions that create healthier homes 
              and give people more time to focus on what matters most - spending quality time with loved ones.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-200">Awards Won</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-200">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Timeline */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in Jimmy's growth story</p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg mr-8">
                  {milestone.year}
                </div>
                <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-800 text-lg">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certifications & Awards</h2>
            <p className="text-lg text-gray-600">Recognition for our commitment to quality and innovation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Allergy UK Certified</h3>
              <p className="text-gray-600">Our filtration technology is certified by Allergy UK for reducing allergens.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ISO 9001 Certified</h3>
              <p className="text-gray-600">International quality management standards certification.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CE Marked</h3>
              <p className="text-gray-600">European conformity marking for safety and environmental standards.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Get in touch with our team to discover how Jimmy can transform your cleaning routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              View Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
