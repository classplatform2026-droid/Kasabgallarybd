// Bangladesh Districts, Payment Options, Coupons & Checkout Utilities

export interface BDDistrict {
  id: string;
  nameBn: string;
  nameEn: string;
  division: string;
  isDhakaCity?: boolean;
}

export const POPULAR_DISTRICTS: BDDistrict[] = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', division: 'Dhaka', isDhakaCity: true },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', division: 'Chattogram' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', division: 'Sylhet' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', division: 'Rajshahi' },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', division: 'Dhaka' },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', division: 'Dhaka' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', division: 'Khulna' },
  { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', division: 'Chattogram' },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', division: 'Rajshahi' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', division: 'Barishal' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', division: 'Mymensingh' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', division: 'Rangpur' },
];

export const ALL_BD_DISTRICTS: BDDistrict[] = [
  // Dhaka Division
  { id: 'dhaka', nameBn: 'ঢাকা (সিটি কর্পোরেশন)', nameEn: 'Dhaka City', division: 'Dhaka', isDhakaCity: true },
  { id: 'dhaka-sub', nameBn: 'ঢাকা (সাভার/ধামরাই/কেরানীগঞ্জ)', nameEn: 'Dhaka Suburbs', division: 'Dhaka', isDhakaCity: false },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', division: 'Dhaka' },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', division: 'Dhaka' },
  { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', division: 'Dhaka' },
  { id: 'kishoreganj', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', division: 'Dhaka' },
  { id: 'manikganj', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', division: 'Dhaka' },
  { id: 'munshiganj', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', division: 'Dhaka' },
  { id: 'narsingdi', nameBn: 'নরসিংদী', nameEn: 'Narsingdi', division: 'Dhaka' },
  { id: 'faridpur', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', division: 'Dhaka' },
  { id: 'gopalganj', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', division: 'Dhaka' },
  { id: 'madaripur', nameBn: 'মাদারীপুর', nameEn: 'Madaripur', division: 'Dhaka' },
  { id: 'rajbari', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', division: 'Dhaka' },
  { id: 'shariatpur', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', division: 'Dhaka' },

  // Chattogram Division
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', division: 'Chattogram' },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", division: 'Chattogram' },
  { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', division: 'Chattogram' },
  { id: 'feni', nameBn: 'ফেনী', nameEn: 'Feni', division: 'Chattogram' },
  { id: 'brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', division: 'Chattogram' },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', division: 'Chattogram' },
  { id: 'chandpur', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', division: 'Chattogram' },
  { id: 'lakshmipur', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', division: 'Chattogram' },
  { id: 'rangamati', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', division: 'Chattogram' },
  { id: 'khagrachhari', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', division: 'Chattogram' },
  { id: 'bandarban', nameBn: 'বান্দরবান', nameEn: 'Bandarban', division: 'Chattogram' },

  // Rajshahi Division
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', division: 'Rajshahi' },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', division: 'Rajshahi' },
  { id: 'pabna', nameBn: 'পাবনা', nameEn: 'Pabna', division: 'Rajshahi' },
  { id: 'sirajganj', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', division: 'Rajshahi' },
  { id: 'naogaon', nameBn: 'নওগাঁ', nameEn: 'Naogaon', division: 'Rajshahi' },
  { id: 'natore', nameBn: 'নাটোর', nameEn: 'Natore', division: 'Rajshahi' },
  { id: 'chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', division: 'Rajshahi' },
  { id: 'joypurhat', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', division: 'Rajshahi' },

  // Khulna Division
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', division: 'Khulna' },
  { id: 'jashore', nameBn: 'যশোর', nameEn: 'Jashore', division: 'Khulna' },
  { id: 'kushtia', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', division: 'Khulna' },
  { id: 'jhenaidah', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', division: 'Khulna' },
  { id: 'satkhira', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', division: 'Khulna' },
  { id: 'bagerhat', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', division: 'Khulna' },
  { id: 'chuadanga', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', division: 'Khulna' },
  { id: 'meherpur', nameBn: 'মেহেরপুর', nameEn: 'Meherpur', division: 'Khulna' },
  { id: 'magura', nameBn: 'মাগুরা', nameEn: 'Magura', division: 'Khulna' },
  { id: 'narail', nameBn: 'নড়াইল', nameEn: 'Narail', division: 'Khulna' },

  // Sylhet Division
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', division: 'Sylhet' },
  { id: 'moulvibazar', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', division: 'Sylhet' },
  { id: 'habiganj', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', division: 'Sylhet' },
  { id: 'sunamganj', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', division: 'Sylhet' },

  // Barishal Division
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', division: 'Barishal' },
  { id: 'patuakhali', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', division: 'Barishal' },
  { id: 'bhola', nameBn: 'ভোলা', nameEn: 'Bhola', division: 'Barishal' },
  { id: 'pirojpur', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', division: 'Barishal' },
  { id: 'barguna', nameBn: 'বরগুনা', nameEn: 'Barguna', division: 'Barishal' },
  { id: 'jhalokathi', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokathi', division: 'Barishal' },

  // Rangpur Division
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', division: 'Rangpur' },
  { id: 'dinajpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', division: 'Rangpur' },
  { id: 'kurigram', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', division: 'Rangpur' },
  { id: 'gaibandha', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', division: 'Rangpur' },
  { id: 'nilphamari', nameBn: 'নীলফামারী', nameEn: 'Nilphamari', division: 'Rangpur' },
  { id: 'lalmonirhat', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', division: 'Rangpur' },
  { id: 'thakurgaon', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', division: 'Rangpur' },
  { id: 'panchagarh', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', division: 'Rangpur' },

  // Mymensingh Division
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', division: 'Mymensingh' },
  { id: 'jamalpur', nameBn: 'জামালপুর', nameEn: 'Jamalpur', division: 'Mymensingh' },
  { id: 'netrokona', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', division: 'Mymensingh' },
  { id: 'sherpur', nameBn: 'শেরপুর', nameEn: 'Sherpur', division: 'Mymensingh' },
];

export interface PaymentMethodOption {
  id: 'cod' | 'bkash' | 'nagad' | 'rocket';
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn?: string;
  badgeEn?: string;
  color: string;
  number?: string;
  accountType?: string;
  instructionsBn: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'cod',
    titleBn: 'ক্যাশ অন ডেলিভারি (COD)',
    titleEn: 'Cash on Delivery',
    subtitleBn: 'পণ্য হাতে পেয়ে দেখে টাকা পরিশোধ করুন। কোনো অগ্রিম লাগবে না।',
    subtitleEn: 'Pay cash when you receive the parcel at your doorstep.',
    badgeBn: 'সবচেয়ে জনপ্রিয়',
    badgeEn: 'Most Popular',
    color: '#2d5016',
    instructionsBn: 'ডেলিভারি ম্যানের কাছ থেকে পার্সেল চেক করে নগদ টাকা বুঝিয়ে দিন। সম্পূর্ণ ঝামেলামুক্ত ও বিশ্বস্ত মাধ্যম।',
  },
  {
    id: 'bkash',
    titleBn: 'বিকাশ পেমেন্ট (bKash)',
    titleEn: 'bKash Send Money / Payment',
    subtitleBn: 'বিকাশ পার্সোনাল নম্বরে সেন্ড মানি করুন।',
    subtitleEn: 'Send money to our official bKash personal number.',
    badgeBn: 'তাৎক্ষণিক ক্যাশব্যাক',
    badgeEn: 'Fast & Secure',
    color: '#e2136e',
    number: '01915-647290',
    accountType: 'Personal / পার্সোনাল',
    instructionsBn: 'বিকাশ অ্যাপ থেকে "Send Money" অপশনে গিয়ে 01915-647290 নম্বরে মোট টাকার পরিমাণ সেন্ড মানি করুন। রেফারেন্সে আপনার ফোন নম্বর বা নাম লিখুন।',
  },
  {
    id: 'nagad',
    titleBn: 'নগদ পেমেন্ট (Nagad)',
    titleEn: 'Nagad Send Money',
    subtitleBn: 'নগদ পার্সোনাল নম্বরে ক্যাশ ইন / সেন্ড মানি করুন।',
    subtitleEn: 'Send money to our official Nagad number.',
    color: '#f7941d',
    number: '01915-647290',
    accountType: 'Personal / পার্সোনাল',
    instructionsBn: 'নগদ অ্যাপ বা *167# ডায়াল করে 01915-647290 নম্বরে সেন্ড মানি করুন।',
  },
  {
    id: 'rocket',
    titleBn: 'রকেট পেমেন্ট (Rocket)',
    titleEn: 'DBBL Rocket',
    subtitleBn: 'রকেট নম্বরে সেন্ড মানি করুন।',
    subtitleEn: 'Send money to our Rocket account.',
    color: '#8c2d8c',
    number: '01915-647290-7',
    accountType: 'Personal / পার্সোনাল',
    instructionsBn: 'রকেট একাউন্ট থেকে 01915-647290-7 নম্বরে সেন্ড মানি সম্পন্ন করুন।',
  },
];

// Coupon Codes
export interface CouponDefinition {
  code: string;
  type: 'flat' | 'percentage' | 'free_shipping';
  value: number; // amount in BDT or percentage
  minSubtotal?: number;
  descriptionBn: string;
  descriptionEn: string;
}

export const ACTIVE_COUPONS: Record<string, CouponDefinition> = {
  'KASAB50': {
    code: 'KASAB50',
    type: 'flat',
    value: 50,
    minSubtotal: 300,
    descriptionBn: '৫০ টাকা ফ্ল্যাট ছাড়',
    descriptionEn: '৳50 Flat Discount',
  },
  'KASAB10': {
    code: 'KASAB10',
    type: 'percentage',
    value: 10,
    minSubtotal: 500,
    descriptionBn: '১০% ছাড় (সর্বোচ্চ ৳২০০)',
    descriptionEn: '10% Discount (up to ৳200)',
  },
  'FREEBD': {
    code: 'FREEBD',
    type: 'free_shipping',
    value: 0,
    minSubtotal: 800,
    descriptionBn: 'ফ্রি হোম ডেলিভারি (৳০ চার্জ)',
    descriptionEn: 'Free Delivery Nationwide',
  },
  'FREESHIP': {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minSubtotal: 800,
    descriptionBn: 'ফ্রি হোম ডেলিভারি (৳০ চার্জ)',
    descriptionEn: 'Free Delivery Nationwide',
  },
  'SUNNAH': {
    code: 'SUNNAH',
    type: 'flat',
    value: 100,
    minSubtotal: 1000,
    descriptionBn: '১০০ টাকা স্পেশাল সুন্নাহ ডিসকাউন্ট',
    descriptionEn: '৳100 Special Sunnah Discount',
  },
};

export function detectOperator(phone: string): { name: string; color: string } | null {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 3) return null;
  const prefix = clean.startsWith('880') ? clean.slice(2, 5) : clean.slice(0, 3);

  if (prefix === '017' || prefix === '013') return { name: 'Grameenphone', color: '#0070ba' };
  if (prefix === '019' || prefix === '014') return { name: 'Banglalink', color: '#ff6200' };
  if (prefix === '018') return { name: 'Robi', color: '#e40000' };
  if (prefix === '016') return { name: 'Airtel', color: '#d81e05' };
  if (prefix === '015') return { name: 'Teletalk', color: '#27902d' };
  return null;
}
