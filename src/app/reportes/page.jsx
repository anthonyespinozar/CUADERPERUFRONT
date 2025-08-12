import ReportesLayout from '@/components/reportes/ReportesLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const dynamic = 'force-dynamic';

export default function ReportesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReportesLayout />
      </div>
    </DashboardLayout>
  );
} 