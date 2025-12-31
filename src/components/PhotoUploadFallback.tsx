import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';
import { uploadPhoto } from 'lib/firebase-storage';
import { uploadImageAsBase64, base64ToBlobUrl, validateImageForBase64, Base64Image } from 'lib/base64-storage';

interface PhotoUploadFallbackProps {
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
  category?: 'before' | 'after' | 'general';
  chairId?: string;
  jobId?: string;
  existingPhotos?: UploadedPhoto[];
}

export interface UploadedPhoto {
  id: string;
  url: string;
  filename: string;
  category: 'before' | 'after' | 'general';
  uploadedAt: Date;
  size: number;
  isBase64?: boolean; // Flag to indicate if this is stored as base64
}

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  background: ${props => props.isDragOver ? theme.colors.primary[50] : theme.colors.background.primary};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.primary[500]};
    background: ${theme.colors.primary[50]};
  }
`;

const StorageMethodBadge = styled.div<{ method: 'firebase' | 'base64' }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.sm};
  
  ${props => props.method === 'firebase' 
    ? `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`
    : `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`
  }
`;

const UploadText = styled.div`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error[600]};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.error[50]};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.error[200]};
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success[600]};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.success[50]};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.success[200]};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const PhotoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background: ${theme.colors.gray[100]};
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${theme.colors.gray[200]};
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${theme.colors.primary[500]};
    transition: width 0.3s ease;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export const PhotoUploadFallback: React.FC<PhotoUploadFallbackProps> = ({
  onPhotosChange,
  maxPhotos = 10,
  category = 'general',
  chairId,
  jobId,
  existingPhotos = []
}) => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(existingPhotos);
  const [uploading, setUploading] = useState<{ [key: string]: number }>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [storageMethod, setStorageMethod] = useState<'firebase' | 'base64'>('firebase');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<UploadedPhoto | null> => {
    const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    try {
      setError('');
      setSuccess('');
      
      // Start progress tracking
      setUploading(prev => ({ ...prev, [uploadId]: 0 }));
      
      // Try Firebase Storage first
      try {
        console.log('Attempting Firebase Storage upload...');
        
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${timestamp}_${randomId}.${extension}`;
        
        const path = chairId && jobId 
          ? `chairs/${chairId}/jobs/${jobId}/${category}/${filename}`
          : `photos/${category}/${filename}`;
        
        const downloadURL = await uploadPhoto(file, path, (progress) => {
          setUploading(prev => ({ ...prev, [uploadId]: progress }));
        });
        
        setStorageMethod('firebase');
        setSuccess('✅ Image uploaded to Firebase Storage successfully!');
        
        // Remove from uploading state
        setUploading(prev => {
          const newState = { ...prev };
          delete newState[uploadId];
          return newState;
        });
        
        return {
          id: uploadId,
          url: downloadURL,
          filename: file.name,
          category,
          uploadedAt: new Date(),
          size: file.size,
          isBase64: false
        };
        
      } catch (firebaseError) {
        console.log('Firebase Storage failed, trying base64 fallback...', firebaseError);
        
        // Fallback to base64 storage
        const validation = validateImageForBase64(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        const base64Image = await uploadImageAsBase64(file, category, (progress) => {
          setUploading(prev => ({ ...prev, [uploadId]: progress }));
        });
        
        setStorageMethod('base64');
        setSuccess('⚠️ Image stored as base64 (Firebase Storage unavailable)');
        
        // Remove from uploading state
        setUploading(prev => {
          const newState = { ...prev };
          delete newState[uploadId];
          return newState;
        });
        
        // Convert base64 to blob URL for display
        const blobUrl = base64ToBlobUrl(base64Image.base64Data);
        
        return {
          id: base64Image.id,
          url: blobUrl,
          filename: base64Image.filename,
          category,
          uploadedAt: base64Image.uploadedAt,
          size: base64Image.size,
          isBase64: true
        };
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Remove from uploading state
      setUploading(prev => {
        const newState = { ...prev };
        delete newState[uploadId];
        return newState;
      });
      
      return null;
    }
  }, [category, chairId, jobId]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });
    
    // Check photo limit
    if (photos.length + validFiles.length > maxPhotos) {
      setError(`Cannot upload more than ${maxPhotos} photos`);
      return;
    }
    
    // Upload files
    const uploadPromises = validFiles.map(uploadFile);
    const uploadedPhotos = await Promise.all(uploadPromises);
    
    // Filter successful uploads
    const successfulUploads = uploadedPhotos.filter((photo): photo is UploadedPhoto => photo !== null);
    const newPhotos = [...photos, ...successfulUploads];
    
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  }, [photos, maxPhotos, uploadFile, onPhotosChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <UploadContainer>
      <StorageMethodBadge method={storageMethod}>
        {storageMethod === 'firebase' 
          ? '🔥 Firebase Storage' 
          : '💾 Base64 Storage (Fallback)'
        }
      </StorageMethodBadge>
      
      <UploadArea
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📷</div>
        <UploadText>
          {category === 'before' && 'Upload Before Photos'}
          {category === 'after' && 'Upload After Photos'}
          {category === 'general' && 'Upload Photos'}
        </UploadText>
        <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary }}>
          Drag and drop images here, or click to select files
          <br />
          Max {maxPhotos} photos • Tries Firebase Storage first, falls back to base64
        </div>
      </UploadArea>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInput}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {(photos.length > 0 || Object.keys(uploading).length > 0) && (
        <PhotoGrid>
          {photos.map((photo) => (
            <PhotoItem key={photo.id}>
              <PhotoImage src={photo.url} alt={photo.filename} />
              {photo.isBase64 && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(251, 191, 36, 0.9)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  B64
                </div>
              )}
            </PhotoItem>
          ))}
          
          {Object.entries(uploading).map(([id, progress]) => (
            <PhotoItem key={id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                background: theme.colors.gray[100],
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <div style={{ fontSize: '0.8rem' }}>Uploading...</div>
                <div style={{ fontSize: '0.8rem' }}>{Math.round(progress)}%</div>
              </div>
              <ProgressBar progress={progress} />
            </PhotoItem>
          ))}
        </PhotoGrid>
      )}

      <div style={{ 
        marginTop: theme.spacing.md, 
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        textAlign: 'center'
      }}>
        {photos.length} of {maxPhotos} photos uploaded
        {storageMethod === 'base64' && (
          <div style={{ color: theme.colors.warning[600], marginTop: theme.spacing.xs }}>
            Using fallback storage. Enable Firebase Storage for better performance.
          </div>
        )}
      </div>
    </UploadContainer>
  );
};