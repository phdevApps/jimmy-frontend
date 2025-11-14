
import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedBlogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Bed Vacuum Cleaning: UV Technology Explained',
      excerpt: 'Discover how advanced UV sterilization and high-temperature cleaning can eliminate 99.9% of dust mites, allergens, and bacteria from your mattress for healthier sleep.',
      image: 'https://jimmy.eu/cdn/shop/files/JIMMY_JV35_UV_Bed_Vacuum_-2800_1200-2.jpg?v=1737450830',
      date: 'March 15, 2024',
      author: 'Dr. Sarah Mitchell',
      category: 'Health & Wellness',
      slug: 'ultimate-guide-bed-vacuum-cleaning',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Professional Hair Styling at Home: Master the HF9 Multi-styler',
      excerpt: 'Learn professional techniques and styling tips to achieve salon-quality results with the Jimmy HF9 Hair Multi-styler. Transform your daily routine.',
      image: 'https://jimmy.eu/cdn/shop/files/Jimmy_HF9_Hair_Multi-styler_Banner-250108-2800-1.jpg?v=1736325797',
      date: 'March 12, 2024',
      author: 'Emma Rodriguez',
      category: 'Beauty Tips',
      slug: 'hair-styling-professional-tips',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Cordless vs Corded Vacuum Cleaners: Complete Buyer\'s Guide 2024',
      excerpt: 'Compare the benefits, performance, and features of cordless and corded vacuum cleaners to find the perfect cleaning solution for your home needs.',
      image: 'https://jimmy.eu/cdn/shop/files/JIMMY_H10_Flex_Cordless_Stick_Vacuum_Cleaner-2800-1200-0220.jpg?v=1708414372',
      date: 'March 8, 2024',
      author: 'Mark Thompson',
      category: 'Product Guide',
      slug: 'cordless-vs-corded-vacuum-guide',
      readTime: '10 min read'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest News & Guides
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with expert tips, product guides, and the latest innovations in home cleaning technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blogs/news/${post.slug}`} className="group">
              <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                {/* Featured Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </span>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link to="/blogs/news">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              View All Articles
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
