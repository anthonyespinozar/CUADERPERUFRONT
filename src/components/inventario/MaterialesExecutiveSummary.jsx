import { useMateriales } from '@/hooks/useMateriales';
import { 
  CubeIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export function MaterialesExecutiveSummary() {
  const { data: materiales, isLoading } = useMateriales();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Materiales</h3>
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

  const totalMateriales = materiales?.length || 0;
  const materialesActivos = materiales?.filter(m => m.estado).length || 0;
  //const materialesInactivos = materiales?.filter(m => !m.estado).length || 0;
  
  // Calcular stock total y valor
  const stockTotal = materiales?.reduce((sum, material) => sum + (material.stock_actual || 0), 0) || 0;
  const valorTotalStock = materiales?.reduce((sum, material) => {
    // Asumiendo un valor promedio por unidad (esto podría venir del backend)
    const valorPorUnidad = 10; // Valor estimado por unidad
    return sum + ((material.stock_actual || 0) * valorPorUnidad);
  }, 0) || 0;

  // Materiales con stock bajo
  const materialesStockBajo = materiales?.filter(m => 
    m.stock_actual <= (m.stock_minimo || 50) && m.stock_actual > 0
  ).length || 0;

  // Materiales sin stock
  const materialesSinStock = materiales?.filter(m => 
    m.stock_actual <= 0
  ).length || 0;

  // Materiales con stock óptimo
  //const materialesStockOptimo = materiales?.filter(m => 
  //  m.stock_actual > (m.stock_minimo || 50) && m.stock_actual <= (m.stock_maximo || 200)
  //).length || 0;

  // Calcular porcentajes
  const porcentajeActivos = totalMateriales > 0 ? (materialesActivos / totalMateriales) * 100 : 0;
  const porcentajeStockBajo = totalMateriales > 0 ? (materialesStockBajo / totalMateriales) * 100 : 0;
  //const porcentajeSinStock = totalMateriales > 0 ? (materialesSinStock / totalMateriales) * 100 : 0;

  // Calcular tendencia de stock (comparar con el mes anterior)
  const stockPromedio = totalMateriales > 0 ? stockTotal / totalMateriales : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Materiales */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Materiales</p>
              <p className="text-2xl font-bold text-gray-900">{totalMateriales}</p>
              <p className="text-xs text-gray-500">{porcentajeActivos.toFixed(1)}% activos</p>
            </div>
            <div className="text-blue-500">
              <CubeIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Stock Total */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900">{stockTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Promedio: {stockPromedio.toFixed(0)} por material</p>
            </div>
            <div className="text-green-500">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Materiales con Stock Bajo */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{materialesStockBajo}</p>
              <p className="text-xs text-gray-500">{porcentajeStockBajo.toFixed(1)}% del total</p>
            </div>
            <div className="text-yellow-500">
              <ExclamationTriangleIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Valor del Stock */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor del Stock</p>
              <p className="text-2xl font-bold text-gray-900">S/ {valorTotalStock.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Valor estimado total</p>
            </div>
            <div className="text-purple-500">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {(materialesStockBajo > 0 || materialesSinStock > 0) && (
        <div className="mt-4 space-y-2">
          {materialesSinStock > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    ¡Alerta! {materialesSinStock} material{materialesSinStock > 1 ? 'es' : ''} sin stock
                  </p>
                  <p className="text-xs text-red-700">
                    Necesitas realizar compras urgentes para estos materiales
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {materialesStockBajo > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {materialesStockBajo} material{materialesStockBajo > 1 ? 'es' : ''} con stock bajo
                  </p>
                  <p className="text-xs text-yellow-700">
                    Considera realizar compras preventivas
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