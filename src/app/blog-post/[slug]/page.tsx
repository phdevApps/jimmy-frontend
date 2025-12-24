"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  readTime: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock blog post data - in real app, fetch from API
    const mockPost: BlogPost = {
      id: 1,
      title: "Why Choose Jimmy PW11 Pro Max 5-in-1 Cordless Wet & Dry Vacuum Cleaner",
      content: `
        <div class="prose prose-lg max-w-none">
          <p>The Jimmy PW11 Pro Max represents the pinnacle of cleaning technology, combining powerful suction with intelligent design to deliver an unmatched cleaning experience. This revolutionary 5-in-1 cordless wet and dry vacuum cleaner is engineered to handle every cleaning challenge in your home.</p>
          
          <h2>Unparalleled Cleaning Performance</h2>
          <p>With its advanced motor technology, the PW11 Pro Max delivers consistent, powerful suction that adapts to different surfaces automatically. Whether you're dealing with fine dust on hardwood floors or embedded dirt in carpets, this vacuum adjusts its power to provide optimal cleaning results.</p>
          
          <h2>5-in-1 Versatility</h2>
          <ul>
            <li><strong>Stick Vacuum:</strong> Perfect for quick daily cleanups and reaching high places</li>
            <li><strong>Handheld Vacuum:</strong> Ideal for stairs, car interiors, and furniture</li>
            <li><strong>Wet Cleaning:</strong> Handles spills and wet messes with ease</li>
            <li><strong>Dry Cleaning:</strong> Traditional vacuuming for dust and debris</li>
            <li><strong>Mopping Function:</strong> Combines vacuuming with mopping for complete floor care</li>
          </ul>
          
          <h2>Smart Technology Integration</h2>
          <p>The PW11 Pro Max features intelligent LED display that shows real-time performance metrics, battery status, and maintenance reminders. The smart sensor technology automatically adjusts suction power based on the surface type and debris density.</p>
          
          <h2>Long-Lasting Battery Life</h2>
          <p>Equipped with a high-capacity lithium battery, the PW11 Pro Max provides up to 45 minutes of continuous cleaning on a single charge. The fast-charging technology ensures you're never waiting long to get back to cleaning.</p>
          
          <h2>Advanced Filtration System</h2>
          <p>The multi-stage HEPA filtration system captures 99.97% of particles as small as 0.3 microns, ensuring that allergens, dust mites, and microscopic particles are trapped and not released back into your home's air.</p>
        </div>
      `,
      excerpt: "Discover why the Jimmy PW11 Pro Max is the ultimate cleaning solution for modern homes.",
      author: "Jimmy Team",
      date: "2024-01-15",
      image: "https://jimmy.eu/cdn/shop/files/PW11_Series_Cordless_Wet_Dry_Vacuum_Cleaner-2800-240801.jpg?v=1722501511",
      tags: ["Vacuum Cleaner", "Technology", "Home Cleaning", "PW11 Pro Max"],
      readTime: "5 min read"
    };

    setPost(mockPost);
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blogs/news" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        canonical={window.location.href}
        image={post.image}
      />

      <article className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blogs/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <span>{post.readTime}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="aspect-video rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Related Posts */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    <Link href="#" className="block group">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Complete Guide to Vacuum Maintenance
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">3 min read</p>
                    </Link>
                    <Link href="#" className="block group">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Best Cleaning Tips for Pet Owners
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">4 min read</p>
                    </Link>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the latest cleaning tips and product updates.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
