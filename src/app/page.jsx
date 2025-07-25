'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useStore();

  useEffect(() => {
    // Solo redirigir cuando el estado esté hidratado
    if (!hydrated) return;

    const path = isAuthenticated ? '/dashboard' : '/login';
    router.replace(path);
  }, [isAuthenticated, hydrated, router]);

  // Mostrar loading mientras se hidrata el estado
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}
