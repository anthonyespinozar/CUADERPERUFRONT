'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import {
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO'] },
  { name: 'Usuarios', href: '/usuarios', icon: UsersIcon, roles: ['ADMINISTRADOR'] },
  { name: 'Compras', href: '/compras', icon: ShoppingCartIcon, roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
  { name: 'Inventario', href: '/inventario', icon: CubeIcon, roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
  { name: 'Producción', href: '/produccion', icon: ClipboardDocumentListIcon, roles: ['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO'] },
];

export function Sidebar({ user }) {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.rol)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <span className="text-xl font-bold text-white">CuaderPeru</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-1 text-sm">
            <p className="font-medium text-white">{user?.nombre}</p>
            <p className="text-gray-400">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 text-gray-400" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
} 