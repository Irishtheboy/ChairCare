import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'contexts/ThemeContext';
import { theme as defaultTheme } from 'styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<ButtonProps & { currentTheme: any }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${defaultTheme.spacing.sm};
  font-family: ${defaultTheme.typography.fontFamily.sans.join(', ')};
  font-weight: ${defaultTheme.typography.fontWeight.medium};
  border: none;
  border-radius: ${defaultTheme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${defaultTheme.spacing.sm} ${defaultTheme.spacing.md};
          font-size: ${defaultTheme.typography.fontSize.sm};
          min-height: 2rem;
        `;
      case 'lg':
        return `
          padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.xl};
          font-size: ${defaultTheme.typography.fontSize.lg};
          min-height: 3rem;
        `;
      default:
        return `
          padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.lg};
          font-size: ${defaultTheme.typography.fontSize.base};
          min-height: 2.5rem;
        `;
    }
  }}
  
  ${({ variant = 'primary', currentTheme }) => {
    const isDark = currentTheme?.mode === 'dark';
    
    switch (variant) {
      case 'secondary':
        return `
          background: ${isDark ? defaultTheme.colors.gray[800] : defaultTheme.colors.gray[100]};
          color: ${isDark ? defaultTheme.colors.gray[200] : defaultTheme.colors.gray[700]};
          border: 1px solid ${isDark ? defaultTheme.colors.gray[600] : defaultTheme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background: ${isDark ? defaultTheme.colors.gray[700] : defaultTheme.colors.gray[200]};
            border-color: ${isDark ? defaultTheme.colors.gray[500] : defaultTheme.colors.gray[400]};
          }
        `;
      case 'success':
        return `
          background: ${defaultTheme.colors.success[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${defaultTheme.colors.success[600]};
          }
        `;
      case 'warning':
        return `
          background: ${defaultTheme.colors.warning[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${defaultTheme.colors.warning[600]};
          }
        `;
      case 'error':
      case 'danger':
        return `
          background: ${defaultTheme.colors.error[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${defaultTheme.colors.error[600]};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${isDark ? defaultTheme.colors.primary[400] : defaultTheme.colors.primary[600]};
          
          &:hover:not(:disabled) {
            background: ${isDark ? 'rgba(74, 222, 128, 0.1)' : defaultTheme.colors.primary[50]};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${isDark ? defaultTheme.colors.primary[400] : defaultTheme.colors.primary[600]};
          border: 1px solid ${isDark ? defaultTheme.colors.primary[400] : defaultTheme.colors.primary[300]};
          
          &:hover:not(:disabled) {
            background: ${isDark ? 'rgba(74, 222, 128, 0.1)' : defaultTheme.colors.primary[50]};
            border-color: ${isDark ? defaultTheme.colors.primary[300] : defaultTheme.colors.primary[400]};
          }
        `;
      default:
        return `
          background: ${isDark 
            ? `linear-gradient(135deg, ${defaultTheme.colors.primary[500]} 0%, ${defaultTheme.colors.primary[600]} 100%)`
            : `linear-gradient(135deg, ${defaultTheme.colors.primary[600]} 0%, ${defaultTheme.colors.primary[700]} 100%)`
          };
          color: white;
          box-shadow: ${isDark ? defaultTheme.shadows.sm : defaultTheme.shadows.md};
          
          &:hover:not(:disabled) {
            background: ${isDark
              ? `linear-gradient(135deg, ${defaultTheme.colors.primary[600]} 0%, ${defaultTheme.colors.primary[700]} 100%)`
              : `linear-gradient(135deg, ${defaultTheme.colors.primary[700]} 0%, ${defaultTheme.colors.primary[800]} 100%)`
            };
            box-shadow: ${isDark ? defaultTheme.shadows.md : defaultTheme.shadows.lg};
            transform: translateY(-1px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  disabled,
  ...props 
}) => {
  const { theme: currentTheme } = useTheme();
  
  return (
    <StyledButton {...props} currentTheme={currentTheme} disabled={disabled || loading}>
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};