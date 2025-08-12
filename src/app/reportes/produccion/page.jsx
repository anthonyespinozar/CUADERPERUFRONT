import ReporteProduccion from '@/components/reportes/ReporteProduccion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteProduccionPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteProduccion />
      </div>
    </DashboardLayout>
  );
} 