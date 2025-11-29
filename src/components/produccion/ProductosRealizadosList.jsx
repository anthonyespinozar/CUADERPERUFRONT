'use client';

import { useState, useCallback, useMemo } from 'react';
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto, useToggleProductoEstado } from '@/hooks/useProductos';
import { Button, Modal, Form, Input, Select, InputNumber, Segmented, Switch, Tag, Card, Row, Col, Statistic, Alert, Tooltip, Space, Badge } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, HistoryOutlined, InfoCircleOutlined, DollarOutlined, ShoppingCartOutlined, WarningOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { ProductosExecutiveSummary } from '../produccion/ProductosExecutiveSummary';
import MovimientosProductosModal from '@/components/produccion/MovimientosProductosModal';

const { Option } = Select;

const ProductoForm = ({ form, initialValues, onFinish, onCancel, isEditing = false }) => {

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      className="pt-2"
    >
      {/* Cliente y Producto */}
      <Form.Item
        name="nombre"
        label="Nombre del Producto"
        rules={[{ required: true, message: 'Ingrese el nombre del producto' }]}
      >
        <Input placeholder="Ej. Cuaderno Universitario A4" />
      </Form.Item>

      <Form.Item
        name="descripcion"
        label="Descripción"
        rules={[{ required: true, message: 'Ingrese una descripción' }]}
      >
        <Input.TextArea placeholder="Describe brevemente el producto..." rows={4} />
      </Form.Item>

      {/* Stock y Precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="stock_actual"
          label="Stock Actual"
          rules={[{ required: true, message: 'Ingrese el stock actual' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
        </Form.Item>

        <Form.Item
          name="precio_unitario"
          label="Precio Unitario (S/.)"
          rules={[
            { required: true, message: 'Ingrese el precio unitario' },
            { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' }
          ]}
        >
          <InputNumber 
            min={0} 
            step={0.01} 
            style={{ width: '100%' }} 
            placeholder="0.00"
            precision={2}
          />
        </Form.Item>
      </div>

      {/* Unidad y Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="unidad_medida"
          label="Unidad de Medida"
          rules={[{ required: true, message: 'Seleccione la unidad de medida' }]}
        >
          <Select placeholder="Seleccione unidad">
            <Option value="unidad">Unidad</Option>
            <Option value="docena">Docena</Option>
            <Option value="centena">Centena</Option>
            <Option value="millar">Millar</Option>
            <Option value="kg">Kilogramos</Option>
            <Option value="g">Gramos</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="estado"
          label="Estado del Producto"
          rules={[{ required: true, message: 'Seleccione el estado' }]}
        >
          <Select placeholder="Seleccionar estado">
            <Option value={true}>Activo</Option>
            <Option value={false}>Inactivo</Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default function ProductosRealizadosList() {
  const [form] = Form.useForm();
  const { data, isLoading, refetch } = useProductos();
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const deleteMutation = useDeleteProducto();
  const toggleMutation = useToggleProductoEstado();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [movimientosModalVisible, setMovimientosModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [filters, setFilters] = useState({
    search: undefined,
  });

  // Filtros locales (solo frontend)
  const filteredData = useCallback(() => {
    let filtered = data || [];
    // Filtro por estado
    switch (filterStatus) {
      case 'ACTIVOS':
        filtered = filtered.filter(item => item.estado === true);
        break;
      case 'INACTIVOS':
        filtered = filtered.filter(item => item.estado === false);
        break;
      default:
        break;
    }
    // Filtro por nombre o descripción
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(searchLower) ||
        item.descripcion?.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [data, filterStatus, filters]);

  const handleCreate = () => {
    setEditingProducto(null);
    form.resetFields();
    form.setFieldsValue({
      nombre: undefined,
      descripcion: undefined,
      stock_actual: undefined,
      stock_minimo: undefined,
        precio_unitario: undefined,
        unidad_medida: undefined,
        estado: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    form.setFieldsValue({
      ...producto,
      precio_unitario: Number(producto.precio_unitario) || 0,
      stock_actual: Number(producto.stock_actual) || 0
    });
    setModalVisible(true);
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      await toggleMutation.mutateAsync({
        id,
        estado: checked
      });
      toast.success(`Producto ${checked ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Este producto no puede ser desactivado porque está siendo utilizado en otros registros');
      } else {
        toast.error(error.message || 'Error al cambiar el estado del producto');
      }
    }
  };

  const handleDelete = (producto) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Producto',
      content: (
        <div className="space-y-2">
          <p>¿Está seguro que desea eliminar el producto "{producto.nombre}"?</p>
          <p className="text-yellow-600">
            ⚠️ Esta acción solo es posible si el producto no está siendo utilizado en otros registros.
          </p>
          <p className="text-sm text-gray-500">
            Si el producto está en uso, se recomienda desactivarlo en lugar de eliminarlo.
          </p>
        </div>
      ),
      async onOk() {
        try {
          await deleteMutation.mutateAsync(producto.id);
          toast.success('Producto eliminado exitosamente');
        } catch (error) {
          if (error.response?.status === 409) {
            toast.error(
              'No se puede eliminar este producto porque está siendo utilizado en otros registros. Por favor, desactívelo en su lugar.',
              { duration: 5000 }
            );
          } else {
            toast.error(error.message || 'Error al eliminar el producto');
          }
        }
      }
    });
  };

  const handleModalOk = async (values) => {
    try {
      // Asegurar que los valores numéricos no sean nulos y sean números válidos
      const productoData = {
        ...values,
        precio_unitario: Number(values.precio_unitario) || 0,
        stock_actual: Number(values.stock_actual) || 0
      };
      
      if (editingProducto) {
        await updateMutation.mutateAsync({
          id: editingProducto.id,
          productoData: productoData
        });
        toast.success('Producto actualizado exitosamente');
      } else {
        await createMutation.mutateAsync(productoData);
        toast.success('Producto creado exitosamente');
      }
      setModalVisible(false);
      setEditingProducto(null);
      form.resetFields();
      form.setFieldsValue({
        nombre: undefined,
        descripcion: undefined,
        stock_actual: undefined,
        precio_unitario: undefined,
        unidad_medida: undefined,
        estado: true,
      });
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const handleViewMovimientos = (producto) => {
    setSelectedProducto(producto);
    setMovimientosModalVisible(true);
  };

  const columns = [
    {
      key: 'producto_id',
      header: 'ID',
      render: (row) => (
        <Badge count={row.id} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      key: 'nombre',
      header: 'Producto',
      render: (row) => (
        <div>
          <div className="font-medium">{row.nombre}</div>
          <div className="text-xs text-gray-500">{row.descripcion}</div>
        </div>
      )
    },
    {
      key: 'precio',
      header: 'Precio',
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-lg">
            S/ {row.precio_unitario ? Number(row.precio_unitario).toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-gray-500">
            por {row.unidad_medida}
          </div>
        </div>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row) => row.stock_actual ?? '-'
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <div className="text-center">
          <Switch
            checked={row.estado}
            onChange={(checked) => handleToggleStatus(row.id, checked)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </div>
      )
    },
    {
      key: 'valor',
      header: 'Valor Total',
      render: (row) => {
        const valorTotal = (row.stock_actual || 0) * (row.precio_unitario || 0);
        return (
          <div className="text-right">
            <div className="font-semibold text-lg">
              S/ {valorTotal.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              en inventario
            </div>
          </div>
        );
      }
    },
    {
      key: 'creado_en',
      header: 'Registro',
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium">
            {new Date(row.creado_en).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(row.creado_en).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    }
  ];

  const renderActions = (row) => (
    <div className="flex flex-wrap gap-2">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => handleEdit(row)}
      >
        Editar
      </Button>

      <Button
        icon={<HistoryOutlined />}
        onClick={() => handleViewMovimientos(row)}
      >
        Movimientos
      </Button>

      {!row.estado && (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(row)}
        >
          Eliminar
        </Button>
      )}
    </div>
  );

  // Chips de filtros activos
  const filterLabels = {
    search: 'Búsqueda',
  };
  const activeChips = Object.entries(filters)
    .filter(([k, v]) => v)
    .map(([k, v]) => {
      let label = filterLabels[k];
      let value = v;
      return { key: k, label, value };
    });
  if (filterStatus !== 'TODOS') {
    activeChips.unshift({ key: 'estado', label: 'Estado', value: filterStatus });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Productos Terminados</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Resumen Ejecutivo */}
      <ProductosExecutiveSummary />


      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm flex-wrap gap-2">
        <Segmented
          options={[
            { label: 'Todos', value: 'TODOS' },
            { label: 'Activos', value: 'ACTIVOS' },
            { label: 'Inactivos', value: 'INACTIVOS' }
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          className="min-w-[300px]"
        />
        <div className="flex gap-2">
          <Input.Search
            placeholder="Buscar nombre o descripción"
            style={{ width: 200 }}
            onSearch={v => setFilters(f => ({ ...f, search: v || undefined }))}
            allowClear
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value || undefined }))}
          />
        </div>
        <Button
          onClick={() => {
            setFilters({ search: undefined });
            setFilterStatus('TODOS');
          }}
          disabled={activeChips.length === 0}
        >
          Limpiar filtros
        </Button>
        {activeChips.map(chip => (
          <Tag
            key={chip.key}
            closable
            onClose={() => {
              if (chip.key === 'estado') setFilterStatus('TODOS');
              else setFilters(f => ({ ...f, [chip.key]: undefined }));
            }}
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

      <Modal
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          setEditingProducto(null);
          form.resetFields();
          form.setFieldsValue({
            nombre: undefined,
            descripcion: undefined,
            stock_actual: undefined,
            stock_minimo: undefined,
        precio_unitario: undefined,
        unidad_medida: undefined,
        estado: true,
          });
        }}
        width={600}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <ProductoForm
          form={form}
          initialValues={editingProducto}
          onFinish={handleModalOk}
          onCancel={() => setModalVisible(false)}
          isEditing={!!editingProducto}
        />
      </Modal>

      <MovimientosProductosModal
        open={movimientosModalVisible}
        onClose={() => setMovimientosModalVisible(false)}
        producto={selectedProducto}
      />
    </div>
  );
}

