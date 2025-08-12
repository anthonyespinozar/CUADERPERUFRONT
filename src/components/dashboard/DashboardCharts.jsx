import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ProductionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Producción Mensual</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de producción disponibles
        </div>
      </div>
    );
  }

  const chartData = data
    .filter(item => item.mes)
    .map(item => ({
      mes: item.mes,
      produccion: parseInt(item.total)
    }))
    .reverse();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Producción Mensual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="mes" 
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year.slice(2)}`;
            }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value, 'Órdenes Finalizadas']}
            labelFormatter={(label) => {
              const [year, month] = label.split('-');
              return `${month}/${year}`;
            }}
          />
          <Bar dataKey="produccion" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StockChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stock de Materiales</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de stock disponibles
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.nombre,
    stock: item.stock_actual,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Stock de Materiales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip 
            formatter={(value) => [value, 'Stock Actual']}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="stock" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StockPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Stock</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de stock disponibles
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.nombre,
    value: Math.max(0, item.stock_actual), // Solo valores positivos para el gráfico
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Stock</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 