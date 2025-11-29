import ReporteMovimientosProductos from '@/components/reportes/ReporteMovimientosProductos';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteMovimientosProductosPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteMovimientosProductos />
      </div>
    </DashboardLayout>
  );
}

