
"use client";
import React, { useState } from 'react';
import { Facebook, Instagram, Mail, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Get 5% Off</h2>
          <p className="text-xl text-blue-100 mb-8">Be the first to know about new collections and exclusive offers.</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
              required
            />
            <button 
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">Our Brand</a></li>
              <li><a href="/stores" className="text-gray-300 hover:text-white transition-colors">Where to Buy</a></li>
              <li><a href="/affiliate" className="text-gray-300 hover:text-white transition-colors">Affiliate Program</a></li>
              <li><a href="/blogs/news" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Information Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-white transition-colors">Return A Product</a></li>
              <li><a href="/payment" className="text-gray-300 hover:text-white transition-colors">Payment Information</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="text-gray-300 hover:text-white transition-colors">Cookies Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/apps/track123" className="text-gray-300 hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="/avada-faqs" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/product-care" className="text-gray-300 hover:text-white transition-colors">Product Care</a></li>
              <li><a href="/trouble-shooting" className="text-gray-300 hover:text-white transition-colors">Troubleshooting</a></li>
              <li><a href="/instruction-manual" className="text-gray-300 hover:text-white transition-colors">Instruction Manual</a></li>
              <li><a href="/warranty-guide" className="text-gray-300 hover:text-white transition-colors">Warranty Guide</a></li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/JIMMY-EU-107782334790209" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://x.com/JimmyTech_EU" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/jimmy_eu/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@JIMMY_EU" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Jimmy. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Payment Method Icons */}
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-xs">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-red-600 font-bold text-xs">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-xs">PayPal</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-gray-800 font-bold text-xs">Apple Pay</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-green-600 font-bold text-xs">Google Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
