'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/authService';
import MaterialesList from '@/components/inventario/MaterialesList';

export default function InventarioPage() {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-2 shadow">
          <MaterialesList />
        </div>
      </div>
    </DashboardLayout>
  );
} 