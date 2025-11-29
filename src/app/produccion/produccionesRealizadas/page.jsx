'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProduccionesRealizadasList from '@/components/produccion/ProduccionesRealizadasList';

export default function OrdenesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProduccionesRealizadasList />
      </div>
    </DashboardLayout>
  );
} 