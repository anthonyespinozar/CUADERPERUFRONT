import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon,
  CogIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  ArrowUpIcon 
} from '@heroicons/react/24/outline';

export function ExecutiveSummary({ data }) {
  if (!data) return null;

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, type: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
    };
  };

  const getTrendIcon = (type) => {
    switch (type) {
      case 'positive':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen Ejecutivo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productividad */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productividad</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.produccionesSemana || 0}
              </p>
              <p className="text-xs text-gray-500">Órdenes esta semana</p>
            </div>
            <div className="text-blue-500">
              <CogIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventario</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.totalMateriasPrimas || 0}
              </p>
              <p className="text-xs text-gray-500">Unidades totales</p>
            </div>
            <div className="text-green-500">
              <CubeIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Compras */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compras</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.comprasDelMes || 0}
              </p>
              <p className="text-xs text-gray-500">Este mes</p>
            </div>
            <div className="text-purple-500">
              <ShoppingCartIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Actividad */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actividad</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.movimientosHoy || 0}
              </p>
              <p className="text-xs text-gray-500">Movimientos hoy</p>
            </div>
            <div className="text-orange-500">
              <ArrowUpIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de rendimiento */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Proveedores Activos</p>
          <p className="text-xl font-bold text-gray-900">{data.totalProveedores || 0}</p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
          <p className="text-xl font-bold text-gray-900">{data.clientesActivos || 0}</p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Tipos de Materiales</p>
          <p className="text-xl font-bold text-gray-900">
            {data.graficoStock?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
} 