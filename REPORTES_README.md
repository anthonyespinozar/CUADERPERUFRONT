# Sistema de Reportes - CuaderPeru

## Descripción General

El sistema de reportes de CuaderPeru proporciona una interfaz completa y profesional para generar y analizar reportes de todas las áreas del sistema. Cada reporte incluye filtros avanzados, estadísticas en tiempo real y capacidades de exportación a Excel y PDF.

## Características Principales

### 🎯 Funcionalidades
- **6 tipos de reportes** diferentes cubriendo todas las áreas del negocio
- **Filtros avanzados** por fecha, estado, material, etc.
- **Exportación** a Excel y PDF
- **Estadísticas en tiempo real** con métricas clave
- **Interfaz responsive** y profesional
- **Navegación intuitiva** con búsqueda y acceso rápido

### 📊 Tipos de Reportes

#### 1. Reporte de Inventario
- **Descripción**: Estado actual del inventario de materiales
- **Filtros**: Sin filtros específicos (muestra todo el inventario)
- **Exportación**: Excel, PDF
- **Estadísticas**: Total materiales, activos, stock bajo, sin stock
- **Campos**: ID, Nombre, Tipo, Unidad, Stock Actual, Mínimo, Máximo, Estado

#### 2. Reporte de Compras
- **Descripción**: Análisis de compras por período y proveedor
- **Filtros**: Fecha desde, Fecha hasta
- **Exportación**: Excel, PDF
- **Estadísticas**: Total compras, monto total, completadas, pendientes
- **Campos**: ID Compra, Fecha, Estado, Proveedor, Fecha Estimada, Total, Observaciones

#### 3. Reporte de Producción
- **Descripción**: Estado de órdenes de producción y rendimiento
- **Filtros**: Estado (completada, en_proceso, pendiente, cancelada)
- **Exportación**: Excel, PDF
- **Estadísticas**: Total órdenes, completadas, en proceso, pendientes
- **Campos**: ID Orden, Código, Tipo Cuaderno, Cantidad, Estado, Fechas, Cliente

#### 4. Reporte de Movimientos
- **Descripción**: Historial de movimientos de inventario
- **Filtros**: Material, Fecha desde, Fecha hasta
- **Exportación**: Excel, PDF
- **Estadísticas**: Total movimientos, entradas, salidas, totales
- **Campos**: ID, Material, Tipo, Cantidad, Descripción, Fecha

#### 5. Reporte de Clientes
- **Descripción**: Información y estado de clientes
- **Filtros**: Estado (activo, inactivo)
- **Exportación**: Excel
- **Estadísticas**: Total clientes, activos, inactivos, con email
- **Campos**: ID, Nombre, Contacto, Teléfono, Email, Dirección, Estado, Creado en

#### 6. Reporte de Proveedores
- **Descripción**: Análisis de proveedores y actividad
- **Filtros**: Sin filtros específicos
- **Exportación**: Excel
- **Estadísticas**: Total proveedores, con compras, sin compras, con email, total compras
- **Campos**: ID, Nombre, Contacto, Teléfono, Email, Dirección, Total Compras

## Estructura de Archivos

```
src/
├── components/
│   └── reportes/
│       ├── index.js                    # Exportaciones
│       ├── ReporteFiltros.jsx         # Componente reutilizable de filtros
│       ├── ReportesLayout.jsx         # Layout principal de reportes
│       ├── ReporteInventario.jsx      # Reporte de inventario
│       ├── ReporteCompras.jsx         # Reporte de compras
│       ├── ReporteProduccion.jsx      # Reporte de producción
│       ├── ReporteMovimientos.jsx     # Reporte de movimientos
│       ├── ReporteClientes.jsx        # Reporte de clientes
│       └── ReporteProveedores.jsx     # Reporte de proveedores
├── app/
│   └── reportes/
│       ├── page.jsx                   # Página principal de reportes
│       ├── inventario/
│       │   └── page.jsx              # Página reporte inventario
│       ├── compras/
│       │   └── page.jsx              # Página reporte compras
│       ├── produccion/
│       │   └── page.jsx              # Página reporte producción
│       ├── movimientos/
│       │   └── page.jsx              # Página reporte movimientos
│       ├── clientes/
│       │   └── page.jsx              # Página reporte clientes
│       └── proveedores/
│           └── page.jsx              # Página reporte proveedores
├── hooks/
│   └── useReportes.js                # Hooks para manejo de datos
└── services/
    └── reportesService.js            # Servicios de API
```

## Componentes Principales

### ReporteFiltros.jsx
Componente reutilizable que maneja:
- Filtros de fecha (desde/hasta)
- Filtros de estado
- Filtros de material
- Botones de exportación (Excel/PDF)
- Filtros avanzados expandibles

### ReportesLayout.jsx
Layout principal que incluye:
- Header con título y descripción
- Búsqueda de reportes
- Grid de tarjetas de reportes
- Acceso rápido con iconos
- Estados vacíos

### Componentes de Reporte Individuales
Cada reporte incluye:
- Header específico con icono y descripción
- Filtros personalizados
- Estadísticas en tiempo real
- Tabla de datos con paginación
- Estados de carga y error
- Funcionalidad de exportación

## Integración con Backend

### Endpoints Utilizados
- `GET /api/reportes/inventario` - Reporte de inventario
- `GET /api/reportes/compras` - Reporte de compras
- `GET /api/reportes/produccion` - Reporte de producción
- `GET /api/reportes/movimientos` - Reporte de movimientos
- `GET /api/reportes/clientes` - Reporte de clientes
- `GET /api/reportes/proveedores` - Reporte de proveedores

### Parámetros de Query
- `desde` - Fecha de inicio (YYYY-MM-DD)
- `hasta` - Fecha de fin (YYYY-MM-DD)
- `estado` - Estado del registro
- `material_id` - ID del material
- `export` - Tipo de exportación (excel/pdf)

### Exportación
Los reportes soportan exportación a:
- **Excel (.xlsx)**: Formato tabular completo
- **PDF**: Formato de documento con formato profesional

## Características Técnicas

### Tecnologías Utilizadas
- **React 18** con hooks modernos
- **Next.js 14** con App Router
- **Tailwind CSS** para estilos
- **Heroicons** para iconografía
- **React Query** para manejo de estado
- **TypeScript** para tipado (opcional)

### Patrones de Diseño
- **Componentes reutilizables** para filtros y layouts
- **Hooks personalizados** para lógica de negocio
- **Separación de responsabilidades** entre UI y datos
- **Manejo de estados** con React Query
- **Error boundaries** para manejo de errores

### Responsive Design
- **Mobile-first** approach
- **Grid layouts** adaptativos
- **Tablas con scroll horizontal** en móviles
- **Cards responsive** para estadísticas

## Uso y Navegación

### Acceso a Reportes
1. Navegar a `/reportes` desde el sidebar
2. Seleccionar el reporte deseado desde la grilla
3. Aplicar filtros según necesidad
4. Exportar en el formato deseado

### Filtros Comunes
- **Fechas**: Seleccionar rango de fechas
- **Estado**: Filtrar por estado activo/inactivo
- **Material**: Filtrar por material específico
- **Búsqueda**: Buscar reportes por nombre

### Exportación
1. Configurar filtros deseados
2. Hacer clic en "Exportar Excel" o "Exportar PDF"
3. El archivo se descargará automáticamente
4. El nombre incluye timestamp para evitar duplicados

## Mantenimiento y Extensibilidad

### Agregar Nuevos Reportes
1. Crear componente en `src/components/reportes/`
2. Agregar servicio en `src/services/reportesService.js`
3. Agregar hook en `src/hooks/useReportes.js`
4. Crear página en `src/app/reportes/`
5. Actualizar `ReportesLayout.jsx` con nueva entrada

### Personalización de Filtros
- Modificar `ReporteFiltros.jsx` para nuevos tipos
- Agregar validaciones específicas
- Implementar filtros avanzados según necesidad

### Mejoras Futuras
- **Gráficos**: Integrar librerías de gráficos
- **Dashboards**: Crear dashboards interactivos
- **Scheduling**: Programar reportes automáticos
- **Email**: Envío de reportes por email
- **Almacenamiento**: Guardar configuraciones de filtros

## Consideraciones de Rendimiento

### Optimizaciones Implementadas
- **React Query** para cache de datos
- **Lazy loading** de componentes
- **Debounce** en filtros de búsqueda
- **Paginación** para grandes datasets
- **Compresión** de archivos exportados

### Monitoreo
- **Error tracking** en exportaciones
- **Loading states** para mejor UX
- **Retry logic** para fallos de red
- **Analytics** de uso de reportes

## Conclusión

El sistema de reportes de CuaderPeru proporciona una solución completa y profesional para la generación y análisis de datos empresariales. Con su arquitectura modular, interfaz intuitiva y capacidades de exportación, satisface las necesidades de reporting de una empresa manufacturera moderna. 