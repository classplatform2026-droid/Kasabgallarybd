import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatBDT } from '../utils/formatters';
import { ShoppingBag, Eye, Star, MessageCircle, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    openCheckoutDrawer,
    setSelectedProduct,
    setCurrentPage,
    setQuickViewProduct,
    language,
    generateWhatsAppOrderUrl,
  } = useShop();

  const handleProductClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCheckoutDrawer(product);
  };

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppOrderUrl([], undefined, product);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`product-card-${product._id}`}
      onClick={handleProductClick}
      className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-[#1e3a15]/30 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* 1. PRODUCT IMAGERY CONTAINER (4:3 Luxury Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full bg-[#f6f4ee] overflow-hidden">
        <img
          src={product.image}
          alt={language === 'bn' ? product.banglaName : product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quiet Top Text Tag (Max 1 subtle text mark, no pill clutter) */}
        {product.sunnah_certified && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#1e3a15] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs">
              {language === 'bn' ? '১০০% খাঁটি' : 'Pure Organic'}
            </span>
          </div>
        )}

        {/* Quick View Floating Button */}
        <button
          type="button"
          onClick={handleQuickView}
          id={`quick-view-btn-${product._id}`}
          className="absolute right-2.5 top-2.5 p-2 rounded-full bg-white/95 hover:bg-white text-neutral-700 hover:text-[#1e3a15] shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          title={language === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Out of Stock Scrim */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold">
              {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-bold text-neutral-800 text-[11px] tabular-nums font-mono">
              {product.rating.toFixed(1)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[10px] text-neutral-400">
              ({product.reviews_count} {language === 'bn' ? 'রিভিউ' : 'reviews'})
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#1e3a15] transition-colors">
            {language === 'bn' ? product.banglaName : product.name}
          </h3>

          <p className="text-[11px] text-neutral-400 font-medium line-clamp-1">
            {language === 'bn' ? product.name : product.banglaName}
          </p>
        </div>

        {/* 3. PRICE & ACTIONS */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100">
          <div className="flex items-baseline justify-between gap-1 mb-2.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-[#1e3a15] font-mono tabular-nums">
                {formatBDT(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-mono tabular-nums">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold text-[#1e3a15] font-mono">
                -৳{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Quick Buy & Action Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Quick Buy (Opens Express Drawer) */}
            <button
              type="button"
              onClick={handleQuickBuy}
              disabled={!product.available}
              className="col-span-3 min-h-[38px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#1e3a15] hover:bg-[#152a0f] disabled:bg-neutral-300 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
            </button>

            {/* Add to Cart / WhatsApp */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.available}
              title={language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
              className="col-span-1 min-h-[38px] flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-[#1e3a15]/10 text-neutral-700 hover:text-[#1e3a15] transition-all cursor-pointer active:scale-95 border border-neutral-200"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
