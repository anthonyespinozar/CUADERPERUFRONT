import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import useStore from '@/store/useStore';

export default function Header() {
  const { toggleSidebar, notifications } = useStore();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 bg-white shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-500 rounded-md hover:bg-gray-100">
              <BellIcon className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
} 