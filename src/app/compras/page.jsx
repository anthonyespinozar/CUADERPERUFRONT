'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ComprasPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Compras</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sección de órdenes de compra */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Órdenes de Compra</h2>
            {/* Contenido de órdenes de compra */}
          </div>

          {/* Sección de proveedores */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Proveedores</h2>
            {/* Contenido de proveedores */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 