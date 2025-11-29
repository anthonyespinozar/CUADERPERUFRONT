'use client';

import { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Input, Select, InputNumber, DatePicker, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useMovimientosProductos, useCreateMovimientoProducto, useUpdateMovimientoProducto, useDeleteMovimientoProducto } from '@/hooks/useMovimientosProductosService';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { Option } = Select;

export default function MovimientosProductosModal({ open, onClose, producto }) {
  const [form] = Form.useForm();
  const [modalMovimiento, setModalMovimiento] = useState(null);
  const [filtros, setFiltros] = useState({});
  
  const { data: movimientos, isLoading } = useMovimientosProductos({
    producto_id: producto?.id,
    ...filtros
  });
  
  const createMutation = useCreateMovimientoProducto();
  const updateMutation = useUpdateMovimientoProducto();
  const deleteMutation = useDeleteMovimientoProducto();

  useEffect(() => {
    if (!open) {
      setModalMovimiento(null);
      setFiltros({});
    }
  }, [open]);

  const handleCreateMovimiento = () => {
    setModalMovimiento({ producto_id: producto.id });
  };

  const handleEditMovimiento = (movimiento) => {
    // Verificar si es un movimiento que no se puede editar
    if (movimiento.origen === 'automatico') {
      toast.error('No se puede editar un movimiento generado automáticamente');
      return;
    }
    if (movimiento.origen === 'Producción') {
      toast.error('No se puede editar un movimiento generado por producción');
      return;
    }

    setModalMovimiento(movimiento);
  };

  const handleDeleteMovimiento = (movimiento) => {
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
              <strong>Producto:</strong> {producto?.nombre}<br/>
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

  const handleSubmitMovimiento = async (values) => {
    try {
      if (modalMovimiento.id) {
        // Editar movimiento - solo cantidad y motivo según el controlador
        const updateData = {
          cantidad: Number(values.cantidad),
          motivo: values.motivo
        };

        await updateMutation.mutateAsync({
          id: modalMovimiento.id,
          movimientoData: updateData
        });
        toast.success('✅ Movimiento actualizado correctamente');
      } else {
        // Crear movimiento
        const movimientoData = {
          producto_id: modalMovimiento.producto_id || producto.id,
          tipo: values.tipo,
          cantidad: Number(values.cantidad),
          motivo: values.motivo
        };

        await createMutation.mutateAsync(movimientoData);
        toast.success('Movimiento creado exitosamente');
      }
      setModalMovimiento(null);
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

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => fecha ? new Date(fecha).toLocaleString('es-PE') : '-'
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo) => (
        <Tag color={tipo === 'entrada' ? 'green' : 'red'} icon={tipo === 'entrada' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
          {tipo === 'entrada' ? 'Entrada' : 'Salida'}
        </Tag>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad) => (
        <div>
          <span className="font-medium">{cantidad}</span>
          <span className="text-sm text-gray-500 ml-1">{producto?.unidad_medida || 'unidades'}</span>
        </div>
      )
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
      render: (motivo) => (
        <div className="max-w-xs truncate" title={motivo}>
          {motivo}
        </div>
      )
    },
    {
      title: 'Origen',
      dataIndex: 'origen',
      key: 'origen',
      render: (origen) => {
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
        
        const config = getOrigenConfig(origen);
        return (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        );
      }
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditMovimiento(record)}
            disabled={record.origen === 'automatico' || record.origen === 'Producción'}
            className="text-blue-600 hover:text-blue-800"
          >
            Editar
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMovimiento(record)}
            disabled={record.origen === 'automatico' || record.origen === 'Producción'}
            className="text-red-600 hover:text-red-800"
          >
            Eliminar
          </Button>
          {(record.origen === 'automatico' || record.origen === 'Producción') && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              {record.origen === 'automatico' ? 'Solo lectura' : 'Generado por producción'}
            </span>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={`Movimientos de ${producto?.nombre || 'Producto'}`}
        open={open}
        onCancel={onClose}
        width={1000}
        footer={null}
      >
        <div className="space-y-4">
          {/* Información del producto */}
          {producto && (
            <div className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600">Stock actual: {producto.stock_actual} {producto.unidad_medida}</p>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateMovimiento}
                >
                  Nuevo Movimiento
                </Button>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="flex gap-2">
            <Select
              placeholder="Tipo"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFiltros(f => ({ ...f, tipo: value }))}
            >
              <Option value="entrada">Entrada</Option>
              <Option value="salida">Salida</Option>
            </Select>
            <Select
              placeholder="Origen"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFiltros(f => ({ ...f, origen: value }))}
            >
              <Option value="manual">Manual</Option>
              <Option value="automatico">Automático</Option>
              <Option value="Producción">Producción</Option>
            </Select>
            <DatePicker
              placeholder="Desde"
              onChange={(date) => setFiltros(f => ({ ...f, desde: date?.toISOString() }))}
            />
            <DatePicker
              placeholder="Hasta"
              onChange={(date) => setFiltros(f => ({ ...f, hasta: date?.toISOString() }))}
            />
          </div>

          {/* Tabla de movimientos */}
          <Table
            columns={columns}
            dataSource={movimientos}
            loading={isLoading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </div>
      </Modal>

      {/* Modal para crear/editar movimiento */}
      <Modal
        title={modalMovimiento?.id ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        open={!!modalMovimiento}
        onCancel={() => setModalMovimiento(null)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        destroyOnHidden
        width={600}
      >
        {/* Información adicional para edición */}
        {modalMovimiento?.id && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Editando movimiento:</strong> {producto?.nombre}<br/>
              <strong>Tipo:</strong> {modalMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}<br/>
              <strong>Stock resultante actual:</strong> {modalMovimiento.stock_resultante} unidades
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ Al modificar la cantidad, el stock se recalculará automáticamente
            </p>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitMovimiento}
          initialValues={{
            tipo: modalMovimiento?.tipo || 'entrada',
            cantidad: modalMovimiento?.cantidad || undefined,
            motivo: modalMovimiento?.motivo || undefined
          }}
          key={modalMovimiento?.id || 'new'} // Forzar re-render cuando cambie el modal
        >
          {!modalMovimiento?.id && (
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
          )}

          {modalMovimiento?.id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
              <div className="p-2 bg-gray-50 border rounded text-sm">
                {modalMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
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
    </>
  );
}

