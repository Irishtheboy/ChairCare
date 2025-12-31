import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'contexts/ThemeContext';
import { Logo } from 'components/ui/Logo';
import { EmailIcon } from 'components/icons/IconSystem';

const FooterContainer = styled.footer<{ theme: any }>`
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  };
  border-top: 1px solid ${props => props.theme.colors.border.primary};
  padding: ${props => props.theme.spacing.lg} 0;
  margin-top: auto;
`;

const FooterContent = styled.div<{ theme: any }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.md};
  }
`;

const FooterGrid = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: ${props => props.theme.spacing.md};
  }
`;

const CompanySection = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const ContactInfo = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ContactLink = styled.a<{ theme: any }>`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

const CopyrightText = styled.div<{ theme: any }>`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  @media (max-width: 768px) {
    order: -1;
  }
`;

export const Footer: React.FC = () => {
  const { theme, mode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer theme={theme}>
      <FooterContent theme={theme}>
        <FooterGrid theme={theme}>
          <CompanySection theme={theme}>
            <Logo 
              variant={mode} 
              size="sm" 
              showText={true}
              customLogo="/images/lightmode.jpeg"
              customLogoAlt="Chair Care Logo"
            />
            <ContactInfo theme={theme}>
              <EmailIcon size={14} />
              <ContactLink theme={theme} href="mailto:support@chaircare.co.za">
                support@chaircare.co.za
              </ContactLink>
            </ContactInfo>
          </CompanySection>

          <CopyrightText theme={theme}>
            © {currentYear} Chair Care. All rights reserved.
          </CopyrightText>
        </FooterGrid>
      </FooterContent>
    </FooterContainer>
  );
};