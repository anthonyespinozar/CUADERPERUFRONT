'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ClientesList from '@/components/clientes/ClientesList';

export default function ClientesPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6 ">
        <div className="rounded-lg bg-white p-2 shadow">
          <ClientesList />
        </div>
      </div>
    </DashboardLayout>
  );
} 