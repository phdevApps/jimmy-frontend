"use client";

import React from 'react';
import { Shield, FileText, Clock, CheckCircle } from 'lucide-react';

const WarrantyGuide = () => {
  const warrantyPeriods = [
    { product: "Bed Vacuum Cleaners", period: "24 months", coverage: "Full coverage" },
    { product: "Stick Vacuum Cleaners", period: "24 months", coverage: "Full coverage" },
    { product: "Wet-Dry Vacuum Cleaners", period: "24 months", coverage: "Full coverage" },
    { product: "Hair Multi-Stylers", period: "12 months", coverage: "Full coverage" },
    { product: "Accessories & Parts", period: "6 months", coverage: "Manufacturing defects" }
  ];

  const coveredItems = [
    "Manufacturing defects in materials",
    "Workmanship issues",
    "Motor and electrical component failures",
    "Structural integrity problems",
    "Battery performance issues (where applicable)"
  ];

  const notCovered = [
    "Normal wear and tear",
    "Damage from misuse or abuse", 
    "Water damage (unless product is water-resistant)",
    "Damage from unauthorized repairs",
    "Lost or stolen products",
    "Consumable items (filters, brushes)"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Warranty Guide</h1>
          <p className="text-xl text-blue-100">Understanding your Jimmy product warranty</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warranty Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Warranty Coverage</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Product Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Warranty Period</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Coverage Type</th>
                </tr>
              </thead>
              <tbody>
                {warrantyPeriods.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{item.product}</td>
                    <td className="py-3 px-4 text-gray-700">{item.period}</td>
                    <td className="py-3 px-4 text-gray-700">{item.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What's Covered vs Not Covered */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">What's Covered</h2>
            </div>
            <ul className="space-y-3">
              {coveredItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <Clock className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">What's Not Covered</h2>
            </div>
            <ul className="space-y-3">
              {notCovered.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to Make a Claim */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">How to Make a Warranty Claim</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600">Reach out to our customer support team with your issue.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Provide Information</h3>
              <p className="text-gray-600">Share your purchase receipt and product details.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Resolution</h3>
              <p className="text-gray-600">We'll repair, replace, or refund based on the issue.</p>
            </div>
          </div>
        </div>

        {/* Required Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-4">Required Information for Warranty Claims</h3>
          <ul className="text-yellow-700 space-y-2">
            <li>• Original purchase receipt or proof of purchase</li>
            <li>• Product model number and serial number</li>
            <li>• Clear description of the issue</li>
            <li>• Photos or videos of the problem (if applicable)</li>
            <li>• Your contact information</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need to Make a Claim?</h2>
          <p className="text-gray-600 mb-6">Our support team is ready to help with your warranty claim.</p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4"
          >
            Contact Support
          </a>
          <a
            href="/apps/track123"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Track Existing Claim
          </a>
        </div>
      </div>
    </div>
  );
};

export default WarrantyGuide;
