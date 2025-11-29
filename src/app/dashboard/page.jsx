'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { authService } from '@/services/authService';
import { useDashboard } from '@/hooks/useDashboard';
import { 
  StatsCard, 
  ProductionChart, 
  RecentMovements, 
  RecentPurchases, 
  WelcomeCard
} from '@/components/dashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  ExclamationTriangleIcon, 
  CubeIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CogIcon,
  ChartBarIcon,
  TrophyIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const user = authService.getUser();
  const router = useRouter();
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

  // Formatear valores
  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(num);
  };

  const formatNumber = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-PE').format(num);
  };

  // Materiales críticos
  const materialesCriticos = data?.materialesCriticos || [];
  const tieneMaterialesCriticos = materialesCriticos.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Tarjeta de bienvenida */}
        <WelcomeCard user={user} />

        {/* ALERTAS CRÍTICAS - Prioridad máxima */}
        {tieneMaterialesCriticos && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  ⚠️ Materiales con Stock Crítico
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Los siguientes materiales están por debajo del stock mínimo requerido:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {materialesCriticos.map((material) => {
                    const porcentaje = material.stock_minimo > 0 
                      ? Math.round((material.stock_actual / material.stock_minimo) * 100)
                      : 0;
                    const estaAgotado = material.stock_actual <= 0;
                    
                    return (
                      <div
                        key={material.id}
                        className={`p-4 rounded-lg border-2 ${
                          estaAgotado 
                            ? 'bg-red-100 border-red-300' 
                            : 'bg-orange-100 border-orange-300'
                        } cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => router.push('/inventario')}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {material.nombre}
                          </h4>
                          {estaAgotado && (
                            <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">
                              AGOTADO
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Stock actual:</span>
                            <span className={`font-bold ${
                              estaAgotado ? 'text-red-700' : 'text-orange-700'
                            }`}>
                              {material.stock_actual} unidades
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Stock mínimo:</span>
                            <span className="font-medium text-gray-700">
                              {material.stock_minimo} unidades
                            </span>
                          </div>
                          {!estaAgotado && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    porcentaje < 30 ? 'bg-red-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {porcentaje}% del mínimo requerido
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => router.push('/inventario')}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Ver Inventario Completo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumen Ejecutivo - Métricas Clave */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen General</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stock Total */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <CubeIcon className="h-8 w-8 text-blue-600" />
                <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded">
                  INVENTARIO
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {formatNumber(data?.totalStockMaterias || 0)}
              </p>
              <p className="text-sm text-gray-600">Unidades en stock</p>
            </div>

            {/* Producciones */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <ArrowUpIcon className="h-8 w-8 text-green-600" />
                <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded">
                  PRODUCCIÓN
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {data?.produccionesSemana || 0}
              </p>
              <p className="text-sm text-gray-600">Órdenes esta semana</p>
            </div>

            {/* Compras */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <ArrowDownIcon className="h-8 w-8 text-purple-600" />
                <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded">
                  COMPRAS
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(data?.comprasDelMes || 0)}
              </p>
              <p className="text-sm text-gray-600">Gastos del mes</p>
            </div>

            {/* Actividad */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <ArrowUpIcon className="h-8 w-8 text-orange-600" />
                <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded">
                  ACTIVIDAD
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {data?.movimientosHoy || 0}
              </p>
              <p className="text-sm text-gray-600">Movimientos hoy</p>
            </div>
          </div>

          {/* Métricas secundarias */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{data?.totalProveedores || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Proveedores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{data?.clientesActivos || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Clientes Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {materialesCriticos.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Materiales Críticos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{data?.ordenesActivas || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Órdenes Activas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(data?.stockProductosTerminados?.reduce((sum, p) => sum + (parseInt(p.stock_actual) || 0), 0) || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Productos Terminados</p>
            </div>
          </div>
        </div>

        {/* Estado de Órdenes de Producción */}
        {data?.estadosOrdenes && data.estadosOrdenes.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <CogIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Estado de Órdenes de Producción
              </h2>
              <button
                onClick={() => router.push('/produccion')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Ver todas →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.estadosOrdenes.map((estado) => {
                const estadoConfig = {
                  pendiente: { 
                    label: 'Pendientes', 
                    color: 'gold', 
                    bgColor: 'bg-yellow-50', 
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    icon: ClockIcon
                  },
                  iniciado: { 
                    label: 'En Proceso', 
                    color: 'blue', 
                    bgColor: 'bg-blue-50', 
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    icon: PlayIcon
                  },
                  finalizado: { 
                    label: 'Finalizadas', 
                    color: 'green', 
                    bgColor: 'bg-green-50', 
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    icon: CheckCircleIcon
                  }
                };
                const config = estadoConfig[estado.estado] || estadoConfig.pendiente;
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={estado.estado}
                    className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-5 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => router.push('/produccion')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <IconComponent className={`h-8 w-8 ${config.textColor}`} />
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      {estado.total}
                    </p>
                    <p className="text-sm text-gray-600">Órdenes {config.label.toLowerCase()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Producción y Productos Terminados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producción Mensual de Productos */}
          {data?.produccionMensualProductos && data.produccionMensualProductos.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
                  Producción del Mes
                </h3>
              </div>
              <div className="space-y-3">
                {data.produccionMensualProductos.map((item, index) => {
                  const total = data.produccionMensualProductos.reduce((sum, p) => sum + (parseInt(p.total) || 0), 0);
                  const porcentaje = total > 0 ? Math.round((parseInt(item.total) / total) * 100) : 0;
                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.producto}</span>
                        <span className="text-sm font-bold text-gray-900">{formatNumber(item.total)} unidades</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{ 
                            width: `${porcentaje}%`,
                            backgroundColor: colors[index % colors.length]
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{porcentaje}% del total producido</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ranking de Productos */}
          {data?.rankingProductos && data.rankingProductos.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  Top Productos (30 días)
                </h3>
              </div>
              <div className="space-y-4">
                {data.rankingProductos.map((producto, index) => {
                  const maxTotal = Math.max(...data.rankingProductos.map(p => parseInt(p.total) || 0));
                  const porcentaje = maxTotal > 0 ? Math.round((parseInt(producto.total) / maxTotal) * 100) : 0;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {producto.producto}
                        </p>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">{formatNumber(producto.total)}</p>
                        <p className="text-xs text-gray-500">unidades</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stock de Productos Terminados */}
        {data?.stockProductosTerminados && data.stockProductosTerminados.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <CubeIcon className="h-6 w-6 mr-2 text-purple-600" />
                Stock de Productos Terminados
              </h2>
              <button
                onClick={() => router.push('/produccion')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Ver todos →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.stockProductosTerminados.slice(0, 9).map((producto) => {
                const stock = parseInt(producto.stock_actual) || 0;
                const estaAgotado = stock === 0;
                const stockBajo = stock > 0 && stock <= 10;
                
                return (
                  <div
                    key={producto.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${
                      estaAgotado
                        ? 'bg-red-50 border-red-200'
                        : stockBajo
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                    onClick={() => router.push('/produccion')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm flex-1">
                        {producto.nombre}
                      </h4>
                      {estaAgotado && (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded ml-2">
                          AGOTADO
                        </span>
                      )}
                      {stockBajo && !estaAgotado && (
                        <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-200 rounded ml-2">
                          BAJO
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatNumber(stock)}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">unidades</span>
                      </div>
                      {!estaAgotado && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              stockBajo ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {data.stockProductosTerminados.length > 9 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push('/produccion')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Ver {data.stockProductosTerminados.length - 9} productos más →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gráfico de Producción */}
        {data?.graficoProduccionMensual && data.graficoProduccionMensual.length > 0 && (
          <ProductionChart data={data.graficoProduccionMensual} />
        )}

        {/* Actividad Reciente - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentMovements movements={data?.ultimosMovimientos} />
          <RecentPurchases purchases={data?.ultimasCompras} />
        </div>
      </div>
    </DashboardLayout>
  );
} 