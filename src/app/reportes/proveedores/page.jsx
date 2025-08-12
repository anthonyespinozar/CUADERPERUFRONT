import ReporteProveedores from '@/components/reportes/ReporteProveedores';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReporteProveedoresPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReporteProveedores />
      </div>
    </DashboardLayout>
  );
} 