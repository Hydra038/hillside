'use client';

import { useState, useEffect, Suspense } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageLoadingSpinner from "@/components/PageLoadingSpinner";
import { AuthProvider } from "@/lib/auth-provider";
import { ErrorBoundary } from 'react-error-boundary';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
      <AuthProvider>
        <PageLoadingSpinner />
        <Navigation />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        }>
          <main className="flex-grow">
            {children}
          </main>
        </Suspense>
        <Footer />
      </AuthProvider>
    </ErrorBoundary>
  );
}
