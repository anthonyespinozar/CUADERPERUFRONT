'use client';

import { useEffect, useState } from 'react';
import { makeGetRequest } from '@/utils/api';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    stockTotal: 0,
    ordenesPendientes: 0,
    comprasPendientes: 0,
    produccionDiaria: 0,
  });
  const [stockData, setStockData] = useState(null);
  const [produccionData, setProduccionData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener datos del inventario
        const stockResponse = await makeGetRequest('/inventario/stock');
        setStockData({
          labels: stockResponse.map(item => item.nombre),
          datasets: [
            {
              label: 'Stock Actual',
              data: stockResponse.map(item => item.stock_actual),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });

        // Obtener datos de producción
        const produccionResponse = await makeGetRequest('/reportes/consumo-mensual');
        setProduccionData({
          labels: produccionResponse.map(item => item.mes),
          datasets: [
            {
              label: 'Producción Mensual',
              data: produccionResponse.map(item => item.cantidad),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });

        // Actualizar estadísticas
        setStats({
          stockTotal: stockResponse.reduce((acc, curr) => acc + curr.stock_actual, 0),
          ordenesPendientes: produccionResponse.filter(item => item.estado === 'pendiente').length,
          comprasPendientes: 0, // Implementar cuando esté disponible la API
          produccionDiaria: produccionResponse[0]?.cantidad || 0,
        });
      } catch (error) {
        toast.error('Error al cargar los datos del dashboard');
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Stock Total</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.stockTotal}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Órdenes Pendientes</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.ordenesPendientes}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Compras Pendientes</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.comprasPendientes}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Producción Diaria</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.produccionDiaria}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Stock por Material</h3>
          {stockData && (
            <div className="mt-4 h-80">
              <Bar
                data={stockData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Producción Mensual</h3>
          {produccionData && (
            <div className="mt-4 h-80">
              <Line
                data={produccionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 