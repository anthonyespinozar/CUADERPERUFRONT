'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProveedoresList from '@/components/proveedores/ProveedoresList';

export default function ProveedoresPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProveedoresList />
          </div>
    </DashboardLayout>
  );
} 