'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { getUserImages } from '../../lib/firebase/images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
}

export default function Library() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    const fetchImages = async () => {
      if (user) {
        try {
          const userImages = await getUserImages(user.uid);
          setImages(userImages as GeneratedImage[]);
        } catch (error) {
          console.error('Error fetching images:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImages();
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Generated Images</h1>
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images generated yet. Try creating some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 