"use client";

import React from 'react';
import { Shield, Wrench, Calendar, AlertTriangle } from 'lucide-react';

const ProductCare = () => {
  const careGuides = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Bed Vacuum Cleaner Care",
      items: [
        "Clean the dust chamber after each use",
        "Replace HEPA filter every 6 months",
        "Wipe UV lamp with soft cloth monthly",
        "Store in dry place when not in use"
      ]
    },
    {
      icon: <Wrench className="h-8 w-8 text-green-600" />,
      title: "Stick Vacuum Maintenance",
      items: [
        "Empty dustbin when 2/3 full",
        "Check and clean brush roll weekly",
        "Charge battery fully before first use",
        "Replace filters as recommended"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      title: "Wet-Dry Vacuum Care",
      items: [
        "Drain water tank immediately after use",
        "Clean all tanks with mild soap",
        "Allow all parts to air dry completely",
        "Check seals and gaskets regularly"
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      title: "Hair Multi-Styler Care",
      items: [
        "Clean styling attachments after each use",
        "Store with cord loosely coiled",
        "Never immerse main unit in water",
        "Use heat protectant on attachments"
      ]
    }
  ];

  const generalTips = [
    {
      title: "Regular Cleaning",
      description: "Clean your Jimmy products regularly to maintain optimal performance and extend their lifespan."
    },
    {
      title: "Proper Storage",
      description: "Store in a clean, dry place away from direct sunlight and extreme temperatures."
    },
    {
      title: "Gentle Handling",
      description: "Handle with care and avoid dropping or rough treatment of your devices."
    },
    {
      title: "Original Parts",
      description: "Always use genuine Jimmy replacement parts and accessories for best results."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Product Care Guide</h1>
          <p className="text-xl text-blue-100">Keep your Jimmy products in perfect condition</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Care Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {careGuides.map((guide, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {guide.icon}
                <h2 className="text-xl font-bold text-gray-900 ml-3">{guide.title}</h2>
              </div>
              <ul className="space-y-2">
                {guide.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* General Care Tips */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">General Care Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generalTips.map((tip, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Safety Notes</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Always unplug devices before cleaning</li>
                <li>• Never use harsh chemicals or abrasive materials</li>
                <li>• Refer to your product manual for specific instructions</li>
                <li>• Contact support if you notice any unusual operation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Replacement Parts?</h2>
          <p className="text-gray-600 mb-6">Browse our selection of genuine Jimmy replacement parts and accessories.</p>
          <a
            href="/collections/parts-accessories"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Shop Parts & Accessories
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCare;
