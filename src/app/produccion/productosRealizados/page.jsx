'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductosRealizadosList from '@/components/produccion/ProductosRealizadosList';

export default function OrdenesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProductosRealizadosList />
      </div>
    </DashboardLayout>
  );
} 