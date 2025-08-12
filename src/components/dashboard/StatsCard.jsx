import { 
  CubeIcon, 
  ArrowUpIcon, 
  ShoppingCartIcon, 
  CogIcon,
  UserGroupIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  materiales: CubeIcon,
  movimientos: ArrowUpIcon,
  compras: ShoppingCartIcon,
  produccion: CogIcon,
  proveedores: UserGroupIcon,
  clientes: UsersIcon,
  tendencia: ArrowTrendingUpIcon,
  alerta: ExclamationTriangleIcon
};

const colorMap = {
  materiales: 'bg-blue-500',
  movimientos: 'bg-green-500',
  compras: 'bg-purple-500',
  produccion: 'bg-orange-500',
  proveedores: 'bg-indigo-500',
  clientes: 'bg-pink-500',
  tendencia: 'bg-emerald-500',
  alerta: 'bg-red-500'
};

export function StatsCard({ title, value, icon, type = 'default', change, changeType = 'neutral' }) {
  const IconComponent = iconMap[icon] || CubeIcon;
  const bgColor = colorMap[icon] || 'bg-gray-500';

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-md ${bgColor} text-white`}>
              <IconComponent className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === 'positive' ? 'text-green-600' : 
                    changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {changeType === 'positive' && <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />}
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 