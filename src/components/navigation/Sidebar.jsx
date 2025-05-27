'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = authService.getUser();
  const isAdmin = user?.rol === 'ADMIN';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Usuarios', href: '/usuarios', icon: UsersIcon, adminOnly: true },
    { name: 'Inventario', href: '/inventario', icon: ClipboardDocumentListIcon },
    { name: 'Proveedores', href: '/proveedores', icon: TruckIcon },
    { name: 'Compras', href: '/compras', icon: ShoppingCartIcon },
    { name: 'Órdenes de Producción', href: '/ordenes', icon: WrenchScrewdriverIcon },
    { name: 'Producción', href: '/produccion', icon: ClipboardDocumentCheckIcon },
    { name: 'Auditoría', href: '/auditoria', icon: ChartBarIcon, adminOnly: true },
  ];

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center">
        <h1 className="text-xl font-bold text-white">CuaderPerú</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          // Skip admin-only items for non-admin users
          if (item.adminOnly && !isAdmin) return null;

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
          <div className="flex-1 truncate">
            <div className="text-sm font-medium text-white">{user?.nombre}</div>
            <div className="text-xs text-gray-400">{user?.rol}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
} 