'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

const PROTECTED_ROUTES = {
  '/dashboard': ['administrador', 'usuario'],
  '/usuarios': ['administrador'],
  '/compras': ['administrador', 'usuario'],
  '/inventario': ['administrador', 'usuario'],
  '/produccion': ['administrador', 'usuario'],
  '/clientes': ['administrador', 'usuario'],
  '/reportes': ['administrador', 'usuario'],
  '/reportes/inventario': ['administrador', 'usuario'],
  '/reportes/compras': ['administrador', 'usuario'],
  '/reportes/produccion': ['administrador', 'usuario'],
  '/reportes/movimientos': ['administrador', 'usuario'],
  '/reportes/clientes': ['administrador', 'usuario'],
  '/reportes/proveedores': ['administrador', 'usuario']
};

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!authService.isAuthenticated()) {
      toast.error('Sesión no válida. Por favor, inicie sesión.');
      router.push('/login');
      return;
    }

    setUser(currentUser);

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

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="min-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
