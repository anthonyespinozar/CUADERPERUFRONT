'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/auth.service';

export default function ProduccionPage() {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Producción</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Órdenes de producción */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Órdenes de Producción</h2>
            {/* Contenido de órdenes de producción */}
          </div>

          {/* Estado de la producción */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Estado Actual</h2>
            {/* Contenido del estado de producción */}
          </div>

          {/* Planificación */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Planificación</h2>
            {/* Contenido de planificación */}
          </div>

          {/* Reportes */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Reportes</h2>
            {/* Contenido de reportes */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 