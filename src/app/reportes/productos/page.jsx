import ReporteProductos from '@/components/reportes/ReporteProductos';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteProductosPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteProductos />
      </div>
    </DashboardLayout>
  );
}

