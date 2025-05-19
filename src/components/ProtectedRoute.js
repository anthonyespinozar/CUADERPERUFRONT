'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const { isAuthenticated, hasPermission } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (requiredRole && !hasPermission(requiredRole)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, requiredRole, hasPermission, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return null;
  }

  return children;
} 