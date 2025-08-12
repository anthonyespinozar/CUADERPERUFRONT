# Dashboard Profesional - CuaderPeru

## Descripción

Se ha creado un dashboard profesional y moderno para el sistema CuaderPeru que muestra información en tiempo real sobre el estado del negocio. El dashboard está diseñado para ser intuitivo, informativo y visualmente atractivo.

## Características Principales

### 🎯 **Tarjeta de Bienvenida Personalizada**
- Saludo dinámico según la hora del día
- Información del usuario y su rol
- Fecha y hora actual
- Diseño con gradiente profesional

### 📊 **Estadísticas en Tiempo Real**
- **Total Materias Primas**: Stock disponible en el inventario
- **Movimientos Hoy**: Actividad del día actual
- **Compras del Mes**: Compras realizadas en el mes actual
- **Producciones Semana**: Órdenes finalizadas esta semana
- **Total Proveedores**: Proveedores registrados en el sistema
- **Clientes Activos**: Clientes con estado activo

### 📈 **Gráficos Interactivos**
- **Gráfico de Producción Mensual**: Muestra las órdenes finalizadas por mes
- **Gráfico de Stock de Materiales**: Visualización del inventario actual
- **Gráfico de Distribución de Stock**: Gráfico circular con porcentajes

### ⚠️ **Alertas de Stock**
- **Sin Stock**: Materiales con stock 0 o negativo
- **Stock Bajo**: Materiales con stock ≤ 50 unidades
- Indicadores visuales con colores diferenciados

### 📋 **Actividad Reciente**
- **Últimos Movimientos**: Timeline de movimientos de inventario
- **Últimas Compras**: Historial de compras recientes
- Información detallada con fechas y montos

### 🎛️ **Resumen Ejecutivo**
- Métricas clave en tarjetas coloridas
- Indicadores de rendimiento
- Vista rápida del estado del negocio

## Componentes Creados

### `StatsCard`
Tarjetas de estadísticas con iconos y colores diferenciados por categoría.

### `WelcomeCard`
Tarjeta de bienvenida personalizada con información del usuario y tiempo.

### `DashboardCharts`
- `ProductionChart`: Gráfico de barras para producción mensual
- `StockChart`: Gráfico horizontal para stock de materiales
- `StockPieChart`: Gráfico circular para distribución de stock

### `RecentActivity`
- `RecentMovements`: Timeline de movimientos recientes
- `RecentPurchases`: Timeline de compras recientes
- `StockAlerts`: Alertas de stock bajo y sin stock

### `ExecutiveSummary`
Resumen ejecutivo con métricas clave y indicadores de rendimiento.

## Datos del Backend

El dashboard consume datos del endpoint `/api/dashboard` que devuelve:

```json
{
  "totalMateriasPrimas": "1405",
  "movimientosHoy": "0",
  "comprasDelMes": "0",
  "produccionesSemana": "1",
  "totalProveedores": "4",
  "clientesActivos": "1",
  "graficoProduccion": [...],
  "graficoStock": [...],
  "ultimosMovimientos": [...],
  "ultimasCompras": [...]
}
```

## Tecnologías Utilizadas

- **React Query**: Para manejo de estado y caché de datos
- **Recharts**: Para gráficos interactivos y responsivos
- **Heroicons**: Para iconografía consistente
- **Tailwind CSS**: Para estilos y diseño responsivo
- **Next.js**: Framework de React

## Características Técnicas

### 🔄 **Actualización Automática**
- Refetch automático cada 5 minutos
- Datos considerados frescos por 5 minutos
- Manejo de estados de carga y error

### 📱 **Diseño Responsivo**
- Adaptable a diferentes tamaños de pantalla
- Grid system flexible
- Componentes optimizados para móvil

### 🎨 **Diseño Moderno**
- Paleta de colores profesional
- Sombras y efectos visuales
- Tipografía clara y legible
- Iconografía consistente

### ⚡ **Rendimiento**
- Componentes optimizados
- Lazy loading de gráficos
- Manejo eficiente de datos

## Estructura de Archivos

```
src/components/dashboard/
├── StatsCard.jsx          # Tarjetas de estadísticas
├── WelcomeCard.jsx        # Tarjeta de bienvenida
├── DashboardCharts.jsx    # Gráficos del dashboard
├── RecentActivity.jsx     # Actividad reciente
├── ExecutiveSummary.jsx   # Resumen ejecutivo
└── index.js              # Exportaciones

src/hooks/
└── useDashboard.js       # Hook personalizado para datos

src/app/dashboard/
└── page.jsx             # Página principal del dashboard
```

## Uso

El dashboard se carga automáticamente al acceder a `/dashboard` y muestra:

1. **Tarjeta de bienvenida** con información personalizada
2. **Resumen ejecutivo** con métricas clave
3. **Estadísticas principales** en tarjetas coloridas
4. **Alertas de stock** si existen materiales con stock bajo
5. **Gráficos interactivos** de producción y stock
6. **Actividad reciente** con timelines
7. **Panel de administración** para usuarios admin

## Personalización

El dashboard se adapta automáticamente según:
- **Rol del usuario**: Muestra información adicional para administradores
- **Datos disponibles**: Maneja casos donde no hay datos
- **Estado del sistema**: Muestra alertas y estados operativos

## Mejoras Futuras

- [ ] Filtros por fecha para gráficos
- [ ] Exportación de reportes
- [ ] Notificaciones en tiempo real
- [ ] Más tipos de gráficos
- [ ] Personalización de widgets
- [ ] Modo oscuro 