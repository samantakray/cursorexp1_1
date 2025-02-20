import "./globals.css";
import type { Metadata } from 'next';
import Header from './components/Header';
import { AuthProvider } from '../lib/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Generate amazing images using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
