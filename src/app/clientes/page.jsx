'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ClientesList from '@/components/clientes/ClientesList';

export default function ClientesPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClientesList />
          </div>
    </DashboardLayout>
  );
} 