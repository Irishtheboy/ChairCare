import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { Mail, Calendar } from 'lucide-react';
import { useAuth } from 'contexts/AuthContext';
import { User } from 'types/chair-care';
import apiClient from 'lib/api-client';
import { Layout } from 'components/ui/Layout';
import { Button } from 'components/ui/Button';
import { Input } from 'components/ui/Input';
import { Card } from 'components/ui/Card';
import { ConfirmationModal } from 'components/ui/ConfirmationModal';
import { theme } from 'styles/theme';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['2xl']};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const FormContainer = styled(Card)`
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const ClientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ClientCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg};
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.sm};
`;

const ClientDetails = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ status }) => {
    switch (status) {
      case 'approved':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
          border: 1px solid ${theme.colors.success[200]};
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
          border: 1px solid ${theme.colors.warning[200]};
        `;
      case 'suspended':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
          border: 1px solid ${theme.colors.error[200]};
        `;
      default:
        return `
          background-color: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
          border: 1px solid ${theme.colors.gray[200]};
        `;
    }
  }}
`;

const ClientActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const ActionButton = styled(Button)`
  font-size: ${theme.typography.fontSize.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error[600]};
  background: ${theme.colors.error[50]};
  border: 1px solid ${theme.colors.error[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success[600]};
  background: ${theme.colors.success[50]};
  border: 1px solid ${theme.colors.success[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing['3xl']};
  
  h3 {
    margin: 0 0 ${theme.spacing.md} 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.xl};
  }
  
  p {
    margin: 0;
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.sm};
  color: ${theme.colors.primary[400]};
  width: 16px;
  height: 16px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

interface ClientForm {
  name: string;
  email: string;
  companyName: string;
  clientType: 'individual' | 'company';
  password: string;
}

const ClientsPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [deleteAction, setDeleteAction] = useState<'delete' | 'deactivate' | 'suspend'>('deactivate');
  const [includeChairs, setIncludeChairs] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState<ClientForm>({
    name: '',
    email: '',
    companyName: '',
    clientType: 'individual',
    password: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    loadClients();
  }, [user, router]);

  const loadClients = async () => {
    try {
      const response = await apiClient.get('/api/admin/get-clients');
      
      if (response.data.success) {
        const clientUsers: User[] = response.data.data.map((userData: any) => ({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          companyName: userData.companyName,
          status: userData.status || 'approved',
          createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date(),
          updatedAt: userData.updatedAt?.toDate ? userData.updatedAt.toDate() : new Date()
        }));
        
        setClients(clientUsers);
      } else {
        setError('Failed to load clients');
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
      setError('Failed to load clients');
    }
  };

  const handleInputChange = (field: keyof ClientForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetPassword = async (clientId: string, clientEmail: string) => {
    if (!confirm(`Are you sure you want to reset the password for ${clientEmail}?`)) {
      return;
    }

    setResetLoading(clientId);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('/api/admin/reset-password', {
        userId: clientId
      });

      if (response.data.success) {
        const { email, password } = response.data.data;
        setSuccess(`Password reset for ${email}. New password: ${password} (Email sent to client)`);
      } else {
        setError(response.data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setResetLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/admin/create-client', {
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        clientType: formData.clientType,
        password: formData.password
      });

      if (response.data.success) {
        const { email, password } = response.data.data;
        setSuccess(`Client created successfully! Welcome email sent to ${email} with password: ${password}`);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          companyName: '',
          clientType: 'individual',
          password: ''
        });
        
        setShowForm(false);
        loadClients(); // Reload the clients list
      } else {
        setError(response.data.error || 'Failed to create client');
      }
      
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.response?.data?.error || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleClientAction = (client: User, action: 'delete' | 'deactivate' | 'suspend') => {
    setSelectedClient(client);
    setDeleteAction(action);
    setIncludeChairs(false);
    setShowDeleteModal(true);
  };

  const confirmClientAction = async () => {
    if (!selectedClient) return;

    setDeleteLoading(true);
    try {
      const response = await apiClient.post('/api/admin/delete-client', {
        clientId: selectedClient.id,
        action: deleteAction,
        includeChairs
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        // Refresh the clients list
        await loadClients();
        setShowDeleteModal(false);
        setSelectedClient(null);
      } else {
        setError(response.data.error || 'Failed to perform action');
      }
    } catch (error: any) {
      console.error('Error performing client action:', error);
      setError(error.response?.data?.error || 'Failed to perform action');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getActionModalContent = () => {
    if (!selectedClient) return { title: '', message: '', confirmText: '', variant: 'info' as const };

    const chairsMessage = includeChairs ? ' Their chairs will also be affected.' : ' Their chairs will remain active.';

    switch (deleteAction) {
      case 'delete':
        return {
          title: 'Delete Client',
          message: `Are you sure you want to permanently delete client "${selectedClient.name}"? This action cannot be undone and will only work if the client has no service history or active jobs.${chairsMessage}`,
          confirmText: 'Delete Permanently',
          variant: 'danger' as const
        };
      case 'deactivate':
        return {
          title: 'Deactivate Client',
          message: `Are you sure you want to deactivate client "${selectedClient.name}"? The client will be marked as inactive but can be reactivated later.${chairsMessage}`,
          confirmText: 'Deactivate',
          variant: 'warning' as const
        };
      case 'suspend':
        return {
          title: 'Suspend Client',
          message: `Are you sure you want to suspend client "${selectedClient.name}"? The client will be temporarily suspended from accessing the system.${chairsMessage}`,
          confirmText: 'Suspend Client',
          variant: 'warning' as const
        };
      default:
        return { title: '', message: '', confirmText: '', variant: 'info' as const };
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <PageContainer>
        <Card>
          <SectionHeader>
            <SectionTitle>Client Management</SectionTitle>
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "ghost" : "primary"}
            >
              {showForm ? 'Cancel' : 'Add New Client'}
            </Button>
          </SectionHeader>

          {showForm && (
            <FormContainer>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="clientType">Client Type *</Label>
                  <Select
                    id="clientType"
                    value={formData.clientType}
                    onChange={(e) => handleInputChange('clientType', e.target.value as 'individual' | 'company')}
                    required
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </Select>
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="name">
                      {formData.clientType === 'individual' ? 'Full Name' : 'Contact Person'} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={formData.clientType === 'individual' ? 'John Smith' : 'Jane Doe'}
                      required
                      fullWidth
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                      fullWidth
                    />
                  </FormGroup>
                </FormRow>

                {formData.clientType === 'company' && (
                  <FormGroup>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="ABC Corporation"
                      required={formData.clientType === 'company'}
                      fullWidth
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label htmlFor="password">Password (leave empty to auto-generate)</Label>
                  <Input
                    id="password"
                    type="text"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Auto-generated if empty"
                    fullWidth
                  />
                </FormGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <Button 
                  type="submit" 
                  loading={loading}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Creating Client...' : 'Create Client'}
                </Button>
              </Form>
            </FormContainer>
          )}
        </Card>

        <Card>
          <SectionTitle>Existing Clients</SectionTitle>
          
          {clients.length === 0 ? (
            <EmptyState>
              <h3>No Clients Found</h3>
              <p>Add your first client to get started with chair management.</p>
            </EmptyState>
          ) : (
            <ClientsList>
              {clients.map((client) => (
                <ClientCard key={client.id}>
                  <ClientInfo>
                    <ClientName>
                      {client.name}
                      {client.companyName && ` - ${client.companyName}`}
                    </ClientName>
                    <ClientDetails>
                      <IconWrapper>
                        <Mail />
                      </IconWrapper>
                      {client.email}
                      <br />
                      <IconWrapper>
                        <Calendar />
                      </IconWrapper>
                      Created: {client.createdAt.toLocaleDateString('en-ZA')}
                    </ClientDetails>
                  </ClientInfo>
                  <ClientActions>
                    <StatusBadge status="approved">
                      Active
                    </StatusBadge>
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleResetPassword(client.id, client.email)}
                      loading={resetLoading === client.id}
                      disabled={resetLoading === client.id}
                    >
                      {resetLoading === client.id ? 'Resetting...' : 'Reset Password'}
                    </ActionButton>
                    <ActionButton
                      variant="warning"
                      size="sm"
                      onClick={() => handleClientAction(client, 'deactivate')}
                    >
                      Deactivate
                    </ActionButton>
                    <ActionButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClientAction(client, 'suspend')}
                    >
                      Suspend
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleClientAction(client, 'delete')}
                    >
                      Delete
                    </ActionButton>
                  </ClientActions>
                </ClientCard>
              ))}
            </ClientsList>
          )}
        </Card>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedClient(null);
          }}
          onConfirm={confirmClientAction}
          loading={deleteLoading}
          {...getActionModalContent()}
        />

        {/* Additional options for client deletion */}
        {showDeleteModal && selectedClient && (
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            background: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.primary}`,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.lg,
            zIndex: 1001
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}>
              <input
                type="checkbox"
                checked={includeChairs}
                onChange={(e) => setIncludeChairs(e.target.checked)}
              />
              Also affect client's chairs
            </label>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default ClientsPage;