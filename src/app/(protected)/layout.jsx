'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Sidebar from '@/components/navigation/Sidebar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const user = authService.getUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error('Sesión no válida. Por favor, inicie sesión.');
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
} 