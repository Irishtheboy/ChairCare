import React from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  customLogo?: string; // Path to custom logo image
  customLogoDark?: string; // Path to custom logo for dark mode
  customLogoAlt?: string; // Alt text for custom logo
}

const LogoContainer = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => {
    switch (props.size) {
      case 'sm': return theme.spacing.sm;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.md;
    }
  }};
`;

const LogoIcon = styled.div<{ size: string; variant: string; hasCustomLogo?: boolean }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  border-radius: ${props => props.hasCustomLogo ? '0' : theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  background: ${props => props.hasCustomLogo ? 'transparent' : (
    props.variant === 'dark' 
      ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
  )};
  
  box-shadow: ${props => props.hasCustomLogo ? 'none' : (
    props.variant === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(14, 165, 233, 0.3)'
  )};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.hasCustomLogo ? 'transparent' : (
      props.variant === 'dark'
        ? 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
        : 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
    )};
  }
`;

const CustomLogoImage = styled.img<{ size: string; variant: string }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  object-fit: contain;
  position: relative;
  z-index: 1;
  
  /* Improve visibility in dark mode */
  filter: ${props => props.variant === 'dark' 
    ? 'brightness(1.1) contrast(1.05) drop-shadow(0 0 8px rgba(255,255,255,0.1))' 
    : 'none'
  };
  transition: filter 0.3s ease;
`;

const ChairSVG = styled.svg<{ size: string; variant: string }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '18px';
      case 'lg': return '28px';
      default: return '22px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '18px';
      case 'lg': return '28px';
      default: return '22px';
    }
  }};
  fill: ${props => props.variant === 'dark' ? '#e2e8f0' : '#ffffff'};
  position: relative;
  z-index: 1;
`;

const LogoText = styled.div<{ size: string; variant: string }>`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const BrandName = styled.span<{ size: string; variant: string }>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.lg;
      case 'lg': return theme.typography.fontSize['2xl'];
      default: return theme.typography.fontSize.xl;
    }
  }};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${props => props.variant === 'dark' ? theme.colors.gray[100] : theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily.sans.join(', ')};
  letter-spacing: -0.02em;
`;

const BrandTagline = styled.span<{ size: string; variant: string }>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.xs;
      case 'lg': return theme.typography.fontSize.sm;
      default: return theme.typography.fontSize.xs;
    }
  }};
  color: ${props => props.variant === 'dark' ? theme.colors.gray[400] : theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'light', 
  size = 'md', 
  showText = true,
  className,
  customLogo,
  customLogoDark,
  customLogoAlt = 'Logo'
}) => {
  // Choose the appropriate logo based on theme
  const logoSrc = variant === 'dark' && customLogoDark ? customLogoDark : customLogo;
  
  return (
    <LogoContainer size={size} className={className}>
      <LogoIcon size={size} variant={variant} hasCustomLogo={!!logoSrc}>
        {logoSrc ? (
          <CustomLogoImage 
            src={logoSrc} 
            alt={customLogoAlt}
            size={size}
            variant={variant}
            onError={(e) => {
              console.warn('Custom logo failed to load, falling back to default');
              // Hide the image and show default icon
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <ChairSVG size={size} variant={variant} viewBox="0 0 24 24">
            {/* Modern chair icon design */}
            <path d="M7 11v2h10v-2H7zm0-4V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H5c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2h2zm2-2v2h6V5H9z"/>
            {/* Add subtle design elements */}
            <circle cx="12" cy="8" r="1" opacity="0.3"/>
            <rect x="8" y="12" width="8" height="1" opacity="0.2"/>
          </ChairSVG>
        )}
      </LogoIcon>
      
      {showText && (
        <LogoText size={size} variant={variant}>
          <BrandName size={size} variant={variant}>
            Chair Care
          </BrandName>
          <BrandTagline size={size} variant={variant}>
            QR Service Management
          </BrandTagline>
        </LogoText>
      )}
    </LogoContainer>
  );
};