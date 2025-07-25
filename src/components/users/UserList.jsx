'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Button, Modal, Form, Input, Select, Switch, Checkbox, Tag } from 'antd';
import { EditOutlined, PlusOutlined, LockOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { createUser, updateUser, toggleUserStatus } from '@/services/userService';
import { toast } from 'sonner';

const { Option } = Select;

const UserForm = ({ form, initialValues, onFinish, onCancel }) => {
  const [showPasswordField, setShowPasswordField] = useState(false);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="nombre"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="correo"
        label="Correo"
        rules={[
          { required: true, message: 'Por favor ingrese el correo' },
          { type: 'email', message: 'Por favor ingrese un correo válido' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="rol"
        label="Rol"
        rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
      >
        <Select>
          <Option value="administrador">Administrador</Option>
          <Option value="usuario">Usuario</Option>
        </Select>
      </Form.Item>

      {!initialValues ? (
        // Si es nuevo usuario, mostrar campo de contraseña obligatorio
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}
        >
          <Input.Password />
        </Form.Item>
      ) : (
        // Si es edición, mostrar opción para cambiar contraseña
        <>
          <Form.Item>
            <Checkbox 
              onChange={(e) => setShowPasswordField(e.target.checked)}
              style={{ marginBottom: '8px' }}
            >
              Cambiar contraseña
            </Checkbox>
          </Form.Item>

          {showPasswordField && (
            <Form.Item
              name="password"
              label="Nueva Contraseña"
              rules={[
                { required: true, message: 'Por favor ingrese la nueva contraseña' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nueva contraseña"
              />
            </Form.Item>
          )}
        </>
      )}
    </Form>
  );
};

export default function UserList() {
  const [form] = Form.useForm();
  const { data: allUsers, isLoading, refetch } = useUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState(undefined);

  // Filtros locales (solo frontend)
  const filteredData = (allUsers || []).filter((user) => {
    if (rol && user.rol !== rol) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(s) ||
      user.correo?.toLowerCase().includes(s)
    );
  });

  //console.log('UserList - Data:', data);

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      // Si no se marcó cambiar contraseña, eliminamos el campo password
      if (editingUser && !values.password) {
        delete values.password;
      }

      if (editingUser) {
        await updateUser(editingUser.id, values);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await createUser(values);
        toast.success('Usuario creado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      await toggleUserStatus(id, checked);
      toast.success(`Usuario ${checked ? 'activado' : 'desactivado'} exitosamente`);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar el estado');
    }
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre'
    },
    {
      key: 'correo',
      header: 'Correo'
    },
    {
      key: 'rol',
      header: 'Rol',
      render: (row) => row.rol.charAt(0).toUpperCase() + row.rol.slice(1)
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (row) => (
        <Switch
          checked={row.activo}
          onChange={(checked) => handleToggleStatus(row.id, checked)}
        />
      )
    },
    {
      key: 'creado_en',
      header: 'Fecha de Creación',
      render: (row) => new Date(row.creado_en).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  ];

  const renderActions = (row) => (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={() => handleEdit(row)}
    >
      Editar
    </Button>
  );

  const filterLabels = {
    rol: 'Rol',
    search: 'Búsqueda',
  };
  const activeChips = [];
  if (rol) activeChips.push({ key: 'rol', label: filterLabels.rol, value: rol.charAt(0).toUpperCase() + rol.slice(1) });
  if (search) activeChips.push({ key: 'search', label: filterLabels.search, value: search });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nuevo Usuario
        </Button>
      </div>
      <div className="flex gap-2 mb-2 items-center">
        <Select
          allowClear
          placeholder="Rol"
          style={{ width: 140 }}
          onChange={v => setRol(v)}
          value={rol}
        >
          <Option value="administrador">Administrador</Option>
          <Option value="usuario">Usuario</Option>
        </Select>
        <Input.Search
          placeholder="Buscar por nombre o correo"
          style={{ width: 250 }}
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={v => setSearch(v || '')}
        />
        <Button
          onClick={() => {
            setRol(undefined);
            setSearch('');
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
              if (chip.key === 'rol') setRol(undefined);
              if (chip.key === 'search') setSearch('');
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
        data={filteredData}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />

      <Modal
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => setModalVisible(false)}
      >
        <UserForm
          form={form}
          initialValues={editingUser}
          onFinish={handleModalOk}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
} 