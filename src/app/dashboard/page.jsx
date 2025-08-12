'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/authService';
import { useDashboard } from '@/hooks/useDashboard';
import { 
  StatsCard, 
  ProductionChart, 
  StockChart, 
  StockPieChart,
  RecentMovements, 
  RecentPurchases, 
  StockAlerts,
  WelcomeCard,
  ExecutiveSummary 
} from '@/components/dashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const user = authService.getUser();
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar el dashboard
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error?.message || 'No se pudieron cargar los datos del dashboard'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Tarjeta de bienvenida */}
        <WelcomeCard user={user} />

        {/* Resumen ejecutivo */}
        <ExecutiveSummary data={data} />

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Materias Primas"
            value={data?.totalMateriasPrimas || '0'}
            icon="materiales"
            change={data?.totalMateriasPrimas > 0 ? 'Disponible' : 'Sin stock'}
            changeType={data?.totalMateriasPrimas > 0 ? 'positive' : 'negative'}
          />
          
          <StatsCard
            title="Movimientos Hoy"
            value={data?.movimientosHoy || '0'}
            icon="movimientos"
            change="Hoy"
            changeType="neutral"
          />
          
          <StatsCard
            title="Compras del Mes"
            value={data?.comprasDelMes || '0'}
            icon="compras"
            change="Este mes"
            changeType="neutral"
          />
          
          <StatsCard
            title="Producciones Semana"
            value={data?.produccionesSemana || '0'}
            icon="produccion"
            change="Esta semana"
            changeType="neutral"
          />
          
          <StatsCard
            title="Total Proveedores"
            value={data?.totalProveedores || '0'}
            icon="proveedores"
            change="Activos"
            changeType="neutral"
          />
          
          <StatsCard
            title="Clientes Activos"
            value={data?.clientesActivos || '0'}
            icon="clientes"
            change="Registrados"
            changeType="neutral"
          />
        </div>

        {/* Alertas de stock */}
        {data?.graficoStock && (
          <StockAlerts stockData={data.graficoStock} />
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionChart data={data?.graficoProduccion} />
          <StockChart data={data?.graficoStock} />
        </div>

        {/* Gráfico de distribución de stock */}
        {data?.graficoStock && data.graficoStock.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockPieChart data={data.graficoStock} />
            
            {/* Resumen de actividad */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Actividad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Sistema Operativo</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Funcionando</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Última Actualización</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">
                    {new Date().toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Total de Materiales</span>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">
                    {data?.graficoStock?.length || 0} tipos
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentMovements movements={data?.ultimosMovimientos} />
          <RecentPurchases purchases={data?.ultimasCompras} />
        </div>

        {/* Información adicional para administradores */}
        {user?.rol === 'ADMIN' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Panel de Administración</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Gestión de Usuarios</h4>
                <p className="text-xs text-gray-500 mt-1">Administrar permisos y roles</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Configuración del Sistema</h4>
                <p className="text-xs text-gray-500 mt-1">Ajustes generales</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Reportes Avanzados</h4>
                <p className="text-xs text-gray-500 mt-1">Análisis detallado</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 