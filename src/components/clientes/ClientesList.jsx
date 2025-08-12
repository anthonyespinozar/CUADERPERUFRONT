'use client';

import { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { createCliente, updateCliente, toggleClienteEstado, deleteCliente } from '@/services/clientesService';
import { Button, Modal, Form, Input, Switch, Tag, Select } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { toast } from 'sonner';

const { Option } = Select;

const ClienteForm = ({ form, initialValues, onFinish }) => (
  <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
    <Form.Item name="nombre" label="Nombre de la empresa" rules={[{ required: true, message: 'Ingrese el nombre de la empresa' }]}><Input /></Form.Item>
    <Form.Item name="contacto" label="Contacto nombre" rules={[{ required: true, message: 'Ingrese el contacto' }]}><Input /></Form.Item>
    <Form.Item name="telefono" label="Teléfono de contacto" rules={[{ required: true, message: 'Ingrese el teléfono de contacto' }]}><Input /></Form.Item>
    <Form.Item name="email" label="Email de contacto"><Input type="email" /></Form.Item>
    <Form.Item name="direccion" label="Dirección de la empresa" rules={[{ required: true, message: 'Ingrese la dirección de la empresa' }]}><Input /></Form.Item>
  </Form>
);

export default function ClientesList() {
  const [form] = Form.useForm();
  const { data: allClientes, isLoading, refetch } = useClientes();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [filters, setFilters] = useState({ estado: undefined, search: '' });

  // Filtros frontend
  const filteredData = (allClientes || []).filter((cli) => {
    if (filters.estado !== undefined && cli.estado !== filters.estado) return false;
    if (!filters.search) return true;
    const s = filters.search.toLowerCase();
    return (
      cli.nombre?.toLowerCase().includes(s) ||
      cli.contacto?.toLowerCase().includes(s) ||
      cli.email?.toLowerCase().includes(s)
    );
  });

  // Chips de filtros activos
  const activeChips = [];
  if (filters.estado !== undefined) activeChips.push({ key: 'estado', label: 'Estado', value: filters.estado ? 'Activo' : 'Inactivo' });
  if (filters.search) activeChips.push({ key: 'search', label: 'Búsqueda', value: filters.search });

  const handleCreate = () => {
    setEditingCliente(null);
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

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    form.setFieldsValue(cliente);
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.id, values);
        toast.success('Cliente actualizado exitosamente');
      } else {
        await createCliente(values);
        toast.success('Cliente creado exitosamente');
      }
      setModalVisible(false);
      setEditingCliente(null);
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

  const handleToggleEstado = async (id, checked) => {
    try {
      await toggleClienteEstado(id, checked);
      toast.success(`Cliente ${checked ? 'activado' : 'desactivado'} exitosamente`);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar el estado');
    }
  };

  const handleDelete = (cliente) => {
    Modal.confirm({
      title: 'Eliminar Cliente',
      icon: <ExclamationCircleOutlined className="text-warning" />,
      content: (
        <div>
          ¿Está seguro que desea eliminar el cliente <b>{cliente.nombre}</b>?<br />
          <span className="text-sm text-gray-500">
            Solo se puede eliminar si está desactivado y no tiene órdenes de producción asociadas.
          </span>
        </div>
      ),
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await deleteCliente(cliente.id);
          toast.success('Cliente eliminado correctamente');
          refetch();
        } catch (error) {
          toast.error(error?.response?.data?.error || error.message || 'Error al eliminar el cliente');
        }
      }
    });
  };

  const columns = [
    { key: 'nombre', header: 'Nombre de la empresa' },
    { key: 'contacto', header: 'Contacto nombre' },
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
    },
    {
      key: 'creado_en',
      header: 'Fecha de Registro',
      render: (row) => new Date(row.creado_en).toLocaleDateString('es-ES')
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
        <h1 className="text-2xl font-semibold">Gestión de Clientes</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>Nuevo Cliente</Button>
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
          placeholder="Buscar por nombre, contacto o email"
          style={{ width: 300 }}
          allowClear
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          onSearch={v => setFilters(f => ({ ...f, search: v || '' }))}
        />
        <Button
          onClick={() => setFilters({ estado: undefined, search: '' })}
          disabled={activeChips.length === 0}
        >
          Limpiar filtros
        </Button>
        {activeChips.map(chip => (
          <Tag
            key={chip.key}
            closable
            onClose={() => setFilters(f => ({ ...f, [chip.key]: chip.key === 'estado' ? undefined : '' }))}
            color="blue"
            style={{ marginLeft: 4 }}
          >
            {chip.label}: {chip.value}
          </Tag>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />
      <Modal
        title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          setEditingCliente(null);
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
        <ClienteForm form={form} initialValues={editingCliente} onFinish={handleModalOk} />
      </Modal>
    </div>
  );
}
