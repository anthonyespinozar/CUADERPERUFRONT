'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import MovimientosProductosList from '@/components/produccion/MovimientosProductosList';

export default function MovimientosProductosPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="rounded-lg bg-white p-2 shadow">
      
        <MovimientosProductosList />
      </div>
      </div>
    </DashboardLayout>
  );
} 