import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from 'contexts/ThemeContext';
import { Button } from 'components/ui/Button';
import { Card } from 'components/ui/Card';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ModalOverlay = styled.div<{ theme: any; isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.xl};
`;

const ModalCard = styled(Card)<{ theme: any }>`
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'
  };
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows['2xl']};
  backdrop-filter: blur(20px);
`;

const ModalHeader = styled.div<{ theme: any; variant: string }>`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  background: ${props => {
    switch (props.variant) {
      case 'danger': return props.theme.colors.error[500];
      case 'warning': return props.theme.colors.warning[500];
      default: return props.theme.gradients.primary;
    }
  }};
  color: white;
  border-radius: ${props => props.theme.borderRadius['2xl']} ${props => props.theme.borderRadius['2xl']} 0 0;
`;

const ModalTitle = styled.h2<{ theme: any }>`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const ModalBody = styled.div<{ theme: any }>`
  padding: ${props => props.theme.spacing.xl};
`;

const ModalMessage = styled.p<{ theme: any }>`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const ModalActions = styled.div<{ theme: any }>`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  padding: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border.primary};
`;

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}) => {
  const { theme } = useTheme();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay theme={theme} isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalCard theme={theme}>
        <ModalHeader theme={theme} variant={variant}>
          <ModalTitle theme={theme}>{title}</ModalTitle>
        </ModalHeader>
        
        <ModalBody theme={theme}>
          <ModalMessage theme={theme}>{message}</ModalMessage>
        </ModalBody>
        
        <ModalActions theme={theme}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>
  );
};