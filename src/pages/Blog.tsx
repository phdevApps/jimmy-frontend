
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { useYoastSeo } from '../hooks/useYoastSeo';
import { getHomePageSeo } from '../services/wooCommerceApi';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

interface BlogPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media?: string;
  date: string;
  slug: string;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
    }>>;
  };
}

const Blog = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [paginatedPosts, setPaginatedPosts] = useState<BlogPost[]>([]);
  const [homePageSeo, setHomePageSeo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching blog posts from WordPress API...');
        
        // Fetch posts with embedded media and categories
        const response = await fetch('https://uae.jimmy.me/wp-json/wp/v2/posts?_embed&per_page=50');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log('Fetched blog posts:', posts);
        
        setAllPosts(posts);
        setError(null);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
        // Fallback to static data if API fails
        setAllPosts([
          {
            id: 1,
            title: { rendered: "How to Deep Clean Your Home with Professional Vacuum Cleaners" },
            excerpt: { rendered: "Discover the secrets to achieving a professional-level clean with our range of vacuum cleaners." },
            date: "2025-01-15T00:00:00",
            slug: "how-to-deep-clean-your-home",
            categories: [1]
          },
          {
            id: 2,
            title: { rendered: "The Science Behind UV Cleaning Technology" },
            excerpt: { rendered: "Learn how UV technology in our bed vacuum cleaners eliminates bacteria and allergens." },
            date: "2025-01-10T00:00:00",
            slug: "science-behind-uv-cleaning-technology",
            categories: [2]
          }
        ] as BlogPost[]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSeoData = async () => {
      try {
        const seoData = await getHomePageSeo();
        setHomePageSeo(seoData);
      } catch (error) {
        console.error('Error fetching blog SEO data:', error);
      }
    };

    fetchPosts();
    fetchSeoData();
  }, []);

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setPaginatedPosts(allPosts.slice(startIndex, endIndex));
  }, [allPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPostImage = (post: BlogPost) => {
    if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return "https://uae.jimmy.me/cdn/shop/articles/blog-post-1.jpg?v=1736926396&width=400";
  };

  const getPostCategory = (post: BlogPost) => {
    if (post._embedded?.['wp:term']?.[0]?.[0]?.name) {
      return post._embedded['wp:term'][0][0].name;
    }
    return "News";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis after first page if current page is far from start
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis before last page if current page is far from end
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // SEO configuration for blog page
  const seoData = useYoastSeo({
    yoastData: homePageSeo,
    fallbackTitle: 'Blog & News',
    fallbackDescription: 'Stay updated with the latest cleaning tips, product news, and technology insights from Jimmy',
    fallbackCanonical: window.location.href
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Jimmy Blog & News</h1>
            <p className="text-xl text-blue-100">Stay updated with the latest cleaning tips, product news, and technology insights</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo {...seoData} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Jimmy Blog & News</h1>
            <p className="text-xl text-blue-100">Stay updated with the latest cleaning tips, product news, and technology insights</p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {((currentPage - 1) * postsPerPage) + 1}-{Math.min(currentPage * postsPerPage, allPosts.length)} of {allPosts.length} articles
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{error}. Showing sample content.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <Link key={post.id} to={`/blogs/news/${post.slug}`}>
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={getPostImage(post)}
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                        {getPostCategory(post)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        5 min read
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title.rendered}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                    <div className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
