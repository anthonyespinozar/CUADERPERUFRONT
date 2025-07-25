'use client';

import { useState } from 'react';
import { useCompras } from '@/hooks/useCompras';
import { useProveedores } from '@/hooks/useProveedores';
import { useMateriales } from '@/hooks/useMateriales';
import { Button, Modal, Form, Input, Select, InputNumber, DatePicker, Divider, Tag } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { createCompra, updateCompraEstado, updateCompra, deleteCompra } from '@/services/comprasService';
import { createProveedor } from '@/services/proveedoresService';
import { createMateriales } from '@/services/materialesService';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProveedorForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="nombre"
        label="Nombre"
        rules={[{ required: true, message: 'Ingrese el nombre' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contacto"
        label="Contacto"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="telefono"
        label="Teléfono"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        name="direccion"
        label="Dirección"
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Crear Proveedor
        </Button>
      </Form.Item>
    </Form>
  );
};

const MaterialForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
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
        <Input.TextArea rows={3} />
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
        initialValue={true}
      >
        <Select>
          <Option value={true}>Activo</Option>
          <Option value={false}>Inactivo</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Crear Material
        </Button>
      </Form.Item>
    </Form>
  );
};

const CompraForm = ({ form, initialValues, onFinish, onCancel, onOpenProveedorModal, onOpenMaterialModal }) => {
  const { data: proveedores, refetch: refetchProveedores } = useProveedores();
  const { data: materiales, refetch: refetchMateriales } = useMateriales();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {initialValues && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>⚠️ Nota:</strong> Al editar esta compra, se reemplazarán todos los materiales y detalles existentes.
            Solo se pueden editar compras con estado "pendiente".
          </p>
        </div>
      )}
      <Form.Item
        name="proveedor_id"
        label="Proveedor"
        rules={[{ required: true, message: 'Por favor seleccione el proveedor' }]}
      >
        <Select
          showSearch
          placeholder="Seleccione un proveedor"
          popupRender={menu => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Button type="link" onClick={onOpenProveedorModal}>
                + Nuevo proveedor
              </Button>
            </>
          )}
        >
          {proveedores?.map(p => (
            <Option key={p.id} value={p.id}>{p.nombre}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.List name="materiales">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="flex gap-2 items-end mb-2">
                <Form.Item
                  {...restField}
                  name={[name, 'material_id']}
                  rules={[{ required: true, message: 'Seleccione material' }]}
                  style={{ flex: 2 }}
                >
                                     <Select
                     showSearch
                     placeholder="Material"
                     popupRender={menu => (
                       <>
                         {menu}
                         <Divider style={{ margin: '8px 0' }} />
                                                 <Button type="link" onClick={onOpenMaterialModal}>
                          + Nuevo material
                        </Button>
                       </>
                     )}
                   >
                    {materiales?.map(m => (
                      <Option key={m.id} value={m.id}>{m.nombre}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'cantidad']}
                  rules={[{ required: true, message: 'Cantidad' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={1} placeholder="Cantidad" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'precio_unitario']}
                  rules={[{ required: true, message: 'Precio' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} step={0.01} placeholder="Precio" style={{ width: '100%' }} />
                </Form.Item>
                <Button danger onClick={() => remove(name)}>
                  Eliminar
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Agregar material
            </Button>
          </>
        )}
      </Form.List>

      <Form.Item
        name="fecha_orden"
        label="Fecha de Orden"
        rules={[{ required: true, message: 'Por favor seleccione la fecha de orden' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="fecha_entrega_esperada"
        label="Fecha de Entrega Esperada"
        rules={[{ required: true, message: 'Por favor seleccione la fecha de entrega esperada' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="observaciones"
        label="Observaciones"
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

const EstadoCompraModal = ({ open, onClose, compra, onEstadoChange }) => {
  const [form] = Form.useForm();

  const handleEstadoChange = async (values) => {
    try {
      await updateCompraEstado(compra.compra_id, values.estado);
      toast.success('Estado de compra actualizado exitosamente');
      onEstadoChange();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el estado');
    }
  };

  return (
    <Modal
      title="Actualizar Estado de Compra"
      open={open}
      onOk={form.submit}
      onCancel={onClose}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleEstadoChange}
        initialValues={{ estado: compra?.estado }}
      >
        <Form.Item
          name="estado"
          label="Nuevo Estado"
          rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
        >
          <Select>
            <Option value="pendiente">Pendiente</Option>
            <Option value="ordenado">Ordenado</Option>
            <Option value="en_transito">En Tránsito</Option>
            <Option value="recibido">Recibido</Option>
            <Option value="anulada">Anulada</Option>
            <Option value="cancelado">Cancelado</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function ComprasList() {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    estado: undefined,
    proveedor_id: undefined,
    fecha_inicio: undefined,
    fecha_fin: undefined,
    material: undefined,
    descripcion: undefined,
  });
  const { data: allCompras, isLoading, refetch } = useCompras();
  const { data: proveedores, refetch: refetchProveedores } = useProveedores();
  const { data: materiales, refetch: refetchMateriales } = useMateriales();
  const [modalVisible, setModalVisible] = useState(false);
  const [estadoModalVisible, setEstadoModalVisible] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [proveedorModalVisible, setProveedorModalVisible] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);

  // Filtros locales (solo frontend)
  const filteredData = (allCompras || []).filter((compra) => {
    if (filters.estado && compra.estado !== filters.estado) return false;
    if (filters.proveedor_id && compra.proveedor_id !== filters.proveedor_id) return false;
    if (filters.fecha_inicio && dayjs(compra.fecha_compra).isBefore(filters.fecha_inicio, 'day')) return false;
    if (filters.fecha_fin && dayjs(compra.fecha_compra).isAfter(filters.fecha_fin, 'day')) return false;
    if (filters.material && !compra.materiales?.some(m => m.material_id === filters.material)) return false;
    if (filters.descripcion && !compra.observaciones?.toLowerCase().includes(filters.descripcion.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    setEditingCompra(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (compra) => {
    // Solo permitir editar compras pendientes
    if (compra.estado !== 'pendiente') {
      toast.error('Solo se pueden editar compras con estado "pendiente".');
      return;
    }
    setEditingCompra(compra);
    // Transformar los datos de la compra al formato del formulario
    const materialesForm = compra.materiales?.map(material => ({
      material_id: material.material_id,
      cantidad: material.cantidad,
      precio_unitario: material.precio_unitario
    })) || [];
    form.setFieldsValue({
      proveedor_id: compra.proveedor_id,
      materiales: materialesForm,
      fecha_orden: compra.fecha_compra ? dayjs(compra.fecha_compra) : null,
      fecha_entrega_esperada: compra.fecha_estimada_llegada ? dayjs(compra.fecha_estimada_llegada) : null,
      observaciones: compra.observaciones,
    });
    setModalVisible(true);
  };

  const handleDelete = (compra) => {
    // Solo permitir eliminar compras pendientes o en tránsito
    if (compra.estado === 'recibido') {
      toast.error('No se puede eliminar una compra que ya fue recibida. Use "Anular" en su lugar.');
      return;
    }

    ConfirmationModal.confirm({
      title: 'Eliminar Compra',
      content: (
        <div className="space-y-2">
          <p>¿Está seguro que desea eliminar la compra #${compra.compra_id}?</p>
          <p className="text-yellow-600 text-sm">
            ⚠️ Esta acción eliminará permanentemente la compra y no se puede deshacer.
          </p>
        </div>
      ),
      async onOk() {
        try {
          await deleteCompra(compra.compra_id);
          toast.success('Compra eliminada exitosamente');
          refetch();
        } catch (error) {
          toast.error(error.message || 'Error al eliminar la compra');
        }
      },
      onCancel() {
        // No action needed on cancel
      }
    });
  };

  const handleEstadoChange = (compra) => {
    // Solo permitir cambiar estado de compras no finalizadas
    if (['anulada', 'cancelado', 'recibido'].includes(compra.estado)) {
      toast.error('No se puede cambiar el estado de una compra finalizada o recibida.');
      return;
    }
    setSelectedCompra(compra);
    setEstadoModalVisible(true);
  };

  const handleOpenProveedorModal = () => {
    setProveedorModalVisible(true);
  };

  const handleOpenMaterialModal = () => {
    setMaterialModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingCompra(null);
    form.resetFields();
  };

  const handleModalOk = async (values) => {
    try {
      if (editingCompra && !editingCompra.compra_id) {
        toast.error('Error: ID de compra inválido');
        return;
      }
      if (editingCompra && editingCompra.estado !== 'pendiente') {
        toast.error('Solo se pueden editar compras con estado "pendiente"');
        return;
      }
      // Transformar los datos al formato que espera el backend
      const compraData = {
        proveedor_id: values.proveedor_id,
        materiales: values.materiales?.map(material => ({
          material_id: material.material_id,
          cantidad: material.cantidad,
          precio_unitario: material.precio_unitario
        })) || [],
        fecha_compra: values.fecha_orden ? values.fecha_orden.toISOString() : null,
        fecha_estimada_llegada: values.fecha_entrega_esperada ? values.fecha_entrega_esperada.toISOString() : null,
        observaciones: values.observaciones,
      };
      if (editingCompra) {
        await updateCompra(editingCompra.compra_id, compraData);
        toast.success('Compra actualizada exitosamente');
      } else {
        await createCompra(compraData);
        toast.success('Compra creada exitosamente');
      }
      setModalVisible(false);
      setEditingCompra(null);
      form.resetFields();
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      ordenado: 'bg-blue-100 text-blue-800',
      en_transito: 'bg-orange-100 text-orange-800',
      recibido: 'bg-green-100 text-green-800',
      anulada: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'compra_id',
      header: 'ID',
      render: (row) => `#${row.compra_id}`
    },
    {
      key: 'proveedor_nombre',
      header: 'Proveedor',
      render: (row) => row.proveedor_nombre || 'N/A'
    },
    {
      key: 'materiales',
      header: 'Materiales',
      render: (row) => (
        <div className="space-y-1">
          {row.materiales?.map((material, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{material.material_nombre}</span>
              <br />
              <span className="text-gray-600">
                {material.cantidad} {material.unidad_medida} - S/ {material.precio_unitario?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'total_materiales',
      header: 'Total Materiales',
      render: (row) => row.materiales?.length || 0
    },
    {
      key: 'total_compra',
      header: 'Total Compra',
      render: (row) => {
        const total = row.materiales?.reduce((sum, material) => 
          sum + (material.cantidad * material.precio_unitario), 0
        ) || 0;
        return `S/ ${total.toFixed(2)}`;
      }
    },
    {
      key: 'observaciones',
      header: 'Observaciones',
      render: (row) => row.observaciones || <span className="text-gray-400 italic">Sin observaciones</span>
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(row.estado)}`}>
          {row.estado?.charAt(0).toUpperCase() + row.estado?.slice(1) || 'N/A'}
        </span>
      )
    },
    {
      key: 'fecha_compra',
      header: 'Fecha de Compra',
      render: (row) => row.fecha_compra ? new Date(row.fecha_compra).toLocaleDateString('es-ES') : 'N/A'
    },
    {
      key: 'fecha_estimada_llegada',
      header: 'Fecha Entrega Esperada',
      render: (row) => row.fecha_estimada_llegada ? new Date(row.fecha_estimada_llegada).toLocaleDateString('es-ES') : 'N/A'
    }
  ];

  const renderActions = (row) => {
    const canEdit = row.estado === 'pendiente';
    const canDelete = ['pendiente', 'ordenado', 'en_transito'].includes(row.estado);
    const canChangeState = !['anulada', 'cancelado', 'recibido'].includes(row.estado);

    return (
      <div className="space-x-2">
        {canEdit && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(row)}
            size="small"
          >
            Editar
          </Button>
        )}
        {canChangeState && (
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleEstadoChange(row)}
            size="small"
          >
            Estado
          </Button>
        )}
        {canDelete && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(row)}
            size="small"
          >
            Eliminar
          </Button>
        )}
        {!canEdit && !canDelete && !canChangeState && (
          <span className="text-gray-500 text-sm">Solo lectura</span>
        )}
      </div>
    );
  };

  // Chips de filtros activos
  const filterLabels = {
    estado: 'Estado',
    proveedor_id: 'Proveedor',
    fecha_inicio: 'Desde',
    fecha_fin: 'Hasta',
    material: 'Material',
    descripcion: 'Observaciones',
  };
  const activeChips = Object.entries(filters)
    .filter(([k, v]) => v)
    .map(([k, v]) => {
      let label = filterLabels[k];
      let value = v;
      if (k === 'fecha_inicio' || k === 'fecha_fin') value = dayjs(v).format('YYYY-MM-DD');
      if (k === 'proveedor_id') {
        const prov = proveedores?.find(p => p.id === v);
        value = prov ? prov.nombre : v;
      }
      if (k === 'material') {
        const mat = materiales?.find(m => m.id === v);
        value = mat ? mat.nombre : v;
      }
      return { key: k, label, value };
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Compras</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nueva Compra
        </Button>
      </div>
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-2 items-center">
        <Select
          allowClear
          placeholder="Estado"
          style={{ width: 140 }}
          onChange={v => setFilters(f => ({ ...f, estado: v }))}
          value={filters.estado}
        >
          <Option value="pendiente">Pendiente</Option>
          <Option value="ordenado">Ordenado</Option>
          <Option value="en_transito">En Tránsito</Option>
          <Option value="recibido">Recibido</Option>
          <Option value="anulada">Anulada</Option>
          <Option value="cancelado">Cancelado</Option>
        </Select>
        <Select
          allowClear
          showSearch
          placeholder="Proveedor"
          style={{ width: 180 }}
          onChange={v => setFilters(f => ({ ...f, proveedor_id: v }))}
          value={filters.proveedor_id}
        >
          {proveedores?.map(p => (
            <Option key={p.id} value={p.id}>{p.nombre}</Option>
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
          {materiales?.map(m => (
            <Option key={m.id} value={m.id}>{m.nombre}</Option>
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
        <Input.Search
          placeholder="Buscar observaciones"
          style={{ width: 200 }}
          onSearch={v => setFilters(f => ({ ...f, descripcion: v || undefined }))}
          allowClear
          value={filters.descripcion}
          onChange={e => setFilters(f => ({ ...f, descripcion: e.target.value || undefined }))}
        />
        <Button
          onClick={() => setFilters({
            estado: undefined,
            proveedor_id: undefined,
            fecha_inicio: undefined,
            fecha_fin: undefined,
            material: undefined,
            descripcion: undefined,
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
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />

      <Modal
        title={editingCompra ? `Editar Compra #${editingCompra.compra_id}` : 'Nueva Compra'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={handleModalCancel}
        width={600}
      >
        <CompraForm
          form={form}
          initialValues={editingCompra}
          onFinish={handleModalOk}
          onCancel={handleModalCancel}
          onOpenProveedorModal={handleOpenProveedorModal}
          onOpenMaterialModal={handleOpenMaterialModal}
        />
      </Modal>

      <EstadoCompraModal
        open={estadoModalVisible}
        onClose={() => setEstadoModalVisible(false)}
        compra={selectedCompra}
        onEstadoChange={refetch}
      />

      {/* Modal para crear proveedor */}
      <Modal
        title="Nuevo Proveedor"
        open={proveedorModalVisible}
        onCancel={() => setProveedorModalVisible(false)}
        footer={null}
         destroyOnHidden
      >
        <ProveedorForm
          onFinish={async (values) => {
            try {
              await createProveedor(values);
              toast.success('Proveedor creado exitosamente');
              refetchProveedores();
              setProveedorModalVisible(false);
            } catch (error) {
              toast.error(error.message || 'Error al crear el proveedor');
            }
          }}
        />
      </Modal>

      {/* Modal para crear material */}
      <Modal
        title="Nuevo Material"
        open={materialModalVisible}
        onCancel={() => setMaterialModalVisible(false)}
        footer={null}
         destroyOnHidden
      >
        <MaterialForm
          onFinish={async (values) => {
            try {
              await createMateriales(values);
              toast.success('Material creado exitosamente');
              refetchMateriales();
              setMaterialModalVisible(false);
            } catch (error) {
              toast.error(error.message || 'Error al crear el material');
            }
          }}
        />
      </Modal>
    </div>
  );
} 