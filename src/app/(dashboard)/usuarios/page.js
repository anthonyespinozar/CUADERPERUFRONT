'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function UsuariosPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Gestión de Usuarios</h1>
        {/* Aquí irá el contenido de la gestión de usuarios */}
      </div>
    </ProtectedRoute>
  );
} 