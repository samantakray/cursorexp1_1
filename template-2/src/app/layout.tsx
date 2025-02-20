import "./globals.css";
import type { Metadata } from 'next';

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
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
