import React, { useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Search, X, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { formatBanglaNumber } from '../utils/formatters';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    language,
    setCurrentPage,
  } = useShop();

  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 8;

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategoryId !== 'all' && p.category !== selectedCategoryId) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBangla = p.banglaName.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q) || p.banglaDescription.toLowerCase().includes(q);
          if (!matchName && !matchBangla && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.reviews_count || 0) - (a.reviews_count || 0);
      });
  }, [products, selectedCategoryId, searchQuery, sortBy]);

  // Reset page when filter or search changes
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [selectedCategoryId, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPageNum - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPageNum, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPageNum(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      {/* Editorial Minimal Header */}
      <div className="border-b border-neutral-200/70 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2d5016] transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'হোম' : 'Home'}
                </button>
                <span>/</span>
                <span className="text-[#2d5016] font-semibold">
                  {language === 'bn' ? 'পণ্য সম্ভার' : 'Collection'}
                </span>
              </div>
              <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                {language === 'bn' ? 'খাঁটি ও প্রাকৃতিক পণ্য সম্ভার' : 'Artisanal Natural Collection'}
              </h1>
            </div>

            {/* Minimal Search & Sort Bar */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input
                  id="catalog-search-field"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search collection...'}
                  className="w-full pl-8 pr-7 py-2 rounded-full border border-neutral-200 bg-neutral-50/70 hover:bg-white focus:bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#2d5016] transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Minimal Sort Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-200 bg-white text-xs text-neutral-700 shrink-0 shadow-2xs">
                <ArrowUpDown className="w-3 h-3 text-neutral-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-neutral-800 hover:text-neutral-950 focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                  <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                  <option value="price_low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                  <option value="price_high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
                  <option value="rating">{language === 'bn' ? 'রেটিং' : 'Rating'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Minimal Horizontal Category Line */}
          <div className="flex gap-1.5 overflow-x-auto pt-3.5 pb-0.5 no-scrollbar items-center border-t border-neutral-100 mt-3.5">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-[#2d5016] text-[#d4af37] font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {language === 'bn' ? 'সব পণ্য' : 'All Products'} ({formatBanglaNumber(products.length)})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat._id).length;
              const isSelected = selectedCategoryId === cat._id;
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat._id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2d5016] text-[#d4af37] font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-[#2d5016] shrink-0" />
                  <span>{language === 'bn' ? cat.banglaName : cat.name}</span>
                  <span className={isSelected ? 'text-[#d4af37]/80 text-[10px]' : 'text-neutral-400 text-[10px]'}>
                    ({formatBanglaNumber(count)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Subtle Result Stats */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pb-1">
          <span>
            {language === 'bn'
              ? `মোট ${formatBanglaNumber(filteredProducts.length)}টি পণ্যের মধ্যে দেখানো হচ্ছে`
              : `Showing ${paginatedProducts.length} of ${filteredProducts.length} items`}
          </span>
          {totalPages > 1 && (
            <span className="text-[11px] text-neutral-400 font-mono">
              {language === 'bn'
                ? `পৃষ্ঠা ${formatBanglaNumber(currentPageNum)} / ${formatBanglaNumber(totalPages)}`
                : `Page ${currentPageNum} of ${totalPages}`}
            </span>
          )}
        </div>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/70 p-8 max-w-md mx-auto shadow-2xs">
            <p className="text-sm font-semibold text-neutral-900 mb-1">
              {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
            </p>
            <p className="text-xs text-neutral-500 mb-4">
              {language === 'bn'
                ? 'অন্য কোনো নাম দিয়ে সার্চ করুন অথবা সব পণ্য ক্যাটাগরি সিলেক্ট করুন।'
                : 'Try searching with different keywords.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#2d5016] text-[#d4af37] text-xs font-semibold hover:bg-[#234011] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সব পণ্য দেখুন' : 'View all products'}
            </button>
          </div>
        )}

        {/* Minimal Responsive Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-8 pb-4">
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
    </div>
  );
};

