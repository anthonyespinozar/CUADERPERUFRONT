import { useState, useMemo } from "react";
import { useProducciones, useEditarProduccion, useEliminarProduccion } from "@/hooks/useProducciones";
import { useOrdenesProduccion } from "@/hooks/useOrdenesProduccion";
import { Table, Button, Tag, DatePicker, Input, Select, Modal, Form, InputNumber } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { BaseForm } from "@/components/forms/BaseForm";
const { RangePicker } = DatePicker;

export default function ProduccionesRealizadasList() {
  const { data: producciones, isLoading } = useProducciones();
  const { data: ordenesRaw } = useOrdenesProduccion();
  const [form] = Form.useForm();


  // Hooks de mutación
  const editarMutation = useEditarProduccion();
  const eliminarMutation = useEliminarProduccion();

  // Mapea ordenes para lookup rápido
  const ordenes = useMemo(() => {
    return (ordenesRaw || []).map(item => ({ ...item.ordenData, _obj: item }));
  }, [ordenesRaw]);

  // Filtros locales
  const [filtroFecha, setFiltroFecha] = useState([]);
  const [filtroOrden, setFiltroOrden] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalEdit, setModalEdit] = useState(null);

  // Filtrado
  const dataFiltrada = useMemo(() => {
    let lista = producciones || [];
    if (filtroFecha.length === 2) {
      const [start, end] = filtroFecha;
      lista = lista.filter(p => {
        const fecha = new Date(p.fecha_registro);
        return fecha >= start.startOf('day').toDate() && fecha <= end.endOf('day').toDate();
      });
    }
    if (filtroOrden) {
      lista = lista.filter(p => p.orden_id === parseInt(filtroOrden));
    }
    if (filtroProducto) {
      lista = lista.filter(p => {
        const orden = ordenes.find(o => o.id === p.orden_id);
        return orden && orden.tipo_cuaderno === filtroProducto;
      });
    }
    if (busqueda) {
      const b = busqueda.toLowerCase();
      lista = lista.filter(p => {
        const orden = ordenes.find(o => o.id === p.orden_id);
        return (
          (orden?.codigo && orden.codigo.toLowerCase().includes(b)) ||
          (orden?.tipo_cuaderno && orden.tipo_cuaderno.toLowerCase().includes(b))
        );
      });
    }
    return lista;
  }, [producciones, filtroFecha, filtroOrden, filtroProducto, busqueda, ordenes]);

  // Columnas
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha_registro',
      key: 'fecha_registro',
      render: f => f ? new Date(f).toLocaleString('es-PE') : '-'
    },
    {
      title: 'Orden',
      dataIndex: 'orden_id',
      key: 'orden_id',
      render: id => {
        const orden = ordenes.find(o => o.id === id);
        return orden ? `${orden.codigo} (${orden.tipo_cuaderno})` : id;
      }
    },
    {
      title: 'Producto',
      key: 'producto',
      render: (_, row) => {
        const orden = ordenes.find(o => o.id === row.orden_id);
        return orden?.tipo_cuaderno || '-';
      }
    },
    {
      title: 'Cantidad producida',
      dataIndex: 'cantidad_producida',
      key: 'cantidad_producida',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          {/* Botón Ver - neutro */}
          <Button
            icon={<EyeOutlined />}
            type="default"
            onClick={() => setModalEdit({ ...row, view: true })}
          >
            Ver
          </Button>

          {/* Botón Editar - azul (primario) */}
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => setModalEdit(row)}
          >
            Editar
          </Button>

          {/* Botón Eliminar - rojo */}
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() => handleEliminar(row)}
          >
            Eliminar
          </Button>
        </div>

      )
    }
  ];

  // Eliminar
  const handleEliminar = (row) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Producción',
      content: `¿Está seguro que desea eliminar este registro de producción?`,
      async onOk() {
        try {
          await eliminarMutation.mutateAsync(row.id);
          toast.success('Producción eliminada correctamente');
        } catch (error) {
          toast.error(error.message || 'Error al eliminar producción');
        }
      }
    });
  };

  // Editar (modal simple)
  const handleEditSubmit = async (values) => {
    try {
      await editarMutation.mutateAsync({
        produccionId: modalEdit.id,
        produccionData: { cantidad_producida: values.cantidad_producida }
      });
      toast.success('Producción actualizada correctamente');
      setModalEdit(null);
    } catch (error) {
      toast.error(error.message || 'Error al editar producción');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Producciones Realizadas</h1>
      <div className="flex flex-wrap gap-2 items-center justify-between">
      
        <div className="flex gap-2">
          <RangePicker onChange={v => setFiltroFecha(v || [])} />
          <Select
            allowClear
            placeholder="Orden"
            style={{ width: 160 }}
            onChange={v => setFiltroOrden(v)}
            value={filtroOrden}
            options={ordenes.map(o => ({ value: o.id, label: `${o.codigo} (${o.tipo_cuaderno})` }))}
          />
          <Select
            allowClear
            placeholder="Producto"
            style={{ width: 160 }}
            onChange={v => setFiltroProducto(v)}
            value={filtroProducto}
            options={[...new Set(ordenes.map(o => o.tipo_cuaderno))].map(p => ({ value: p, label: p }))}
          />
          <Input.Search
            placeholder="Buscar orden o producto"
            style={{ width: 200 }}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            allowClear
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataFiltrada}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      {/* Modal de edición */}
      <Modal
  open={!!modalEdit && !modalEdit?.view}
  title="Editar Producción"
  onCancel={() => setModalEdit(null)}
  onOk={() => form.submit()}
  confirmLoading={editarMutation.isLoading}
  destroyOnHidden
  width={500}
>
  <div className="mb-4 p-3 bg-gray-50 rounded border text-sm text-gray-600">
    <div><strong>Orden:</strong> {ordenes.find(o => o.id === modalEdit?.orden_id)?.codigo}</div>
    <div><strong>Producto:</strong> {ordenes.find(o => o.id === modalEdit?.orden_id)?.tipo_cuaderno}</div>
    <div><strong>Fecha de registro:</strong> {modalEdit?.fecha_registro ? new Date(modalEdit.fecha_registro).toLocaleString('es-PE') : '-'}</div>
    <div><strong>Cantidad actual:</strong> {modalEdit?.cantidad_producida || 0}</div>
  </div>

  <Form
    form={form}
    layout="vertical"
    initialValues={{
      cantidad_producida: modalEdit?.cantidad_producida
    }}
    onFinish={handleEditSubmit}
  >
    <Form.Item
      name="cantidad_producida"
      label="Nueva cantidad producida"
      rules={[
        { required: true, message: 'La cantidad es obligatoria' },
        { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
      ]}
    >
      <InputNumber
        placeholder="Ej. 50"
        min={1}
        style={{ width: '100%' }}
      />
    </Form.Item>
  </Form>
</Modal>

      {/* Modal de vista */}
      <Modal
  open={!!modalEdit && modalEdit?.view}
  title="Detalle de Producción"
  onCancel={() => setModalEdit(null)}
  footer={null}
  destroyOnHidden
  width={500}
>
  <div className="space-y-3 text-sm text-gray-800">
    <div><strong>Orden:</strong> {ordenes.find(o => o.id === modalEdit?.orden_id)?.codigo}</div>
    <div><strong>Producto:</strong> {ordenes.find(o => o.id === modalEdit?.orden_id)?.tipo_cuaderno}</div>
    <div><strong>Fecha:</strong> {modalEdit?.fecha_registro ? new Date(modalEdit.fecha_registro).toLocaleString('es-PE') : '-'}</div>
    <div><strong>Cantidad producida:</strong> {modalEdit?.cantidad_producida}</div>
  </div>
</Modal>

    </div>
  );
} 