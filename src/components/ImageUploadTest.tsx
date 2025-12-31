import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';
import { uploadPhoto } from 'lib/firebase-storage';
import { Button } from 'components/ui/Button';

const TestContainer = styled.div`
  padding: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.primary[300]};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg} 0;
  background: ${theme.colors.background.secondary};
`;

const TestTitle = styled.h3`
  color: ${theme.colors.primary[600]};
  margin: 0 0 ${theme.spacing.md} 0;
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
    background: ${theme.colors.primary[500]};
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.xs};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

export const ImageUploadTest: React.FC = () => {
  const [log, setLog] = useState('Image Upload Test Tool\n\n');
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => prev + `[${timestamp}] ${message}\n`);
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
      setUploadedUrl('');
      addLog(`Starting upload test with: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      
      try {
        // Test upload path
        const testPath = `debug/test_${Date.now()}_${file.name}`;
        addLog(`Upload path: ${testPath}`);
        
        // Start upload with progress tracking
        const downloadURL = await uploadPhoto(file, testPath, (progressValue) => {
          setProgress(progressValue);
          addLog(`Progress: ${Math.round(progressValue)}%`);
        });
        
        setUploadedUrl(downloadURL);
        addLog(`✅ SUCCESS! Upload completed`);
        addLog(`Download URL: ${downloadURL}`);
        addLog(`Image is now stored in Firebase Storage`);
        
      } catch (error) {
        addLog(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Upload test error:', error);
      } finally {
        setTesting(false);
      }
    };
    
    input.click();
  };

  const clearLog = () => {
    setLog('Image Upload Test Tool\n\n');
    setProgress(0);
    setUploadedUrl('');
  };

  return (
    <TestContainer>
      <TestTitle>🧪 Image Upload Test Tool</TestTitle>
      
      <ButtonGroup>
        <Button onClick={testImageUpload} disabled={testing} variant="primary">
          {testing ? 'Testing...' : 'Test Image Upload'}
        </Button>
        <Button onClick={clearLog} disabled={testing} variant="outline">
          Clear Log
        </Button>
      </ButtonGroup>

      {testing && (
        <div style={{ marginBottom: theme.spacing.md }}>
          <ProgressBar progress={progress} />
          <ProgressText>{Math.round(progress)}% Complete</ProgressText>
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginBottom: theme.spacing.md }}>
          <h4>✅ Upload Successful!</h4>
          <img 
            src={uploadedUrl} 
            alt="Uploaded test" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              border: `1px solid ${theme.colors.border.primary}`,
              borderRadius: theme.borderRadius.md
            }} 
          />
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Image successfully stored and retrieved from Firebase Storage
          </p>
        </div>
      )}

      <LogArea 
        value={log} 
        readOnly 
        placeholder="Test logs will appear here..."
      />
    </TestContainer>
  );
};