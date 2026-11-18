import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { BlogPost } from '../types';
import { 
  Clock, 
  ArrowRight, 
  Calendar, 
  Search, 
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';
import { formatBanglaNumber } from '../utils/formatters';

export const BlogView: React.FC = () => {
  const { blogs, setSelectedBlog, setCurrentPage, language } = useShop();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchBlog, setSearchBlog] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const postsPerPage = 6;

  const allTags = useMemo(() => {
    return Array.from(new Set(blogs.flatMap((b) => b.tags)));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (selectedTag !== 'all' && !b.tags.includes(selectedTag)) {
        return false;
      }
      if (searchBlog.trim()) {
        const q = searchBlog.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.banglaTitle.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.banglaExcerpt.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [blogs, selectedTag, searchBlog]);

  // Reset page when tag or search changes
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [selectedTag, searchBlog]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / postsPerPage));
  const paginatedBlogs = useMemo(() => {
    const start = (currentPageNum - 1) * postsPerPage;
    return filteredBlogs.slice(start, start + postsPerPage);
  }, [filteredBlogs, currentPageNum, postsPerPage]);

  const handleReadBlog = (post: BlogPost) => {
    setSelectedBlog(post);
    setCurrentPage('blog_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (p: number) => {
    setCurrentPageNum(p);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // When on first page without search/filter, lead with first post as featured editorial
  const isFirstPageGeneral = currentPageNum === 1 && selectedTag === 'all' && !searchBlog.trim();
  const featuredPost = isFirstPageGeneral ? paginatedBlogs[0] : null;
  const listPosts = isFirstPageGeneral ? paginatedBlogs.slice(1) : paginatedBlogs;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Minimal Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-neutral-400">
        <button 
          onClick={() => setCurrentPage('home')}
          className="hover:text-[#2d5016] transition-colors cursor-pointer font-medium"
        >
          {language === 'bn' ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span className="text-[#2d5016] font-semibold">
          {language === 'bn' ? 'Kasab Gallery Journal' : 'Journal'}
        </span>
      </nav>

      {/* Editorial Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-neutral-200/60 pb-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2d5016] uppercase tracking-widest">
            <span className="w-2 h-0.5 bg-[#2d5016]" />
            <span>{language === 'bn' ? 'Kasab Gallery Editorial' : 'Kasab Editorial'}</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
            {language === 'bn' ? 'প্রাকৃতিক পুষ্টি ও সুন্নাহ জীবনধারা' : 'Wellness, Purity & Mindful Living'}
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {language === 'bn'
              ? 'খাঁটি মধু, ভেষজ উপাদান ও প্রাকৃতিক পথ্যের গবেষণাধর্মী স্বাস্থ্য বিষয়ক প্রবন্ধ।'
              : 'Insights into organic superfoods, sunnah remedies, and holistic natural well-being.'}
          </p>
        </div>

        {/* Minimal Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            value={searchBlog}
            onChange={(e) => setSearchBlog(e.target.value)}
            placeholder={language === 'bn' ? 'নিবন্ধ খুঁজুন...' : 'Search articles...'}
            className="w-full pl-8 pr-7 py-2 rounded-full border border-neutral-200 bg-neutral-50/60 hover:bg-white focus:bg-white text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#2d5016] transition-colors shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          {searchBlog && (
            <button
              onClick={() => setSearchBlog('')}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Minimal Topic Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
            selectedTag === 'all'
              ? 'bg-[#2d5016] text-[#d4af37] font-semibold shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
          }`}
        >
          {language === 'bn' ? 'সব প্রবন্ধ' : 'All Articles'}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              selectedTag === tag
                ? 'bg-[#2d5016] text-[#d4af37] font-semibold shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* If No Articles Found */}
      {filteredBlogs.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-neutral-200 bg-white p-8 max-w-md mx-auto shadow-2xs space-y-3">
          <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="font-serif-brand text-base font-bold text-neutral-900">
            {language === 'bn' ? 'কোনো নিবন্ধ পাওয়া যায়নি' : 'No articles found'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'bn' ? 'ভিন্ন শব্দ দিয়ে খুঁজুন বা ফিল্টার রিসেট করুন।' : 'Try another query or clear the filter.'}
          </p>
          <button
            onClick={() => {
              setSearchBlog('');
              setSelectedTag('all');
            }}
            className="px-4 py-2 rounded-full bg-[#2d5016] text-[#d4af37] text-xs font-semibold hover:bg-[#234011] transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filter'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Editorial Post */}
          {featuredPost && (
            <article
              onClick={() => handleReadBlog(featuredPost)}
              className="group cursor-pointer rounded-3xl border border-neutral-200/70 bg-white hover:border-[#2d5016]/40 hover:shadow-md transition-all overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch"
            >
              <div className="md:col-span-7 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-neutral-100">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[#d4af37] text-[10px] font-bold tracking-wider">
                  {language === 'bn' ? featuredPost.banglaCategoryName : featuredPost.categoryName}
                </span>
              </div>

              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {featuredPost.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {language === 'bn' ? featuredPost.banglaReadTime : featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-[#2d5016] transition-colors leading-snug">
                    {language === 'bn' ? featuredPost.banglaTitle : featuredPost.title}
                  </h2>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {language === 'bn' ? featuredPost.banglaExcerpt : featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">
                    {featuredPost.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d5016] group-hover:translate-x-1 transition-transform">
                    <span>{language === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Minimal Grid of Articles */}
          {listPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listPosts.map((post) => (
                <article
                  key={post._id}
                  onClick={() => handleReadBlog(post)}
                  className="group cursor-pointer rounded-2xl border border-neutral-200/70 bg-white hover:border-[#2d5016]/40 hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-neutral-900/80 backdrop-blur-xs text-[#d4af37] text-[10px] font-bold">
                        {language === 'bn' ? post.banglaCategoryName : post.categoryName}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>{post.publishedDate}</span>
                        <span>•</span>
                        <span>{language === 'bn' ? post.banglaReadTime : post.readTime}</span>
                      </div>

                      <h3 className="font-serif-brand text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#2d5016] transition-colors leading-snug line-clamp-2">
                        {language === 'bn' ? post.banglaTitle : post.title}
                      </h3>

                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {language === 'bn' ? post.banglaExcerpt : post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {post.author}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#2d5016] group-hover:translate-x-0.5 transition-transform text-xs">
                      <span>{language === 'bn' ? 'পড়ুন' : 'Read'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Minimal Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
                disabled={currentPageNum === 1}
                className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    currentPageNum === page
                      ? 'bg-[#2d5016] text-[#d4af37] font-bold shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {language === 'bn' ? formatBanglaNumber(page) : page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPageNum + 1))}
                disabled={currentPageNum === totalPages}
                className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

