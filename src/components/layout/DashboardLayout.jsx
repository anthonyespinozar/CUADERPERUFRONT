'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

// Configuración de rutas protegidas y roles permitidos
const PROTECTED_ROUTES = {
  '/dashboard': ['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO'],
  '/usuarios': ['ADMINISTRADOR'],
  '/compras': ['ADMINISTRADOR', 'SUPERVISOR'],
  '/inventario': ['ADMINISTRADOR', 'SUPERVISOR'],
  '/produccion': ['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO']
};

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    const currentUser = authService.getUser();
    if (!authService.isAuthenticated()) {
      toast.error('Sesión no válida. Por favor, inicie sesión.');
      router.push('/login');
      return;
    }

    setUser(currentUser);
    
    // Verificar permisos de ruta
    const allowedRoles = PROTECTED_ROUTES[pathname];
    if (allowedRoles && !allowedRoles.includes(currentUser?.rol)) {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
    }
    
    setIsLoading(false);
  }, [router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 