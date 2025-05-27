'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/auth.service';

export default function InventarioPage() {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Inventario</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Resumen de inventario */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Resumen</h2>
            {/* Contenido del resumen */}
          </div>

          {/* Productos en stock */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Stock Actual</h2>
            {/* Contenido de stock */}
          </div>

          {/* Movimientos recientes */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Movimientos</h2>
            {/* Contenido de movimientos */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 