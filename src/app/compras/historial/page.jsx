

'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

import HistorialCompras from '@/components/compras/HistorialCompras';

export default function HistorialComprasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">


          <HistorialCompras />

      </div>
    </DashboardLayout>
  );
} 