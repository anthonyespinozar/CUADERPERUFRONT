import { useProductos } from '@/hooks/useProductos';
import { 
  CubeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function ProductosExecutiveSummary() {
  const { data: productos, isLoading } = useProductos();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Productos</h3>
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

  const productosActivos = productos?.filter(p => p.estado === true) || [];
  const productosInactivos = productos?.filter(p => p.estado === false) || [];
  
  // Calcular valor total del inventario
  const valorTotalInventario = productosActivos.reduce((total, producto) => {
    const precio = Number(producto.precio_unitario) || 0;
    const stock = Number(producto.stock_actual) || 0;
    return total + (stock * precio);
  }, 0);

  // Calcular stock total
  const stockTotal = productosActivos.reduce((total, producto) => {
    return total + (Number(producto.stock_actual) || 0);
  }, 0);

  // Calcular promedio de stock
  const promedioStock = productosActivos.length > 0 ? 
    Math.round(stockTotal / productosActivos.length) : 0;

  // Calcular productos con stock bajo (menos de 10 unidades)
  const productosStockBajo = productosActivos.filter(p => (p.stock_actual || 0) < 10).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Productos</h3>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Productos */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Productos</p>
              <p className="text-2xl font-bold text-gray-900">{productos?.length || 0}</p>
              <p className="text-xs text-gray-500">{productosActivos.length} activos</p>
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
              <p className="text-2xl font-bold text-gray-900">{stockTotal}</p>
              <p className="text-xs text-gray-500">unidades en inventario</p>
            </div>
            <div className="text-green-500">
              <ChartBarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Promedio Stock */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio Stock</p>
              <p className="text-2xl font-bold text-gray-900">{promedioStock}</p>
              <p className="text-xs text-gray-500">unidades por producto</p>
            </div>
            <div className="text-orange-500">
              <ArrowTrendingUpIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Valor Total */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">S/ {valorTotalInventario.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-500">inventario total</p>
            </div>
            <div className="text-purple-500">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {productosStockBajo > 0 && (
        <div className="mt-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {productosStockBajo} producto{productosStockBajo > 1 ? 's' : ''} con stock bajo
                </p>
                <p className="text-xs text-yellow-700">
                  Considera reponer el inventario de estos productos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {productosInactivos.length > 0 && (
        <div className="mt-2">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {productosInactivos.length} producto{productosInactivos.length > 1 ? 's' : ''} inactivo{productosInactivos.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-700">
                  Productos deshabilitados temporalmente
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

