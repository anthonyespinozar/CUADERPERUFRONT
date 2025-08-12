import { useOrdenesProduccion } from '@/hooks/useOrdenesProduccion';
import { 
  CogIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export function OrdenesExecutiveSummary() {
  const { data: ordenes, isLoading } = useOrdenesProduccion();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Producción</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalOrdenes = ordenes?.length || 0;
  const ordenesFinalizadas = ordenes?.filter(o => o.ordenData.estado === 'finalizado').length || 0;
  const ordenesEnProceso = ordenes?.filter(o => ['en_proceso', 'iniciado'].includes(o.ordenData.estado)).length || 0;
  const ordenesPendientes = ordenes?.filter(o => o.ordenData.estado === 'pendiente').length || 0;
 // const ordenesCanceladas = ordenes?.filter(o => o.estado === 'cancelado').length || 0;

  // Calcular porcentajes
  const porcentajeFinalizadas = totalOrdenes > 0 ? (ordenesFinalizadas / totalOrdenes) * 100 : 0;
  const porcentajeEnProceso = totalOrdenes > 0 ? (ordenesEnProceso / totalOrdenes) * 100 : 0;
  //const porcentajePendientes = totalOrdenes > 0 ? (ordenesPendientes / totalOrdenes) * 100 : 0;

  // Calcular eficiencia de producción
  const ordenesCompletadas = ordenes?.filter(o => ['finalizado', 'cancelado'].includes(o.estado)).length || 0;
  //const eficienciaProduccion = totalOrdenes > 0 ? (ordenesFinalizadas / ordenesCompletadas) * 100 : 0;

  // Calcular tiempo promedio de producción
  const ordenesConTiempo = ordenes?.filter(o => 
    o.estado === 'finalizado' && o.fecha_inicio && o.fecha_fin
  ) || [];

  const tiempoPromedio = ordenesConTiempo.length > 0 
    ? ordenesConTiempo.reduce((sum, orden) => {
        const inicio = new Date(orden.fecha_inicio);
        const fin = new Date(orden.fecha_fin);
        return sum + (fin - inicio);
      }, 0) / ordenesConTiempo.length / (1000 * 60 * 60) // Convertir a horas
    : 0;

  /*Calcular tendencia (últimos 30 días vs anteriores)
  const ahora = new Date();
  const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const ordenesRecientes = ordenes?.filter(o => new Date(o.fecha_creacion) >= hace30Dias).length || 0;
  const ordenesAnteriores = ordenes?.filter(o => new Date(o.fecha_creacion) < hace30Dias).length || 0;
  
  const tendenciaOrdenes = ordenesAnteriores > 0 
    ? ((ordenesRecientes - ordenesAnteriores) / ordenesAnteriores) * 100 
    : 0;
*/
  // Calcular valor estimado de producción
  const valorTotalProduccion = ordenes?.reduce((sum, orden) => {
    // Asumiendo un valor promedio por orden (esto podría venir del backend)
    const valorPorOrden = 500; // Valor estimado por orden
    return sum + valorPorOrden;
  }, 0) || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Órdenes */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrdenes}</p>
              <p className="text-xs text-gray-500">Todas las órdenes</p>
            </div>
            <div className="text-blue-500">
              <CogIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Órdenes Finalizadas */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Órdenes Finalizadas</p>
              <p className="text-2xl font-bold text-gray-900">{ordenesFinalizadas}</p>
              <p className="text-xs text-gray-500">{porcentajeFinalizadas.toFixed(1)}% del total</p>
            </div>
            <div className="text-green-500">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Órdenes en Proceso */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-gray-900">{ordenesEnProceso}</p>
              <p className="text-xs text-gray-500">{porcentajeEnProceso.toFixed(1)}% del total</p>
            </div>
            <div className="text-yellow-500">
              <ClockIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Valor de Producción */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Producción</p>
              <p className="text-2xl font-bold text-gray-900">S/ {valorTotalProduccion.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Valor estimado total</p>
            </div>
            <div className="text-purple-500">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de rendimiento
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Eficiencia de Producción</p>
          <div className="flex items-center justify-center mt-2">
            {eficienciaProduccion >= 80 ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-1" />
            )}
            <span className={`text-lg font-bold ${
              eficienciaProduccion >= 80 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {eficienciaProduccion.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Órdenes completadas exitosamente</p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
          <p className="text-lg font-bold text-gray-900">{tiempoPromedio.toFixed(1)}h</p>
          <p className="text-xs text-gray-500">Por orden finalizada</p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Tendencia (30 días)</p>
          <div className="flex items-center justify-center mt-2">
            {tendenciaOrdenes > 0 ? (
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-1" />
            )}
            <span className={`text-lg font-bold ${
              tendenciaOrdenes > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(tendenciaOrdenes).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {ordenesRecientes} órdenes en los últimos 30 días
          </p>
        </div>
      </div>*/}

      {/* Estado de producción 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Órdenes Pendientes</p>
          <p className="text-lg font-bold text-gray-900">{ordenesPendientes}</p>
          <p className="text-xs text-gray-500">
            {porcentajePendientes.toFixed(1)}% del total
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Órdenes Canceladas</p>
          <p className="text-lg font-bold text-gray-900">{ordenesCanceladas}</p>
          <p className="text-xs text-gray-500">
            {totalOrdenes > 0 ? ((ordenesCanceladas / totalOrdenes) * 100).toFixed(1) : 0}% del total
          </p>
        </div>
      </div>
*/}
      {/* Alertas */}
      {(ordenesPendientes > 0 || ordenesEnProceso > 0) && (
        <div className="mt-4 space-y-2">
          {ordenesPendientes > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {ordenesPendientes} orden{ordenesPendientes > 1 ? 'es' : ''} pendiente{ordenesPendientes > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Necesitan ser iniciadas para comenzar la producción
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {ordenesEnProceso > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <CogIcon className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {ordenesEnProceso} orden{ordenesEnProceso > 1 ? 'es' : ''} en proceso
                  </p>
                  <p className="text-xs text-blue-700">
                    Monitorea el progreso de estas órdenes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 