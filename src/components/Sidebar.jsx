import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import useStore from '@/store/useStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Inventario', href: '/inventario', icon: CubeIcon },
  { name: 'Producción', href: '/produccion', icon: ClipboardDocumentListIcon },
  { name: 'Compras', href: '/compras', icon: ShoppingCartIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Usuarios', href: '/usuarios', icon: UserGroupIcon },
  { name: 'Configuración', href: '/configuracion', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">CuaderPeru</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src="https://via.placeholder.com/32"
                alt="User"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Usuario</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 