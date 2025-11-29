'use client';

import { useState } from 'react';
import { Button, Select, DatePicker, Input } from 'antd';
import { useMovimientos, useDeleteMovimiento } from '@/hooks/useMovimientos';
import { useMateriales } from '@/hooks/useMateriales';
import MovimientoForm from './MovimientoForm';
import { DataTable } from '@/components/tables/DataTable';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';

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
    origen: undefined,
  });

  const { data: allMovimientos, isLoading } = useMovimientos();
  const { data: materiales } = useMateriales();
  const deleteMovimientoMutation = useDeleteMovimiento();

  // Filtros locales (solo frontend)
  const filteredData = (allMovimientos || []).filter((mov) => {
    if (filters.tipo_movimiento && mov.tipo_movimiento !== filters.tipo_movimiento) return false;
    if (filters.material_id && mov.material_id !== filters.material_id) return false;
    if (filters.fecha_inicio && dayjs(mov.fecha_movimiento).isBefore(filters.fecha_inicio, 'day')) return false;
    if (filters.fecha_fin && dayjs(mov.fecha_movimiento).isAfter(filters.fecha_fin, 'day')) return false;
    if (filters.descripcion && !mov.descripcion?.toLowerCase().includes(filters.descripcion.toLowerCase())) return false;
    if (filters.origen && mov.origen !== filters.origen) return false;
    return true;
  });

  const handleEdit = (row) => {
    // Verificar si es un movimiento que no se puede editar
    if (row.origen === 'automatico') {
      toast.error('No se puede editar un movimiento generado automáticamente');
      return;
    }
    if (row.origen === 'compra') {
      toast.error('No se puede editar un movimiento generado por compra');
      return;
    }
    if (row.origen === 'produccion') {
      toast.error('No se puede editar un movimiento generado por producción');
      return;
    }

    setEditingMovimiento(row);
    setFormVisible(true);
  };

  const handleDelete = (row) => {
    // Verificar si es un movimiento que no se puede eliminar
    if (row.origen === 'automatico') {
      toast.error('No se puede eliminar un movimiento generado automáticamente');
      return;
    }
    if (row.origen === 'compra') {
      toast.error('No se puede eliminar un movimiento generado por compra');
      return;
    }
    if (row.origen === 'produccion') {
      toast.error('No se puede eliminar un movimiento generado por producción');
      return;
    }

    ConfirmationModal.confirm({
      title: 'Eliminar Movimiento',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-medium text-blue-800">Detalles del movimiento:</p>
            <p className="text-sm text-blue-700">
              <strong>ID:</strong> #{row.id}<br />
              <strong>Tipo:</strong> {row.tipo_movimiento}<br />
              <strong>Cantidad:</strong> {row.cantidad} unidades<br />
              <strong>Origen:</strong> {row.origen || 'Manual'}
            </p>
          </div>
          <p className="text-gray-700">
            ¿Está seguro que desea eliminar este movimiento?
          </p>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">⚠️ Importante:</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• El stock se revertirá automáticamente</li>
              <li>• Esta acción no se puede deshacer</li>
              <li>• Solo se pueden eliminar movimientos manuales</li>
            </ul>
          </div>
        </div>
      ),
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMovimientoMutation.mutateAsync(row.id);
          toast.success('✅ Movimiento eliminado correctamente');
        } catch (e) {
          if (e.response?.status === 400) {
            const errorMessage = e.response.data.error;
            if (errorMessage.includes('No se puede eliminar')) {
              toast.error('No se puede eliminar este movimiento');
            } else {
              toast.error(errorMessage || 'Error al eliminar movimiento');
            }
          } else {
            toast.error(e.message || 'Error al eliminar');
          }
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
      key: 'origen',
      header: 'Origen',
      render: (row) => {
        const getOrigenConfig = (origen) => {
          switch (origen) {
            case 'automatico':
              return { color: 'blue', label: 'Automático' };
            case 'manual':
              return { color: 'purple', label: 'Manual' };
            case 'compra':
              return { color: 'green', label: 'Compra' };
            case 'produccion':
              return { color: 'orange', label: 'Producción' };
            default:
              return { color: 'default', label: origen || 'Manual' };
          }
        };
        
        const config = getOrigenConfig(row.origen);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color === 'blue' ? 'bg-blue-100 text-blue-800' :
            config.color === 'purple' ? 'bg-purple-100 text-purple-800' :
            config.color === 'green' ? 'bg-green-100 text-green-800' :
            config.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'}`}>
            {config.label}
          </span>
        );
      }
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (row) => {
    const puedeEditar = !row.origen || row.origen === 'manual';
    const puedeEliminar = !row.origen || row.origen === 'manual';

    return (
      <div className="flex flex-wrap gap-2">
        {puedeEditar && (
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(row)}>
            Editar
          </Button>
        )}

        {puedeEliminar && (
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(row)}
            loading={deleteMovimientoMutation.isLoading}
          >
            Eliminar
          </Button>
        )}

        {row.origen === 'automatico' && (
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Solo lectura
          </span>
        )}

        {row.origen === 'compra' && (
          <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">
            Generado por compra
          </span>
        )}

        {row.origen === 'produccion' && (
          <span className="text-xs text-orange-600 px-2 py-1 bg-orange-100 rounded">
            Generado por producción
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Movimientos de Insumos</h1>
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
        <Select
          allowClear
          placeholder="Origen"
          style={{ width: 120 }}
          onChange={v => setFilters(f => ({ ...f, origen: v }))}
          value={filters.origen}
        >
          <Option value="manual">Manual</Option>
          <Option value="automatico">Automático</Option>
          <Option value="compra">Compra</Option>
          <Option value="produccion">Producción</Option>
        </Select>
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
        actions={renderActions}
        pageSize={10}
      />

      <MovimientoForm
        open={formVisible}
        onClose={handleFormClose}
        editingMovimiento={editingMovimiento}
      />
    </div>
  );
}
