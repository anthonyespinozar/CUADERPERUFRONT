import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export function WelcomeCard({ user }) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  let greeting = 'Buenos días';
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Buenas tardes';
  } else if (currentHour >= 18) {
    greeting = 'Buenas noches';
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">
              {greeting}, {user?.nombre || 'Usuario'}
            </h2>
            <p className="text-blue-100">
              {user?.rol === 'ADMIN' ? 'Administrador' : 'Usuario'} - {formatDate(currentTime)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center text-blue-100">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">
              {currentTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center text-blue-100">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">
              {currentTime.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 