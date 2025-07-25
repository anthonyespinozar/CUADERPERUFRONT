
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import UserList from '@/components/users/UserList';

export default function UsuariosPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <UserList />
        </div>
      </div>
    </DashboardLayout>
  );
} 