import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { theme } from 'styles/theme';
import { 
  uploadImageToPantry, 
  deletePantryImage, 
  base64ToBlobUrl, 
  PantryImage 
} from 'lib/pantry-storage';

interface PhotoUploadPantryProps {
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
  isPantry?: boolean;
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

const PantryBadge = styled.div`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.sm};
  background: ${theme.colors.accent[100]};
  color: ${theme.colors.accent[700]};
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
`;

const UploadText = styled.div`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
`;

const UploadSubtext = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.tertiary};
`;

const HiddenInput = styled.input`
  display: none;
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

const PhotoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${PhotoItem}:hover & {
    opacity: 1;
  }
`;

const DeleteButton = styled.button`
  background: ${theme.colors.error[500]};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    background: ${theme.colors.error[600]};
  }
`;

const UploadProgress = styled.div<{ progress: number }>`
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
    background: ${theme.colors.accent[500]};
    transition: width 0.3s ease;
  }
`;

const CategoryBadge = styled.span<{ category: string }>`
  position: absolute;
  top: ${theme.spacing.xs};
  right: ${theme.spacing.xs};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.category) {
      case 'before':
        return `
          background: ${theme.colors.warning[500]};
          color: white;
        `;
      case 'after':
        return `
          background: ${theme.colors.success[500]};
          color: white;
        `;
      default:
        return `
          background: ${theme.colors.accent[500]};
          color: white;
        `;
    }
  }}
`;

const PantryIndicator = styled.div`
  position: absolute;
  top: ${theme.spacing.xs};
  left: ${theme.spacing.xs};
  background: rgba(34, 211, 238, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 10px;
  font-weight: bold;
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

export const PhotoUploadPantry: React.FC<PhotoUploadPantryProps> = ({
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<UploadedPhoto | null> => {
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    try {
      setError('');
      setSuccess('');
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      // Start progress tracking
      setUploading(prev => ({ ...prev, [uploadId]: 0 }));
      
      console.log(`Uploading to Pantry: ${file.name}`);
      
      // Upload to Pantry
      const pantryImage = await uploadImageToPantry(
        file,
        category,
        chairId,
        jobId,
        (progress: number) => {
          console.log(`Pantry upload progress: ${Math.round(progress)}%`);
          setUploading(prev => ({ ...prev, [uploadId]: progress }));
        }
      );
      
      // Remove from uploading state
      setUploading(prev => {
        const newState = { ...prev };
        delete newState[uploadId];
        return newState;
      });
      
      // Convert to blob URL for display
      const blobUrl = base64ToBlobUrl(pantryImage.base64Data);
      
      setSuccess(`✅ Image uploaded to Pantry successfully! (${(file.size / 1024).toFixed(1)}KB)`);
      
      const uploadedPhoto: UploadedPhoto = {
        id: pantryImage.id,
        url: blobUrl,
        filename: pantryImage.filename,
        category: category,
        uploadedAt: new Date(pantryImage.uploadedAt),
        size: pantryImage.size,
        isPantry: true
      };
      
      return uploadedPhoto;
      
    } catch (error) {
      console.error('Pantry upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to upload ${file.name}: ${errorMessage}`);
      
      // Remove from uploading state on error
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
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    
    // Check photo limit
    if (photos.length + validFiles.length > maxPhotos) {
      setError(`Cannot upload more than ${maxPhotos} photos`);
      return;
    }
    
    // Upload files sequentially to avoid overwhelming Pantry
    const uploadedPhotos: UploadedPhoto[] = [];
    
    for (const file of validFiles) {
      const uploadedPhoto = await uploadFile(file);
      if (uploadedPhoto) {
        uploadedPhotos.push(uploadedPhoto);
      }
    }
    
    // Update state
    const newPhotos = [...photos, ...uploadedPhotos];
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

  const handleDeletePhoto = useCallback(async (photo: UploadedPhoto) => {
    try {
      if (photo.isPantry) {
        // Delete from Pantry
        await deletePantryImage(photo.id);
      }
      
      // Remove from state
      const newPhotos = photos.filter(p => p.id !== photo.id);
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
      
      setSuccess('Photo deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [photos, onPhotosChange]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <UploadContainer>
      <PantryBadge>
        🥫 Pantry Cloud Storage
      </PantryBadge>
      
      <UploadArea
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <UploadIcon>📷</UploadIcon>
        <UploadText>
          {category === 'before' && 'Upload Before Photos'}
          {category === 'after' && 'Upload After Photos'}
          {category === 'general' && 'Upload Photos'}
        </UploadText>
        <UploadSubtext>
          Drag and drop images here, or click to select files
          <br />
          Max {maxPhotos} photos, 5MB each • Stored in Pantry Cloud
        </UploadSubtext>
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
              <CategoryBadge category={photo.category}>
                {photo.category}
              </CategoryBadge>
              {photo.isPantry && (
                <PantryIndicator>
                  PANTRY
                </PantryIndicator>
              )}
              <PhotoOverlay>
                <DeleteButton onClick={() => handleDeletePhoto(photo)}>
                  ×
                </DeleteButton>
              </PhotoOverlay>
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
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥫</div>
                <div style={{ fontSize: '0.8rem' }}>Uploading to Pantry...</div>
                <div style={{ fontSize: '0.8rem' }}>{Math.round(progress)}%</div>
              </div>
              <UploadProgress progress={progress} />
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
        {photos.length} of {maxPhotos} photos uploaded to Pantry Cloud
      </div>
    </UploadContainer>
  );
};