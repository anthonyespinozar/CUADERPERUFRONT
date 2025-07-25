'use client';

import { useState, useCallback } from 'react';
import { useMateriales } from '@/hooks/useMateriales';
import { Button, Modal, Form, Input, Select, InputNumber, Segmented, Switch, Tag } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { createMateriales, updateMateriales, toggleMaterialStatus, deleteMateriales } from '@/services/materialesService';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import MaterialComprasModal from '@/components/compras/MaterialComprasModal';

const { Option } = Select;

const MaterialForm = ({ form, initialValues, onFinish, onCancel }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="nombre"
        label="Nombre del Material"
        rules={[{ required: true, message: 'Por favor ingrese el nombre del material' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tipo"
        label="Tipo de Material"
        rules={[{ required: true, message: 'Por favor seleccione el tipo de material' }]}
      >
        <Select>
          <Option value="papel">Papel</Option>
          <Option value="cartón">Cartón</Option>
          <Option value="tinta">Tinta</Option>
          <Option value="insumo">Insumo</Option>
          <Option value="otro">Otro</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="descripcion"
        label="Descripción"
        rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="stock_actual"
        label="Stock Actual"
        rules={[{ required: true, message: 'Por favor ingrese el stock actual' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="stock_minimo"
        label="Stock Mínimo"
        rules={[{ required: true, message: 'Por favor ingrese el stock mínimo' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="stock_maximo"
        label="Stock Máximo"
        rules={[{ required: true, message: 'Por favor ingrese el stock máximo' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="unidad_medida"
        label="Unidad de Medida"
        rules={[{ required: true, message: 'Por favor seleccione la unidad de medida' }]}
      >
        <Select>
          <Option value="unidad">Unidad</Option>
          <Option value="resmas">Resmas</Option>
          <Option value="planchas">Planchas</Option>
          <Option value="kg">Kilogramos</Option>
          <Option value="g">Gramos</Option>
          <Option value="l">Litros</Option>
          <Option value="ml">Mililitros</Option>
          <Option value="m">Metros</Option>
          <Option value="cm">Centímetros</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="estado"
        label="Estado"
        rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
        valuePropName="checked"
      >
        <Select>
          <Option value={true}>Activo</Option>
          <Option value={false}>Inactivo</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default function MaterialesList() {
  const [form] = Form.useForm();
  const { data, isLoading, refetch } = useMateriales();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [comprasModalVisible, setComprasModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filters, setFilters] = useState({
    tipo: undefined,
    search: undefined,
  });

  // Filtros locales (solo frontend)
  const filteredData = useCallback(() => {
    let filtered = data || [];
    // Filtro por estado (ya implementado)
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
    // Filtro por tipo
    if (filters.tipo) {
      filtered = filtered.filter(item => item.tipo === filters.tipo);
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
    setEditingMaterial(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    form.setFieldsValue(material);
    setModalVisible(true);
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      await toggleMaterialStatus(id, checked);
      toast.success(`Material ${checked ? 'activado' : 'desactivado'} exitosamente`);
      refetch();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Este material no puede ser desactivado porque está siendo utilizado en otros registros');
      } else {
        toast.error(error.message || 'Error al cambiar el estado del material');
      }
    }
  };

  const handleDelete = (material) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Material',
      content: (
        <div className="space-y-2">
          <p>¿Está seguro que desea eliminar el material "{material.nombre}"?</p>
          <p className="text-yellow-600">
            ⚠️ Esta acción solo es posible si el material no está siendo utilizado en otros registros.
          </p>
          <p className="text-sm text-gray-500">
            Si el material está en uso, se recomienda desactivarlo en lugar de eliminarlo.
          </p>
        </div>
      ),
      async onOk() {
        try {
          await deleteMateriales(material.id);
          toast.success('Material eliminado exitosamente');
          refetch();
        } catch (error) {
          if (error.response?.status === 409) {
            toast.error(
              'No se puede eliminar este material porque está siendo utilizado en otros registros. Por favor, desactívelo en su lugar.',
              { duration: 5000 }
            );
          } else {
            toast.error(error.message || 'Error al eliminar el material');
          }
        }
      }
    });
  };

  const handleModalOk = async (values) => {
    try {
      if (editingMaterial) {
        await updateMateriales(editingMaterial.id, values);
        toast.success('Material actualizado exitosamente');
      } else {
        await createMateriales(values);
        toast.success('Material creado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const handleViewCompras = (material) => {
    setSelectedMaterial(material);
    setComprasModalVisible(true);
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (row) => (
        <div>
          <div className="font-medium">{row.nombre}</div>
          <div className="text-xs text-gray-500">{row.descripcion}</div>
        </div>
      )
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1)}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Control de Stock',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Actual:</span>
            <span className={`${
              row.stock_actual <= row.stock_minimo 
                ? 'text-red-600 font-medium' 
                : row.stock_actual >= row.stock_maximo 
                  ? 'text-orange-600 font-medium'
                  : 'text-green-600'
            }`}>
              {row.stock_actual} {row.unidad_medida}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Mín: {row.stock_minimo}</span>
            <span>|</span>
            <span>Máx: {row.stock_maximo}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                row.stock_actual <= row.stock_minimo 
                  ? 'bg-red-500' 
                  : row.stock_actual >= row.stock_maximo 
                    ? 'bg-orange-500'
                    : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min(100, (row.stock_actual / row.stock_maximo) * 100)}%`
              }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'alertas',
      header: 'Estado de Stock',
      render: (row) => {
        const porcentajeStock = (row.stock_actual / row.stock_maximo) * 100;
        let status = '';
        let color = '';

        if (row.stock_actual <= row.stock_minimo) {
          status = 'Stock Bajo';
          color = 'bg-red-100 text-red-800';
        } else if (row.stock_actual >= row.stock_maximo) {
          status = 'Sobrestock';
          color = 'bg-orange-100 text-orange-800';
        } else if (porcentajeStock <= 30) {
          status = 'Por Agotar';
          color = 'bg-yellow-100 text-yellow-800';
        } else {
          status = 'Normal';
          color = 'bg-green-100 text-green-800';
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <Switch
          checked={row.estado}
          onChange={(checked) => handleToggleStatus(row.id, checked)}
          checkedChildren="Activo"
          unCheckedChildren="Inactivo"
        />
      )
    },
    {
      key: 'creado_en',
      header: 'Registro',
      render: (row) => (
        <div className="text-sm">
          <div>{new Date(row.creado_en).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</div>
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
    <div className="space-x-2">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => handleEdit(row)}
      >
        Editar
      </Button>
      <Button
        icon={<ShoppingCartOutlined />}
        onClick={() => handleViewCompras(row)}
        size="small"
      >
        Compras
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
    tipo: 'Tipo',
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
        <h1 className="text-2xl font-semibold">Gestión de Materiales</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nuevo Material
        </Button>
      </div>

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
          <Select
            allowClear
            placeholder="Tipo"
            style={{ width: 140 }}
            onChange={v => setFilters(f => ({ ...f, tipo: v }))}
            value={filters.tipo}
          >
            <Option value="papel">Papel</Option>
            <Option value="cartón">Cartón</Option>
            <Option value="tinta">Tinta</Option>
            <Option value="insumo">Insumo</Option>
            <Option value="otro">Otro</Option>
          </Select>
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
            setFilters({ tipo: undefined, search: undefined });
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
        title={editingMaterial ? 'Editar Material' : 'Nuevo Material'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <MaterialForm
          form={form}
          initialValues={editingMaterial}
          onFinish={handleModalOk}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      <MaterialComprasModal
        open={comprasModalVisible}
        onClose={() => setComprasModalVisible(false)}
        material={selectedMaterial}
      />
    </div>
  );
} 