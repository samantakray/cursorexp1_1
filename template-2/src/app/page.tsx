import ImageGenerator from './components/ImageGenerator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Image Generator</h1>
        <p className="text-center text-gray-600 mb-8">
          Create amazing images using AI. Just enter a description and let the magic happen!
        </p>
        <ImageGenerator />
      </div>
    </main>
  );
}
