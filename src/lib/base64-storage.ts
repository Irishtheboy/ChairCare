// Temporary image storage solution using base64 encoding
// This stores images directly in Firestore as base64 strings
// Use this while Firebase Storage setup is being resolved

import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Base64Image {
  id: string;
  filename: string;
  base64Data: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  category?: string;
}

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image before converting to base64
 */
export const compressImageToBase64 = (
  file: File,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload image as base64 to Firestore
 */
export const uploadImageAsBase64 = async (
  file: File,
  category: string = 'general',
  onProgress?: (progress: number) => void
): Promise<Base64Image> => {
  try {
    // Start progress
    onProgress?.(10);
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit for base64
      throw new Error('File too large. Max 5MB for base64 storage.');
    }
    
    onProgress?.(25);
    
    // Compress and convert to base64
    const base64Data = await compressImageToBase64(file);
    
    onProgress?.(75);
    
    // Create image document
    const imageDoc: Omit<Base64Image, 'id'> = {
      filename: file.name,
      base64Data,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date(),
      category
    };
    
    // Store in Firestore
    const docRef = await addDoc(collection(db, 'base64Images'), {
      ...imageDoc,
      uploadedAt: serverTimestamp()
    });
    
    onProgress?.(100);
    
    return {
      id: docRef.id,
      ...imageDoc
    };
    
  } catch (error) {
    console.error('Base64 upload error:', error);
    throw error;
  }
};

/**
 * Get image by ID
 */
export const getBase64Image = async (imageId: string): Promise<Base64Image | null> => {
  try {
    const docRef = doc(db, 'base64Images', imageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        filename: data.filename,
        base64Data: data.base64Data,
        mimeType: data.mimeType,
        size: data.size,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
        category: data.category
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting base64 image:', error);
    throw error;
  }
};

/**
 * Create a blob URL from base64 data (for displaying images)
 */
export const base64ToBlobUrl = (base64Data: string): string => {
  try {
    // Extract mime type and data
    const [header, data] = base64Data.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    
    // Convert to blob
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting base64 to blob URL:', error);
    return base64Data; // Fallback to original base64
  }
};

/**
 * Validate image file for base64 storage
 */
export const validateImageForBase64 = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  // Check file size (5MB limit for base64 to avoid Firestore document size limits)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB for base64 storage' };
  }
  
  // Check file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File type not supported. Use JPG, PNG, GIF, or WebP' };
  }
  
  return { valid: true };
};