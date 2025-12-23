"use client";

import React, { useState } from 'react';
import { Download, FileText, Video, Search } from 'lucide-react';

interface Manual {
  id: number;
  product: string;
  category: string;
  pdfUrl: string;
  videoUrl?: string;
  fileSize: string;
  language: string;
  version: string;
}

const InstructionManual = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const manuals: Manual[] = [
    {
      id: 1,
      product: "BX7 Bed Vacuum Cleaner",
      category: "bed-vacuum",
      pdfUrl: "/manuals/bx7-manual.pdf",
      videoUrl: "https://youtube.com/watch?v=example1",
      fileSize: "2.3 MB",
      language: "EN",
      version: "v2.1"
    },
    {
      id: 2,
      product: "JV85 Pro Stick Vacuum",
      category: "stick-vacuum",
      pdfUrl: "/manuals/jv85-manual.pdf",
      videoUrl: "https://youtube.com/watch?v=example2",
      fileSize: "3.1 MB",
      language: "EN",
      version: "v1.8"
    },
    {
      id: 3,
      product: "MW31 Wet Dry Vacuum",
      category: "wet-dry-vacuum",
      pdfUrl: "/manuals/mw31-manual.pdf",
      fileSize: "2.8 MB",
      language: "EN",
      version: "v1.5"
    },
    {
      id: 4,
      product: "HF9 Hair Multi-Styler",
      category: "hair-styler",
      pdfUrl: "/manuals/hf9-manual.pdf",
      videoUrl: "https://youtube.com/watch?v=example3",
      fileSize: "1.9 MB",
      language: "EN",
      version: "v1.2"
    },
    {
      id: 5,
      product: "BX7 Bed Vacuum Cleaner",
      category: "bed-vacuum",
      pdfUrl: "/manuals/bx7-manual-fr.pdf",
      fileSize: "2.4 MB",
      language: "FR",
      version: "v2.1"
    },
    {
      id: 6,
      product: "JV85 Pro Stick Vacuum",
      category: "stick-vacuum",
      pdfUrl: "/manuals/jv85-manual-ar.pdf",
      fileSize: "3.2 MB",
      language: "AR",
      version: "v1.8"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'bed-vacuum', label: 'Bed Vacuum Cleaners' },
    { value: 'stick-vacuum', label: 'Stick Vacuum Cleaners' },
    { value: 'wet-dry-vacuum', label: 'Wet-Dry Vacuum Cleaners' },
    { value: 'hair-styler', label: 'Hair Multi-Stylers' }
  ];

  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manual.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (manual: Manual) => {
    // In a real application, this would trigger the actual download
    console.log(`Downloading ${manual.product} manual...`);
    // For demo purposes, we'll just show an alert
    alert(`Download started for ${manual.product} manual (${manual.fileSize})`);
  };

  const handleVideoWatch = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Instruction Manuals</h1>
          <p className="text-xl text-blue-100">Download user manuals and setup guides for your Jimmy products</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for product manuals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuals.map(manual => (
            <div key={manual.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                    {manual.language}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                    {manual.version}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{manual.product}</h3>
              <p className="text-sm text-gray-600 mb-4">Size: {manual.fileSize}</p>

              <div className="space-y-2">
                <button
                  onClick={() => handleDownload(manual)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>

                {manual.videoUrl && (
                  <button
                    onClick={() => handleVideoWatch(manual.videoUrl!)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <Video className="h-4 w-4" />
                    Watch Setup Video
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredManuals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No manuals found matching your search.</p>
          </div>
        )}

        {/* Quick Setup Tips */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Setup Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Before You Start</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Unbox all components carefully</li>
                <li>• Check that all parts are included</li>
                <li>• Charge the device fully before first use</li>
                <li>• Read safety instructions thoroughly</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Getting Help</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Watch setup videos for visual guidance</li>
                <li>• Contact support for technical issues</li>
                <li>• Keep your manual for future reference</li>
                <li>• Register your product for warranty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="/trouble-shooting"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Troubleshooting Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionManual;
