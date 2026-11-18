import React from 'react';

interface KasabLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  badgeBg?: string;
  rounded?: boolean;
}

export const KasabLogo: React.FC<KasabLogoProps> = ({
  className = 'w-10 h-10 sm:w-12 sm:h-12',
  rounded = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${
        rounded ? 'rounded-full' : ''
      } ${className}`}
      title="Kasab Gallery"
    >
      <img
        src="/kasab-logo.svg"
        alt="Kasab Gallery Logo"
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
