import ReporteMovimientos from '@/components/reportes/ReporteMovimientos';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteMovimientosPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteMovimientos />
      </div>
    </DashboardLayout>
  );
} 