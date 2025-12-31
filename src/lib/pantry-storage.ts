// Pantry Cloud Storage for Images
// Simple JSON storage service for image data

const PANTRY_ID = '2a62dd90-4a3a-417e-a262-c6a54d5f8aef';
const BASE_URL = 'https://getpantry.cloud/apiv1/pantry';

export interface PantryImage {
  id: string;
  filename: string;
  base64Data: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  category?: string;
  chairId?: string;
  jobId?: string;
}

export interface PantryImageCollection {
  images: PantryImage[];
  lastUpdated: string;
  totalImages: number;
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
export const compressImageForPantry = (
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
 * Get images from Pantry
 */
export const getPantryImages = async (basketName: string = 'images'): Promise<PantryImageCollection> => {
  try {
    const response = await fetch(`${BASE_URL}/${PANTRY_ID}/basket/${basketName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        // Basket doesn't exist yet, return empty collection
        return {
          images: [],
          lastUpdated: new Date().toISOString(),
          totalImages: 0
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as PantryImageCollection;
  } catch (error) {
    console.error('Error getting Pantry images:', error);
    // Return empty collection on error
    return {
      images: [],
      lastUpdated: new Date().toISOString(),
      totalImages: 0
    };
  }
};

/**
 * Save images to Pantry
 */
export const savePantryImages = async (
  images: PantryImageCollection, 
  basketName: string = 'images'
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${PANTRY_ID}/basket/${basketName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(images),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Images saved to Pantry successfully');
  } catch (error) {
    console.error('Error saving to Pantry:', error);
    throw error;
  }
};

/**
 * Upload image to Pantry
 */
export const uploadImageToPantry = async (
  file: File,
  category: string = 'general',
  chairId?: string,
  jobId?: string,
  onProgress?: (progress: number) => void
): Promise<PantryImage> => {
  try {
    // Start progress
    onProgress?.(10);
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File too large. Max 5MB for Pantry storage.');
    }
    
    onProgress?.(25);
    
    // Compress and convert to base64
    const base64Data = await compressImageForPantry(file);
    
    onProgress?.(50);
    
    // Get existing images
    const existingCollection = await getPantryImages();
    
    onProgress?.(75);
    
    // Create new image object
    const newImage: PantryImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      filename: file.name,
      base64Data,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      category,
      chairId,
      jobId
    };
    
    // Add to collection
    const updatedCollection: PantryImageCollection = {
      images: [...existingCollection.images, newImage],
      lastUpdated: new Date().toISOString(),
      totalImages: existingCollection.images.length + 1
    };
    
    // Save to Pantry
    await savePantryImages(updatedCollection);
    
    onProgress?.(100);
    
    console.log('Image uploaded to Pantry:', newImage.id);
    return newImage;
    
  } catch (error) {
    console.error('Pantry upload error:', error);
    throw error;
  }
};

/**
 * Get image by ID from Pantry
 */
export const getPantryImageById = async (imageId: string): Promise<PantryImage | null> => {
  try {
    const collection = await getPantryImages();
    return collection.images.find(img => img.id === imageId) || null;
  } catch (error) {
    console.error('Error getting Pantry image by ID:', error);
    return null;
  }
};

/**
 * Delete image from Pantry
 */
export const deletePantryImage = async (imageId: string): Promise<void> => {
  try {
    const collection = await getPantryImages();
    const updatedImages = collection.images.filter(img => img.id !== imageId);
    
    const updatedCollection: PantryImageCollection = {
      images: updatedImages,
      lastUpdated: new Date().toISOString(),
      totalImages: updatedImages.length
    };
    
    await savePantryImages(updatedCollection);
    console.log('Image deleted from Pantry:', imageId);
  } catch (error) {
    console.error('Error deleting Pantry image:', error);
    throw error;
  }
};

/**
 * Get images by category
 */
export const getPantryImagesByCategory = async (category: string): Promise<PantryImage[]> => {
  try {
    const collection = await getPantryImages();
    return collection.images.filter(img => img.category === category);
  } catch (error) {
    console.error('Error getting Pantry images by category:', error);
    return [];
  }
};

/**
 * Get images by chair ID
 */
export const getPantryImagesByChair = async (chairId: string): Promise<PantryImage[]> => {
  try {
    const collection = await getPantryImages();
    return collection.images.filter(img => img.chairId === chairId);
  } catch (error) {
    console.error('Error getting Pantry images by chair:', error);
    return [];
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
 * Test Pantry connection
 */
export const testPantryConnection = async (): Promise<boolean> => {
  try {
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Pantry connection test'
    };
    
    const response = await fetch(`${BASE_URL}/${PANTRY_ID}/basket/testBasket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Pantry connection test failed:', error);
    return false;
  }
};

/**
 * Get Pantry storage stats
 */
export const getPantryStats = async (): Promise<{
  totalImages: number;
  totalSize: number;
  categories: Record<string, number>;
}> => {
  try {
    const collection = await getPantryImages();
    const stats = {
      totalImages: collection.totalImages,
      totalSize: collection.images.reduce((sum, img) => sum + img.size, 0),
      categories: {} as Record<string, number>
    };
    
    // Count by category
    collection.images.forEach(img => {
      const category = img.category || 'general';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting Pantry stats:', error);
    return {
      totalImages: 0,
      totalSize: 0,
      categories: {}
    };
  }
};