import { useQuery } from "@tanstack/react-query";
import {
  getReporteInventario,
  getReporteCompras,
  getReporteProduccion,
  getReporteMovimientos,
  getReporteClientes,
  getReporteProveedores,
  getReporteMovimientosProductos,
  getReporteProductos,
} from "@/services/reportesService";

// Reporte de Inventario
export const useReporteInventario = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteInventario", params],
    queryFn: () => getReporteInventario(params),
  });

  return query;
};

// Reporte de Compras
export const useReporteCompras = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteCompras", params],
    queryFn: () => getReporteCompras(params),
  });

  return query;
};
// Reporte de Movimientos insumos
export const useReporteMovimientos = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteMovimientos", params],
    queryFn: () => getReporteMovimientos(params),
  });

  return query;
};

// Reporte de Producción
export const useReporteProduccion = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteProduccion", params],
    queryFn: () => getReporteProduccion(params),
  });

  return query;
};

// Reporte de productos
export const useReporteProductos = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteProductos", params],
    queryFn: () => getReporteProductos(params),
  });

  return query;
};

// Reporte de Movimientos productos terminados
export const useReporteMovimientosProductos = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteMovimientosProductosTerminados", params],
    queryFn: () => getReporteMovimientosProductos(params),
  });

  return query;
};


// Reporte de Clientes
export const useReporteClientes = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteClientes", params],
    queryFn: () => getReporteClientes(params),
  });

  return query;
};

// Reporte de Proveedores
export const useReporteProveedores = (params = {}) => {
  const query = useQuery({
    queryKey: ["reporteProveedores", params],
    queryFn: () => getReporteProveedores(params),
  });

  return query;
};
