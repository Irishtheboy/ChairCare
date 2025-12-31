import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'contexts/ThemeContext';
import { theme as defaultTheme } from 'styles/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const StyledCard = styled.div<{ theme: any; cardProps: CardProps }>`
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  background: ${props => props.theme.mode === 'dark' ? '#1a1a1a' : '#ffffff'};
  border: ${props => props.theme.mode === 'dark' ? 'none' : '1px solid #e2e8f0'};
  border-radius: 1rem;
  overflow: hidden;
  font-family: ${defaultTheme.typography.fontFamily.sans.join(', ')};
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };
  --gradient: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(to bottom, #4ade80, #22c55e, #16a34a)'
    : 'linear-gradient(to bottom, #22c55e, #16a34a, #15803d)'
  };
  --color: ${props => props.theme.mode === 'dark' ? '#4ade80' : '#16a34a'};
  
  /* Outer border gradient effect */
  &:before {
    position: absolute;
    content: "";
    inset: 0.0625rem;
    border-radius: 0.9375rem;
    background: ${props => props.theme.mode === 'dark' 
      ? '#0a0a0a' 
      : '#ffffff'
    };
    background-image: ${props => props.theme.mode === 'dark' 
      ? 'radial-gradient(rgba(255, 255, 255, 0.05) 10%, transparent 1%)' 
      : 'radial-gradient(rgba(0, 0, 0, 0.02) 10%, transparent 1%)'
    };
    background-size: 8px 8px;
    z-index: 2;
  }
  
  /* Left accent bar */
  &:after {
    position: absolute;
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    border-radius: 0.125rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }
  
  ${({ cardProps, theme }) => cardProps.hover && `
    &:hover:after {
      transform: translateX(0.15rem);
    }
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme?.mode === 'dark' 
        ? '0 20px 40px rgba(74, 222, 128, 0.15)'
        : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      };
    }
    
    &:hover .card-glow {
      opacity: ${theme?.mode === 'dark' ? '0.1' : '0.05'};
    }
    
    &:hover .card-border-glow {
      opacity: ${theme?.mode === 'dark' ? '0.1' : '0.05'};
    }
  `}
  
  ${({ cardProps }) => {
    switch (cardProps.padding) {
      case 'sm':
        return `
          min-height: 4rem;
        `;
      case 'lg':
        return `
          min-height: 12rem;
        `;
      default:
        return `
          min-height: 8rem;
        `;
    }
  }}
`;

const CardGlow = styled.div<{ theme: any }>`
  position: absolute;
  width: 20rem;
  height: 20rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.mode === 'dark' 
    ? 'radial-gradient(circle closest-side at center, rgba(74, 222, 128, 0.8), transparent)'
    : 'radial-gradient(circle closest-side at center, rgba(74, 222, 128, 0.3), transparent)'
  };
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: 3;
  pointer-events: none;
`;

const CardBorderGlow = styled.div<{ theme: any }>`
  position: absolute;
  width: 20rem;
  height: 20rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.mode === 'dark' 
    ? 'radial-gradient(circle closest-side at center, rgba(74, 222, 128, 0.4), transparent)'
    : 'radial-gradient(circle closest-side at center, rgba(74, 222, 128, 0.2), transparent)'
  };
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: 1;
  pointer-events: none;
`;

const CardContainer = styled.div<{ theme: any; cardProps: CardProps }>`
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  ${({ cardProps }) => {
    switch (cardProps.padding) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
        `;
      case 'lg':
        return `
          padding: 1.5rem 1.25rem;
        `;
      default:
        return `
          padding: 1rem 1.25rem;
        `;
    }
  }}
  
  ${({ cardProps }) => cardProps.hover && `
    transition: transform 300ms ease;
    
    ${StyledCard}:hover & {
      transform: translateX(0.15rem);
    }
  `}
`;

const CardHeaderStyled = styled.div<{ isDark: boolean }>`
  margin-bottom: ${defaultTheme.spacing.md};
  padding-bottom: ${defaultTheme.spacing.md};
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(74, 222, 128, 0.2)' 
    : 'rgba(22, 163, 74, 0.2)'
  };
`;

const CardTitleStyled = styled.h3<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#4ade80' : '#16a34a'};
  font-weight: ${defaultTheme.typography.fontWeight.semibold};
  font-size: ${defaultTheme.typography.fontSize.lg};
  margin: 0 0 ${defaultTheme.spacing.sm} 0;
  transition: transform 300ms ease;
  line-height: ${defaultTheme.typography.lineHeight.tight};
  
  ${StyledCard}:hover & {
    transform: translateX(0.1rem);
  }
`;

const CardContentStyled = styled.div<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#cbd5e1' : '#475569'};
  line-height: ${defaultTheme.typography.lineHeight.relaxed};
  flex: 1;
  transition: transform 300ms ease;
  font-size: ${defaultTheme.typography.fontSize.base};
  font-weight: ${defaultTheme.typography.fontWeight.normal};
  
  ${StyledCard}:hover & {
    transform: translateX(0.2rem);
  }
  
  /* Improve readability for different text elements */
  p {
    margin: 0 0 ${defaultTheme.spacing.sm} 0;
    color: ${props => props.isDark ? '#cbd5e1' : '#475569'};
  }
  
  strong {
    color: ${props => props.isDark ? '#f8fafc' : '#0f172a'};
    font-weight: ${defaultTheme.typography.fontWeight.semibold};
  }
  
  small {
    color: ${props => props.isDark ? '#94a3b8' : '#64748b'};
    font-size: ${defaultTheme.typography.fontSize.sm};
  }
`;

// Wrapper components that provide theme automatically
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <CardHeaderStyled isDark={theme.mode === 'dark'}>{children}</CardHeaderStyled>;
};

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <CardTitleStyled isDark={theme.mode === 'dark'}>{children}</CardTitleStyled>;
};

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <CardContentStyled isDark={theme.mode === 'dark'}>{children}</CardContentStyled>;
};

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Content: typeof CardContent;
} = ({ children, hover = false, ...props }) => {
  const { theme } = useTheme();
  
  const cardProps = { ...props, hover, children };
  
  return (
    <StyledCard theme={theme} cardProps={cardProps}>
      <CardGlow theme={theme} className="card-glow" />
      <CardBorderGlow theme={theme} className="card-border-glow" />
      <CardContainer theme={theme} cardProps={cardProps}>
        {children}
      </CardContainer>
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;