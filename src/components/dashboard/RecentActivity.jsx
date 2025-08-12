import { ArrowUpIcon, ArrowDownIcon, ShoppingCartIcon, CubeIcon } from '@heroicons/react/24/outline';

export function RecentMovements({ movements }) {
  if (!movements || movements.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Últimos Movimientos</h3>
        <div className="text-center text-gray-500 py-8">
          No hay movimientos recientes
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Últimos Movimientos</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {movements.map((movement, index) => (
            <li key={movement.id}>
              <div className="relative pb-8">
                {index !== movements.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      movement.tipo_movimiento === 'entrada' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {movement.tipo_movimiento === 'entrada' ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {movement.material}
                        </span>
                        {' - '}
                        <span className={`font-medium ${
                          movement.tipo_movimiento === 'entrada' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.tipo_movimiento === 'entrada' ? '+' : '-'}{movement.cantidad} unidades
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(movement.fecha_movimiento).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RecentPurchases({ purchases }) {
  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Compras</h3>
        <div className="text-center text-gray-500 py-8">
          No hay compras recientes
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Compras</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {purchases.map((purchase, index) => (
            <li key={purchase.id}>
              <div className="relative pb-8">
                {index !== purchases.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-purple-500 text-white">
                      <ShoppingCartIcon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {purchase.proveedor}
                        </span>
                        {' - '}
                        <span className="font-medium text-purple-600">
                          S/ {parseFloat(purchase.total).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(purchase.fecha_compra).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function StockAlerts({ stockData }) {
  if (!stockData || stockData.length === 0) {
    return null;
  }

  const lowStockItems = stockData.filter(item => item.stock_actual <= 50 && item.stock_actual > 0);
  const outOfStockItems = stockData.filter(item => item.stock_actual <= 0);

  if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas de Stock</h3>
      
      {outOfStockItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-red-600 mb-2">Sin Stock</h4>
          <div className="space-y-2">
            {outOfStockItems.map(item => (
              <div key={item.nombre} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <CubeIcon className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{item.nombre}</span>
                </div>
                <span className="text-sm text-red-600 font-medium">Sin stock</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-yellow-600 mb-2">Stock Bajo</h4>
          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.nombre} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <CubeIcon className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{item.nombre}</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">{item.stock_actual} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 