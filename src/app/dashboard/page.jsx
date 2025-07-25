'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/authService';

export default function DashboardPage() {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tarjeta de bienvenida */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">
              Bienvenido, {user?.nombre}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Rol: {user?.rol}
            </p>
          </div>

          {/* Estadísticas y resúmenes según el rol */}
          {user?.rol === 'ADMIN' && (
            <>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">Usuarios</h3>
                {/* Contenido para administradores */}
              </div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">Actividad</h3>
                {/* Contenido para administradores */}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 