import React from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';

interface RandIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const RandIconStyled = styled.span<{ size: 'xs' | 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'xs': return '12px';
      case 'sm': return '16px';
      case 'md': return '20px';
      case 'lg': return '24px';
      default: return '16px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'xs': return '12px';
      case 'sm': return '16px';
      case 'md': return '20px';
      case 'lg': return '24px';
      default: return '16px';
    }
  }};
  background: ${theme.colors.primary[500]};
  color: white;
  border-radius: 50%;
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return '8px';
      case 'sm': return '10px';
      case 'md': return '12px';
      case 'lg': return '14px';
      default: return '10px';
    }
  }};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-right: 4px;
  flex-shrink: 0;
`;

export const RandIcon: React.FC<RandIconProps> = ({ size = 'sm', className }) => {
  return (
    <RandIconStyled size={size} className={className}>
      R
    </RandIconStyled>
  );
};