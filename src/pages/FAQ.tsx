
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How do I use the bed vacuum cleaner?",
      answer: "Simply turn on the device, select your preferred mode, and slowly move it across your bedding. The UV light will sanitize while the suction removes dust mites and allergens.",
      category: "product-usage"
    },
    {
      id: 2,
      question: "What is the warranty period for Jimmy products?",
      answer: "All Jimmy products come with a 2-year manufacturer warranty covering defects in materials and workmanship.",
      category: "warranty"
    },
    {
      id: 3,
      question: "How often should I replace the filters?",
      answer: "We recommend replacing HEPA filters every 6-12 months depending on usage frequency. You'll receive a notification when it's time to replace.",
      category: "maintenance"
    },
    {
      id: 4,
      question: "Can I use the wet-dry vacuum on all floor types?",
      answer: "Yes, our wet-dry vacuums are designed to work safely on all floor types including hardwood, tile, carpet, and laminate.",
      category: "product-usage"
    },
    {
      id: 5,
      question: "How do I track my order?",
      answer: "You can track your order using the tracking number sent to your email, or visit our order tracking page.",
      category: "shipping"
    },
    {
      id: 6,
      question: "What's included in the box?",
      answer: "Each product comes with the main unit, charging dock, accessories, user manual, and warranty card. Specific contents vary by model.",
      category: "product-info"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'product-usage', label: 'Product Usage' },
    { value: 'warranty', label: 'Warranty' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'product-info', label: 'Product Information' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">Find answers to common questions about Jimmy products</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
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

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                {openItems.includes(faq.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Contact our support team.</p>
          <a
            href="/pages/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
