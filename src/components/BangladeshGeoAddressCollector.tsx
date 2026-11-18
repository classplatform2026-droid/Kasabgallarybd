import React, { useState, useEffect, useMemo } from 'react';
import {
  BD_DIVISIONS,
  BD_DISTRICTS,
  BD_THANAS,
  findNearestDistrict,
  formatBangladeshAddress,
} from '../data/bangladeshGeoEngine';
import {
  MapPin,
  CheckCircle2,
  Building2,
  Truck,
  Sparkles,
  Navigation,
  ChevronDown,
  Layers,
} from 'lucide-react';

export interface GeoAddressData {
  fullAddress: string;
  streetAddress: string;
  division: string;
  district: string;
  thana: string;
  city: 'Dhaka' | 'Outside Dhaka';
}

interface BangladeshGeoAddressCollectorProps {
  initialStreetAddress?: string;
  initialDistrict?: string;
  initialThana?: string;
  initialCity?: 'Dhaka' | 'Outside Dhaka';
  language?: 'bn' | 'en';
  onAddressChange: (data: GeoAddressData) => void;
  error?: string;
}

export const BangladeshGeoAddressCollector: React.FC<BangladeshGeoAddressCollectorProps> = ({
  initialStreetAddress = '',
  initialDistrict = 'ঢাকা সিটি কর্পোরেশন',
  initialThana = 'ধানমন্ডি',
  initialCity = 'Dhaka',
  language = 'bn',
  onAddressChange,
  error,
}) => {
  // 1. Division Selection State
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(() => {
    const foundDistrict = BD_DISTRICTS.find(
      (d) => d.nameBn === initialDistrict || d.nameEn.toLowerCase() === initialDistrict.toLowerCase()
    );
    return foundDistrict?.divisionId || 'dhaka';
  });

  // 2. District Selection State
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    const foundDistrict = BD_DISTRICTS.find(
      (d) => d.nameBn === initialDistrict || d.nameEn.toLowerCase() === initialDistrict.toLowerCase()
    );
    return foundDistrict?.id || 'dhaka_city';
  });

  const [districtNameBn, setDistrictNameBn] = useState<string>(initialDistrict);

  // 3. Thana Selection State
  const [thanaNameBn, setThanaNameBn] = useState<string>(initialThana);
  const [customThana, setCustomThana] = useState<string>('');
  const [isCustomThanaMode, setIsCustomThanaMode] = useState<boolean>(false);

  // 4. Detailed Street Address State
  const [streetAddress, setStreetAddress] = useState<string>(initialStreetAddress);
  const [cityZone, setCityZone] = useState<'Dhaka' | 'Outside Dhaka'>(initialCity);

  // GPS auto-detection feedback
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Filtered districts for chosen division
  const availableDistricts = useMemo(() => {
    return BD_DISTRICTS.filter((d) => d.divisionId === selectedDivisionId);
  }, [selectedDivisionId]);

  // Filtered thanas for chosen district
  const availableThanas = useMemo(() => {
    return BD_THANAS.filter((t) => t.districtId === selectedDistrictId);
  }, [selectedDistrictId]);

  // Current Division object
  const currentDivision = useMemo(() => {
    return BD_DIVISIONS.find((div) => div.id === selectedDivisionId) || BD_DIVISIONS[0];
  }, [selectedDivisionId]);

  // Current District object
  const currentDistrict = useMemo(() => {
    return BD_DISTRICTS.find((dist) => dist.id === selectedDistrictId) || BD_DISTRICTS[0];
  }, [selectedDistrictId]);

  // Automatically ensure valid thana when district changes
  useEffect(() => {
    if (availableThanas.length > 0) {
      const exists = availableThanas.some((t) => t.nameBn === thanaNameBn);
      if (!exists && !isCustomThanaMode) {
        setThanaNameBn(availableThanas[0].nameBn);
      }
    }
  }, [availableThanas, thanaNameBn, isCustomThanaMode]);

  // Emit updated address data to parent component
  useEffect(() => {
    const activeThana = isCustomThanaMode ? customThana.trim() : thanaNameBn;
    const formatted = formatBangladeshAddress({
      streetAddress: streetAddress.trim(),
      thana: activeThana,
      district: districtNameBn,
      division: currentDivision.nameBn,
    });

    onAddressChange({
      fullAddress: formatted,
      streetAddress: streetAddress.trim(),
      division: currentDivision.nameBn,
      district: districtNameBn,
      thana: activeThana,
      city: cityZone,
    });
  }, [streetAddress, thanaNameBn, customThana, isCustomThanaMode, districtNameBn, currentDivision, cityZone]);

  // Change Division handler
  const handleDivisionChange = (newDivisionId: string) => {
    setSelectedDivisionId(newDivisionId);
    const districtsInDiv = BD_DISTRICTS.filter((d) => d.divisionId === newDivisionId);
    if (districtsInDiv.length > 0) {
      const firstDist = districtsInDiv[0];
      setSelectedDistrictId(firstDist.id);
      setDistrictNameBn(firstDist.nameBn);
      setCityZone(firstDist.isDhakaCity ? 'Dhaka' : 'Outside Dhaka');

      // Update thana
      const thanasInDist = BD_THANAS.filter((t) => t.districtId === firstDist.id);
      if (thanasInDist.length > 0) {
        setThanaNameBn(thanasInDist[0].nameBn);
        setIsCustomThanaMode(false);
      } else {
        setThanaNameBn(firstDist.nameBn + ' সদর');
        setIsCustomThanaMode(false);
      }
    }
  };

  // Change District handler
  const handleDistrictChange = (newDistrictId: string) => {
    setSelectedDistrictId(newDistrictId);
    const dist = BD_DISTRICTS.find((d) => d.id === newDistrictId);
    if (dist) {
      setDistrictNameBn(dist.nameBn);
      setCityZone(dist.isDhakaCity ? 'Dhaka' : 'Outside Dhaka');

      // Update thana
      const thanasInDist = BD_THANAS.filter((t) => t.districtId === dist.id);
      if (thanasInDist.length > 0) {
        setThanaNameBn(thanasInDist[0].nameBn);
        setIsCustomThanaMode(false);
      } else {
        setThanaNameBn(dist.nameBn + ' সদর');
        setIsCustomThanaMode(false);
      }
    }
  };

  // Select Thana handler
  const handleThanaChange = (newThanaBn: string) => {
    if (newThanaBn === '__CUSTOM__') {
      setIsCustomThanaMode(true);
    } else {
      setIsCustomThanaMode(false);
      setThanaNameBn(newThanaBn);
    }
  };

  // GPS Auto-detect handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsMessage(language === 'bn' ? 'আপনার ব্রাউজারে লোকেশন সমর্থন নেই' : 'Geolocation not supported');
      return;
    }
    setIsDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestDistrict(latitude, longitude);

        setSelectedDivisionId(nearest.divisionId);
        setSelectedDistrictId(nearest.id);
        setDistrictNameBn(nearest.nameBn);
        setCityZone(nearest.isDhakaCity ? 'Dhaka' : 'Outside Dhaka');

        const thanasInDist = BD_THANAS.filter((t) => t.districtId === nearest.id);
        if (thanasInDist.length > 0) {
          setThanaNameBn(thanasInDist[0].nameBn);
          setIsCustomThanaMode(false);
        }

        setGpsMessage(
          language === 'bn'
            ? `শনাক্ত হয়েছে: ${nearest.nameBn} (${nearest.divisionId === 'dhaka' ? 'ঢাকা বিভাগ' : 'বিভাগ'})`
            : `Detected: ${nearest.nameEn}`
        );
      },
      () => {
        setIsDetectingGps(false);
        setGpsMessage(
          language === 'bn'
            ? 'লোকেশন পারমিশন পাওয়া যায়নি। ম্যানুয়ালি বিভাগ ও জেলা নির্বাচন করুন।'
            : 'Permission denied. Please select manually.'
        );
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="space-y-4 rounded-2xl bg-[#fafaf6] p-4 sm:p-5 border border-neutral-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#2d5016] text-[#d4af37] flex items-center justify-center font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
              {language === 'bn' ? 'ডেলিভারি ঠিকানা (ধাপে ধাপে নির্বাচন)' : 'Delivery Address (Step-by-Step)'}
            </h3>
            <p className="text-[10px] text-neutral-500">
              বিভাগ ➔ জেলা ➔ থানা/উপজেলা নির্বাচন করুন
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isDetectingGps}
          className="text-[11px] font-bold text-[#2d5016] hover:text-[#234011] bg-white hover:bg-neutral-50 px-2.5 py-1.5 rounded-xl border border-neutral-300 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
        >
          <Navigation className={`w-3 h-3 text-[#d4af37] ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'শনাক্ত হচ্ছে...' : 'অটো-লোকেশন ডিটেক্ট'}</span>
        </button>
      </div>

      {gpsMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
          <span>{gpsMessage}</span>
          <button
            type="button"
            onClick={() => setGpsMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* CASCADING GRID: STEP 1 (Division) & STEP 2 (District) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* ধাপ ১: বিভাগ নির্বাচন (Division) */}
        <div>
          <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2d5016] text-white text-[10px] font-bold flex items-center justify-center">
              ১
            </span>
            <span>বিভাগ নির্বাচন করুন *</span>
          </label>
          <div className="relative">
            <select
              id="geo-division-select"
              value={selectedDivisionId}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-[#2d5016] cursor-pointer appearance-none shadow-2xs"
            >
              {BD_DIVISIONS.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.nameBn} বিভাগ ({div.nameEn})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* ধাপ ২: জেলা নির্বাচন (District) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#2d5016] text-white text-[10px] font-bold flex items-center justify-center">
                ২
              </span>
              <span>জেলা নির্বাচন করুন *</span>
            </label>
            <span className="text-[10px] text-neutral-400">
              {availableDistricts.length}টি জেলা
            </span>
          </div>
          <div className="relative">
            <select
              id="geo-district-select"
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-[#2d5016] cursor-pointer appearance-none shadow-2xs"
            >
              {availableDistricts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.nameBn} {dist.isDhakaCity ? '★ (ঢাকা সিটি - ৳৭০)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ধাপ ৩: থানা / উপজেলা নির্বাচন (Thana/Upazila Selection) - ALWAYS VISIBLE */}
      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2d5016] text-white text-[10px] font-bold flex items-center justify-center">
              ৩
            </span>
            <span>থানা / উপজেলা নির্বাচন করুন ({districtNameBn}) *</span>
          </label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {availableThanas.length}টি থানা/উপজেলা তালিকাভুক্ত
          </span>
        </div>

        {/* Dropdown Selector for Thana */}
        <div className="relative">
          <select
            id="geo-thana-select"
            value={isCustomThanaMode ? '__CUSTOM__' : thanaNameBn}
            onChange={(e) => handleThanaChange(e.target.value)}
            className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-[#2d5016] cursor-pointer appearance-none shadow-2xs"
          >
            {availableThanas.map((th) => (
              <option key={th.id} value={th.nameBn}>
                {th.nameBn} ({th.nameEn})
              </option>
            ))}
            <option value="__CUSTOM__">✍ তালিকায় না থাকলে নিজে লিখুন (কাস্টম থানা/উপজেলা)...</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Custom Thana Input if chosen or needed */}
        {isCustomThanaMode && (
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5 animate-fadeIn">
            <label className="block text-[11px] font-bold text-amber-900">
              আপনার থানা বা উপজেলার নাম লিখুন:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customThana}
                onChange={(e) => setCustomThana(e.target.value)}
                placeholder="যেমন: শিবপুর বা আপনার এলাকার নাম..."
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-[#2d5016]"
              />
              <button
                type="button"
                onClick={() => setIsCustomThanaMode(false)}
                className="px-3 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold cursor-pointer"
              >
                তালিকায় ফিরুন
              </button>
            </div>
          </div>
        )}

        {/* Quick Clickable Thana Chips (Always displayed for instant 1-click selection!) */}
        <div className="space-y-1.5 pt-1 border-t border-neutral-100">
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>এক ক্লিকে থানা নির্বাচন করুন:</span>
            <span className="text-[10px] text-neutral-400">
              বর্তমান: <strong className="text-neutral-900">{isCustomThanaMode ? customThana || 'কাস্টম' : thanaNameBn}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 py-1">
            {availableThanas.map((th) => {
              const isSelected = !isCustomThanaMode && thanaNameBn === th.nameBn;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    setThanaNameBn(th.nameBn);
                    setIsCustomThanaMode(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2d5016] text-white border-[#2d5016] font-bold shadow-2xs scale-102'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {th.nameBn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ধাপ ৪: বিস্তারিত ঠিকানা (Street / House / Area) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2d5016] text-white text-[10px] font-bold flex items-center justify-center">
              ৪
            </span>
            <span>বিস্তারিত ঠিকানা (বাড়ি নং, রোড নং, এলাকা / গ্রাম) *</span>
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">
            {districtNameBn} &gt; {isCustomThanaMode ? customThana || 'থানা' : thanaNameBn}
          </span>
        </div>

        <textarea
          id="checkout-street-address"
          rows={2}
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="উদাহরণ: বাড়ি #১২, রোড #০৪, সেক্টর #৭, উত্তরা অথবা গ্রামের নাম ও বাজার..."
          className={`w-full p-3 rounded-xl border text-xs sm:text-sm bg-white focus:outline-none focus:border-[#2d5016] resize-none ${
            error ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
          }`}
        />

        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>

      {/* LIVE COURIER DELIVERY PREVIEW BADGE */}
      <div className="p-3 rounded-xl bg-white border border-neutral-200 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-neutral-700 flex items-center gap-1.5 text-[11px]">
            <Truck className="w-3.5 h-3.5 text-[#2d5016]" />
            <span>কুরিয়ার ডেলিভারি লেবেল প্রিভিউ:</span>
          </span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
            cityZone === 'Dhaka'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {cityZone === 'Dhaka' ? 'ঢাকা সিটির ভিতর (ডেলিভারি ৳৭০)' : 'ঢাকার বাইরে সারা বাংলাদেশ (ডেলিভারি ৳১৩০)'}
          </span>
        </div>

        <p className="font-mono text-neutral-900 font-semibold bg-neutral-50 p-2 rounded-lg border border-neutral-100 text-[11px] sm:text-xs leading-relaxed">
          {formatBangladeshAddress({
            streetAddress: streetAddress.trim() || '...',
            thana: isCustomThanaMode ? customThana || '...' : thanaNameBn,
            district: districtNameBn,
            division: currentDivision.nameBn,
          })}
        </p>
      </div>
    </div>
  );
};
