'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OrdenesList from '@/components/produccion/OrdenesList';

export default function OrdenesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="rounded-lg bg-white p-2 shadow">
      
        <OrdenesList />
      </div>
      </div>
    </DashboardLayout>
  );
} 