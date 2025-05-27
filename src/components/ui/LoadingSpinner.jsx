export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      <span className="ml-2 text-gray-700">Cargando...</span>
    </div>
  );
} 