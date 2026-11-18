// Comprehensive Bangladesh Geo Engine Data & Utilities
// Covers 8 Divisions, 64 Districts, All 495+ Upazilas/Thanas, Coordinates, and Search Engine

export interface Division {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface District {
  id: string;
  divisionId: string;
  nameBn: string;
  nameEn: string;
  isDhakaCity?: boolean;
  lat: number;
  lng: number;
}

export interface Thana {
  id: string;
  districtId: string;
  divisionId: string;
  nameBn: string;
  nameEn: string;
  isDhakaCity?: boolean;
}

export const BD_DIVISIONS: Division[] = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
];

export const BD_DISTRICTS: District[] = [
  // Dhaka Division
  { id: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ঢাকা সিটি কর্পোরেশন', nameEn: 'Dhaka City', isDhakaCity: true, lat: 23.8103, lng: 90.4125 },
  { id: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'ঢাকা (সাভার/ধামরাই/কেরানীগঞ্জ)', nameEn: 'Dhaka Suburbs', isDhakaCity: false, lat: 23.8583, lng: 90.2667 },
  { id: 'gazipur', divisionId: 'dhaka', nameBn: 'গাজীপুর', nameEn: 'Gazipur', isDhakaCity: false, lat: 24.0023, lng: 90.4264 },
  { id: 'narayanganj', divisionId: 'dhaka', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', isDhakaCity: false, lat: 23.6238, lng: 90.5000 },
  { id: 'tangail', divisionId: 'dhaka', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', isDhakaCity: false, lat: 24.2513, lng: 89.9167 },
  { id: 'kishoreganj', divisionId: 'dhaka', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', isDhakaCity: false, lat: 24.4449, lng: 90.7766 },
  { id: 'manikganj', divisionId: 'dhaka', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', isDhakaCity: false, lat: 23.8617, lng: 90.0003 },
  { id: 'munshiganj', divisionId: 'dhaka', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', isDhakaCity: false, lat: 23.5422, lng: 90.5305 },
  { id: 'narsingdi', divisionId: 'dhaka', nameBn: 'নরসিংদী', nameEn: 'Narsingdi', isDhakaCity: false, lat: 23.9322, lng: 90.7154 },
  { id: 'faridpur', divisionId: 'dhaka', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', isDhakaCity: false, lat: 23.6071, lng: 89.8429 },
  { id: 'gopalganj', divisionId: 'dhaka', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', isDhakaCity: false, lat: 23.0051, lng: 89.8266 },
  { id: 'madaripur', divisionId: 'dhaka', nameBn: 'মাদারীপুর', nameEn: 'Madaripur', isDhakaCity: false, lat: 23.1641, lng: 90.1897 },
  { id: 'rajbari', divisionId: 'dhaka', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', isDhakaCity: false, lat: 23.7574, lng: 89.6445 },
  { id: 'shariatpur', divisionId: 'dhaka', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', isDhakaCity: false, lat: 23.2423, lng: 90.4348 },

  // Chattogram Division
  { id: 'chattogram', divisionId: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', lat: 22.3569, lng: 91.7832 },
  { id: 'coxsbazar', divisionId: 'chattogram', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
  { id: 'cumilla', divisionId: 'chattogram', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', lat: 23.4682, lng: 91.1788 },
  { id: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', lat: 23.9571, lng: 91.1119 },
  { id: 'chandpur', divisionId: 'chattogram', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', lat: 23.2333, lng: 90.6667 },
  { id: 'feni', divisionId: 'chattogram', nameBn: 'ফেনী', nameEn: 'Feni', lat: 23.0186, lng: 91.3966 },
  { id: 'lakshmipur', divisionId: 'chattogram', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', lat: 22.9425, lng: 90.8412 },
  { id: 'noakhali', divisionId: 'chattogram', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', lat: 22.8696, lng: 91.0994 },
  { id: 'bandarban', divisionId: 'chattogram', nameBn: 'বান্দরবান', nameEn: 'Bandarban', lat: 22.1953, lng: 92.2184 },
  { id: 'khagrachhari', divisionId: 'chattogram', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', lat: 23.1193, lng: 91.9847 },
  { id: 'rangamati', divisionId: 'chattogram', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', lat: 22.6533, lng: 92.1789 },

  // Rajshahi Division
  { id: 'rajshahi', divisionId: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { id: 'bogura', divisionId: 'rajshahi', nameBn: 'বগুড়া', nameEn: 'Bogura', lat: 24.8465, lng: 89.3777 },
  { id: 'pabna', divisionId: 'rajshahi', nameBn: 'পাবনা', nameEn: 'Pabna', lat: 24.0064, lng: 89.2372 },
  { id: 'sirajganj', divisionId: 'rajshahi', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', lat: 24.4534, lng: 89.7008 },
  { id: 'naogaon', divisionId: 'rajshahi', nameBn: 'নওগাঁ', nameEn: 'Naogaon', lat: 24.7936, lng: 88.9318 },
  { id: 'natore', divisionId: 'rajshahi', nameBn: 'নাটোর', nameEn: 'Natore', lat: 24.4206, lng: 89.0003 },
  { id: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', lat: 24.5965, lng: 88.2775 },
  { id: 'joypurhat', divisionId: 'rajshahi', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', lat: 25.1015, lng: 89.0267 },

  // Khulna Division
  { id: 'khulna', divisionId: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { id: 'jashore', divisionId: 'khulna', nameBn: 'যশোর', nameEn: 'Jashore', lat: 23.1664, lng: 89.2081 },
  { id: 'kushtia', divisionId: 'khulna', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', lat: 23.9013, lng: 89.1205 },
  { id: 'bagerhat', divisionId: 'khulna', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', lat: 22.6516, lng: 89.7859 },
  { id: 'chuadanga', divisionId: 'khulna', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', lat: 23.6402, lng: 88.8418 },
  { id: 'jhenaidah', divisionId: 'khulna', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', lat: 23.5450, lng: 89.1726 },
  { id: 'magura', divisionId: 'khulna', nameBn: 'মাগুরা', nameEn: 'Magura', lat: 23.4873, lng: 89.4198 },
  { id: 'meherpur', divisionId: 'khulna', nameBn: 'মেহেরপুর', nameEn: 'Meherpur', lat: 23.7622, lng: 88.6318 },
  { id: 'narail', divisionId: 'khulna', nameBn: 'নড়াইল', nameEn: 'Narail', lat: 23.1725, lng: 89.5127 },
  { id: 'satkhira', divisionId: 'khulna', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', lat: 22.7185, lng: 89.0705 },

  // Barishal Division
  { id: 'barishal', divisionId: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535 },
  { id: 'bhola', divisionId: 'barishal', nameBn: 'ভোলা', nameEn: 'Bhola', lat: 22.6859, lng: 90.6481 },
  { id: 'jhalokathi', divisionId: 'barishal', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokathi', lat: 22.6406, lng: 90.1987 },
  { id: 'patuakhali', divisionId: 'barishal', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', lat: 22.3596, lng: 90.3299 },
  { id: 'pirojpur', divisionId: 'barishal', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', lat: 22.5841, lng: 89.9720 },
  { id: 'barguna', divisionId: 'barishal', nameBn: 'বরগুনা', nameEn: 'Barguna', lat: 22.0953, lng: 90.0768 },

  // Sylhet Division
  { id: 'sylhet', divisionId: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { id: 'moulvibazar', divisionId: 'sylhet', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', lat: 24.4829, lng: 91.7774 },
  { id: 'habiganj', divisionId: 'sylhet', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', lat: 24.3749, lng: 91.4155 },
  { id: 'sunamganj', divisionId: 'sylhet', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', lat: 25.0658, lng: 91.3950 },

  // Rangpur Division
  { id: 'rangpur', divisionId: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { id: 'dinajpur', divisionId: 'rangpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', lat: 25.6217, lng: 88.6355 },
  { id: 'gaibandha', divisionId: 'rangpur', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', lat: 25.3288, lng: 89.5407 },
  { id: 'kurigram', divisionId: 'rangpur', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', lat: 25.8054, lng: 89.6362 },
  { id: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', lat: 25.9923, lng: 89.2847 },
  { id: 'nilphamari', divisionId: 'rangpur', nameBn: 'নীলফামারী', nameEn: 'Nilphamari', lat: 25.9318, lng: 88.8560 },
  { id: 'panchagarh', divisionId: 'rangpur', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', lat: 26.3411, lng: 88.5542 },
  { id: 'thakurgaon', divisionId: 'rangpur', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', lat: 26.0337, lng: 88.4617 },

  // Mymensingh Division
  { id: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
  { id: 'jamalpur', divisionId: 'mymensingh', nameBn: 'জামালপুর', nameEn: 'Jamalpur', lat: 24.9375, lng: 89.9378 },
  { id: 'netrokona', divisionId: 'mymensingh', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', lat: 24.8709, lng: 90.7279 },
  { id: 'sherpur', divisionId: 'mymensingh', nameBn: 'শেরপুর', nameEn: 'Sherpur', lat: 25.0205, lng: 90.0153 },
];

export const BD_THANAS: Thana[] = [
  // ==========================================
  // DHAKA DIVISION
  // ==========================================
  // Dhaka City Corporation (৳70 Delivery)
  { id: 'dhk_dhanmondi', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ধানমন্ডি', nameEn: 'Dhanmondi', isDhakaCity: true },
  { id: 'dhk_gulshan', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'গুলশান', nameEn: 'Gulshan', isDhakaCity: true },
  { id: 'dhk_banani', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'বনানী', nameEn: 'Banani', isDhakaCity: true },
  { id: 'dhk_uttara', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'উত্তরা', nameEn: 'Uttara', isDhakaCity: true },
  { id: 'dhk_mirpur', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'মিরপুর', nameEn: 'Mirpur', isDhakaCity: true },
  { id: 'dhk_mohammadpur', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'মোহাম্মদপুর', nameEn: 'Mohammadpur', isDhakaCity: true },
  { id: 'dhk_badda', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'বাড্ডা', nameEn: 'Badda', isDhakaCity: true },
  { id: 'dhk_bashundhara', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'বসুন্ধরা আবাসিক এলাকা', nameEn: 'Bashundhara R/A', isDhakaCity: true },
  { id: 'dhk_vatara', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ভাটারা', nameEn: 'Vatara', isDhakaCity: true },
  { id: 'dhk_motijheel', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'মতিঝিল', nameEn: 'Motijheel', isDhakaCity: true },
  { id: 'dhk_tejgaon', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'তেজগাঁও', nameEn: 'Tejgaon', isDhakaCity: true },
  { id: 'dhk_khilgaon', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'খিলগাঁও', nameEn: 'Khilgaon', isDhakaCity: true },
  { id: 'dhk_rampura', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'রামপুরা', nameEn: 'Rampura', isDhakaCity: true },
  { id: 'dhk_shantinagar', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'শান্তিনগর / কাকরাইল', nameEn: 'Shantinagar / Kakrail', isDhakaCity: true },
  { id: 'dhk_malibagh', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'মালিবাগ / মগবাজার', nameEn: 'Malibagh / Moghbazar', isDhakaCity: true },
  { id: 'dhk_lalbagh', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'লালবাগ', nameEn: 'Lalbagh', isDhakaCity: true },
  { id: 'dhk_newmarket', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'নিউ মার্কেট / আজিমপুর', nameEn: 'New Market / Azimpur', isDhakaCity: true },
  { id: 'dhk_shahbagh', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'শাহবাগ', nameEn: 'Shahbagh', isDhakaCity: true },
  { id: 'dhk_paltan', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'পল্টন', nameEn: 'Paltan', isDhakaCity: true },
  { id: 'dhk_jatrabari', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'যাত্রাবাড়ী', nameEn: 'Jatrabari', isDhakaCity: true },
  { id: 'dhk_wari', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ওয়ারী', nameEn: 'Wari', isDhakaCity: true },
  { id: 'dhk_kotwali_dhk', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'কোতোয়ালী (পুরান ঢাকা)', nameEn: 'Kotwali (Old Dhaka)', isDhakaCity: true },
  { id: 'dhk_chawkbazar', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'চকবাজার', nameEn: 'Chawkbazar', isDhakaCity: true },
  { id: 'dhk_bangshal', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'বংশাল', nameEn: 'Bangshal', isDhakaCity: true },
  { id: 'dhk_kafrul', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'কাফরুল / শেওড়াপাড়া', nameEn: 'Kafrul / Shewrapara', isDhakaCity: true },
  { id: 'dhk_cantonment', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ক্যান্টনমেন্ট', nameEn: 'Cantonment', isDhakaCity: true },
  { id: 'dhk_hazaribagh', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'হাজারীবাগ', nameEn: 'Hazaribagh', isDhakaCity: true },
  { id: 'dhk_hatirjheel', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'হাতিরঝিল', nameEn: 'Hatirjheel', isDhakaCity: true },
  { id: 'dhk_sabujbagh', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'সবুজবাগ', nameEn: 'Sabujbagh', isDhakaCity: true },
  { id: 'dhk_nikunja', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'নিকুঞ্জ / খিলক্ষেত', nameEn: 'Nikunja / Khilkhet', isDhakaCity: true },
  { id: 'dhk_turag', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'তুরাগ / কামারপাড়া', nameEn: 'Turag / Kamarpara', isDhakaCity: true },
  { id: 'dhk_uttarkhan', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'উত্তরখান / দক্ষিণখান', nameEn: 'Uttarkhan / Dakshinkhan', isDhakaCity: true },
  { id: 'dhk_kamrangirchar', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'কামরাঙ্গীরচর', nameEn: 'Kamrangirchar', isDhakaCity: true },
  { id: 'dhk_demra', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'ডেমরা', nameEn: 'Demra', isDhakaCity: true },
  { id: 'dhk_kadamtali', districtId: 'dhaka_city', divisionId: 'dhaka', nameBn: 'কদমতলী', nameEn: 'Kadamtali', isDhakaCity: true },

  // Dhaka Suburbs (সাভার, আশুলিয়া, ধামরাই, কেরানীগঞ্জ)
  { id: 'sub_savar', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'সাভার', nameEn: 'Savar' },
  { id: 'sub_ashulia', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'আশুলিয়া', nameEn: 'Ashulia' },
  { id: 'sub_dhamrai', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'ধামরাই', nameEn: 'Dhamrai' },
  { id: 'sub_keraniganj', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'কেরানীগঞ্জ (কদমতলী)', nameEn: 'Keraniganj' },
  { id: 'sub_nawabganj', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },
  { id: 'sub_dohar', districtId: 'dhaka_suburbs', divisionId: 'dhaka', nameBn: 'দোহার', nameEn: 'Dohar' },

  // Gazipur
  { id: 'gzp_joydebpur', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'জয়দেবপুর / গাজীপুর সদর', nameEn: 'Joydebpur / Sadar' },
  { id: 'gzp_tongi', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'টঙ্গী', nameEn: 'Tongi' },
  { id: 'gzp_kaliakair', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'কালিয়াকৈর', nameEn: 'Kaliakair' },
  { id: 'gzp_sreepur', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
  { id: 'gzp_kapasia', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'কাপাসিয়া', nameEn: 'Kapasia' },
  { id: 'gzp_kaliganj', districtId: 'gazipur', divisionId: 'dhaka', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },

  // Narayanganj
  { id: 'nrn_sadar', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'নারায়ণগঞ্জ সদর', nameEn: 'Narayanganj Sadar' },
  { id: 'nrn_fatullah', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'ফতুল্লা', nameEn: 'Fatullah' },
  { id: 'nrn_siddhirganj', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'সিদ্ধিরগঞ্জ', nameEn: 'Siddhirganj' },
  { id: 'nrn_sonargaon', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'সোনারগাঁও', nameEn: 'Sonargaon' },
  { id: 'nrn_rupganj', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'রূপগঞ্জ', nameEn: 'Rupganj' },
  { id: 'nrn_bandar', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'বন্দর', nameEn: 'Bandar' },
  { id: 'nrn_araihazar', districtId: 'narayanganj', divisionId: 'dhaka', nameBn: 'আড়াইহাজার', nameEn: 'Araihazar' },

  // Tangail
  { id: 'tan_sadar', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'টাঙ্গাইল সদর', nameEn: 'Tangail Sadar' },
  { id: 'tan_mirzapur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'মির্জাপুর', nameEn: 'Mirzapur' },
  { id: 'tan_delduar', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'দেলদুয়ার', nameEn: 'Delduar' },
  { id: 'tan_nagarpur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'নাগরপুর', nameEn: 'Nagarpur' },
  { id: 'tan_sakhipur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'সখীপুর', nameEn: 'Sakhipur' },
  { id: 'tan_basail', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'বাসাইল', nameEn: 'Basail' },
  { id: 'tan_ghatail', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'ঘাটাইল', nameEn: 'Ghatail' },
  { id: 'tan_kalihati', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'কালিহাতী', nameEn: 'Kalihati' },
  { id: 'tan_madhupur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'মধুপুর', nameEn: 'Madhupur' },
  { id: 'tan_dhanbari', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'ধনবাড়ী', nameEn: 'Dhanbari' },
  { id: 'tan_gopalpur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'গোপালপুর', nameEn: 'Gopalpur' },
  { id: 'tan_bhuapur', districtId: 'tangail', divisionId: 'dhaka', nameBn: 'ভূঞাপুর', nameEn: 'Bhuapur' },

  // Kishoreganj
  { id: 'kis_sadar', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'কিশোরগঞ্জ সদর', nameEn: 'Kishoreganj Sadar' },
  { id: 'kis_bhairab', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'ভৈরব', nameEn: 'Bhairab' },
  { id: 'kis_bajitpur', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'বাজিতপুর', nameEn: 'Bajitpur' },
  { id: 'kis_katiadi', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'কটিয়াদী', nameEn: 'Katiadi' },
  { id: 'kis_kuliarchar', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'কুলিয়ারচর', nameEn: 'Kuliarchar' },
  { id: 'kis_pakundia', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'পাকুন্দিয়া', nameEn: 'Pakundia' },
  { id: 'kis_karimganj', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'করিমগঞ্জ', nameEn: 'Karimganj' },
  { id: 'kis_tarail', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'তাড়াইল', nameEn: 'Tarail' },
  { id: 'kis_hossainpur', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'হোসেনপুর', nameEn: 'Hossainpur' },
  { id: 'kis_nikli', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'নিকলী', nameEn: 'Nikli' },
  { id: 'kis_itna', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'ইটনা', nameEn: 'Itna' },
  { id: 'kis_mithamoin', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'মিঠামইন', nameEn: 'Mithamoin' },
  { id: 'kis_astagram', districtId: 'kishoreganj', divisionId: 'dhaka', nameBn: 'অষ্টগ্রাম', nameEn: 'Astagram' },

  // Manikganj
  { id: 'man_sadar', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'মানিকগঞ্জ সদর', nameEn: 'Manikganj Sadar' },
  { id: 'man_saturia', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'সাটুরিয়া', nameEn: 'Saturia' },
  { id: 'man_singair', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'সিংগাইর', nameEn: 'Singair' },
  { id: 'man_shibalaya', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'শিবালয়', nameEn: 'Shibalaya' },
  { id: 'man_ghiur', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'ঘিউর', nameEn: 'Ghiur' },
  { id: 'man_daulatpur', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },
  { id: 'man_harirampur', districtId: 'manikganj', divisionId: 'dhaka', nameBn: 'হরিরামপুর', nameEn: 'Harirampur' },

  // Munshiganj
  { id: 'mun_sadar', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'মুন্সীগঞ্জ সদর', nameEn: 'Munshiganj Sadar' },
  { id: 'mun_sreenagar', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'শ্রীনগর', nameEn: 'Sreenagar' },
  { id: 'mun_sirajdikhan', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'সিরাজদিখান', nameEn: 'Sirajdikhan' },
  { id: 'mun_louhajang', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'লৌহজং', nameEn: 'Louhajang' },
  { id: 'mun_tongibari', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'টংগীবাড়ী', nameEn: 'Tongibari' },
  { id: 'mun_gazaria', districtId: 'munshiganj', divisionId: 'dhaka', nameBn: 'গজারিয়া', nameEn: 'Gazaria' },

  // Narsingdi
  { id: 'nar_sadar', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'নরসিংদী সদর', nameEn: 'Narsingdi Sadar' },
  { id: 'nar_madhabdi', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'মাধবদী', nameEn: 'Madhabdi' },
  { id: 'nar_palash', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'পলাশ', nameEn: 'Palash' },
  { id: 'nar_shibpur', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'শিবপুর', nameEn: 'Shibpur' },
  { id: 'nar_raipura', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'রায়পুরা', nameEn: 'Raipura' },
  { id: 'nar_monohardi', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'মনোহরদী', nameEn: 'Monohardi' },
  { id: 'nar_belabo', districtId: 'narsingdi', divisionId: 'dhaka', nameBn: 'বেলাব', nameEn: 'Belabo' },

  // Faridpur
  { id: 'far_sadar', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'ফরিদপুর সদর / কোতোয়ালী', nameEn: 'Faridpur Sadar' },
  { id: 'far_modhukhali', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'মধুখালী', nameEn: 'Modhukhali' },
  { id: 'far_boalmari', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'বোয়ালমারী', nameEn: 'Boalmari' },
  { id: 'far_alfadanga', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'আলফাডাঙ্গা', nameEn: 'Alfadanga' },
  { id: 'far_nagarkanda', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'নগরকান্দা', nameEn: 'Nagarkanda' },
  { id: 'far_saltha', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'সালথা', nameEn: 'Saltha' },
  { id: 'far_bhanga', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'ভাঙ্গা', nameEn: 'Bhanga' },
  { id: 'far_sadarpur', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'সদরপুর', nameEn: 'Sadarpur' },
  { id: 'far_charbhadrasan', districtId: 'faridpur', divisionId: 'dhaka', nameBn: 'চরভদ্রাসন', nameEn: 'Charbhadrasan' },

  // Gopalganj
  { id: 'gop_sadar', districtId: 'gopalganj', divisionId: 'dhaka', nameBn: 'গোপালগঞ্জ সদর', nameEn: 'Gopalganj Sadar' },
  { id: 'gop_tungipara', districtId: 'gopalganj', divisionId: 'dhaka', nameBn: 'টুঙ্গিপাড়া', nameEn: 'Tungipara' },
  { id: 'gop_kotalipara', districtId: 'gopalganj', divisionId: 'dhaka', nameBn: 'কোটালীপাড়া', nameEn: 'Kotalipara' },
  { id: 'gop_kashiani', districtId: 'gopalganj', divisionId: 'dhaka', nameBn: 'কাশিয়ানী', nameEn: 'Kashiani' },
  { id: 'gop_muksudpur', districtId: 'gopalganj', divisionId: 'dhaka', nameBn: 'মুকসুদপুর', nameEn: 'Muksudpur' },

  // Madaripur
  { id: 'mad_sadar', districtId: 'madaripur', divisionId: 'dhaka', nameBn: 'মাদারীপুর সদর', nameEn: 'Madaripur Sadar' },
  { id: 'mad_shibchar', districtId: 'madaripur', divisionId: 'dhaka', nameBn: 'শিবচর', nameEn: 'Shibchar' },
  { id: 'mad_kalkini', districtId: 'madaripur', divisionId: 'dhaka', nameBn: 'কালকিনি', nameEn: 'Kalkini' },
  { id: 'mad_rajoir', districtId: 'madaripur', divisionId: 'dhaka', nameBn: 'রাজৈর', nameEn: 'Rajoir' },
  { id: 'mad_dasar', districtId: 'madaripur', divisionId: 'dhaka', nameBn: 'ডাসার', nameEn: 'Dasar' },

  // Rajbari
  { id: 'rajb_sadar', districtId: 'rajbari', divisionId: 'dhaka', nameBn: 'রাজবাড়ী সদর', nameEn: 'Rajbari Sadar' },
  { id: 'rajb_goalanda', districtId: 'rajbari', divisionId: 'dhaka', nameBn: 'গোয়ালন্দ', nameEn: 'Goalanda' },
  { id: 'rajb_pangsha', districtId: 'rajbari', divisionId: 'dhaka', nameBn: 'পাংশা', nameEn: 'Pangsha' },
  { id: 'rajb_baliakandi', districtId: 'rajbari', divisionId: 'dhaka', nameBn: 'বালিয়াকান্দি', nameEn: 'Baliakandi' },
  { id: 'rajb_kalukhali', districtId: 'rajbari', divisionId: 'dhaka', nameBn: 'কালুখালী', nameEn: 'Kalukhali' },

  // Shariatpur
  { id: 'sha_sadar', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'শরীয়তপুর সদর / পালং', nameEn: 'Shariatpur Sadar' },
  { id: 'sha_zajira', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'জাজিরা', nameEn: 'Zajira' },
  { id: 'sha_naria', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'নড়িয়া', nameEn: 'Naria' },
  { id: 'sha_bhedarganj', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'ভেদরগঞ্জ', nameEn: 'Bhedarganj' },
  { id: 'sha_damudya', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'ডামুড্যা', nameEn: 'Damudya' },
  { id: 'sha_gosairhat', districtId: 'shariatpur', divisionId: 'dhaka', nameBn: 'গোসাইরহাট', nameEn: 'Gosairhat' },

  // ==========================================
  // CHATTOGRAM DIVISION
  // ==========================================
  // Chattogram
  { id: 'ctg_kotwali', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'কোতোয়ালী', nameEn: 'Kotwali' },
  { id: 'ctg_panchlaish', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'পাঁচলাইশ', nameEn: 'Panchlaish' },
  { id: 'ctg_khulshi', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'খুলশী', nameEn: 'Khulshi' },
  { id: 'ctg_chandgaon', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'চান্দগাঁও', nameEn: 'Chandgaon' },
  { id: 'ctg_bakalia', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'বাকলিয়া', nameEn: 'Bakalia' },
  { id: 'ctg_halishahar', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'হালিশহর', nameEn: 'Halishahar' },
  { id: 'ctg_patenga', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'পতেঙ্গা', nameEn: 'Patenga' },
  { id: 'ctg_pahartali', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'পাহাড়তলী', nameEn: 'Pahartali' },
  { id: 'ctg_doublemooring', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'ডবলমুরিং', nameEn: 'Double Mooring' },
  { id: 'ctg_sitakunda', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'সীতাকুণ্ড', nameEn: 'Sitakunda' },
  { id: 'ctg_mirsharai', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'মীরসরাই', nameEn: 'Mirsharai' },
  { id: 'ctg_hathazari', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'হাটহাজারী', nameEn: 'Hathazari' },
  { id: 'ctg_raozan', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'রাউজান', nameEn: 'Raozan' },
  { id: 'ctg_rangunia', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'রাঙ্গুনিয়া', nameEn: 'Rangunia' },
  { id: 'ctg_patiya', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'পটিয়া', nameEn: 'Patiya' },
  { id: 'ctg_satkania', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'সাতকানিয়া', nameEn: 'Satkania' },
  { id: 'ctg_lohagara', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'লোহাগাড়া', nameEn: 'Lohagara' },
  { id: 'ctg_boalkhali', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'বোয়ালখালী', nameEn: 'Boalkhali' },
  { id: 'ctg_anwara', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'আনোয়ারা', nameEn: 'Anwara' },
  { id: 'ctg_banshkhali', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'বাঁশখালী', nameEn: 'Banshkhali' },
  { id: 'ctg_fatikchhari', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'ফটিকছড়ি', nameEn: 'Fatikchhari' },
  { id: 'ctg_sandwip', districtId: 'chattogram', divisionId: 'chattogram', nameBn: 'সন্দ্বীপ', nameEn: 'Sandwip' },

  // Cox's Bazar
  { id: 'cxb_sadar', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'কক্সবাজার সদর', nameEn: 'Coxs Bazar Sadar' },
  { id: 'cxb_chakaria', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'চকোরিয়া', nameEn: 'Chakaria' },
  { id: 'cxb_ramu', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'রামু', nameEn: 'Ramu' },
  { id: 'cxb_teknaf', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'টেকনাফ', nameEn: 'Teknaf' },
  { id: 'cxb_ukhiya', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'উখিয়া', nameEn: 'Ukhiya' },
  { id: 'cxb_pekua', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'পেকুয়া', nameEn: 'Pekua' },
  { id: 'cxb_moheshkhali', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'মহেশখালী', nameEn: 'Moheshkhali' },
  { id: 'cxb_kutubdia', districtId: 'coxsbazar', divisionId: 'chattogram', nameBn: 'কুতুবদিয়া', nameEn: 'Kutubdia' },

  // Cumilla
  { id: 'cml_sadar', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'কুমিল্লা আদর্শ সদর', nameEn: 'Cumilla Adarsha Sadar' },
  { id: 'cml_south', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'কুমিল্লা সদর দক্ষিণ', nameEn: 'Cumilla Sadar Dakshin' },
  { id: 'cml_daudkandi', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'দাউদকান্দি', nameEn: 'Daudkandi' },
  { id: 'cml_chandina', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'চান্দিনা', nameEn: 'Chandina' },
  { id: 'cml_burichong', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'বুড়িচং', nameEn: 'Burichong' },
  { id: 'cml_debidwar', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'দেবিদ্বার', nameEn: 'Debidwar' },
  { id: 'cml_laksam', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'লাকসাম', nameEn: 'Laksam' },
  { id: 'cml_chauddagram', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'চৌদ্দগ্রাম', nameEn: 'Chauddagram' },
  { id: 'cml_homna', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'হোমনা', nameEn: 'Homna' },
  { id: 'cml_barura', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'বরুড়া', nameEn: 'Barura' },
  { id: 'cml_brahmanpara', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'ব্রাহ্মণপাড়া', nameEn: 'Brahmanpara' },
  { id: 'cml_muradnagar', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'মুরাদনগর', nameEn: 'Muradnagar' },
  { id: 'cml_nangalkot', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'নাঙ্গলকোট', nameEn: 'Nangalkot' },
  { id: 'cml_titas', districtId: 'cumilla', divisionId: 'chattogram', nameBn: 'তিতাস', nameEn: 'Titas' },

  // Brahmanbaria
  { id: 'brb_sadar', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'ব্রাহ্মণবাড়িয়া সদর', nameEn: 'Brahmanbaria Sadar' },
  { id: 'brb_ashuganj', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'আশুগঞ্জ', nameEn: 'Ashuganj' },
  { id: 'brb_sarail', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'সরাইল', nameEn: 'Sarail' },
  { id: 'brb_kasba', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'কসবা', nameEn: 'Kasba' },
  { id: 'brb_akhaura', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'আখাউড়া', nameEn: 'Akhaura' },
  { id: 'brb_nabinagar', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'নবীনগর', nameEn: 'Nabinagar' },
  { id: 'brb_bancharampur', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'বাঞ্ছারামপুর', nameEn: 'Bancharampur' },
  { id: 'brb_nasirnagar', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'নাসিরনগর', nameEn: 'Nasirnagar' },
  { id: 'brb_bijoynagar', districtId: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'বিজয়নগর', nameEn: 'Bijoynagar' },

  // Chandpur
  { id: 'chp_sadar', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'চাঁদপুর সদর', nameEn: 'Chandpur Sadar' },
  { id: 'chp_hajiganj', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'হাজীগঞ্জ', nameEn: 'Hajiganj' },
  { id: 'chp_faridganj', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'ফরিদগঞ্জ', nameEn: 'Faridganj' },
  { id: 'chp_matlabnorth', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'মতলব উত্তর', nameEn: 'Matlab North' },
  { id: 'chp_matlabsouth', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'মতলব দক্ষিণ', nameEn: 'Matlab South' },
  { id: 'chp_kachua', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'কচুয়া', nameEn: 'Kachua' },
  { id: 'chp_shahrasti', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'শাহরাস্তি', nameEn: 'Shahrasti' },
  { id: 'chp_haimchar', districtId: 'chandpur', divisionId: 'chattogram', nameBn: 'হাইমচর', nameEn: 'Haimchar' },

  // Feni
  { id: 'fen_sadar', districtId: 'feni', divisionId: 'chattogram', nameBn: 'ফেনী সদর', nameEn: 'Feni Sadar' },
  { id: 'fen_daganbhuiyan', districtId: 'feni', divisionId: 'chattogram', nameBn: 'দাগনভূঞা', nameEn: 'Daganbhuiyan' },
  { id: 'fen_chhagalnaiya', districtId: 'feni', divisionId: 'chattogram', nameBn: 'ছাগলনাইয়া', nameEn: 'Chhagalnaiya' },
  { id: 'fen_sonagazi', districtId: 'feni', divisionId: 'chattogram', nameBn: 'সোনাগাজী', nameEn: 'Sonagazi' },
  { id: 'fen_parshuram', districtId: 'feni', divisionId: 'chattogram', nameBn: 'পরশুরাম', nameEn: 'Parshuram' },
  { id: 'fen_fulgazi', districtId: 'feni', divisionId: 'chattogram', nameBn: 'ফুলগাজী', nameEn: 'Fulgazi' },

  // Lakshmipur
  { id: 'lak_sadar', districtId: 'lakshmipur', divisionId: 'chattogram', nameBn: 'লক্ষ্মীপুর সদর', nameEn: 'Lakshmipur Sadar' },
  { id: 'lak_raipur', districtId: 'lakshmipur', divisionId: 'chattogram', nameBn: 'রায়পুর', nameEn: 'Raipur' },
  { id: 'lak_ramganj', districtId: 'lakshmipur', divisionId: 'chattogram', nameBn: 'রামগঞ্জ', nameEn: 'Ramganj' },
  { id: 'lak_ramgati', districtId: 'lakshmipur', divisionId: 'chattogram', nameBn: 'রামগতি', nameEn: 'Ramgati' },
  { id: 'lak_kamalnagar', districtId: 'lakshmipur', divisionId: 'chattogram', nameBn: 'কমলনগর', nameEn: 'Kamalnagar' },

  // Noakhali
  { id: 'noa_sadar', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'নোয়াখালী সদর / সুধারাম', nameEn: 'Noakhali Sadar' },
  { id: 'noa_begumganj', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'বেগমগঞ্জ / চৌমুহনী', nameEn: 'Begumganj' },
  { id: 'noa_chatkhil', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'চাটখিল', nameEn: 'Chatkhil' },
  { id: 'noa_companiganj', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'কোম্পানীগঞ্জ', nameEn: 'Companiganj' },
  { id: 'noa_hatiya', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'হাতিয়া', nameEn: 'Hatiya' },
  { id: 'noa_senbagh', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'সেনবাগ', nameEn: 'Senbagh' },
  { id: 'noa_sonaimuri', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'সোনাইমুড়ী', nameEn: 'Sonaimuri' },
  { id: 'noa_subarnachar', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'সুবর্ণচর', nameEn: 'Subarnachar' },
  { id: 'noa_kabirhat', districtId: 'noakhali', divisionId: 'chattogram', nameBn: 'কবিরহাট', nameEn: 'Kabirhat' },

  // Hill tracts: Bandarban, Khagrachhari, Rangamati
  { id: 'ban_sadar', districtId: 'bandarban', divisionId: 'chattogram', nameBn: 'বান্দরবান সদর', nameEn: 'Bandarban Sadar' },
  { id: 'ban_ruma', districtId: 'bandarban', divisionId: 'chattogram', nameBn: 'রুমা', nameEn: 'Ruma' },
  { id: 'ban_lama', districtId: 'bandarban', divisionId: 'chattogram', nameBn: 'লামা', nameEn: 'Lama' },
  { id: 'ban_alikadam', districtId: 'bandarban', divisionId: 'chattogram', nameBn: 'আলীকদম', nameEn: 'Alikadam' },
  { id: 'ban_naikhongchhari', districtId: 'bandarban', divisionId: 'chattogram', nameBn: 'নাইক্ষ্যংছড়ি', nameEn: 'Naikhongchhari' },

  { id: 'khag_sadar', districtId: 'khagrachhari', divisionId: 'chattogram', nameBn: 'খাগড়াছড়ি সদর', nameEn: 'Khagrachhari Sadar' },
  { id: 'khag_dighinala', districtId: 'khagrachhari', divisionId: 'chattogram', nameBn: 'দীঘিনালা', nameEn: 'Dighinala' },
  { id: 'khag_panchhari', districtId: 'khagrachhari', divisionId: 'chattogram', nameBn: 'পানছড়ি', nameEn: 'Panchhari' },
  { id: 'khag_matiranga', districtId: 'khagrachhari', divisionId: 'chattogram', nameBn: 'মাটিরাঙ্গা', nameEn: 'Matiranga' },
  { id: 'khag_ramgarh', districtId: 'khagrachhari', divisionId: 'chattogram', nameBn: 'রামগড়', nameEn: 'Ramgarh' },

  { id: 'ran_sadar', districtId: 'rangamati', divisionId: 'chattogram', nameBn: 'রাঙ্গামাটি সদর', nameEn: 'Rangamati Sadar' },
  { id: 'ran_kaptai', districtId: 'rangamati', divisionId: 'chattogram', nameBn: 'কাপ্তাই', nameEn: 'Kaptai' },
  { id: 'ran_baghaichhari', districtId: 'rangamati', divisionId: 'chattogram', nameBn: 'বাঘাইছড়ি', nameEn: 'Baghaichhari' },
  { id: 'ran_barkal', districtId: 'rangamati', divisionId: 'chattogram', nameBn: 'বরকল', nameEn: 'Barkal' },
  { id: 'ran_langadu', districtId: 'rangamati', divisionId: 'chattogram', nameBn: 'লংগদু', nameEn: 'Langadu' },

  // ==========================================
  // RAJSHAHI DIVISION
  // ==========================================
  // Rajshahi
  { id: 'raj_boalia', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'বোয়ালিয়া', nameEn: 'Boalia' },
  { id: 'raj_rajpara', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'রাজপাড়া', nameEn: 'Rajpara' },
  { id: 'raj_motihar', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'মতিহার', nameEn: 'Motihar' },
  { id: 'raj_chandrima', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'চন্দ্রিমা', nameEn: 'Chandrima' },
  { id: 'raj_shahmakhdum', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'শাহ মখদুম', nameEn: 'Shah Makhdum' },
  { id: 'raj_paba', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'পবা', nameEn: 'Paba' },
  { id: 'raj_godagari', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'গোদাগাড়ী', nameEn: 'Godagari' },
  { id: 'raj_bagmara', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'বাগমারা', nameEn: 'Bagmara' },
  { id: 'raj_tanore', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'তানোর', nameEn: 'Tanore' },
  { id: 'raj_puthia', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'পুঠিয়া', nameEn: 'Puthia' },
  { id: 'raj_durgapur', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur' },
  { id: 'raj_charghat', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'চারঘাট', nameEn: 'Charghat' },
  { id: 'raj_bagha', districtId: 'rajshahi', divisionId: 'rajshahi', nameBn: 'বাঘা', nameEn: 'Bagha' },

  // Bogura
  { id: 'bog_sadar', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'বগুড়া সদর', nameEn: 'Bogura Sadar' },
  { id: 'bog_shajahanpur', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'শাজাহানপুর', nameEn: 'Shajahanpur' },
  { id: 'bog_sherpur', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'শেরপুর', nameEn: 'Sherpur' },
  { id: 'bog_shibganj', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'শিবগঞ্জ', nameEn: 'Shibganj' },
  { id: 'bog_gabtali', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'গাবতলী', nameEn: 'Gabtali' },
  { id: 'bog_adamdighi', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'আদমদীঘি / সান্তাহার', nameEn: 'Adamdighi / Santahar' },
  { id: 'bog_dhunat', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'ধুনট', nameEn: 'Dhunat' },
  { id: 'bog_dupchanchia', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'দুপচাঁচিয়া', nameEn: 'Dupchanchia' },
  { id: 'bog_nandigram', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'নন্দীগ্রাম', nameEn: 'Nandigram' },
  { id: 'bog_sariakandi', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'সারিয়াকান্দি', nameEn: 'Sariakandi' },
  { id: 'bog_kahaloo', districtId: 'bogura', divisionId: 'rajshahi', nameBn: 'কাহালু', nameEn: 'Kahaloo' },

  // Pabna
  { id: 'pab_sadar', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'পাবনা সদর', nameEn: 'Pabna Sadar' },
  { id: 'pab_ishwardi', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'ঈশ্বরদী', nameEn: 'Ishwardi' },
  { id: 'pab_atgharia', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'আটঘরিয়া', nameEn: 'Atgharia' },
  { id: 'pab_chatmohar', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'চাটমোহর', nameEn: 'Chatmohar' },
  { id: 'pab_bhangura', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'ভাঙ্গুড়া', nameEn: 'Bhangura' },
  { id: 'pab_faridpur', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'ফরিদপুর (পাবনা)', nameEn: 'Faridpur (Pabna)' },
  { id: 'pab_bera', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'বেড়া', nameEn: 'Bera' },
  { id: 'pab_santhia', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'সাঁথিয়া', nameEn: 'Santhia' },
  { id: 'pab_sujanagar', districtId: 'pabna', divisionId: 'rajshahi', nameBn: 'সুজানগর', nameEn: 'Sujanagar' },

  // Sirajganj
  { id: 'sir_sadar', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'সিরাজগঞ্জ সদর', nameEn: 'Sirajganj Sadar' },
  { id: 'sir_shahjadpur', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'শাহজাদপুর', nameEn: 'Shahjadpur' },
  { id: 'sir_ullahpara', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'উল্লাপাড়া', nameEn: 'Ullahpara' },
  { id: 'sir_belkuchi', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'বেলকুচি', nameEn: 'Belkuchi' },
  { id: 'sir_tarash', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'তাড়াশ', nameEn: 'Tarash' },
  { id: 'sir_raiganj', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'রায়গঞ্জ', nameEn: 'Raiganj' },
  { id: 'sir_kazipur', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'কাজীপুর', nameEn: 'Kazipur' },
  { id: 'sir_kamarkhanda', districtId: 'sirajganj', divisionId: 'rajshahi', nameBn: 'কামারখন্দ', nameEn: 'Kamarkhanda' },

  // Naogaon
  { id: 'nao_sadar', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'নওগাঁ সদর', nameEn: 'Naogaon Sadar' },
  { id: 'nao_patnitala', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'পত্নীতলা', nameEn: 'Patnitala' },
  { id: 'nao_dhamoirhat', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'ধামইরহাট', nameEn: 'Dhamoirhat' },
  { id: 'nao_mohadavpur', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'মহাদেবপুর', nameEn: 'Mohadavpur' },
  { id: 'nao_manda', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'মান্দা', nameEn: 'Manda' },
  { id: 'nao_badalgachhi', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'বদলগাছী', nameEn: 'Badalgachhi' },
  { id: 'nao_raninagar', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'রানীনগর', nameEn: 'Raninagar' },
  { id: 'nao_atrai', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'আত্রাই', nameEn: 'Atrai' },
  { id: 'nao_sapahar', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'সাপাহার', nameEn: 'Sapahar' },
  { id: 'nao_niamatpur', districtId: 'naogaon', divisionId: 'rajshahi', nameBn: 'নিয়ামতপুর', nameEn: 'Niamatpur' },

  // Natore
  { id: 'nat_sadar', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'নাটোর সদর', nameEn: 'Natore Sadar' },
  { id: 'nat_bagatipara', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'বাগাতিপাড়া', nameEn: 'Bagatipara' },
  { id: 'nat_baraigram', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'বড়াইগ্রাম', nameEn: 'Baraigram' },
  { id: 'nat_gurudaspur', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'গুরুদাসপুর', nameEn: 'Gurudaspur' },
  { id: 'nat_lalpur', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'লালপুর', nameEn: 'Lalpur' },
  { id: 'nat_singra', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'সিংড়া', nameEn: 'Singra' },
  { id: 'nat_naldanga', districtId: 'natore', divisionId: 'rajshahi', nameBn: 'নলডাঙ্গা', nameEn: 'Naldanga' },

  // Chapainawabganj
  { id: 'cnj_sadar', districtId: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'চাঁপাইনবাবগঞ্জ সদর', nameEn: 'Chapainawabganj Sadar' },
  { id: 'cnj_shibganj', districtId: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'শিবগঞ্জ', nameEn: 'Shibganj' },
  { id: 'cnj_gomostapur', districtId: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'গোমস্তাপুর', nameEn: 'Gomostapur' },
  { id: 'cnj_nachole', districtId: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'নাচোল', nameEn: 'Nachole' },
  { id: 'cnj_bholahat', districtId: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'ভোলাহাট', nameEn: 'Bholahat' },

  // Joypurhat
  { id: 'joy_sadar', districtId: 'joypurhat', divisionId: 'rajshahi', nameBn: 'জয়পুরহাট সদর', nameEn: 'Joypurhat Sadar' },
  { id: 'joy_panchbibi', districtId: 'joypurhat', divisionId: 'rajshahi', nameBn: 'পাঁচবিবি', nameEn: 'Panchbibi' },
  { id: 'joy_kalai', districtId: 'joypurhat', divisionId: 'rajshahi', nameBn: 'কালাই', nameEn: 'Kalai' },
  { id: 'joy_khetlal', districtId: 'joypurhat', divisionId: 'rajshahi', nameBn: 'ক্ষেতলাল', nameEn: 'Khetlal' },
  { id: 'joy_akkelpur', districtId: 'joypurhat', divisionId: 'rajshahi', nameBn: 'আক্কেলপুর', nameEn: 'Akkelpur' },

  // ==========================================
  // KHULNA DIVISION
  // ==========================================
  // Khulna
  { id: 'khl_sadar', districtId: 'khulna', divisionId: 'khulna', nameBn: 'খুলনা সদর', nameEn: 'Khulna Sadar' },
  { id: 'khl_sonadanga', districtId: 'khulna', divisionId: 'khulna', nameBn: 'সোনাডাঙ্গা', nameEn: 'Sonadanga' },
  { id: 'khl_khalishpur', districtId: 'khulna', divisionId: 'khulna', nameBn: 'খালিশপুর', nameEn: 'Khalishpur' },
  { id: 'khl_daulatpur', districtId: 'khulna', divisionId: 'khulna', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },
  { id: 'khl_khanjahanali', districtId: 'khulna', divisionId: 'khulna', nameBn: 'খানজাহান আলী', nameEn: 'Khan Jahan Ali' },
  { id: 'khl_dumuria', districtId: 'khulna', divisionId: 'khulna', nameBn: 'ডুমুরিয়া', nameEn: 'Dumuria' },
  { id: 'khl_rupsha', districtId: 'khulna', divisionId: 'khulna', nameBn: 'রূপসা', nameEn: 'Rupsha' },
  { id: 'khl_phultala', districtId: 'khulna', divisionId: 'khulna', nameBn: 'ফুলতলা', nameEn: 'Phultala' },
  { id: 'khl_batiaghata', districtId: 'khulna', divisionId: 'khulna', nameBn: 'বটিয়াঘাটা', nameEn: 'Batiaghata' },
  { id: 'khl_paikgachha', districtId: 'khulna', divisionId: 'khulna', nameBn: 'পাইকগাছা', nameEn: 'Paikgachha' },
  { id: 'khl_koyra', districtId: 'khulna', divisionId: 'khulna', nameBn: 'কয়রা', nameEn: 'Koyra' },

  // Jashore
  { id: 'jas_sadar', districtId: 'jashore', divisionId: 'khulna', nameBn: 'যশোর সদর / কোতোয়ালী', nameEn: 'Jashore Sadar' },
  { id: 'jas_jhikargachha', districtId: 'jashore', divisionId: 'khulna', nameBn: 'ঝিকরগাছা', nameEn: 'Jhikargachha' },
  { id: 'jas_sharsha', districtId: 'jashore', divisionId: 'khulna', nameBn: 'শার্শা / বেনাপোল', nameEn: 'Sharsha / Benapole' },
  { id: 'jas_manirampur', districtId: 'jashore', divisionId: 'khulna', nameBn: 'মনিরামপুর', nameEn: 'Manirampur' },
  { id: 'jas_keshabpur', districtId: 'jashore', divisionId: 'khulna', nameBn: 'কেশবপুর', nameEn: 'Keshabpur' },
  { id: 'jas_abhaynagar', districtId: 'jashore', divisionId: 'khulna', nameBn: 'অভয়নগর / নওয়াপাড়া', nameEn: 'Abhaynagar' },
  { id: 'jas_bagherpara', districtId: 'jashore', divisionId: 'khulna', nameBn: 'বাঘারপাড়া', nameEn: 'Bagherpara' },
  { id: 'jas_chaugachha', districtId: 'jashore', divisionId: 'khulna', nameBn: 'চৌগাছা', nameEn: 'Chaugachha' },

  // Kushtia
  { id: 'kus_sadar', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'কুষ্টিয়া সদর', nameEn: 'Kushtia Sadar' },
  { id: 'kus_kumarkhali', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'কুমারখালী', nameEn: 'Kumarkhali' },
  { id: 'kus_khoksa', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'খোকসা', nameEn: 'Khoksa' },
  { id: 'kus_mirpur', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'মিরপুর (কুষ্টিয়া)', nameEn: 'Mirpur (Kushtia)' },
  { id: 'kus_bheramara', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'ভেড়ামারা', nameEn: 'Bheramara' },
  { id: 'kus_daulatpur', districtId: 'kushtia', divisionId: 'khulna', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },

  // Bagerhat
  { id: 'bag_sadar', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'বাগেরহাট সদর', nameEn: 'Bagerhat Sadar' },
  { id: 'bag_mongla', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'মোংলা', nameEn: 'Mongla' },
  { id: 'bag_fakirhat', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'ফকিরহাট', nameEn: 'Fakirhat' },
  { id: 'bag_kachua', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'কচুয়া', nameEn: 'Kachua' },
  { id: 'bag_mollahat', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'মোল্লাহাট', nameEn: 'Mollahat' },
  { id: 'bag_rampal', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'রামপাল', nameEn: 'Rampal' },
  { id: 'bag_chitalmari', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'চিতলমারী', nameEn: 'Chitalmari' },
  { id: 'bag_morrelganj', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'মোরেলগঞ্জ', nameEn: 'Morrelganj' },
  { id: 'bag_sarankhola', districtId: 'bagerhat', divisionId: 'khulna', nameBn: 'শরণখোলা', nameEn: 'Sarankhola' },

  // Chuadanga
  { id: 'chu_sadar', districtId: 'chuadanga', divisionId: 'khulna', nameBn: 'চুয়াডাঙ্গা সদর', nameEn: 'Chuadanga Sadar' },
  { id: 'chu_alamdanga', districtId: 'chuadanga', divisionId: 'khulna', nameBn: 'আলমডাঙ্গা', nameEn: 'Alamdanga' },
  { id: 'chu_damurhuda', districtId: 'chuadanga', divisionId: 'khulna', nameBn: 'দামুড়হুদা / দর্শনা', nameEn: 'Damurhuda' },
  { id: 'chu_jibannagar', districtId: 'chuadanga', divisionId: 'khulna', nameBn: 'জীবননগর', nameEn: 'Jibannagar' },

  // Jhenaidah
  { id: 'jhe_sadar', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'ঝিনাইদহ সদর', nameEn: 'Jhenaidah Sadar' },
  { id: 'jhe_shailkupa', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'শৈলকুপা', nameEn: 'Shailkupa' },
  { id: 'jhe_harinakunda', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'হরিণাকুণ্ডু', nameEn: 'Harinakunda' },
  { id: 'jhe_kaliganj', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'jhe_kotchandpur', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'কোটচাঁদপুর', nameEn: 'Kotchandpur' },
  { id: 'jhe_maheshpur', districtId: 'jhenaidah', divisionId: 'khulna', nameBn: 'মহেশপুর', nameEn: 'Maheshpur' },

  // Magura
  { id: 'mag_sadar', districtId: 'magura', divisionId: 'khulna', nameBn: 'মাগুরা সদর', nameEn: 'Magura Sadar' },
  { id: 'mag_sreepur', districtId: 'magura', divisionId: 'khulna', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
  { id: 'mag_mohammadpur', districtId: 'magura', divisionId: 'khulna', nameBn: 'মহম্মদপুর', nameEn: 'Mohammadpur' },
  { id: 'mag_shalikha', districtId: 'magura', divisionId: 'khulna', nameBn: 'শালিখা', nameEn: 'Shalikha' },

  // Meherpur
  { id: 'meh_sadar', districtId: 'meherpur', divisionId: 'khulna', nameBn: 'মেহেরপুর সদর', nameEn: 'Meherpur Sadar' },
  { id: 'meh_gangni', districtId: 'meherpur', divisionId: 'khulna', nameBn: 'গাংনী', nameEn: 'Gangni' },
  { id: 'meh_mujibnagar', districtId: 'meherpur', divisionId: 'khulna', nameBn: 'মুজিবনগর', nameEn: 'Mujibnagar' },

  // Narail
  { id: 'nar_sadar_khl', districtId: 'narail', divisionId: 'khulna', nameBn: 'নড়াইল সদর', nameEn: 'Narail Sadar' },
  { id: 'nar_lohagara', districtId: 'narail', divisionId: 'khulna', nameBn: 'লোহাগড়া', nameEn: 'Lohagara' },
  { id: 'nar_kalia', districtId: 'narail', divisionId: 'khulna', nameBn: 'কালিয়া', nameEn: 'Kalia' },

  // Satkhira
  { id: 'sat_sadar', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'সাতক্ষীরা সদর', nameEn: 'Satkhira Sadar' },
  { id: 'sat_kalaroa', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'কলারোয়া', nameEn: 'Kalaroa' },
  { id: 'sat_tala', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'তালা', nameEn: 'Tala' },
  { id: 'sat_debhatta', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'দেবহাটা', nameEn: 'Debhatta' },
  { id: 'sat_kaliganj', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'sat_assasuni', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'আশাশুনি', nameEn: 'Assasuni' },
  { id: 'sat_shyamnagar', districtId: 'satkhira', divisionId: 'khulna', nameBn: 'শ্যামনগর', nameEn: 'Shyamnagar' },

  // ==========================================
  // BARISHAL DIVISION
  // ==========================================
  // Barishal
  { id: 'bar_sadar', districtId: 'barishal', divisionId: 'barishal', nameBn: 'বরিশাল সদর / কোতোয়ালী', nameEn: 'Barishal Sadar / Kotwali' },
  { id: 'bar_airport', districtId: 'barishal', divisionId: 'barishal', nameBn: 'এয়ারপোর্ট', nameEn: 'Airport' },
  { id: 'bar_babuganj', districtId: 'barishal', divisionId: 'barishal', nameBn: 'বাবুগঞ্জ', nameEn: 'Babuganj' },
  { id: 'bar_bakerganj', districtId: 'barishal', divisionId: 'barishal', nameBn: 'বাকেরগঞ্জ', nameEn: 'Bakerganj' },
  { id: 'bar_banaripara', districtId: 'barishal', divisionId: 'barishal', nameBn: 'বানারীপাড়া', nameEn: 'Banaripara' },
  { id: 'bar_gournadi', districtId: 'barishal', divisionId: 'barishal', nameBn: 'গৌরনদী', nameEn: 'Gournadi' },
  { id: 'bar_agailjhara', districtId: 'barishal', divisionId: 'barishal', nameBn: 'আগৈলঝাড়া', nameEn: 'Agailjhara' },
  { id: 'bar_mehendiganj', districtId: 'barishal', divisionId: 'barishal', nameBn: 'মেহেন্দিগঞ্জ', nameEn: 'Mehendiganj' },
  { id: 'bar_muladi', districtId: 'barishal', divisionId: 'barishal', nameBn: 'মুলাদী', nameEn: 'Muladi' },
  { id: 'bar_wazirpur', districtId: 'barishal', divisionId: 'barishal', nameBn: 'উজিরপুর', nameEn: 'Wazirpur' },

  // Bhola
  { id: 'bho_sadar', districtId: 'bhola', divisionId: 'barishal', nameBn: 'ভোলা সদর', nameEn: 'Bhola Sadar' },
  { id: 'bho_daulatkhan', districtId: 'bhola', divisionId: 'barishal', nameBn: 'দৌলতখান', nameEn: 'Daulatkhan' },
  { id: 'bho_burhanuddin', districtId: 'bhola', divisionId: 'barishal', nameBn: 'বোরহানউদ্দিন', nameEn: 'Burhanuddin' },
  { id: 'bho_tazumuddin', districtId: 'bhola', divisionId: 'barishal', nameBn: 'তজুমদ্দিন', nameEn: 'Tazumuddin' },
  { id: 'bho_lalmohan', districtId: 'bhola', divisionId: 'barishal', nameBn: 'লালমোহন', nameEn: 'Lalmohan' },
  { id: 'bho_charfasson', districtId: 'bhola', divisionId: 'barishal', nameBn: 'চরফ্যাশন', nameEn: 'Charfasson' },
  { id: 'bho_manpura', districtId: 'bhola', divisionId: 'barishal', nameBn: 'মনপুরা', nameEn: 'Manpura' },

  // Jhalokathi
  { id: 'jha_sadar', districtId: 'jhalokathi', divisionId: 'barishal', nameBn: 'ঝালকাঠি সদর', nameEn: 'Jhalokathi Sadar' },
  { id: 'jha_nalchhiti', districtId: 'jhalokathi', divisionId: 'barishal', nameBn: 'নলছিটি', nameEn: 'Nalchhiti' },
  { id: 'jha_rajapur', districtId: 'jhalokathi', divisionId: 'barishal', nameBn: 'রাজাপুর', nameEn: 'Rajapur' },
  { id: 'jha_kathalia', districtId: 'jhalokathi', divisionId: 'barishal', nameBn: 'কাঁঠালিয়া', nameEn: 'Kathalia' },

  // Patuakhali
  { id: 'pat_sadar', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'পটুয়াখালী সদর', nameEn: 'Patuakhali Sadar' },
  { id: 'pat_bauphal', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'বাউফল', nameEn: 'Bauphal' },
  { id: 'pat_dumki', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'দুমকি', nameEn: 'Dumki' },
  { id: 'pat_dashmina', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'দশমিনা', nameEn: 'Dashmina' },
  { id: 'pat_galachipa', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'গলাচিপা', nameEn: 'Galachipa' },
  { id: 'pat_kalapara', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'কলাপাড়া / কুয়াকাটা', nameEn: 'Kalapara / Kuakata' },
  { id: 'pat_mirzaganj', districtId: 'patuakhali', divisionId: 'barishal', nameBn: 'মির্জাগঞ্জ', nameEn: 'Mirzaganj' },

  // Pirojpur
  { id: 'pir_sadar', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'পিরোজপুর সদর', nameEn: 'Pirojpur Sadar' },
  { id: 'pir_bhandaria', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'ভান্ডারিয়া', nameEn: 'Bhandaria' },
  { id: 'pir_mathbaria', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'মঠবাড়িয়া', nameEn: 'Mathbaria' },
  { id: 'pir_kawkhali', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'কাউখালী', nameEn: 'Kawkhali' },
  { id: 'pir_nesarabad', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'নেছারাবাদ / স্বরূপকাঠি', nameEn: 'Nesarabad' },
  { id: 'pir_nazirpur', districtId: 'pirojpur', divisionId: 'barishal', nameBn: 'নাজিরপুর', nameEn: 'Nazirpur' },

  // Barguna
  { id: 'bar_barguna_sadar', districtId: 'barguna', divisionId: 'barishal', nameBn: 'বরগুনা সদর', nameEn: 'Barguna Sadar' },
  { id: 'bar_amtali', districtId: 'barguna', divisionId: 'barishal', nameBn: 'আমতলী', nameEn: 'Amtali' },
  { id: 'bar_taltali', districtId: 'barguna', divisionId: 'barishal', nameBn: 'তালতলী', nameEn: 'Taltali' },
  { id: 'bar_patharghata', districtId: 'barguna', divisionId: 'barishal', nameBn: 'পাথরঘাটা', nameEn: 'Patharghata' },
  { id: 'bar_betagi', districtId: 'barguna', divisionId: 'barishal', nameBn: 'বেতাগী', nameEn: 'Betagi' },
  { id: 'bar_bamna', districtId: 'barguna', divisionId: 'barishal', nameBn: 'বামনা', nameEn: 'Bamna' },

  // ==========================================
  // SYLHET DIVISION
  // ==========================================
  // Sylhet
  { id: 'syl_sadar', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'সিলেট সদর', nameEn: 'Sylhet Sadar' },
  { id: 'syl_kotwali', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'কোতোয়ালী', nameEn: 'Kotwali' },
  { id: 'syl_jalalabad', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'জালালাবাদ', nameEn: 'Jalalabad' },
  { id: 'syl_airport', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'এয়ারপোর্ট', nameEn: 'Airport' },
  { id: 'syl_shahparan', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'শাহপরাণ', nameEn: 'Shah Paran' },
  { id: 'syl_southsurma', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'দক্ষিণ সুরমা', nameEn: 'South Surma' },
  { id: 'syl_golapganj', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'গোলাপগঞ্জ', nameEn: 'Golapganj' },
  { id: 'syl_beanibazar', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'বিয়ানীবাজার', nameEn: 'Beanibazar' },
  { id: 'syl_biswanath', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'বিশ্বনাথ', nameEn: 'Biswanath' },
  { id: 'syl_osmaninagar', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'ওসমানীনগর', nameEn: 'Osmani Nagar' },
  { id: 'syl_gowainghat', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'গোয়াইনঘাট', nameEn: 'Gowainghat' },
  { id: 'syl_jaintiapur', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'জৈন্তাপুর', nameEn: 'Jaintiapur' },
  { id: 'syl_kanaighat', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'কানাইঘাট', nameEn: 'Kanaighat' },
  { id: 'syl_zakiganj', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'জকিগঞ্জ', nameEn: 'Zakiganj' },
  { id: 'syl_fenchuganj', districtId: 'sylhet', divisionId: 'sylhet', nameBn: 'ফেঞ্চুগঞ্জ', nameEn: 'Fenchuganj' },

  // Moulvibazar
  { id: 'mou_sadar', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'মৌলভীবাজার সদর', nameEn: 'Moulvibazar Sadar' },
  { id: 'mou_sreemangal', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'শ্রীমঙ্গল', nameEn: 'Sreemangal' },
  { id: 'mou_kamalganj', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'কমলগঞ্জ', nameEn: 'Kamalganj' },
  { id: 'mou_kulaura', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'কুলাউড়া', nameEn: 'Kulaura' },
  { id: 'mou_barlekha', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'বড়লেখা', nameEn: 'Barlekha' },
  { id: 'mou_juri', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'জুড়ী', nameEn: 'Juri' },
  { id: 'mou_rajnagar', districtId: 'moulvibazar', divisionId: 'sylhet', nameBn: 'রাজনগর', nameEn: 'Rajnagar' },

  // Habiganj
  { id: 'hab_sadar', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'হবিগঞ্জ সদর', nameEn: 'Habiganj Sadar' },
  { id: 'hab_madhabpur', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'মাধবপুর', nameEn: 'Madhabpur' },
  { id: 'hab_chunarughat', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'চুনারুঘাট', nameEn: 'Chunarughat' },
  { id: 'hab_bahubal', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'বাহুবল', nameEn: 'Bahubal' },
  { id: 'hab_nabiganj', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'নবীগঞ্জ', nameEn: 'Nabiganj' },
  { id: 'hab_baniachong', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'বানিয়াচং', nameEn: 'Baniachong' },
  { id: 'hab_shaistaganj', districtId: 'habiganj', divisionId: 'sylhet', nameBn: 'শায়েস্তাগঞ্জ', nameEn: 'Shaistaganj' },

  // Sunamganj
  { id: 'sun_sadar', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'সুনামগঞ্জ সদর', nameEn: 'Sunamganj Sadar' },
  { id: 'sun_jagannathpur', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'জগন্নাথপুর', nameEn: 'Jagannathpur' },
  { id: 'sun_chhatak', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'ছাতক', nameEn: 'Chhatak' },
  { id: 'sun_dowarabazar', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'দোয়ারাবাজার', nameEn: 'Dowarabazar' },
  { id: 'sun_tahirpur', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'তাহিরপুর', nameEn: 'Tahirpur' },
  { id: 'sun_derai', districtId: 'sunamganj', divisionId: 'sylhet', nameBn: 'দিরাই', nameEn: 'Derai' },

  // ==========================================
  // RANGPUR DIVISION
  // ==========================================
  // Rangpur
  { id: 'ran_sadar', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'রংপুর সদর / কোতোয়ালী', nameEn: 'Rangpur Sadar / Kotwali' },
  { id: 'ran_tajhat', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'তাজহাট', nameEn: 'Tajhat' },
  { id: 'ran_pirgachha', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'পীরগাছা', nameEn: 'Pirgachha' },
  { id: 'ran_mithapukur', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'মিঠাপুকুর', nameEn: 'Mithapukur' },
  { id: 'ran_badarganj', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'বদরগঞ্জ', nameEn: 'Badarganj' },
  { id: 'ran_gangachhara', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'গংগাচড়া', nameEn: 'Gangachhara' },
  { id: 'ran_kaunia', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'কাউনিয়া', nameEn: 'Kaunia' },
  { id: 'ran_pirganj', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'পীরগঞ্জ', nameEn: 'Pirganj' },
  { id: 'ran_taraganj', districtId: 'rangpur', divisionId: 'rangpur', nameBn: 'তারাগঞ্জ', nameEn: 'Taraganj' },

  // Dinajpur
  { id: 'din_sadar', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'দিনাজপুর সদর / কোতোয়ালী', nameEn: 'Dinajpur Sadar' },
  { id: 'din_biral', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'বিরল', nameEn: 'Biral' },
  { id: 'din_birganj', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'বীরগঞ্জ', nameEn: 'Birganj' },
  { id: 'din_fulbari', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'ফুলবাড়ী', nameEn: 'Fulbari' },
  { id: 'din_birampur', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'বিরামপুর', nameEn: 'Birampur' },
  { id: 'din_hakimpur', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'হাকিমপুর (হিলি)', nameEn: 'Hakimpur (Hili)' },
  { id: 'din_parbatipur', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'পার্বতীপুর', nameEn: 'Parbatipur' },
  { id: 'din_chirirbandar', districtId: 'dinajpur', divisionId: 'rangpur', nameBn: 'চিরিরবন্দর', nameEn: 'Chirirbandar' },

  // Gaibandha
  { id: 'gai_sadar', districtId: 'gaibandha', divisionId: 'rangpur', nameBn: 'গাইবান্ধা সদর', nameEn: 'Gaibandha Sadar' },
  { id: 'gai_govindaganj', districtId: 'gaibandha', divisionId: 'rangpur', nameBn: 'গোবিন্দগঞ্জ', nameEn: 'Govindaganj' },
  { id: 'gai_sundarganj', districtId: 'gaibandha', divisionId: 'rangpur', nameBn: 'সুন্দরগঞ্জ', nameEn: 'Sundarganj' },
  { id: 'gai_palashbari', districtId: 'gaibandha', divisionId: 'rangpur', nameBn: 'পলাশবাড়ী', nameEn: 'Palashbari' },
  { id: 'gai_sadullapur', districtId: 'gaibandha', divisionId: 'rangpur', nameBn: 'সাদুল্লাপুর', nameEn: 'Sadullapur' },

  // Kurigram
  { id: 'kur_sadar', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'কুড়িগ্রাম সদর', nameEn: 'Kurigram Sadar' },
  { id: 'kur_ulipur', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'উলিপুর', nameEn: 'Ulipur' },
  { id: 'kur_nageshwari', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'নাগেশ্বরী', nameEn: 'Nageshwari' },
  { id: 'kur_bhurungamari', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'ভুরুঙ্গামারী', nameEn: 'Bhurungamari' },
  { id: 'kur_chilmari', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'চিলমারী', nameEn: 'Chilmari' },
  { id: 'kur_rajarhat', districtId: 'kurigram', divisionId: 'rangpur', nameBn: 'রাজারহাট', nameEn: 'Rajarhat' },

  // Lalmonirhat
  { id: 'lal_sadar', districtId: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'লালমনিরহাট সদর', nameEn: 'Lalmonirhat Sadar' },
  { id: 'lal_aditmari', districtId: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'আদিতমারী', nameEn: 'Aditmari' },
  { id: 'lal_kaliganj', districtId: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'lal_hatibandha', districtId: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'হাতীবান্ধা', nameEn: 'Hatibandha' },
  { id: 'lal_patgram', districtId: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'পাটগ্রাম', nameEn: 'Patgram' },

  // Nilphamari
  { id: 'nil_sadar', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'নীলফামারী সদর', nameEn: 'Nilphamari Sadar' },
  { id: 'nil_saidpur', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'সৈয়দপুর', nameEn: 'Saidpur' },
  { id: 'nil_domar', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'ডোমার', nameEn: 'Domar' },
  { id: 'nil_dimla', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'ডিমলা', nameEn: 'Dimla' },
  { id: 'nil_jaldhaka', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'জলঢাকা', nameEn: 'Jaldhaka' },
  { id: 'nil_kishoreganj', districtId: 'nilphamari', divisionId: 'rangpur', nameBn: 'কিশোরগঞ্জ (নীলফামারী)', nameEn: 'Kishoreganj' },

  // Panchagarh
  { id: 'pan_sadar', districtId: 'panchagarh', divisionId: 'rangpur', nameBn: 'পঞ্চগড় সদর', nameEn: 'Panchagarh Sadar' },
  { id: 'pan_tetulia', districtId: 'panchagarh', divisionId: 'rangpur', nameBn: 'তেঁতুলিয়া', nameEn: 'Tetulia' },
  { id: 'pan_boda', districtId: 'panchagarh', divisionId: 'rangpur', nameBn: 'বোদা', nameEn: 'Boda' },
  { id: 'pan_debiganj', districtId: 'panchagarh', divisionId: 'rangpur', nameBn: 'দেবীগঞ্জ', nameEn: 'Debiganj' },
  { id: 'pan_atwari', districtId: 'panchagarh', divisionId: 'rangpur', nameBn: 'আটোয়ারী', nameEn: 'Atwari' },

  // Thakurgaon
  { id: 'tha_sadar', districtId: 'thakurgaon', divisionId: 'rangpur', nameBn: 'ঠাকুরগাঁও সদর', nameEn: 'Thakurgaon Sadar' },
  { id: 'tha_pirganj', districtId: 'thakurgaon', divisionId: 'rangpur', nameBn: 'পীরগঞ্জ', nameEn: 'Pirganj' },
  { id: 'tha_baliadangi', districtId: 'thakurgaon', divisionId: 'rangpur', nameBn: 'বালিয়াডাঙ্গী', nameEn: 'Baliadangi' },
  { id: 'tha_ranisankail', districtId: 'thakurgaon', divisionId: 'rangpur', nameBn: 'রাণীশংকৈল', nameEn: 'Ranisankail' },
  { id: 'tha_haripur', districtId: 'thakurgaon', divisionId: 'rangpur', nameBn: 'হরিপুর', nameEn: 'Haripur' },

  // ==========================================
  // MYMENSINGH DIVISION
  // ==========================================
  // Mymensingh
  { id: 'mym_sadar', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ময়মনসিংহ সদর / কোতোয়ালী', nameEn: 'Mymensingh Sadar / Kotwali' },
  { id: 'mym_muktagachha', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'মুক্তাগাছা', nameEn: 'Muktagachha' },
  { id: 'mym_trishal', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ত্রিশাল', nameEn: 'Trishal' },
  { id: 'mym_bhaluka', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ভালুকা', nameEn: 'Bhaluka' },
  { id: 'mym_gauripur', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'গৌরীপুর', nameEn: 'Gauripur' },
  { id: 'mym_fulbaria', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ফুলবাড়িয়া', nameEn: 'Fulbaria' },
  { id: 'mym_gafargaon', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'গফরগাঁও', nameEn: 'Gafargaon' },
  { id: 'mym_ishwarganj', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ঈশ্বরগঞ্জ', nameEn: 'Ishwarganj' },
  { id: 'mym_nandail', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'নান্দাইল', nameEn: 'Nandail' },
  { id: 'mym_haluaghat', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'হালুয়াঘাট', nameEn: 'Haluaghat' },
  { id: 'mym_phulpur', districtId: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ফুলপুর', nameEn: 'Phulpur' },

  // Jamalpur
  { id: 'jam_sadar', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'জামালপুর সদর', nameEn: 'Jamalpur Sadar' },
  { id: 'jam_sarishabari', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'সরিষাবাড়ী', nameEn: 'Sarishabari' },
  { id: 'jam_melandaha', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'মেলান্দহ', nameEn: 'Melandaha' },
  { id: 'jam_islampur', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'ইসলামপুর', nameEn: 'Islampur' },
  { id: 'jam_dewanganj', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'দেওয়ানগঞ্জ', nameEn: 'Dewanganj' },
  { id: 'jam_madarganj', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'মাদারগঞ্জ', nameEn: 'Madarganj' },
  { id: 'jam_bakshiganj', districtId: 'jamalpur', divisionId: 'mymensingh', nameBn: 'বকশীগঞ্জ', nameEn: 'Bakshiganj' },

  // Netrokona
  { id: 'net_sadar', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'নেত্রকোণা সদর', nameEn: 'Netrokona Sadar' },
  { id: 'net_kalmakanda', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'কলমাকান্দা', nameEn: 'Kalmakanda' },
  { id: 'net_durgapur', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur' },
  { id: 'net_kendua', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'কেন্দুয়া', nameEn: 'Kendua' },
  { id: 'net_barhatta', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'বারহাট্টা', nameEn: 'Barhatta' },
  { id: 'net_mohangonj', districtId: 'netrokona', divisionId: 'mymensingh', nameBn: 'মোহনগঞ্জ', nameEn: 'Mohangonj' },

  // Sherpur
  { id: 'she_sadar', districtId: 'sherpur', divisionId: 'mymensingh', nameBn: 'শেরপুর সদর', nameEn: 'Sherpur Sadar' },
  { id: 'she_nakla', districtId: 'sherpur', divisionId: 'mymensingh', nameBn: 'নকলা', nameEn: 'Nakla' },
  { id: 'she_nalitabari', districtId: 'sherpur', divisionId: 'mymensingh', nameBn: 'নালিতাবাড়ী', nameEn: 'Nalitabari' },
  { id: 'she_sreebardi', districtId: 'sherpur', divisionId: 'mymensingh', nameBn: 'শ্রীবরদী', nameEn: 'Sreebardi' },
  { id: 'she_jhenaigati', districtId: 'sherpur', divisionId: 'mymensingh', nameBn: 'ঝিনাইগাতী', nameEn: 'Jhenaigati' },
];

export interface GeoSearchResult {
  thanaNameBn?: string;
  thanaNameEn?: string;
  districtId: string;
  districtNameBn: string;
  districtNameEn: string;
  divisionId: string;
  divisionNameBn: string;
  divisionNameEn: string;
  isDhakaCity: boolean;
  displayTextBn: string;
  displayTextEn: string;
}

export function searchBangladeshGeo(query: string, maxResults = 8): GeoSearchResult[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const results: GeoSearchResult[] = [];
  const seenKeys = new Set<string>();

  for (const thana of BD_THANAS) {
    const matchBn = thana.nameBn.toLowerCase().includes(cleanQ);
    const matchEn = thana.nameEn.toLowerCase().includes(cleanQ);
    if (matchBn || matchEn) {
      const dist = BD_DISTRICTS.find((d) => d.id === thana.districtId);
      const div = BD_DIVISIONS.find((dv) => dv.id === thana.divisionId);
      if (dist && div) {
        const key = `${thana.id}-${dist.id}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const isDhakaCity = !!(thana.isDhakaCity || dist.isDhakaCity);
          results.push({
            thanaNameBn: thana.nameBn,
            thanaNameEn: thana.nameEn,
            districtId: dist.id,
            districtNameBn: dist.nameBn,
            districtNameEn: dist.nameEn,
            divisionId: div.id,
            divisionNameBn: div.nameBn,
            divisionNameEn: div.nameEn,
            isDhakaCity,
            displayTextBn: `${thana.nameBn}, ${dist.nameBn} (${div.nameBn} বিভাগ)`,
            displayTextEn: `${thana.nameEn}, ${dist.nameEn} (${div.nameEn} Div)`,
          });
        }
      }
    }
  }

  if (results.length < maxResults) {
    for (const dist of BD_DISTRICTS) {
      const matchBn = dist.nameBn.toLowerCase().includes(cleanQ);
      const matchEn = dist.nameEn.toLowerCase().includes(cleanQ);
      if (matchBn || matchEn) {
        const div = BD_DIVISIONS.find((dv) => dv.id === dist.divisionId);
        if (div) {
          const key = `dist-${dist.id}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const isDhakaCity = !!dist.isDhakaCity;
            results.push({
              districtId: dist.id,
              districtNameBn: dist.nameBn,
              districtNameEn: dist.nameEn,
              divisionId: div.id,
              divisionNameBn: div.nameBn,
              divisionNameEn: div.nameEn,
              isDhakaCity,
              displayTextBn: `${dist.nameBn} জেলা (${div.nameBn} বিভাগ)`,
              displayTextEn: `${dist.nameEn} District (${div.nameEn} Div)`,
            });
          }
        }
      }
    }
  }

  return results.slice(0, maxResults);
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestDistrict(lat: number, lng: number): District {
  let nearestDistrict = BD_DISTRICTS[0];
  let minDistance = Infinity;

  for (const district of BD_DISTRICTS) {
    const distance = calculateDistanceKm(lat, lng, district.lat, district.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestDistrict = district;
    }
  }

  return nearestDistrict;
}

export function formatBangladeshAddress({
  division,
  district,
  thana,
  streetAddress,
}: {
  division?: string;
  district?: string;
  thana?: string;
  streetAddress: string;
}): string {
  const parts: string[] = [];
  const cleanStreet = streetAddress.trim();
  if (cleanStreet) parts.push(cleanStreet);
  if (thana && thana.trim() && !cleanStreet.includes(thana.trim())) parts.push(thana.trim());
  if (district && district.trim() && !cleanStreet.includes(district.trim())) parts.push(district.trim());
  if (division && division.trim() && !district?.includes(division.trim())) parts.push(`${division.trim()} বিভাগ`);

  return parts.join(', ');
}
