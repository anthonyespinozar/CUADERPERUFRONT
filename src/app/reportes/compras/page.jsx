import ReporteCompras from '@/components/reportes/ReporteCompras';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteComprasPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteCompras />
      </div>
    </DashboardLayout>
  );
} 