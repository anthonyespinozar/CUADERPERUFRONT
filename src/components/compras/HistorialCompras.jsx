'use client';

import { useState } from 'react';
import { useCompras } from '@/hooks/useCompras';
import { DataTable } from '@/components/tables/DataTable';
import { Tag, Card, Row, Col, Statistic, Select, DatePicker, Input, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HistorialCompras() {
  const { data, isLoading } = useCompras();
  // Filtros locales
  const [filters, setFilters] = useState({
    estado: undefined,
    proveedor_nombre: undefined,
    fecha_inicio: undefined,
    fecha_fin: undefined,
    material: undefined,
  });

  // Extraer proveedores y materiales únicos del historial
  const historial = (data || []).filter(c => ['recibido', 'anulada', 'cancelado'].includes(c.estado));
  const proveedores = Array.from(new Set(historial.map(c => c.proveedor_nombre))).filter(Boolean);
  const materiales = Array.from(new Set(historial.flatMap(c => c.materiales?.map(m => m.material_nombre)))).filter(Boolean);

  // Filtros en frontend
  const filteredData = historial.filter((c) => {
    if (filters.estado && c.estado !== filters.estado) return false;
    if (filters.proveedor_nombre && c.proveedor_nombre !== filters.proveedor_nombre) return false;
    if (filters.fecha_inicio && dayjs(c.fecha_compra).isBefore(filters.fecha_inicio, 'day')) return false;
    if (filters.fecha_fin && dayjs(c.fecha_compra).isAfter(filters.fecha_fin, 'day')) return false;
    if (filters.material && !c.materiales?.some(m => m.material_nombre === filters.material)) return false;
    return true;
  });

  const getEstadoColor = (estado) => {
    const colors = {
      recibido: 'green',
      anulada: 'red',
      cancelado: 'default',
    };
    return colors[estado] || 'default';
  };

  // Chips de filtros activos
  const filterLabels = {
    estado: 'Estado',
    proveedor_nombre: 'Proveedor',
    fecha_inicio: 'Desde',
    fecha_fin: 'Hasta',
    material: 'Material',
  };
  const activeChips = Object.entries(filters)
    .filter(([k, v]) => v)
    .map(([k, v]) => {
      let label = filterLabels[k];
      let value = v;
      if (k === 'fecha_inicio' || k === 'fecha_fin') value = dayjs(v).format('YYYY-MM-DD');
      return { key: k, label, value };
    });

  // Calcular estadísticas del historial filtrado
  const comprasRecibidas = filteredData.filter(c => c.estado === 'recibido').length;
  const comprasAnuladas = filteredData.filter(c => c.estado === 'anulada').length;
  const comprasCanceladas = filteredData.filter(c => c.estado === 'cancelado').length;
  const totalInvertido = filteredData
    .filter(c => c.estado === 'recibido')
    .reduce((sum, compra) => {
      const compraTotal = compra.materiales?.reduce((materialSum, material) => 
        materialSum + (material.cantidad * material.precio_unitario), 0
      ) || 0;
      return sum + compraTotal;
    }, 0);

  const columns = [
    { 
      key: 'compra_id', 
      header: 'ID', 
      render: row => (
        <span className="font-mono text-sm">#{row.compra_id}</span>
      )
    },
    { 
      key: 'proveedor_nombre', 
      header: 'Proveedor',
      render: row => (
        <div>
          <div className="font-medium">{row.proveedor_nombre}</div>
          <div className="text-xs text-gray-500">ID: {row.proveedor_id}</div>
        </div>
      )
    },
    { 
      key: 'fecha_compra', 
      header: 'Fecha de Compra', 
      render: row => (
        <div>
          <div>{new Date(row.fecha_compra).toLocaleDateString('es-ES')}</div>
          <div className="text-xs text-gray-500">
            {new Date(row.fecha_compra).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    { 
      key: 'fecha_estimada_llegada', 
      header: 'Fecha Estimada Llegada', 
      render: row => (
        <div>
          <div>{row.fecha_estimada_llegada ? new Date(row.fecha_estimada_llegada).toLocaleDateString('es-ES') : 'N/A'}</div>
          {row.fecha_estimada_llegada && (
            <div className="text-xs text-gray-500">
              Estimada
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'estado', 
      header: 'Estado Final', 
      render: row => (
        <Tag color={getEstadoColor(row.estado)}>
          {row.estado?.charAt(0).toUpperCase() + row.estado?.slice(1)}
        </Tag>
      )
    },
    { 
      key: 'materiales', 
      header: 'Materiales Adquiridos', 
      render: row => (
        <div className="space-y-1">
          {row.materiales?.map((m) => (
            <div key={m.material_id} className="text-sm border-l-2 border-gray-200 pl-2">
              <span className="font-medium">{m.material_nombre}</span>
              <br />
              <span className="text-gray-600">
                {m.cantidad} {m.unidad_medida} × S/ {m.precio_unitario?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )
    },
    { 
      key: 'total', 
      header: 'Total de Compra', 
      render: row => {
        const total = row.materiales?.reduce((sum, m) => sum + m.cantidad * m.precio_unitario, 0) || 0;
        return (
          <div className="text-right">
            <div className="font-medium text-lg">S/ {total.toFixed(2)}</div>
            <div className="text-xs text-gray-500">
              {row.materiales?.length || 0} material{row.materiales?.length !== 1 ? 'es' : ''}
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      {/* Estadísticas arriba */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Compras Recibidas"
              value={comprasRecibidas}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Compras Anuladas"
              value={comprasAnuladas}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Compras Canceladas"
              value={comprasCanceladas}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Invertido"
              value={totalInvertido}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="S/"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
      {/* Tabla con header (título + filtros) */}
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Historial de Compras</h1>
            <div className="text-sm text-gray-500">
              Total: {filteredData.length} compras finalizadas
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Select
              allowClear
              placeholder="Estado"
              style={{ width: 140 }}
              onChange={v => setFilters(f => ({ ...f, estado: v }))}
              value={filters.estado}
            >
              <Option value="recibido">Recibido</Option>
              <Option value="anulada">Anulada</Option>
              <Option value="cancelado">Cancelado</Option>
            </Select>
            <Select
              allowClear
              showSearch
              placeholder="Proveedor"
              style={{ width: 180 }}
              onChange={v => setFilters(f => ({ ...f, proveedor_nombre: v }))}
              value={filters.proveedor_nombre}
            >
              {proveedores.map(p => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
            <Select
              allowClear
              showSearch
              placeholder="Material"
              style={{ width: 180 }}
              onChange={v => setFilters(f => ({ ...f, material: v }))}
              value={filters.material}
            >
              {materiales.map(m => (
                <Option key={m} value={m}>{m}</Option>
              ))}
            </Select>
            <RangePicker
              onChange={dates => {
                setFilters(f => ({
                  ...f,
                  fecha_inicio: dates?.[0] ? dates[0].startOf('day') : undefined,
                  fecha_fin: dates?.[1] ? dates[1].endOf('day') : undefined,
                }));
              }}
              value={filters.fecha_inicio && filters.fecha_fin ? [filters.fecha_inicio, filters.fecha_fin] : []}
            />
            <Button
              onClick={() => setFilters({
                estado: undefined,
                proveedor_nombre: undefined,
                fecha_inicio: undefined,
                fecha_fin: undefined,
                material: undefined,
              })}
              disabled={activeChips.length === 0}
            >
              Limpiar filtros
            </Button>
            {activeChips.map(chip => (
              <Tag
                key={chip.key}
                closable
                onClose={() => setFilters(f => ({ ...f, [chip.key]: undefined }))}
                color="blue"
                style={{ marginLeft: 4 }}
              >
                {chip.label}: {chip.value}
              </Tag>
            ))}
          </div>
        </div>
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
          pageSize={10}
        />
      </div>
    </div>
  );
}
