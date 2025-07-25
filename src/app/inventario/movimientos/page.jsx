
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProveedoresList from '@/components/proveedores/ProveedoresList';

import MovimientosList from '@/components/inventario/MovimientosList';
export default function MovimientosPage() {
  return (
    <DashboardLayout>

        <div className="rounded-lg bg-white p-6 shadow">
          <MovimientosList />
        </div>
    </DashboardLayout>
  );
} 