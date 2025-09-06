'use client';

import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

export default function TestAuthPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const token = authService.getToken();
  const tokenInfo = authService.getTokenInfo();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Prueba de Autenticación</h1>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Estado de Autenticación</h2>
        <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
        <p><strong>Usuario:</strong> {user ? user.nombre : 'No disponible'}</p>
        <p><strong>Rol:</strong> {user ? user.rol : 'No disponible'}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Información del Token</h2>
        <p><strong>Token presente:</strong> {token ? 'Sí' : 'No'}</p>
        {tokenInfo && (
          <div className="mt-2">
            <p><strong>Expira:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString()}</p>
            <p><strong>Emitido:</strong> {new Date(tokenInfo.iat * 1000).toLocaleString()}</p>
            <p><strong>Usuario ID:</strong> {tokenInfo.userId}</p>
            <p><strong>Email:</strong> {tokenInfo.email}</p>
            <p><strong>Rol:</strong> {tokenInfo.role}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Validaciones</h2>
        <p><strong>Token válido:</strong> {authService.isValidTokenFormat(token) ? 'Sí' : 'No'}</p>
        <p><strong>Token expirado:</strong> {authService.isTokenExpired(token) ? 'Sí' : 'No'}</p>
        <p><strong>Próximo a expirar:</strong> {authService.isTokenExpiringSoon() ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}

