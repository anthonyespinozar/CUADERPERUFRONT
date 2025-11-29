'use client';

import { useState, useCallback, useMemo } from 'react';
import { useMovimientosProductos, useCreateMovimientoProducto, useUpdateMovimientoProducto, useDeleteMovimientoProducto } from '@/hooks/useMovimientosProductosService';
import { useProductos } from '@/hooks/useProductos';
import { Button, Modal, Form, Input, Select, InputNumber, DatePicker, Tag, Space, Card, Row, Col, Statistic } from 'antd';
import { DataTable } from '@/components/tables/DataTable';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CogIcon,
  HandRaisedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const { Option } = Select;

export default function MovimientosProductosList() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [filtros, setFiltros] = useState({});
  
  const { data: movimientos, isLoading } = useMovimientosProductos(filtros);
  const { data: productos } = useProductos();
  
  const createMutation = useCreateMovimientoProducto();
  const updateMutation = useUpdateMovimientoProducto();
  const deleteMutation = useDeleteMovimientoProducto();

  // Estadísticas reactivas
  const estadisticas = useMemo(() => {
    const movimientosDelMes = movimientos?.filter(m => {
      const fecha = new Date(m.fecha);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    }) || [];
    
    const entradas = movimientosDelMes.filter(m => m.tipo === 'entrada');
    const salidas = movimientosDelMes.filter(m => m.tipo === 'salida');
    
    const cantidadEntradas = entradas.reduce((total, m) => total + (m.cantidad || 0), 0);
    const cantidadSalidas = salidas.reduce((total, m) => total + (m.cantidad || 0), 0);
    
    const automaticos = movimientosDelMes.filter(m => m.origen === 'automatico').length;
    const manuales = movimientosDelMes.filter(m => m.origen === 'manual').length;
    
    return {
      totalMovimientos: movimientos?.length || 0,
      movimientosDelMes: movimientosDelMes.length,
      cantidadEntradas,
      cantidadSalidas,
      automaticos,
      manuales
    };
  }, [movimientos]);

  // Filtros locales
  const filteredData = useCallback(() => {
    if (!movimientos) return [];
    
    return movimientos.filter(movimiento => {
      // Filtro por producto (usando el nombre del producto que viene en la data)
      if (filtros.producto_id) {
        const producto = productos?.find(p => p.id === filtros.producto_id);
        if (producto && movimiento.producto !== producto.nombre) {
          return false;
        }
      }
      
      // Filtro por tipo
      if (filtros.tipo && movimiento.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro por origen
      if (filtros.origen && movimiento.origen !== filtros.origen) {
        return false;
      }
      
      // Filtro por fecha desde
      if (filtros.desde) {
        const fechaMovimiento = new Date(movimiento.fecha);
        const fechaDesde = new Date(filtros.desde);
        if (fechaMovimiento < fechaDesde) {
          return false;
        }
      }
      
      // Filtro por fecha hasta
      if (filtros.hasta) {
        const fechaMovimiento = new Date(movimiento.fecha);
        const fechaHasta = new Date(filtros.hasta);
        if (fechaMovimiento > fechaHasta) {
          return false;
        }
      }
      
      return true;
    });
  }, [movimientos, filtros, productos]);

  // Chips activos para mostrar filtros aplicados
  const activeChips = useMemo(() => {
    const chips = [];
    
    if (filtros.producto_id) {
      const producto = productos?.find(p => p.id === filtros.producto_id);
      chips.push({
        key: 'producto_id',
        label: 'Producto',
        value: producto?.nombre || `ID: ${filtros.producto_id}`
      });
    }
    
    if (filtros.tipo) {
      chips.push({
        key: 'tipo',
        label: 'Tipo',
        value: filtros.tipo === 'entrada' ? 'Entrada' : 'Salida'
      });
    }
    
    if (filtros.origen) {
      const origenLabels = {
        'automatico': 'Automático',
        'manual': 'Manual',
        'Producción': 'Producción'
      };
      chips.push({
        key: 'origen',
        label: 'Origen',
        value: origenLabels[filtros.origen] || filtros.origen
      });
    }
    
    if (filtros.desde) {
      chips.push({
        key: 'desde',
        label: 'Desde',
        value: new Date(filtros.desde).toLocaleDateString('es-PE')
      });
    }
    
    if (filtros.hasta) {
      chips.push({
        key: 'hasta',
        label: 'Hasta',
        value: new Date(filtros.hasta).toLocaleDateString('es-PE')
      });
    }
    
    return chips;
  }, [filtros, productos]);

  const handleCreate = () => {
    setEditingMovimiento(null);
    setModalVisible(true);
    // Inicializar el formulario después de que el modal se abra
    setTimeout(() => {
      form.resetFields();
      form.setFieldsValue({
        tipo: 'entrada'
      });
    }, 100);
  };

  const handleEdit = (movimiento) => {
    // Verificar si es un movimiento que no se puede editar
    if (movimiento.origen === 'automatico') {
      toast.error('No se puede editar un movimiento generado automáticamente');
      return;
    }
    if (movimiento.origen === 'Producción') {
      toast.error('No se puede editar un movimiento generado por producción');
      return;
    }

    setEditingMovimiento(movimiento);
    setModalVisible(true);
    // Inicializar el formulario después de que el modal se abra
    setTimeout(() => {
      form.setFieldsValue({
        producto_id: movimiento.producto_id,
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad,
        motivo: movimiento.motivo
      });
    }, 100);
  };

  const handleDelete = (movimiento) => {
    // Verificar si es un movimiento que no se puede eliminar
    if (movimiento.origen === 'automatico') {
      toast.error('No se puede eliminar un movimiento generado automáticamente');
      return;
    }
    if (movimiento.origen === 'Producción') {
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
              <strong>Producto:</strong> {movimiento.producto}<br/>
              <strong>Tipo:</strong> {movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}<br/>
              <strong>Cantidad:</strong> {movimiento.cantidad} unidades<br/>
              <strong>Stock resultante:</strong> {movimiento.stock_resultante} unidades
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
              <li>• El movimiento se marcará como inactivo</li>
            </ul>
          </div>
        </div>
      ),
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      async onOk() {
        try {
          await deleteMutation.mutateAsync(movimiento.id);
          toast.success('✅ Movimiento eliminado correctamente y stock revertido');
        } catch (error) {
          if (error.response?.status === 400) {
            const errorMessage = error.response.data.error;
            if (errorMessage.includes('Solo se pueden eliminar movimientos registrados manualmente')) {
              toast.error('Solo se pueden eliminar movimientos registrados manualmente');
            } else if (errorMessage.includes('Cantidad inválida')) {
              toast.error('Cantidad inválida en el movimiento');
            } else {
              toast.error(errorMessage || 'No se puede eliminar este movimiento');
            }
          } else if (error.response?.status === 404) {
            toast.error('Movimiento no encontrado o ya eliminado');
          } else {
            toast.error(error.message || 'Error al eliminar movimiento');
          }
        }
      }
    });
  };

  const handleModalOk = async (values) => {
    try {
      if (editingMovimiento) {
        // Editar movimiento - solo cantidad y motivo según el controlador
        const updateData = {
          cantidad: Number(values.cantidad),
          motivo: values.motivo
        };

        await updateMutation.mutateAsync({
          id: editingMovimiento.id,
          movimientoData: updateData
        });
        toast.success('✅ Movimiento actualizado correctamente');
      } else {
        // Crear movimiento
        const movimientoData = {
          producto_id: values.producto_id,
          tipo: values.tipo,
          cantidad: Number(values.cantidad),
          motivo: values.motivo
        };

        await createMutation.mutateAsync(movimientoData);
        toast.success('Movimiento creado exitosamente');
      }
      handleModalCancel();
    } catch (error) {
      // Manejo específico de errores del controlador
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('Stock insuficiente')) {
          toast.error('Stock insuficiente para realizar esta operación');
        } else if (errorMessage.includes('Datos inválidos')) {
          toast.error('Por favor verifique los datos ingresados');
        } else if (errorMessage.includes('Cantidad inválida')) {
          toast.error('La cantidad debe ser mayor a 0');
        } else if (errorMessage.includes('Solo se pueden editar movimientos registrados manualmente')) {
          toast.error('Solo se pueden editar movimientos registrados manualmente');
        } else if (errorMessage.includes('Stock insuficiente para actualizar el movimiento')) {
          toast.error('Stock insuficiente para actualizar este movimiento');
        } else {
          toast.error(errorMessage || 'Error en los datos enviados');
        }
      } else if (error.response?.status === 404) {
        toast.error('Producto no encontrado');
      } else if (error.response?.status === 500) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('Error al obtener stock actual')) {
          toast.error('Error al obtener el stock actual del producto');
        } else {
          toast.error('Error interno del servidor');
        }
      } else {
        toast.error(error.message || 'Error al procesar movimiento');
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingMovimiento(null);
    // Resetear el formulario después de que el modal se cierre
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (row) => row.fecha ? new Date(row.fecha).toLocaleString('es-PE') : '-'
    },
    {
      key: 'producto',
      header: 'Producto',
      render: (row) => row.producto || '-'
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (row) => (
        <Tag color={row.tipo === 'entrada' ? 'green' : 'red'} icon={row.tipo === 'entrada' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
          {row.tipo === 'entrada' ? 'Entrada' : 'Salida'}
        </Tag>
      )
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      render: (row) => (
        <div>
          <span className="font-medium">{row.cantidad}</span>
          <span className="text-sm text-gray-500 ml-1">unidades</span>
        </div>
      )
    },
    {
      key: 'stock_resultante',
      header: 'Stock Resultante',
      render: (row) => (
        <div className="text-center">
          <span className="font-semibold text-lg">{row.stock_resultante ?? '-'}</span>
          <div className="text-xs text-gray-500">unidades</div>
        </div>
      )
    },
    {
      key: 'motivo',
      header: 'Motivo',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.motivo || 'Sin motivo'}>
          {row.motivo || '-'}
        </div>
      )
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
            case 'Producción':
              return { color: 'green', label: 'Producción' };
            default:
              return { color: 'default', label: origen || 'Desconocido' };
          }
        };
        
        const config = getOrigenConfig(row.origen);
        return (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        );
      }
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (row) => {
    const puedeEditar = row.origen === 'manual';
    const puedeEliminar = row.origen === 'manual';

    return (
      <div className="flex flex-wrap gap-2">
        {puedeEditar && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(row)}
          >
            Editar
          </Button>
        )}

        {puedeEliminar && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(row)}
          >
            Eliminar
          </Button>
        )}

        {row.origen === 'automatico' && (
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Solo lectura
          </span>
        )}

        {row.origen === 'Producción' && (
          <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">
            Generado por producción
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Movimientos de Productos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nuevo Movimiento
        </Button>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Movimientos</h3>
        
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Movimientos */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalMovimientos}</p>
                <p className="text-xs text-gray-500">registros totales</p>
              </div>
              <div className="text-blue-500">
                <ChartBarIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Este Mes */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.movimientosDelMes}</p>
                <p className="text-xs text-gray-500">movimientos recientes</p>
              </div>
              <div className="text-green-500">
                <CalendarIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Entradas */}
          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entradas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.cantidadEntradas}</p>
                <p className="text-xs text-gray-500">unidades ingresadas</p>
              </div>
              <div className="text-emerald-500">
                <ArrowTrendingUpIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Salidas */}
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salidas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.cantidadSalidas}</p>
                <p className="text-xs text-gray-500">unidades retiradas</p>
              </div>
              <div className="text-red-500">
                <ArrowTrendingDownIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Automáticos */}
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automáticos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.automaticos}</p>
                <p className="text-xs text-gray-500">generados por sistema</p>
              </div>
              <div className="text-indigo-500">
                <CogIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Manuales */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manuales</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.manuales}</p>
                <p className="text-xs text-gray-500">creados manualmente</p>
              </div>
              <div className="text-purple-500">
                <HandRaisedIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {estadisticas.movimientosDelMes === 0 && (
          <div className="mt-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    No hay movimientos este mes
                  </p>
                  <p className="text-xs text-yellow-700">
                    Considera registrar movimientos de inventario
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {estadisticas.automaticos > estadisticas.manuales && (
          <div className="mt-2">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Sistema automatizado activo
                  </p>
                  <p className="text-xs text-blue-700">
                    La mayoría de movimientos son generados automáticamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm flex-wrap gap-2">
        <div className="flex gap-2">
          <Select
            placeholder="Producto"
            style={{ width: 200 }}
            allowClear
            value={filtros.producto_id}
            onChange={(value) => setFiltros(f => ({ ...f, producto_id: value }))}
          >
            {productos?.map(producto => (
              <Option key={producto.id} value={producto.id}>
                {producto.nombre}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Tipo"
            style={{ width: 120 }}
            allowClear
            value={filtros.tipo}
            onChange={(value) => setFiltros(f => ({ ...f, tipo: value }))}
          >
            <Option value="entrada">Entrada</Option>
            <Option value="salida">Salida</Option>
          </Select>
          <Select
            placeholder="Origen"
            style={{ width: 120 }}
            allowClear
            value={filtros.origen}
            onChange={(value) => setFiltros(f => ({ ...f, origen: value }))}
          >
            <Option value="manual">Manual</Option>
            <Option value="automatico">Automático</Option>
            <Option value="Producción">Producción</Option>
          </Select>
          <DatePicker
            placeholder="Desde"
            value={filtros.desde ? dayjs(filtros.desde) : null}
            onChange={(date) => setFiltros(f => ({ ...f, desde: date?.toISOString() }))}
          />
          <DatePicker
            placeholder="Hasta"
            value={filtros.hasta ? dayjs(filtros.hasta) : null}
            onChange={(date) => setFiltros(f => ({ ...f, hasta: date?.toISOString() }))}
          />
        </div>
        <Button
          onClick={() => setFiltros({})}
          disabled={activeChips.length === 0}
        >
          Limpiar filtros
        </Button>
        {activeChips.map(chip => (
          <Tag
            key={chip.key}
            closable
            onClose={() => setFiltros(f => ({ ...f, [chip.key]: undefined }))}
            color="blue"
            style={{ marginLeft: 4 }}
          >
            {chip.label}: {chip.value}
          </Tag>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredData()}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />

      {/* Modal para crear/editar movimiento */}
      <Modal
        title={editingMovimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        open={modalVisible}
        onCancel={handleModalCancel}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        destroyOnHidden
        width={600}
      >
        {/* Información adicional para edición */}
        {editingMovimiento && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Editando movimiento:</strong> {editingMovimiento.producto}<br/>
              <strong>Tipo:</strong> {editingMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}<br/>
              <strong>Stock resultante actual:</strong> {editingMovimiento.stock_resultante} unidades
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ Al modificar la cantidad, el stock se recalculará automáticamente
            </p>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          initialValues={{
            tipo: 'entrada'
          }}
        >
          {!editingMovimiento && (
            <>
              <Form.Item
                name="producto_id"
                label="Producto"
                rules={[{ required: true, message: 'Seleccione un producto' }]}
              >
                <Select placeholder="Seleccione un producto">
                  {productos?.map(producto => (
                    <Option key={producto.id} value={producto.id}>
                      {producto.nombre} (Stock: {producto.stock_actual || 0})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="tipo"
                label="Tipo de Movimiento"
                rules={[{ required: true, message: 'Seleccione el tipo' }]}
              >
                <Select>
                  <Option value="entrada">Entrada</Option>
                  <Option value="salida">Salida</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {editingMovimiento && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <div className="p-2 bg-gray-50 border rounded text-sm">
                  {editingMovimiento.producto}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="p-2 bg-gray-50 border rounded text-sm">
                  {editingMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                </div>
              </div>
            </div>
          )}

          <Form.Item
            name="cantidad"
            label="Cantidad"
            rules={[
              { required: true, message: 'Ingrese la cantidad' },
              { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Ej. 10"
            />
          </Form.Item>

          <Form.Item
            name="motivo"
            label="Motivo"
            rules={[{ required: true, message: 'Ingrese un motivo' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Ej. Venta a cliente, Devolución, Ajuste de inventario..."
            />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}

