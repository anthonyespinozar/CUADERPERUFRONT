'use client';


import { DashboardLayout } from '@/components/layout/DashboardLayout';
import MaterialesList from '@/components/inventario/MaterialesList';

export default function MateriasPrimasPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div className="rounded-lg bg-white p-6 shadow">
          <MaterialesList />
        </div>
      </div>
    </DashboardLayout>
  );
} 