import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'white' | 'purple' | 'blue' | 'green' | 'gradient' | 'neutral';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', variant = 'white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getLogoColors = () => {
    switch (variant) {
      case 'purple':
        return {
          main: '#a855f7', // purple-500
          accent: '#c084fc', // purple-400
          opacity: '0.9'
        };
      case 'blue':
        return {
          main: '#3b82f6', // blue-500
          accent: '#60a5fa', // blue-400
          opacity: '0.9'
        };
      case 'green':
        return {
          main: '#10b981', // emerald-500
          accent: '#34d399', // emerald-400
          opacity: '0.9'
        };
      case 'gradient':
        return {
          main: 'url(#logoGradient)',
          accent: '#c084fc',
          opacity: '1'
        };
      case 'neutral':
        return {
          main: '#6b7280', // gray-500
          accent: '#9ca3af', // gray-400
          opacity: '0.9'
        };
      case 'white':
      default:
        return {
          main: '#ffffff',
          accent: '#ffffff',
          opacity: '0.8'
        };
    }
  };

  const colors = getLogoColors();

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      viewBox="0 0 24 24" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definition for gradient variant */}
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      )}
      
      {/* Stylized N with modern geometric design */}
      <path 
        d="M4 20 L4 4 L7 4 L17 16 L17 4 L20 4 L20 20 L17 20 L7 8 L7 20 Z" 
        fill={colors.main}
        stroke={colors.main}
        strokeWidth="0.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      
      {/* Optional accent dots for modern touch */}
      <circle cx="4" cy="3" r="0.8" fill={colors.accent} opacity={colors.opacity} />
      <circle cx="20" cy="3" r="0.8" fill={colors.accent} opacity={colors.opacity} />
    </svg>
  );
};