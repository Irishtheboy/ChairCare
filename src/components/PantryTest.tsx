import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';
import { 
  testPantryConnection, 
  uploadImageToPantry, 
  getPantryStats,
  getPantryImages 
} from 'lib/pantry-storage';
import { Button } from 'components/ui/Button';

const TestContainer = styled.div`
  padding: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.accent[300]};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg} 0;
  background: ${theme.colors.background.secondary};
`;

const TestTitle = styled.h3`
  color: ${theme.colors.accent[600]};
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LogArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.md};
  font-family: monospace;
  font-size: ${theme.typography.fontSize.sm};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.md} 0;
`;

const StatCard = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.accent[50]};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent[600]};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 20px;
  background: ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  margin: ${theme.spacing.sm} 0;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${theme.colors.accent[500]};
    transition: width 0.3s ease;
  }
`;

export const PantryTest: React.FC = () => {
  const [log, setLog] = useState('Pantry Cloud Storage Test Tool\n\n');
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => prev + `[${timestamp}] ${message}\n`);
  };

  const testConnection = async () => {
    setTesting(true);
    addLog('Testing Pantry connection...');
    
    try {
      const isConnected = await testPantryConnection();
      
      if (isConnected) {
        addLog('✅ SUCCESS! Pantry connection is working');
        addLog('Pantry ID: 2a62dd90-4a3a-417e-a262-c6a54d5f8aef');
        addLog('Ready to upload images');
      } else {
        addLog('❌ ERROR: Pantry connection failed');
      }
    } catch (error) {
      addLog(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const loadStats = async () => {
    setTesting(true);
    addLog('Loading Pantry storage statistics...');
    
    try {
      const pantryStats = await getPantryStats();
      setStats(pantryStats);
      
      addLog(`📊 Storage Stats:`);
      addLog(`   Total Images: ${pantryStats.totalImages}`);
      addLog(`   Total Size: ${(pantryStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      addLog(`   Categories: ${Object.keys(pantryStats.categories).join(', ')}`);
      
      Object.entries(pantryStats.categories).forEach(([category, count]) => {
        addLog(`   - ${category}: ${count} images`);
      });
      
    } catch (error) {
      addLog(`❌ ERROR loading stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const testImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setTesting(true);
      setProgress(0);
      addLog(`Starting Pantry upload test: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      
      try {
        const pantryImage = await uploadImageToPantry(
          file, 
          'test',
          undefined,
          undefined,
          (progressValue) => {
            setProgress(progressValue);
            addLog(`Upload progress: ${Math.round(progressValue)}%`);
          }
        );
        
        addLog(`✅ SUCCESS! Image uploaded to Pantry`);
        addLog(`Image ID: ${pantryImage.id}`);
        addLog(`Compressed size: ${(pantryImage.base64Data.length / 1024).toFixed(1)}KB`);
        addLog(`Original size: ${(pantryImage.size / 1024).toFixed(1)}KB`);
        
        // Refresh stats
        await loadStats();
        
      } catch (error) {
        addLog(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setTesting(false);
        setProgress(0);
      }
    };
    
    input.click();
  };

  const listImages = async () => {
    setTesting(true);
    addLog('Listing all images in Pantry...');
    
    try {
      const collection = await getPantryImages();
      
      addLog(`📋 Found ${collection.totalImages} images:`);
      
      if (collection.images.length === 0) {
        addLog('   No images found. Upload some images first!');
      } else {
        collection.images.forEach((img, index) => {
          addLog(`   ${index + 1}. ${img.filename} (${img.category}) - ${(img.size / 1024).toFixed(1)}KB`);
        });
      }
      
    } catch (error) {
      addLog(`❌ ERROR listing images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const clearLog = () => {
    setLog('Pantry Cloud Storage Test Tool\n\n');
    setProgress(0);
    setStats(null);
  };

  return (
    <TestContainer>
      <TestTitle>
        🥫 Pantry Cloud Storage Test
      </TestTitle>
      
      <ButtonGroup>
        <Button onClick={testConnection} disabled={testing} variant="primary">
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button onClick={loadStats} disabled={testing} variant="secondary">
          Load Stats
        </Button>
        <Button onClick={testImageUpload} disabled={testing} variant="success">
          Test Image Upload
        </Button>
        <Button onClick={listImages} disabled={testing} variant="outline">
          List Images
        </Button>
        <Button onClick={clearLog} disabled={testing} variant="ghost">
          Clear Log
        </Button>
      </ButtonGroup>

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalImages}</StatValue>
            <StatLabel>Total Images</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{(stats.totalSize / 1024 / 1024).toFixed(1)}MB</StatValue>
            <StatLabel>Total Size</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{Object.keys(stats.categories).length}</StatValue>
            <StatLabel>Categories</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {testing && progress > 0 && (
        <div>
          <ProgressBar progress={progress} />
          <div style={{ textAlign: 'center', fontSize: theme.typography.fontSize.sm }}>
            {Math.round(progress)}% Complete
          </div>
        </div>
      )}

      <LogArea 
        value={log} 
        readOnly 
        placeholder="Test logs will appear here..."
      />
      
      <div style={{ 
        marginTop: theme.spacing.sm, 
        fontSize: theme.typography.fontSize.sm, 
        color: theme.colors.text.secondary 
      }}>
        <strong>Pantry ID:</strong> 2a62dd90-4a3a-417e-a262-c6a54d5f8aef
        <br />
        <strong>Storage:</strong> JSON-based cloud storage with base64 image encoding
      </div>
    </TestContainer>
  );
};