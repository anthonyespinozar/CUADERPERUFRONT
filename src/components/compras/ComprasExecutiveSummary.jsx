import { useCompras } from '@/hooks/useCompras';
import { 
  ShoppingCartIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export function ComprasExecutiveSummary() {
  const { data: compras, isLoading } = useCompras();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Compras</h3>
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

  const totalCompras = compras?.length || 0;
  const comprasRecibidas = compras?.filter(c => c.estado === 'recibido').length || 0;
  const comprasPendientes = compras?.filter(c => ['pendiente', 'ordenado', 'en_transito'].includes(c.estado)).length || 0;
  //const comprasAnuladas = compras?.filter(c => ['anulada', 'cancelado'].includes(c.estado)).length || 0;
  
  const totalInvertido = compras?.reduce((sum, compra) => {
    const compraTotal = compra.materiales?.reduce((materialSum, material) => 
      materialSum + (material.cantidad * material.precio_unitario), 0
    ) || 0;
    return sum + compraTotal;
  }, 0) || 0;

  const promedioCompra = totalCompras > 0 ? totalInvertido / totalCompras : 0;
  const porcentajeRecibidas = totalCompras > 0 ? (comprasRecibidas / totalCompras) * 100 : 0;
  const porcentajePendientes = totalCompras > 0 ? (comprasPendientes / totalCompras) * 100 : 0;

  // Calcular tendencias (últimos 30 días vs anteriores)
  const ahora = new Date();
  const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
  /*
  const comprasRecientes = compras?.filter(c => new Date(c.fecha_compra) >= hace30Dias).length || 0;
  const comprasAnteriores = compras?.filter(c => new Date(c.fecha_compra) < hace30Dias).length || 0;
  
  const tendenciaCompras = comprasAnteriores > 0 
    ? ((comprasRecientes - comprasAnteriores) / comprasAnteriores) * 100 
    : 0;*/

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Compras */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Compras</p>
              <p className="text-2xl font-bold text-gray-900">{totalCompras}</p>
              <p className="text-xs text-gray-500">Todas las compras</p>
            </div>
            <div className="text-blue-500">
              <ShoppingCartIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Compras Recibidas */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compras Recibidas</p>
              <p className="text-2xl font-bold text-gray-900">{comprasRecibidas}</p>
              <p className="text-xs text-gray-500">{porcentajeRecibidas.toFixed(1)}% del total</p>
            </div>
            <div className="text-green-500">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Compras Pendientes */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compras Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{comprasPendientes}</p>
              <p className="text-xs text-gray-500">{porcentajePendientes.toFixed(1)}% del total</p>
            </div>
            <div className="text-yellow-500">
              <ClockIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Total Invertido */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invertido</p>
              <p className="text-2xl font-bold text-gray-900">S/ {totalInvertido.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Promedio: S/ {promedioCompra.toFixed(2)}</p>
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
          <p className="text-sm font-medium text-gray-600">Tendencia (30 días)</p>
          <div className="flex items-center justify-center mt-2">
            {tendenciaCompras > 0 ? (
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-1" />
            )}
            <span className={`text-lg font-bold ${
              tendenciaCompras > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(tendenciaCompras).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {comprasRecientes} compras en los últimos 30 días
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Eficiencia</p>
          <p className="text-lg font-bold text-gray-900">{porcentajeRecibidas.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Compras completadas</p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Compras Anuladas</p>
          <p className="text-lg font-bold text-gray-900">{comprasAnuladas}</p>
          <p className="text-xs text-gray-500">
            {totalCompras > 0 ? ((comprasAnuladas / totalCompras) * 100).toFixed(1) : 0}% del total
          </p>
        </div>
      </div>*/}

      {/* Alertas */}
      {comprasPendientes > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Tienes {comprasPendientes} compra{comprasPendientes > 1 ? 's' : ''} pendiente{comprasPendientes > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-yellow-700">
                Revisa el estado de las compras en tránsito y ordenadas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 