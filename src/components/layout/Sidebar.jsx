'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import {
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    roles: ['administrador', 'usuario']
  },
  {
    name: 'Inventario',
    href: '/inventario',
    icon: CubeIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      //{ name: 'Materias Primas', href: '/inventario/materias-primas' },
      { name: 'Movimientos', href: '/inventario/movimientos' },
    ]
  },
  {
    name: 'Compras',
    href: '/compras',
    icon: ShoppingCartIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      //{ name: 'Órdenes de Compra', href: '/compras/ordenes' },
      { name: 'Historial', href: '/compras/historial' },
    ]
  },

  {
    name: 'Producción',
    href: '/produccion',
    icon: ClipboardDocumentListIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      //{ name: 'Órdenes de Producción', href: '/produccion/ordenes' },
      { name: 'Producciones Realizadas', href: '/produccion/historial' },
    ]
  },
  
  {
    name: 'Proveedores',
    href: '/proveedores',
    icon: BuildingStorefrontIcon,
    roles: ['administrador', 'usuario'],
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: UserGroupIcon,
    roles: ['administrador', 'usuario']
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: ChartBarIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      { name: 'Inventario', href: '/reportes/inventario' },
      { name: 'Compras', href: '/reportes/compras' },
      { name: 'Producción', href: '/reportes/produccion' },
      { name: 'Movimientos', href: '/reportes/movimientos' },
      { name: 'Clientes', href: '/reportes/clientes' },
      { name: 'Proveedores', href: '/reportes/proveedores' }, 
    ]
  },
  { 
    name: 'Usuarios', 
    href: '/usuarios', 
    icon: UsersIcon, 
    roles: ['administrador'] 
  },
];

export function Sidebar({ user }) {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.rol?.toLowerCase())
  );

  const isActiveLink = (href, pathname) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <span className="text-xl font-bold text-white">CuaderPeru</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = isActiveLink(item.href, pathname);
          
          return (
            <div key={item.name} className="space-y-1">
              <Link
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>

              {/* Submenu */}
              {item.submenu && isActive && (
                <div className="ml-8 space-y-1">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.name}
                      href={subitem.href}
                      className={`group flex items-center rounded-md px-2 py-1.5 text-sm font-medium ${
                        pathname === subitem.href
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="font-medium text-white text-sm">{user?.nombre}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
} 