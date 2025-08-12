'use client';

import { useState } from 'react';
import { useProveedores } from '@/hooks/useProveedores';
import { Button, Modal, Form, Input, Tag, Select, Switch } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { createProveedor, updateProveedor, deleteProveedor, toggleProveedorEstado } from '@/services/proveedoresService';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

const { Option } = Select;

const ProveedorForm = ({ form, initialValues, onFinish }) => (
  <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
    <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}><Input /></Form.Item>
    <Form.Item name="contacto" label="Contacto"><Input /></Form.Item>
    <Form.Item name="telefono" label="Teléfono"><Input /></Form.Item>
    <Form.Item name="email" label="Email"><Input type="email" /></Form.Item>
    <Form.Item name="direccion" label="Dirección"><Input /></Form.Item>
  </Form>
);

export default function ProveedoresList() {
  const [form] = Form.useForm();
  const { data: allProveedores, isLoading, refetch } = useProveedores();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [filters, setFilters] = useState({ estado: undefined, search: '' });

  // Filtros locales (solo frontend)
  const filteredData = (allProveedores || []).filter((prov) => {
    if (filters.estado !== undefined && prov.estado !== filters.estado) return false;
    if (!filters.search) return true;
    const s = filters.search.toLowerCase();
    return (
      prov.nombre?.toLowerCase().includes(s) ||
      prov.email?.toLowerCase().includes(s) ||
      prov.contacto?.toLowerCase().includes(s)
    );
  });

  // Chips de filtros activos
  const activeChips = [];
  if (filters.estado !== undefined) activeChips.push({ key: 'estado', label: 'Estado', value: filters.estado ? 'Activo' : 'Inactivo' });
  if (filters.search) activeChips.push({ key: 'search', label: 'Búsqueda', value: filters.search });

  const handleCreate = () => {
    setEditingProveedor(null);
    form.resetFields();
    // Limpiar explícitamente todos los campos
    form.setFieldsValue({
      nombre: undefined,
      contacto: undefined,
      telefono: undefined,
      email: undefined,
      direccion: undefined,
    });
    setModalVisible(true);
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    form.setFieldsValue(proveedor);
    setModalVisible(true);
  };

  const handleToggleEstado = async (id, checked) => {
    try {
      await toggleProveedorEstado(id, checked);
      toast.success(`Proveedor ${checked ? 'activado' : 'desactivado'} exitosamente`);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar el estado');
    }
  };

  const handleDelete = (proveedor) => {
    Modal.confirm({
      title: 'Eliminar Proveedor',
      icon: <ExclamationCircleOutlined className="text-warning" />,
      content: (
        <div>
          ¿Está seguro que desea eliminar el proveedor "{proveedor.nombre}"?
          <br />
          <span className="text-sm text-gray-500">
            Solo se puede eliminar si está desactivado.
          </span>
        </div>
      ),
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await deleteProveedor(proveedor.id);
          toast.success('Proveedor eliminado exitosamente');
          refetch();
        } catch (error) {
          toast.error(error.message || 'Error al eliminar el proveedor');
        }
      }
    });
  };

  const handleModalOk = async (values) => {
    try {
      if (editingProveedor) {
        await updateProveedor(editingProveedor.id, values);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await createProveedor(values);
        toast.success('Proveedor creado exitosamente');
      }
      setModalVisible(false);
      setEditingProveedor(null);
      form.resetFields();
      // Limpiar explícitamente todos los campos después de guardar
      form.setFieldsValue({
        nombre: undefined,
        contacto: undefined,
        telefono: undefined,
        email: undefined,
        direccion: undefined,
      });
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'contacto', header: 'Contacto' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'email', header: 'Email' },
    { key: 'direccion', header: 'Dirección' },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <Switch
          checked={row.estado}
          onChange={(checked) => handleToggleEstado(row.id, checked)}
          checkedChildren="Activo"
          unCheckedChildren="Inactivo"
        />
      )
    }
  ];

  const renderActions = (row) => (
    <div className="flex gap-2">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => handleEdit(row)}
      >
        Editar
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>Nuevo Proveedor</Button>
      </div>
      <div className="flex gap-2 mb-2 items-center">
        <Select
          allowClear
          placeholder="Estado"
          style={{ width: 140 }}
          onChange={v => setFilters(f => ({ ...f, estado: v }))}
          value={filters.estado}
        >
          <Option value={true}>Activo</Option>
          <Option value={false}>Inactivo</Option>
        </Select>
        <Input.Search
          placeholder="Buscar por nombre, email o contacto"
          style={{ width: 300 }}
          allowClear
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          onSearch={v => setFilters(f => ({ ...f, search: v || '' }))}
        />
        <Button
          onClick={() => {
            setFilters({ estado: undefined, search: '' });
            setFilters(f => ({ ...f, search: '' }));
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
              if (chip.key === 'estado') setFilters(f => ({ ...f, estado: undefined }));
              if (chip.key === 'search') {
                setFilters(f => ({ ...f, search: '' }));
              }
            }}
            color="blue"
            style={{ marginLeft: 4 }}
          >
            {chip.label}: {chip.value}
          </Tag>
        ))}
      </div>
      <DataTable columns={columns} data={filteredData} isLoading={isLoading} actions={renderActions} pageSize={10} />
      <Modal
        title={editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          setEditingProveedor(null);
          form.resetFields();
          // Limpiar explícitamente todos los campos al cancelar
          form.setFieldsValue({
            nombre: undefined,
            contacto: undefined,
            telefono: undefined,
            email: undefined,
            direccion: undefined,
          });
        }}
        width={500}
      >
        <ProveedorForm form={form} initialValues={editingProveedor} onFinish={handleModalOk} />
      </Modal>
    </div>
  );
}