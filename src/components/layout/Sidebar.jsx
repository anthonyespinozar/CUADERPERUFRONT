'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';
import {
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    roles: ['administrador', 'usuario']
  },
  {
    name: 'Insumos',
    href: '/inventario',
    icon: CubeIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      { name: 'Gestión de Insumos', href: '/inventario' },
      { name: 'Movimientos', href: '/inventario/movimientos' },
    ]
  },
  {
    name: 'Compras',
    href: '/compras',
    icon: ShoppingCartIcon,
    roles: ['administrador', 'usuario'],
  },
  {
    name: 'Producción',
    href: '/produccion',
    icon: ClipboardDocumentListIcon,
    roles: ['administrador', 'usuario'],
    submenu: [
      { name: 'Órdenes de Producción', href: '/produccion' },
      { name: 'Movimientos', href: '/produccion/movimientos' },
      { name: 'Producciones Realizadas', href: '/produccion/produccionesRealizadas' },
      { name: 'Productos Realizados', href: '/produccion/productosRealizados' },
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
      { name: 'Movimientos de Insumos', href: '/reportes/movimientos' },
      { name: 'Productos', href: '/reportes/productos' },
      { name: 'Movimientos de Productos', href: '/reportes/movimientos-productos' },
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
  const router = useRouter();
  const { logout } = useLogout();
  const [openMenus, setOpenMenus] = useState({});
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => logout();

  const toggleSubmenu = (item) => {
    // Si tiene submenú, al hacer clic:
    // 1. se expande el menú
    // 2. navega al primer enlace del submenú (como antes)
    if (item.submenu?.length > 0) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));

      // Navega al primer enlace del submenú
      const firstHref = item.submenu[0].href;
      router.push(firstHref);
    } else {
      router.push(item.href);
    }
  };

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.rol?.toLowerCase())
  );

  const isActiveLink = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Botón hamburguesa (solo en móvil) */}
      <div className="lg:hidden flex items-center bg-gray-900 p-3">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <span className="ml-3 text-blue-400 font-bold">CuaderPeru</span>
      </div>

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static z-40 flex h-full w-64 flex-col bg-gray-900 shadow-xl transform transition-transform duration-300`}>
        
        {/* Logo */}
        <div className="hidden lg:flex h-16 items-center justify-center border-b border-gray-800">
          <span className="text-2xl font-bold text-blue-400">CuaderPeru</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = isActiveLink(item.href);
            const isOpenMenu = openMenus[item.name] || isActive;

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item)}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                    {item.name}
                  </div>

                  {item.submenu && (
                    isOpenMenu
                      ? <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      : <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {/* Submenú */}
                {item.submenu && isOpenMenu && (
                  <div className="ml-8 border-l border-gray-700 pl-3 space-y-1 animate-fadeIn">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`block rounded-md px-2 py-1.5 text-sm transition-all duration-150 ${
                          pathname === subitem.href
                            ? 'bg-gray-800 text-blue-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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

        {/* Usuario y Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center mb-3">
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{user?.nombre}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.rol}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
