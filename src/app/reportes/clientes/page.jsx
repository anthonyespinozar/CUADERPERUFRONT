import ReporteClientes from '@/components/reportes/ReporteClientes';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteClientesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteClientes />
      </div>
    </DashboardLayout>
  );
} 