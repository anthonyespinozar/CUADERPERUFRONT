'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ComprasList from '@/components/compras/ComprasList';
import ComprasStats from '@/components/compras/ComprasStats';

export default function ComprasOrdenesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ComprasStats />
        <div className="rounded-lg bg-white p-6 shadow">
          <ComprasList />
        </div>
      </div>
    </DashboardLayout>
  );
} 