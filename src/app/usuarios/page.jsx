'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/auth.service';

export default function UsuariosPage() {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
        
        <div className="rounded-lg bg-white p-6 shadow">
          {/* Contenido de la página de usuarios */}
          <p>Contenido de usuarios aquí</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 