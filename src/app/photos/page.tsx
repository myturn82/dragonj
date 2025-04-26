'use client';

import { useEffect, useState } from 'react';

interface Photo {
  path: string;
  name: string;
  size: number;
  lastModified: Date;
}

export default function PhotosPage() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        
        if (data.success) {
          setPhoto(data.photo);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch photo');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading photo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">No photo found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {isPreview ? 'Photo Preview' : 'Full Size Photo'}
        </h1>
        
        <div className="relative max-w-4xl mx-auto">
          <div 
            className={`${
              isPreview ? 'w-64 h-64' : 'aspect-w-16 aspect-h-9'
            } bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300`}
            onClick={() => setIsPreview(!isPreview)}
          >
            <img
              src={`file://${photo.path}`}
              alt={photo.name}
              className={`${
                isPreview ? 'w-full h-full object-cover' : 'w-full h-full object-contain'
              }`}
            />
          </div>
          
          <div className="mt-4 text-white text-center">
            <p className="text-xl">{photo.name}</p>
            <p className="text-sm text-gray-400">
              {(photo.size / 1024 / 1024).toFixed(2)} MB • 
              {new Date(photo.lastModified).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Click the image to {isPreview ? 'view full size' : 'return to preview'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 