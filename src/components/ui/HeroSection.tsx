import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'contexts/ThemeContext';
import { Button } from 'components/ui/Button';
import { Logo } from 'components/ui/Logo';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  accentText?: string;
  description?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  showDecorative?: boolean;
}

const HeroContainer = styled.div<{ theme: any }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background.primary};
  background-image: ${props => props.theme.colors.background.pattern};
  background-size: ${props => props.theme.colors.background.patternSize};
  padding: ${props => props.theme.spacing['2xl']} ${props => props.theme.spacing.xl};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(74, 222, 128, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    min-height: 90vh;
    padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
  }
`;

const HeroContent = styled.div<{ theme: any }>`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing['4xl']};
  align-items: center;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing['2xl']};
    text-align: left;
  }
`;

const TextContent = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const Greeting = styled.div<{ theme: any }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primary[400]};
  text-transform: uppercase;
  letter-spacing: ${props => props.theme.typography.letterSpacing.wider};
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 2px;
    background: ${props => props.theme.gradients.primary};
  }
`;

const MainTitle = styled.h1<{ theme: any }>`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: ${props => props.theme.typography.fontWeight.black};
  line-height: ${props => props.theme.typography.lineHeight.tight};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  letter-spacing: ${props => props.theme.typography.letterSpacing.tighter};
  font-family: ${props => props.theme.typography.fontFamily.display.join(', ')};
  
  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }
`;

const AccentText = styled.span<{ theme: any }>`
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: ${props => props.theme.typography.fontWeight.black};
  text-transform: uppercase;
  letter-spacing: ${props => props.theme.typography.letterSpacing.tight};
  display: block;
  margin-top: ${props => props.theme.spacing.md};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -40px;
    width: 20px;
    height: 20px;
    background: ${props => props.theme.colors.primary[400]};
    border-radius: 50%;
    transform: translateY(-50%);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
    50% { opacity: 0.7; transform: translateY(-50%) scale(1.1); }
  }
`;

const Description = styled.p<{ theme: any }>`
  font-size: ${props => props.theme.typography.fontSize.xl};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  max-width: 600px;
`;

const ActionButtons = styled.div<{ theme: any }>`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Button)<{ theme: any }>`
  background: ${props => props.theme.gradients.button};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.professional};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.professionalHover};
    background: ${props => props.theme.gradients.buttonHover};
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SecondaryButton = styled(Button)<{ theme: any }>`
  background: transparent;
  color: ${props => props.theme.colors.text.primary};
  border: 2px solid ${props => props.theme.colors.border.accent};
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.background.primary};
    border-color: ${props => props.theme.colors.primary[400]};
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.professionalHover};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.gradients.primary};
    transition: left 0.4s;
    z-index: -1;
  }
  
  &:hover::before {
    left: 0;
  }
`;

const DecorativeSection = styled.div<{ theme: any }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  
  @media (max-width: 768px) {
    margin-top: ${props => props.theme.spacing['2xl']};
    min-height: 300px;
  }
`;

const FloatingElement = styled.div<{ theme: any; delay?: number; size?: number }>`
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  position: absolute;
  animation: float 8s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  opacity: 0.6;
  filter: blur(1px);
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(90deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
    75% { transform: translateY(-30px) rotate(270deg); }
  }
`;

const GlowOrb = styled.div<{ theme: any; delay?: number }>`
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, ${props => props.theme.colors.primary[400]} 0%, transparent 70%);
  border-radius: 50%;
  position: absolute;
  animation: glow 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  opacity: 0.3;
  
  @keyframes glow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.6; }
  }
`;

const LogoSection = styled.div<{ theme: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    order: -1;
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  accentText,
  description,
  primaryAction,
  secondaryAction,
  showDecorative = true
}) => {
  const { theme, mode } = useTheme();

  return (
    <HeroContainer theme={theme}>
      <HeroContent theme={theme}>
        <TextContent theme={theme}>
          {subtitle && (
            <Greeting theme={theme}>
              {subtitle}
            </Greeting>
          )}
          
          <MainTitle theme={theme}>
            {title}
            {accentText && (
              <AccentText theme={theme}>
                {accentText}
              </AccentText>
            )}
          </MainTitle>
          
          {description && (
            <Description theme={theme}>
              {description}
            </Description>
          )}
          
          {(primaryAction || secondaryAction) && (
            <ActionButtons theme={theme}>
              {primaryAction && (
                <PrimaryButton theme={theme} onClick={primaryAction.onClick}>
                  {primaryAction.text}
                </PrimaryButton>
              )}
              
              {secondaryAction && (
                <SecondaryButton theme={theme} onClick={secondaryAction.onClick}>
                  {secondaryAction.text}
                </SecondaryButton>
              )}
            </ActionButtons>
          )}
        </TextContent>
        
        <DecorativeSection theme={theme}>
          <LogoSection theme={theme}>
            <Logo 
              variant={mode} 
              size="lg" 
              showText={true}
              customLogo="/images/lightmode.jpeg"
              customLogoAlt="Chair Care Logo"
            />
          </LogoSection>
          
          {showDecorative && (
            <>
              <FloatingElement theme={theme} delay={0} size={60} style={{ top: '10%', right: '15%' }} />
              <FloatingElement theme={theme} delay={2} size={40} style={{ top: '60%', right: '5%' }} />
              <FloatingElement theme={theme} delay={4} size={50} style={{ top: '80%', right: '30%' }} />
              <GlowOrb theme={theme} delay={1} style={{ top: '30%', right: '20%' }} />
              <GlowOrb theme={theme} delay={3} style={{ top: '70%', right: '10%' }} />
            </>
          )}
        </DecorativeSection>
      </HeroContent>
    </HeroContainer>
  );
};