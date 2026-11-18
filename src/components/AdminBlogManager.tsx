import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BlogPost, BlogCategory } from '../types';
import {
  PenTool,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ImageIcon,
  Check,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  X,
  Sparkles,
  Star,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Globe,
  FileText,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import { RichTextRenderer } from './RichTextRenderer';
import { WysiwygEditor } from './WysiwygEditor';

const BLOG_CATEGORIES: { id: BlogCategory; bn: string; en: string }[] = [
  { id: 'honey_guide', bn: 'মধু ও পুষ্টি গাইড', en: 'Honey & Nutrition' },
  { id: 'sunnah_health', bn: 'সুন্নাহ ও প্রাকৃতিক স্বাস্থ্য', en: 'Sunnah & Natural Health' },
  { id: 'halal_lifestyle', bn: 'হালাল লাইফস্টাইল', en: 'Halal Lifestyle' },
  { id: 'skincare_tips', bn: 'প্রাকৃতিক রূপচর্চা ও ত্বক', en: 'Organic Skincare & Care' },
];

const PRESET_COVERS = [
  {
    label: 'খাঁটি মধু',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'মদিনা আজওয়া',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'কালোজিরা ও তেল',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'অলিভ ও হার্বাল',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'ভেষজ চা ও আয়ুর্বেদ',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
  },
];

const SUGGESTED_TAGS = [
  'মধু',
  'খাঁটি মধু পরীক্ষা',
  'আজওয়া খেজুর',
  'কালোজিরা',
  'সুন্নাহ স্বাস্থ্য',
  'প্রাকৃতিক পুষ্টি',
  'রোগ প্রতিরোধ',
  'অর্গানিক ত্বকের যত্ন',
  'হজম শক্তি',
  'সরিষার তেল',
];

interface AdminBlogManagerProps {
  onBackToDashboard?: () => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ onBackToDashboard }) => {
  const {
    blogs,
    products,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setSelectedBlog,
    setCurrentPage,
    showToast,
  } = useShop();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | 'all'>('all');

  // Pagination for Blog Posts
  const [blogPage, setBlogPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);

  // Full-screen 3-Step Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1);
  const [showEnglishSection, setShowEnglishSection] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Delete Confirmation Modal
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Form Fields
  const [banglaTitle, setBanglaTitle] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [banglaExcerpt, setBanglaExcerpt] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [banglaContent, setBanglaContent] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogCategory>('honey_guide');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Kasab Gallery Research Team');
  const [banglaAuthorRole, setBanglaAuthorRole] = useState('খাদ্য পুষ্টিবিদ ও স্বাস্থ্য গবেষক');
  const [authorRole, setAuthorRole] = useState('Nutrition & Wellness Specialist');
  const [publishedDate, setPublishedDate] = useState('');
  const [banglaReadTime, setBanglaReadTime] = useState('৪ মিনিট পড়ার সময়');
  const [readTime, setReadTime] = useState('4 min read');
  const [featured, setFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);

  // Get current Bengali formatted date
  const getTodayBanglaDate = () => {
    const now = new Date();
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const toBnDigits = (num: number) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().split('').map(d => bnDigits[parseInt(d, 10)] || d).join('');
    };
    return `${month} ${toBnDigits(day)}, ${toBnDigits(year)}`;
  };

  // Open Create Modal in Full-screen Step 1
  const handleOpenCreate = () => {
    setEditingPostId(null);
    setBanglaTitle('');
    setTitle('');
    setSlug('');
    setBanglaExcerpt('');
    setExcerpt('');
    setBanglaContent('');
    setContent('');
    setCategory('honey_guide');
    setImage(PRESET_COVERS[0].url);
    setAuthor('Kasab Gallery Research Team');
    setBanglaAuthorRole('খাদ্য পুষ্টিবিদ ও স্বাস্থ্য গবেষক');
    setAuthorRole('Nutrition & Wellness Specialist');
    setPublishedDate(getTodayBanglaDate());
    setBanglaReadTime('৪ মিনিট পড়ার সময়');
    setReadTime('4 min read');
    setFeatured(false);
    setTagsInput('মধু, প্রাকৃতিক খাদ্য, পুষ্টি');
    setRelatedProductIds(products.slice(0, 2).map((p) => p._id));
    setEditorStep(1);
    setShowEnglishSection(false);
    setIsPreviewOpen(false);
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPostId(post._id);
    setBanglaTitle(post.banglaTitle);
    setTitle(post.title);
    setSlug(post.slug);
    setBanglaExcerpt(post.banglaExcerpt);
    setExcerpt(post.excerpt);
    setBanglaContent(post.banglaContent);
    setContent(post.content);
    setCategory(post.category);
    setImage(post.image);
    setAuthor(post.author);
    setBanglaAuthorRole(post.banglaAuthorRole || 'খাদ্য পুষ্টিবিদ ও গবেষক');
    setAuthorRole(post.authorRole || 'Nutrition Specialist');
    setPublishedDate(post.publishedDate);
    setBanglaReadTime(post.banglaReadTime);
    setReadTime(post.readTime);
    setFeatured(!!post.featured);
    setTagsInput(post.tags.join(', '));
    setRelatedProductIds(post.relatedProductIds || []);
    setEditorStep(1);
    setShowEnglishSection(Boolean(post.title && post.title !== post.banglaTitle));
    setIsPreviewOpen(false);
    setIsEditorOpen(true);
  };

  // Auto calculate reading time based on content length
  const calculateReadingTime = (htmlContent: string) => {
    const plainText = htmlContent.replace(/<[^>]*>/g, ' ').trim();
    const words = plainText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 140));
    
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const bnMin = minutes.toString().split('').map(d => bnDigits[parseInt(d, 10)] || d).join('');
    
    return {
      bn: `${bnMin} মিনিট পড়ার সময়`,
      en: `${minutes} min read`
    };
  };

  // Auto generate slug from title
  const handleGenerateSlug = () => {
    const source = title || banglaTitle;
    const generated = source
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated || `kasab-article-${Date.now()}`);
  };

  // Auto extract excerpt from article content
  const handleAutoExtractExcerpt = () => {
    const plainText = banglaContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!plainText) {
      showToast('আগে ১ম ধাপে আপনার আর্টিকেলের কিছু লেখা লিখুন');
      return;
    }
    const excerptText = plainText.slice(0, 140) + (plainText.length > 140 ? '...' : '');
    setBanglaExcerpt(excerptText);
    showToast('মূল লেখা থেকে সংক্ষিপ্ত সারসংক্ষেপ তৈরি হয়েছে!');
  };

  // Save Blog Post (Create or Update)
  const handleSavePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const plainContent = banglaContent.replace(/<[^>]*>/g, '').trim();
    if (!plainContent) {
      showToast('অনুগ্রহ করে ধাপ ১ এ আর্টিকেলের মূল লেখা লিখুন');
      setEditorStep(1);
      return;
    }

    if (!banglaTitle.trim()) {
      showToast('অনুগ্রহ করে ধাপ ২ এ আর্টিকেলের বাংলা শিরোনাম দিন');
      setEditorStep(2);
      return;
    }

    const selectedCategoryObj = BLOG_CATEGORIES.find((c) => c.id === category) || BLOG_CATEGORIES[0];

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const fallbackExcerpt = plainContent.slice(0, 140) + (plainContent.length > 140 ? '...' : '');
    const calculatedReadTime = calculateReadingTime(banglaContent);

    const postPayload: Omit<BlogPost, '_id'> = {
      title: title.trim() || banglaTitle.trim(),
      banglaTitle: banglaTitle.trim(),
      slug: slug.trim() || `kasab-blog-${Date.now()}`,
      excerpt: excerpt.trim() || banglaExcerpt.trim().slice(0, 140) || fallbackExcerpt,
      banglaExcerpt: banglaExcerpt.trim() || fallbackExcerpt,
      content: content.trim() || banglaContent.trim(),
      banglaContent: banglaContent.trim(),
      category: category,
      categoryName: selectedCategoryObj.en,
      banglaCategoryName: selectedCategoryObj.bn,
      image: image.trim() || PRESET_COVERS[0].url,
      author: author.trim() || 'Kasab Gallery Research Team',
      authorRole: authorRole.trim() || 'Nutrition Specialist',
      banglaAuthorRole: banglaAuthorRole.trim() || 'খাদ্য পুষ্টিবিদ ও স্বাস্থ্য গবেষক',
      publishedDate: publishedDate.trim() || getTodayBanglaDate(),
      readTime: readTime.trim() || calculatedReadTime.en,
      banglaReadTime: banglaReadTime.trim() || calculatedReadTime.bn,
      featured: featured,
      tags: tagsArray.length > 0 ? tagsArray : ['প্রাকৃতিক খাদ্য', 'স্বাস্থ্য'],
      relatedProductIds: relatedProductIds,
    };

    if (editingPostId) {
      await updateBlogPost(editingPostId, postPayload);
      showToast('ব্লগ আর্টিকেল সফলভাবে আপডেট করা হয়েছে!');
    } else {
      await addBlogPost(postPayload);
      showToast('নতুন ব্লগ আর্টিকেল সফলভাবে পাবলিশ হয়েছে!');
    }

    setIsEditorOpen(false);
  };

  // Quick toggle featured status directly from table
  const handleToggleFeatured = async (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateBlogPost(post._id, { featured: !post.featured });
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await deleteBlogPost(postToDelete._id);
      setPostToDelete(null);
    }
  };

  // View post live in client view
  const handleViewLive = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBlog(post);
    setCurrentPage('blog_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Blogs
  const filteredBlogs = blogs.filter((b) => {
    if (categoryFilter !== 'all' && b.category !== categoryFilter) {
      return false;
    }
    if (featuredFilter !== 'all' && Boolean(b.featured) !== featuredFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBnTitle = b.banglaTitle.toLowerCase().includes(q);
      const matchEnTitle = b.title.toLowerCase().includes(q);
      const matchAuthor = b.author.toLowerCase().includes(q);
      const matchTags = b.tags?.some((t) => t.toLowerCase().includes(q));
      return matchBnTitle || matchEnTitle || matchAuthor || matchTags;
    }
    return true;
  });

  const totalBlogPages = Math.ceil(filteredBlogs.length / blogsPerPage) || 1;
  const currentBlogPage = Math.min(blogPage, totalBlogPages);
  const paginatedBlogs = filteredBlogs.slice(
    (currentBlogPage - 1) * blogsPerPage,
    currentBlogPage * blogsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="p-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                title="ড্যাশবোর্ডে ফিরুন"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-[#2d5016] text-[#d4af37] flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-neutral-900">
                ব্লগ ও নলেজ হাব কন্ট্রোল (Blog Management)
              </h2>
              <p className="text-xs text-neutral-500">
                Kasab Gallery-র পুষ্টি গাইড, সুন্নাহ স্বাস্থ্য ও ইসলামিক লাইফস্টাইল আর্টিকেল পরিচালনা করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>নতুন ব্লগ আর্টিকেল লিখুন</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-5">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setBlogPage(1);
              }}
              placeholder="আর্টিকেলের শিরোনাম, লেখক বা ট্যাগ দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-neutral-200 text-xs sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-[#2d5016] transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setBlogPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200 text-xs sm:text-sm bg-white cursor-pointer focus:outline-none focus:border-[#2d5016]"
            >
              <option value="all">সব ক্যাটাগরি ({blogs.length})</option>
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.bn}
                </option>
              ))}
            </select>
          </div>

          {/* Featured filter */}
          <div className="sm:col-span-3">
            <select
              value={featuredFilter === 'all' ? 'all' : featuredFilter ? 'featured' : 'standard'}
              onChange={(e) => {
                if (e.target.value === 'all') setFeaturedFilter('all');
                else if (e.target.value === 'featured') setFeaturedFilter(true);
                else setFeaturedFilter(false);
                setBlogPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200 text-xs sm:text-sm bg-white cursor-pointer focus:outline-none focus:border-[#2d5016]"
            >
              <option value="all">সকল পোস্ট</option>
              <option value="featured">ফিচার্ড আর্টিকেল</option>
              <option value="standard">সাধারণ আর্টিকেল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Article Cards */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif-brand text-base font-bold text-neutral-900">
            কোনো ব্লগ আর্টিকেল পাওয়া যায়নি
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            আপনার ফিল্টারের সাথে মিলে এমন কোনো ব্লগ নেই, অথবা এখনো কোনো ব্লগ লেখা হয়নি।
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 rounded-xl bg-[#2d5016] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>নতুন ব্লগ তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedBlogs.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Cover Image & Category Badges */}
                <div className="relative aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.banglaTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {post.banglaCategoryName || post.categoryName}
                    </span>
                  </div>

                  {/* Featured Badge Toggle */}
                  <button
                    onClick={(e) => handleToggleFeatured(post, e)}
                    title={post.featured ? 'ফিচার্ড স্ট্যাটাস বন্ধ করুন' : 'হোম ফিচার্ড করুন'}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      post.featured
                        ? 'bg-[#d4af37] text-neutral-900 shadow-sm'
                        : 'bg-black/50 text-white/80 hover:bg-black/80 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${post.featured ? 'fill-neutral-900' : ''}`} />
                  </button>

                  {/* Reading Time */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.banglaReadTime || post.readTime}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      <span>{post.publishedDate}</span>
                      <span>•</span>
                      <span className="truncate max-w-[140px] text-neutral-600 font-medium">
                        {post.author}
                      </span>
                    </div>

                    <h3 className="font-serif-brand font-bold text-base text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#2d5016] transition-colors">
                      {post.banglaTitle}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {post.banglaExcerpt || post.excerpt}
                    </p>
                  </div>

                  {/* Tags Strip */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-neutral-100">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[10px] text-neutral-400">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#2d5016] hover:text-white text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>

                      <button
                        onClick={(e) => handleViewLive(post, e)}
                        className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-[#2d5016] transition-colors cursor-pointer"
                        title="ওয়েবসাইটে সরাসরি দেখুন"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => setPostToDelete(post)}
                      className="p-1.5 rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="ব্লগ মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalBlogPages > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-neutral-500 font-medium">
                মোট <strong className="text-neutral-900">{filteredBlogs.length}</strong>টি পোস্টের মধ্যে{' '}
                <strong className="text-neutral-900">
                  {(currentBlogPage - 1) * blogsPerPage + 1}-{Math.min(currentBlogPage * blogsPerPage, filteredBlogs.length)}
                </strong>{' '}
                দেখানো হচ্ছে
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBlogPage((p) => Math.max(1, p - 1))}
                  disabled={currentBlogPage === 1}
                  className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors cursor-pointer"
                  title="আগের পৃষ্ঠা"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalBlogPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBlogPage(num)}
                      className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentBlogPage === num
                          ? 'bg-[#2d5016] text-[#d4af37] shadow-2xs font-black'
                          : 'text-neutral-700 hover:bg-neutral-100 border border-transparent'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setBlogPage((p) => Math.min(totalBlogPages, p + 1))}
                  disabled={currentBlogPage === totalBlogPages}
                  className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors cursor-pointer"
                  title="পরের পৃষ্ঠা"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Per page selector */}
                <select
                  value={blogsPerPage}
                  onChange={(e) => {
                    setBlogsPerPage(Number(e.target.value));
                    setBlogPage(1);
                  }}
                  className="ml-2 px-2 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-700 outline-none cursor-pointer"
                >
                  <option value={6}>প্রতি পৃষ্ঠায় ৬টি</option>
                  <option value={12}>প্রতি পৃষ্ঠায় ১২টি</option>
                  <option value={24}>প্রতি পৃষ্ঠায় ২৪টি</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL-SCREEN 3-STEP MINIMAL BLOG WRITING SECTION */}
      {/* ========================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf9f5] flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200">
          
          {/* Top Navigation & Action Bar (Only top buttons!) */}
          <header className="h-14 px-3 sm:px-6 bg-white border-b border-neutral-200/90 flex items-center justify-between shrink-0 z-30 shadow-2xs">
            {/* Left: Close button and Previous Step */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 sm:px-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors border border-transparent hover:border-neutral-200"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">বন্ধ করুন</span>
              </button>

              {editorStep > 1 && (
                <button
                  type="button"
                  onClick={() => setEditorStep((prev) => (prev === 3 ? 2 : 1))}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>আগের ধাপ</span>
                </button>
              )}
            </div>

            {/* Center: Current Step Title */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-bold text-neutral-800">
                {editorStep === 1
                  ? '১. মূল লেখা'
                  : editorStep === 2
                  ? '২. শিরোনাম ও কভার ফটো'
                  : '৩. ইংরেজি সংস্করণ (ঐচ্ছিক)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] text-neutral-500 font-mono font-bold">
                {editorStep}/৩
              </span>
            </div>

            {/* Right: Preview & Next / Publish Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="p-1.5 sm:px-3 rounded-xl border border-neutral-200 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-neutral-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="লাইভ প্রিভিউ দেখুন"
              >
                <Eye className="w-3.5 h-3.5 text-[#2d5016]" />
                <span className="hidden md:inline">প্রিভিউ</span>
              </button>

              {editorStep === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const plain = banglaContent.replace(/<[^>]*>/g, '').trim();
                    if (!plain) {
                      showToast('অনুগ্রহ করে আর্টিকেলের কিছু লেখা লিখুন');
                      return;
                    }
                    setEditorStep(2);
                  }}
                  className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <span>পরবর্তী ধাপ</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                </button>
              )}

              {editorStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSavePost()}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016]/10 text-xs font-bold cursor-pointer transition-colors"
                  >
                    সরাসরি পাবলিশ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!banglaTitle.trim()) {
                        showToast('অনুগ্রহ করে আর্টিকেলের বাংলা শিরোনাম দিন');
                        return;
                      }
                      setEditorStep(3);
                    }}
                    className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    <span>পরবর্তী: ইংরেজি</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </button>
                </>
              )}

              {editorStep === 3 && (
                <button
                  type="button"
                  onClick={() => handleSavePost()}
                  className="px-4 py-1.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{editingPostId ? 'সংরক্ষণ করুন' : 'পাবলিশ করুন'}</span>
                </button>
              )}
            </div>
          </header>

          {/* ======================================================= */}
          {/* STEP 1: FULL SCREEN VISUAL WRITING PAGE (NO **BOLD**) */}
          {/* ======================================================= */}
          {editorStep === 1 && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="max-w-4xl w-full mx-auto p-3 sm:p-6 flex-1 flex flex-col">
                
                {/* The Full-Screen WYSIWYG Editor Canvas */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
                  <WysiwygEditor
                    value={banglaContent}
                    onChange={(newHtml) => setBanglaContent(newHtml)}
                    placeholder="এখানে আপনার সম্পূর্ণ ব্লগের লেখা শুরু করুন... (লেখা সিলেক্ট করে ওপরে বোল্ড বা ইটালিক বাটনে চাপ দিন)"
                    minHeight="min-h-[70vh]"
                  />
                </div>

              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* STEP 2: TITLE, COVER PHOTO & EXCERPT SECTION */}
          {/* ======================================================= */}
          {editorStep === 2 && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6">
                
                {/* 1. Bangla Title Input */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2d5016]" />
                      <span>ব্লগের বাংলা শিরোনাম <span className="text-rose-500">*</span></span>
                    </label>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {banglaTitle.length} অক্ষর
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    value={banglaTitle}
                    onChange={(e) => setBanglaTitle(e.target.value)}
                    placeholder="যেমন: খাঁটি সুন্দরবনের মধু চেনার সহজ ঘরোয়া উপায় ও উপকারিতা"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-sm sm:text-base font-semibold focus:outline-none focus:border-[#2d5016] focus:ring-1 focus:ring-[#2d5016] transition-all"
                  />

                  {/* Auto Slug Generator */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      <span className="text-neutral-400">URL স্লাগ:</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="kasab-pure-honey-guide"
                        className="font-mono text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border-none outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-[#2d5016] font-bold hover:underline cursor-pointer"
                    >
                      অটো-জেনারেট
                    </button>
                  </div>
                </div>

                {/* 2. Cover Photo Section (Clean, Single Unified Preview) */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#2d5016]" />
                      <span>ব্লগ কভার ছবি (Cover Photo) <span className="text-rose-500">*</span></span>
                    </label>
                    {image && (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>কভার নির্বাচিত</span>
                      </span>
                    )}
                  </div>

                  {/* Single Unified Dropzone with wide aspect ratio */}
                  <ImageUploadDropzone
                    value={image}
                    onChange={(url: string) => {
                      setImage(url);
                      showToast('কভার ছবি সফলভাবে যুক্ত হয়েছে!');
                    }}
                    folder="blogs"
                    aspectRatio="wide"
                    hideLabel={true}
                  />

                  {/* 1-Click Curated Presets */}
                  <div className="pt-1 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-500 block mb-1.5">
                      অথবা ১-ক্লিকে প্রিসেট কভার ছবি নির্বাচন করুন:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            setImage(preset.url);
                            showToast(`"${preset.label}" কভার ছবি সেট করা হয়েছে`);
                          }}
                          className={`px-2.5 py-1 rounded-xl border text-xs transition-all cursor-pointer ${
                            image === preset.url
                              ? 'border-[#2d5016] bg-[#2d5016] text-[#d4af37] font-bold shadow-2xs'
                              : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50 hover:bg-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Short Excerpt / Summary */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2d5016]" />
                      <span>সংক্ষিপ্ত সারসংক্ষেপ (Short Excerpt)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoExtractExcerpt}
                      className="text-[11px] text-[#2d5016] hover:bg-[#2d5016]/10 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors"
                      title="মূল লেখা থেকে সারাংশ তুলুন"
                    >
                      লেখা থেকে অটো তৈরি করুন
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={banglaExcerpt}
                    onChange={(e) => setBanglaExcerpt(e.target.value)}
                    placeholder="ব্লগ কার্ড ও সোশ্যাল মিডিয়ায় দেখানোর জন্য ২-৩ লাইনের আকর্ষণীয় ভূমিকা..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#2d5016] leading-relaxed"
                  />
                </div>

                {/* 4. Category Selection */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#2d5016]" />
                    <span>ব্লগ ক্যাটাগরি নির্বাচন করুন</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {BLOG_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          category === cat.id
                            ? 'border-[#2d5016] bg-[#2d5016]/10 text-[#2d5016] font-bold shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{cat.bn}</span>
                        <span className="block text-[10px] text-neutral-400 mt-1">{cat.en}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Author, Date & Featured Settings */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        লেখক / টিম নাম
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Kasab Gallery Research Team"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        লেখকের পদবী
                      </label>
                      <input
                        type="text"
                        value={banglaAuthorRole}
                        onChange={(e) => setBanglaAuthorRole(e.target.value)}
                        placeholder="খাদ্য পুষ্টিবিদ ও গবেষক"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        প্রকাশের তারিখ
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={publishedDate}
                          onChange={(e) => setPublishedDate(e.target.value)}
                          placeholder={getTodayBanglaDate()}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                        />
                        <button
                          type="button"
                          onClick={() => setPublishedDate(getTodayBanglaDate())}
                          className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-bold text-neutral-700 cursor-pointer shrink-0"
                        >
                          আজ
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <label className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2d5016] focus:ring-[#2d5016] cursor-pointer"
                    />
                    <div className="text-xs">
                      <strong className="text-neutral-900 block font-bold">
                        হোমপেজ ও ব্লগ ব্যানারে ফিচার্ড (Featured Article) হিসেবে দেখান
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        এটি সক্রিয় থাকলে ওয়েবসাইটের মূল আকর্ষণ হিসেবে প্রদর্শিত হবে।
                      </span>
                    </div>
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* STEP 3: OPTIONAL ENGLISH WRITING SECTION */}
          {/* ======================================================= */}
          {editorStep === 3 && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6">
                
                {/* Friendly Banner on Optional Nature */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-emerald-950">
                      ইংরেজি সংস্করণ সম্পূর্ণ ঐচ্ছিক (Optional English Version)
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      আপনি যদি শুধু বাংলায় প্রকাশ করতে চান, তবে এটি খালি রেখেই নিচের <strong>"পাবলিশ করুন"</strong> বোতামে চাপ দিন। Kasab Gallery সম্পূর্ণ বাংলায় স্বয়ংক্রিয়ভাবে উপস্থাপিত হবে।
                    </p>
                  </div>
                </div>

                {/* Optional English Title */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <label className="text-xs font-bold text-neutral-700 block">
                    English Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 5 Easy Home Tests to Identify Pure Wild Raw Honey"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#2d5016]"
                  />
                </div>

                {/* Optional English Excerpt */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <label className="text-xs font-bold text-neutral-700 block">
                    English Excerpt (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 2-line summary in English..."
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                  />
                </div>

                {/* Optional English Content Editor */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <label className="text-xs font-bold text-neutral-700 block">
                    English Content (Full Article - Optional)
                  </label>
                  <WysiwygEditor
                    value={content}
                    onChange={(html) => setContent(html)}
                    placeholder="Write the full English version here if you wish (optional)..."
                    minHeight="min-h-[300px]"
                  />
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* LIVE PREVIEW MODAL */}
      {/* ========================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Preview Header */}
            <div className="p-4 px-6 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-neutral-800">
                  লাইভ প্রিভিউ (গ্রাহকরা ওয়েবসাইটে ঠিক যেমন দেখবেন)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Category, Read Time, Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-xs font-bold">
                  {BLOG_CATEGORIES.find((c) => c.id === category)?.bn || 'ক্যাটাগরি'}
                </span>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{banglaReadTime || calculateReadingTime(banglaContent).bn}</span>
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{publishedDate || getTodayBanglaDate()}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
                {banglaTitle || 'ব্লগের বাংলা শিরোনাম'}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-2.5 py-2 border-y border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-[#2d5016] text-[#d4af37] flex items-center justify-center font-bold text-xs">
                  ক
                </div>
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">{author}</span>
                  <span className="text-neutral-500 text-[11px]">{banglaAuthorRole}</span>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={image || PRESET_COVERS[0].url}
                  alt={banglaTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt */}
              {banglaExcerpt && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-[#2d5016] text-neutral-800 text-sm italic">
                  {banglaExcerpt}
                </div>
              )}

              {/* Content Body rendered with RichTextRenderer */}
              <div className="pt-2">
                <RichTextRenderer content={banglaContent || '<p>এখনো কোনো লেখা যোগ করা হয়নি।</p>'} />
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-4 px-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                এডিটরে ফিরুন
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleSavePost();
                }}
                className="px-5 py-2 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4 text-[#d4af37]" />
                <span>সরাসরি পাবলিশ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif-brand font-bold text-base text-neutral-900">
                ব্লগ আর্টিকেলটি মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-neutral-500">
                "{postToDelete.banglaTitle}" স্থায়ীভাবে মুছে যাবে এবং লাইভ ওয়েবসাইট থেকে সরিয়ে ফেলা হবে।
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                না, রাখুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
