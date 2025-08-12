'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ComprasList from '@/components/compras/ComprasList';

export default function ComprasOrdenesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-2 shadow">
          <ComprasList />
        </div>
      </div>
    </DashboardLayout>
  );
} 