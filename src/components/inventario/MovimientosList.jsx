'use client';

import { useState } from 'react';
import { Button, Select, DatePicker, Input } from 'antd';
import { useMovimientos } from '@/hooks/useMovimientos';
import { useMateriales } from '@/hooks/useMateriales';
import MovimientoForm from './MovimientoForm';
import { DataTable } from '@/components/tables/DataTable';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';
import { deleteMovimiento } from '@/services/movimientosService';
import { useQueryClient } from '@tanstack/react-query';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function MovimientosList() {
  const [formVisible, setFormVisible] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [filters, setFilters] = useState({
    tipo_movimiento: undefined,
    material_id: undefined,
    fecha_inicio: undefined,
    fecha_fin: undefined,
    descripcion: undefined,
  });

  const queryClient = useQueryClient();

  const { data: allMovimientos, isLoading } = useMovimientos();
  const { data: materiales } = useMateriales();

  // Filtros locales (solo frontend)
  const filteredData = (allMovimientos || []).filter((mov) => {
    if (filters.tipo_movimiento && mov.tipo_movimiento !== filters.tipo_movimiento) return false;
    if (filters.material_id && mov.material_id !== filters.material_id) return false;
    if (filters.fecha_inicio && dayjs(mov.fecha_movimiento).isBefore(filters.fecha_inicio, 'day')) return false;
    if (filters.fecha_fin && dayjs(mov.fecha_movimiento).isAfter(filters.fecha_fin, 'day')) return false;
    if (filters.descripcion && !mov.descripcion?.toLowerCase().includes(filters.descripcion.toLowerCase())) return false;
    return true;
  });

  const refreshData = () => {
    queryClient.invalidateQueries(['movimientos']);
    queryClient.invalidateQueries(['materiales']);
  };

  const handleEdit = (row) => {
    setEditingMovimiento(row);
    setFormVisible(true);
  };

  const handleDelete = (row) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Movimiento',
      content: <div>¿Seguro que deseas eliminar el movimiento #{row.id}?</div>,
      onOk: async () => {
        try {
          await deleteMovimiento(row.id);
          toast.success('Movimiento eliminado');
          refreshData();
        } catch (e) {
          toast.error(e.message || 'Error al eliminar');
        }
      }
    });
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setEditingMovimiento(null);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => `#${row.id}`,
    },
    {
      key: 'tipo_movimiento',
      header: 'Tipo',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.tipo_movimiento === 'entrada'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'}`}>
          {row.tipo_movimiento.charAt(0).toUpperCase() + row.tipo_movimiento.slice(1)}
        </span>
      )
    },
    {
      key: 'material_id',
      header: 'Material',
      render: (row) => {
        const mat = materiales?.find(m => m.id === row.material_id);
        return mat ? mat.nombre : `ID ${row.material_id}`;
      }
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      render: (row) => row.cantidad
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (row) => row.descripcion
    },
    {
      key: 'fecha_movimiento',
      header: 'Fecha',
      render: (row) => dayjs(row.fecha_movimiento).format('YYYY-MM-DD HH:mm')
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(row)}>
            Editar
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(row)}>
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Movimientos de Inventario</h1>
        <Button type="primary" onClick={() => setFormVisible(true)}>
          Registrar Movimiento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-2">
        <Select
          allowClear
          placeholder="Tipo"
          style={{ width: 120 }}
          onChange={v => setFilters(f => ({ ...f, tipo_movimiento: v }))}
          value={filters.tipo_movimiento}
        >
          <Option value="entrada">Entrada</Option>
          <Option value="salida">Salida</Option>
        </Select>
        <Select
          allowClear
          showSearch
          placeholder="Material"
          style={{ width: 180 }}
          onChange={v => setFilters(f => ({ ...f, material_id: v }))}
          value={filters.material_id}
        >
          {materiales?.map(m => (
            <Option key={m.id} value={m.id}>{m.nombre}</Option>
          ))}
        </Select>
        <RangePicker
          onChange={dates => {
            setFilters(f => ({
              ...f,
              fecha_inicio: dates?.[0]?.startOf('day'),
              fecha_fin: dates?.[1]?.endOf('day'),
            }));
          }}
          value={filters.fecha_inicio && filters.fecha_fin ? [filters.fecha_inicio, filters.fecha_fin] : []}
        />
        <Input.Search
          placeholder="Buscar descripción"
          style={{ width: 200 }}
          onSearch={v => setFilters(f => ({ ...f, descripcion: v || undefined }))}
          allowClear
          value={filters.descripcion}
          onChange={e => setFilters(f => ({ ...f, descripcion: e.target.value || undefined }))}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        pageSize={10}
      />

      <MovimientoForm
        open={formVisible}
        onClose={handleFormClose}
        onSuccess={refreshData}
        editingMovimiento={editingMovimiento}
      />
    </div>
  );
}
