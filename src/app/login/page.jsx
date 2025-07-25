'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import useStore from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    correo: '',
    password: '',
    general: ''
  });
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const { isAuthenticated, login } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ correo: '', password: '', general: '' });
    
    try {
      const response = await login({
        email: formData.correo,
        password: formData.password
      });
      
      toast.success(response.message || 'Inicio de sesión exitoso');
      router.replace('/dashboard');
    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('no encontrado')) {
        setErrors({ ...errors, correo: error.message });
      } else if (error.message.includes('Contraseña incorrecta')) {
        setErrors({ ...errors, password: error.message });
      } else if (error.message.includes('inactiva')) {
        setErrors({ ...errors, general: error.message });
      } else {
        setErrors({ ...errors, general: error.message || 'Error al iniciar sesión' });
      }

      toast.error(error.message, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.value
    });
    // Limpiar error del campo cuando el usuario empiece a escribir
    setErrors({
      ...errors,
      [name]: '',
      general: ''
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="CuaderPeru Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Iniciar Sesión
          </h2>
        </div>

        <div className="mt-8">
          <div className="rounded-md bg-white p-6 shadow">
            {errors.general && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative mt-1">
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className={`block w-full rounded-md pr-10 ${
                      errors.correo
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } shadow-sm sm:text-sm`}
                  />
                  {errors.correo && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.correo && (
                  <p className="mt-2 text-sm text-red-600">{errors.correo}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-md pr-10 ${
                      errors.password
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } shadow-sm sm:text-sm`}
                  />
                  {errors.password && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm 
                    ${isLoading 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </div>
                  ) : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 