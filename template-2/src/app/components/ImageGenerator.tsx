'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../../lib/hooks/useAuth';
import { saveGeneratedImage } from '../../lib/firebase/images';

export default function ImageGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/replicate/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received from the API');
      }

      setImageUrl(data.imageUrl);

      // Save the image to the user's library if they're signed in
      if (user) {
        await saveGeneratedImage(user.uid, data.imageUrl, prompt);
      }

      setPrompt(''); // Clear the prompt after successful generation
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A magical forest with glowing mushrooms, fantasy art, detailed, 8k resolution..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border min-h-[100px]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || !prompt.trim()
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating... (this may take up to 30 seconds)' : 'Generate Image'}
        </button>
        {!user && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Sign in to save your generated images to your library
          </p>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <button
            onClick={() => window.open(imageUrl, '_blank')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Open Image in New Tab
          </button>
        </div>
      )}
    </div>
  );
} 