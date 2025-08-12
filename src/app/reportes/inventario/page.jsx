import ReporteInventario from '@/components/reportes/ReporteInventario';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteInventarioPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteInventario />
      </div>
    </DashboardLayout>
  );
} 