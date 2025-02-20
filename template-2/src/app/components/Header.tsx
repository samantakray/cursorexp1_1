'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/hooks/useAuth';

export default function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="w-full py-4 px-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AI Image Generator
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link
                href="/library"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Library
              </Link>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={signOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
              onClick={signInWithGoogle}
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google logo" 
                className="w-5 h-5 mr-2"
              />
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 