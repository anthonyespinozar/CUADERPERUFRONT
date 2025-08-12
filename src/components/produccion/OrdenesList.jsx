"use client";

import { useState, useCallback } from "react";
import { useOrdenesProduccion } from "@/hooks/useOrdenesProduccion";
import { useRouter } from "next/navigation";
import { Form,  Button, Tag,  Select,Progress, Modal, InputNumber, Input, DatePicker } from "antd";
import { EyeOutlined, PlayCircleOutlined, CheckCircleOutlined, DeleteOutlined, PlusOutlined, EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { OrdenesExecutiveSummary } from './OrdenesExecutiveSummary';
import { toast } from "sonner";
import dayjs from "dayjs";
import { useClientes } from "@/hooks/useClientes";
import OrdenDetalleModal from "@/components/produccion/OrdenDetalleModal";
import OrdenHistorialModal from "@/components/produccion/OrdenHistorialModal";
import { useMateriales } from "@/hooks/useMateriales";
import {
  useFinalizarProduccion,
  useRegistrarProduccion,
  useIniciarProduccion,
  useProducciones
} from "@/hooks/useProducciones";
import { useCreateOrdenProduccion, useDeleteOrdenProduccion, useUpdateOrdenProduccion } from "@/hooks/useOrdenesProduccion";

const estados = [
  { value: "pendiente", label: "Pendiente", color: "gold" },
  { value: "iniciado", label: "En proceso", color: "blue" },
  { value: "finalizado", label: "Finalizada", color: "green" },
];

function EstadoBadge({ estado }) {
  const est = estados.find((e) => e.value === estado);
  return <Tag color={est?.color || "default"}>{est?.label || estado}</Tag>;
}

export default function OrdenesList() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { data, isLoading, refetch } = useOrdenesProduccion();
  const { data: producciones } = useProducciones();
  // Mapea la data para la tabla
  const ordenes = (data || []).map(item => ({ ...item.ordenData, _obj: item }));
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [modalNuevaOrden, setModalNuevaOrden] = useState(false);
  const [modalEditarOrden, setModalEditarOrden] = useState({ open: false, orden: null });
  const [modalHistorial, setModalHistorial] = useState({ open: false, orden: null });
  const [modalRegistrar, setModalRegistrar] = useState({ open: false, orden: null, ordenId: null });
  const [modalDetalle, setModalDetalle] = useState({ open: false, ordenId: null });
  const { data: clientes } = useClientes();
  const { data: materiales } = useMateriales();
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);

  // Hooks de mutación
  const finalizarMutation = useFinalizarProduccion();
  const registrarMutation = useRegistrarProduccion();
  const iniciarMutation = useIniciarProduccion();
  const createOrdenMutation = useCreateOrdenProduccion();
  const updateOrdenMutation = useUpdateOrdenProduccion();
  const deleteOrdenMutation = useDeleteOrdenProduccion();

  // Función para calcular el progreso en tiempo real
  const calcularProgreso = useCallback((ordenId) => {
    if (!producciones || !ordenId) return { total: 0, producido: 0, percent: 0 };

    const produccionesOrden = producciones.filter(p => p.orden_id === ordenId);
    const totalProducido = produccionesOrden.reduce((sum, p) => sum + (p.cantidad_producida || 0), 0);

    const orden = ordenes.find(o => o.id === ordenId);
    const total = orden?.cantidad_producir || 0;
    const percent = total > 0 ? Math.round((totalProducido / total) * 100) : 0;

    return { total, producido: totalProducido, percent };
  }, [producciones, ordenes]);

  // Filtros locales
  const filteredData = useCallback(() => {
    let lista = ordenes || [];
    if (filtroEstado !== "TODOS") {
      lista = lista.filter((o) => o.estado === filtroEstado);
    }
    if (busqueda) {
      const b = busqueda.toLowerCase();
      lista = lista.filter(
        (o) =>
          (o.cliente_nombre && o.cliente_nombre.toLowerCase().includes(b)) ||
          (o.tipo_cuaderno && o.tipo_cuaderno.toLowerCase().includes(b))
      );
    }
    return lista;
  }, [ordenes, filtroEstado, busqueda]);

  // Contadores de estados
  const pendientes = ordenes.filter(o => o.estado === 'pendiente').length;
  const enProceso = ordenes.filter(o => o.estado === 'iniciado').length;
  const finalizadas = ordenes.filter(o => o.estado === 'finalizado').length;

  // Filtros rápidos por estado
  const filtrosRapidos = [
    { label: `Pendientes (${pendientes})`, value: 'pendiente', color: 'gold' },
    { label: `En proceso (${enProceso})`, value: 'iniciado', color: 'blue' },
    { label: `Finalizadas (${finalizadas})`, value: 'finalizado', color: 'green' },
  ];

  // Acciones
  // En la tabla y acciones, usa los campos de ordenData (ya aplanados en el hook)
  // Para el modal de detalle, pasa el objeto original (con materialesSeleccionados)
  const handleVerDetalle = (ordenId) => {
    const ordenPlano = (ordenes || []).find(o => o.id === ordenId);
    setModalDetalle({ open: true, ordenObj: ordenPlano?._obj });
  };
  const handleNuevaOrden = () => setModalNuevaOrden(true);
  const handleEditarOrden = (orden) => {
    // Cargar los materiales existentes de la orden usando la misma estructura que OrdenDetalleModal
    const ordenCompleta = ordenes.find(o => o.id === orden.id)?._obj;
    console.log('Orden completa:', ordenCompleta); // Debug
    console.log('Materiales de la orden:', ordenCompleta?.materialesSeleccionados); // Debug

    const materialesExistentes = ordenCompleta?.materialesSeleccionados?.map(m => ({
      material_id: m.material_id || m.id, // Manejar ambos casos de estructura
      cantidad_necesaria: m.cantidad_necesaria
    })) || [];

    console.log('Materiales existentes procesados:', materialesExistentes); // Debug
    setMaterialesSeleccionados(materialesExistentes);
    setModalEditarOrden({ open: true, orden });
  };
  const handleVerHistorial = (orden) => {
    setModalHistorial({ open: true, orden });
  };
  const handleRegistrarProduccion = (ordenId) => {
    const ordenPlano = (ordenes || []).find(o => o.id === ordenId);
    setModalRegistrar({ open: true, orden: ordenPlano, ordenId });
  };
  const handleFinalizar = (orden) => {
    ConfirmationModal.confirm({
      title: 'Finalizar Orden',
      content: `¿Está seguro que desea finalizar la orden "${orden.codigo}"? Esta acción no se puede deshacer.`,
      async onOk() {
        try {
          await finalizarMutation.mutateAsync(orden.id);
          toast.success('Orden finalizada correctamente');
        } catch (error) {
          toast.error(error.message || 'Error al finalizar la orden');
        }
      }
    });
  };
  // Eliminar (solo si no tiene producciones, lógica pendiente de backend)
  const handleDelete = (orden) => {
    const { producido } = calcularProgreso(orden.id);
    const mensaje = producido > 0
      ? `No se puede eliminar la orden "${orden.codigo}" porque ya tiene ${producido} unidades producidas.`
      : `¿Está seguro que desea eliminar la orden "${orden.codigo}"? Esta acción no se puede deshacer.`;

    if (producido > 0) {
      toast.error(mensaje);
      return;
    }

    ConfirmationModal.confirm({
      title: 'Eliminar Orden',
      content: mensaje,
      async onOk() {
        try {
          await deleteOrdenMutation.mutateAsync(orden.id);
          toast.success('Orden eliminada correctamente');
        } catch (error) {
          toast.error(error.message || 'Error al eliminar la orden');
        }
      }
    });
  };

  // Columnas para DataTable
  const columns = [
    {
      key: 'codigo',
      header: 'Código',
      render: (row) => <span className="font-semibold">{row.codigo || '-'}</span>
    },
    {
      key: 'tipo_cuaderno',
      header: 'Producto',
      render: (row) => row.tipo_cuaderno || '-'
    },
    {
      key: 'cantidad_producir',
      header: 'Cantidad',
      render: (row) => row.cantidad_producir ?? '-'
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => <EstadoBadge estado={row.estado} />
    },
    {
      key: 'fecha_programada',
      header: 'Fecha programada',
      render: (row) => row.fecha_programada ? new Date(row.fecha_programada).toLocaleDateString('es-PE') : '-'
    },
    {
      key: 'cliente_nombre',
      header: 'Cliente',
      render: (row) => row.cliente_nombre || '-'
    },
    {
      key: 'progreso',
      header: 'Progreso',
      render: (row) => {
        const { total, producido, percent } = calcularProgreso(row.id);
        return (
          <div className="min-w-[120px]">
            <Progress percent={percent} size="small" status={percent === 100 ? 'success' : 'active'} />
            <div className="text-xs text-gray-500">{producido} / {total}</div>
          </div>
        );
      }
    }
  ];

  // Acciones por fila
  const renderActions = (row) => {
    const { producido } = calcularProgreso(row.id);
    const puedeEditar = row.estado === 'pendiente';
    const puedeEliminar = row.estado === 'pendiente' && producido === 0;

    return (
      <div className="flex flex-wrap gap-2">
        <Button type="default" icon={<EyeOutlined />} onClick={() => handleVerDetalle(row.id)}>
          Ver
        </Button>

        <Button type="dashed" icon={<HistoryOutlined />} onClick={() => handleVerHistorial(row)}>
          Historial
        </Button>

        {puedeEditar && (
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditarOrden(row)}>
            Editar
          </Button>
        )}

        {row.estado === 'pendiente' && (
          <Button
            icon={<PlayCircleOutlined />}
            style={{
              backgroundColor: '#10b981', // verde Tailwind
              borderColor: '#10b981',
              color: 'white'
            }}
            onClick={() => handleIniciar(row)}
          >
            Iniciar
          </Button>
        )}

        {row.estado === 'iniciado' && (
          <Button
            icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: '#8b5cf6', // violeta Tailwind
              borderColor: '#8b5cf6',
              color: 'white'
            }}
            onClick={() => handleRegistrarProduccion(row.id)}
          >
            Registrar producción
          </Button>
        )}

        {row.estado === 'iniciado' && (
          <Button type="default" danger icon={<CheckCircleOutlined />} onClick={() => handleFinalizar(row)}>
            Finalizar
          </Button>
        )}

        {puedeEliminar && (
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(row)}>
            Eliminar
          </Button>
        )}
      </div>

    );
  };

  // Nueva acción: Iniciar producción
  const handleIniciar = (orden) => {
    ConfirmationModal.confirm({
      title: 'Iniciar Producción',
      content: `¿Está seguro que desea iniciar la producción de la orden "${orden.codigo}"? Se descontará el stock de materiales.`,
      async onOk() {
        try {
          await iniciarMutation.mutateAsync(orden.id);
          toast.success('Producción iniciada correctamente');
        } catch (error) {
          // Mostrar error del backend (stock insuficiente, estado, etc)
          const msg = error?.response?.data?.error || error.message || 'Error al iniciar producción';
          toast.error(msg);
        }
      }
    });
  };

  // Chips de filtros activos
  const activeChips = [];
  if (filtroEstado !== 'TODOS') activeChips.push({ key: 'estado', label: 'Estado', value: estados.find(e => e.value === filtroEstado)?.label });
  if (busqueda) activeChips.push({ key: 'busqueda', label: 'Búsqueda', value: busqueda });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-semibold">Gestión de Producción</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNuevaOrden}>
          Nueva Orden
        </Button>
      </div>

      {/* Resumen Ejecutivo */}
      <OrdenesExecutiveSummary />
      {/* Filtros rápidos y badges de estado */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded-lg shadow-md">
        {filtrosRapidos.map(f => (
          <Button
            key={f.value}
            type={filtroEstado === f.value ? 'primary' : 'default'}
            style={{ borderColor: f.color, color: f.color }}
            onClick={() => setFiltroEstado(f.value)}
          >
            <Tag color={f.color}>{f.label}</Tag>
          </Button>
        ))}
        <Button
          onClick={() => setFiltroEstado('TODOS')}
          type={filtroEstado === 'TODOS' ? 'primary' : 'default'}
        >
          Todas
        </Button>
        <input
          className="border rounded px-2 py-1 min-w-[200px] ml-4"
          placeholder="Buscar cliente o producto"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <Button
          onClick={() => setBusqueda("")}
          disabled={!busqueda}
        >
          Limpiar búsqueda
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={filteredData()}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />
      <OrdenDetalleModal
        open={modalDetalle.open}
        ordenObj={modalDetalle.ordenObj}
        onClose={() => setModalDetalle({ open: false, ordenObj: null })}
        onRegistrarProduccion={(ordenId) => {
          // Cerrar el modal de detalle y abrir el de registro
          setModalDetalle({ open: false, ordenObj: null });
          handleRegistrarProduccion(ordenId);
        }}
      />
 <Modal
  title="Nueva Orden de Producción"
  open={modalNuevaOrden}
  onCancel={() => {
    setModalNuevaOrden(false);
    setMaterialesSeleccionados([]);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  confirmLoading={createOrdenMutation.isLoading}
  destroyOnHidden
>
  <Form
    form={form}
    layout="vertical"
    onFinish={async (values) => {
      try {
        if (materialesSeleccionados.length === 0) {
          toast.error('Debe seleccionar al menos un material');
          return;
        }

        const payload = {
          ordenData: {
            tipo_cuaderno: values.tipo_cuaderno,
            cantidad_producir: values.cantidad_producir,
            estado: "pendiente",
            fecha_programada: values.fecha_programada,
            fecha_inicio: null,
            fecha_fin: null,
            cliente_id: values.cliente_id
          },
          materialesSeleccionados: materialesSeleccionados.map(m => ({
            id: m.material_id,
            cantidad_necesaria: m.cantidad_necesaria
          }))
        };

        await createOrdenMutation.mutateAsync(payload);
        toast.success('Orden creada correctamente');
        setModalNuevaOrden(false);
        setMaterialesSeleccionados([]);
        form.resetFields();
      } catch (error) {
        toast.error(error.message || 'Error al crear la orden');
      }
    }}
    className="pt-2"
  >
    {/* Cliente y Producto */}
    <Form.Item
      name="cliente_id"
      label="Cliente"
      rules={[{ required: true, message: 'Seleccione el cliente' }]}
    >
      <Select
        placeholder="Seleccione un cliente"
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {clientes?.map(c => (
          <Select.Option key={c.id} value={c.id}>{c.nombre}</Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name="tipo_cuaderno"
      label="Producto a fabricar"
      rules={[{ required: true, message: 'Ingrese el producto' }]}
    >
      <Input placeholder="Ej. Cuaderno rayado" />
    </Form.Item>

    {/* Fecha y Cantidad */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Form.Item
        name="fecha_programada"
        label="Fecha Programada"
        rules={[{ required: true, message: 'Seleccione una fecha' }]}
      >
        <DatePicker
          placeholder="Seleccionar fecha"
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
        />
      </Form.Item>

      <Form.Item
        name="cantidad_producir"
        label="Cantidad a producir"
        rules={[
          { required: true, message: 'Ingrese la cantidad' },
          { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
        ]}
      >
        <InputNumber
          min={1}
          placeholder="Ej. 100"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>

    {/* Selector de Materiales */}
    <div className="mt-4">
      <label className="font-medium text-sm text-gray-700 mb-2 block">Materiales requeridos</label>
      <div className="flex gap-2 mb-3">
        <Select
          placeholder="➕ Agregar material..."
          style={{ flex: 1 }}
          value={null}
          onChange={(materialId) => {
            if (!materialId || materialesSeleccionados.some(m => m.material_id === materialId)) return;
            setMaterialesSeleccionados([...materialesSeleccionados, { material_id: materialId, cantidad_necesaria: 1 }]);
          }}
        >
          {(materiales || [])
            .filter(m => !materialesSeleccionados.some(sel => sel.material_id === m.id))
            .map(m => (
              <Select.Option key={m.id} value={m.id}>{m.nombre}</Select.Option>
            ))}
        </Select>
      </div>

      {materialesSeleccionados.length === 0 ? (
        <div className="text-gray-500 text-center text-sm py-3 border border-dashed rounded-md">
          No hay materiales seleccionados
        </div>
      ) : (
        <div className="space-y-2">
          {materialesSeleccionados.map((mat, idx) => {
            const matInfo = materiales.find(m => m.id === mat.material_id);
            return (
              <div key={mat.material_id} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{matInfo?.nombre || `Material #${mat.material_id}`}</div>
                  <div className="text-xs text-gray-500">ID: {mat.material_id}</div>
                </div>
                <InputNumber
                  min={1}
                  value={mat.cantidad_necesaria}
                  onChange={val => {
                    const nuevaCantidad = val || 1;
                    const nuevos = [...materialesSeleccionados];
                    nuevos[idx].cantidad_necesaria = nuevaCantidad;
                    setMaterialesSeleccionados(nuevos);
                  }}
                  className="w-24"
                />
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setMaterialesSeleccionados(materialesSeleccionados.filter((_, i) => i !== idx))
                  }
                >
                  Quitar
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </Form>
</Modal>

<Modal
  title={`Editar Orden #${modalRegistrar.orden?.codigo || ''}`}
  open={modalRegistrar.open}
  onCancel={() => {
    setModalRegistrar({ open: false, orden: null });
    setMaterialesSeleccionados([]);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  confirmLoading={updateOrdenMutation.isLoading}
  destroyOnHidden
  width={1000}
></Modal>


<Modal
  title={`Editar Orden #${modalEditarOrden.orden?.codigo || ''}`}
  open={modalEditarOrden.open}
  onCancel={() => {
    setModalEditarOrden({ open: false, orden: null });
    setMaterialesSeleccionados([]);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  confirmLoading={updateOrdenMutation.isLoading}
  destroyOnHidden
  width={1000}
>
  {/* Alerta de advertencia */}
  <div className="mb-4">
    <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
      <strong>⚠️ Importante:</strong> Solo se pueden editar órdenes en estado <strong>"Pendiente"</strong>. Una vez iniciada la producción, los cambios no serán posibles.
    </div>
  </div>

  <Form
    form={form}
    layout="vertical"
    initialValues={{
      fecha_programada: modalEditarOrden.orden?.fecha_programada
        ? dayjs(modalEditarOrden.orden.fecha_programada)
        : null,
      cliente_id: modalEditarOrden.orden?.cliente_id || '',
      tipo_cuaderno: modalEditarOrden.orden?.tipo_cuaderno || '',
      cantidad_producir: modalEditarOrden.orden?.cantidad_producir || ''
    }}
    onFinish={async (values) => {
      try {
        if (materialesSeleccionados.length === 0) {
          toast.error('Debe seleccionar al menos un material');
          return;
        }

        await updateOrdenMutation.mutateAsync({
          id: modalEditarOrden.orden.id,
          orden: {
            ordenData: {
              codigo: modalEditarOrden.orden.codigo,
              tipo_cuaderno: values.tipo_cuaderno,
              cantidad_producir: values.cantidad_producir,
              estado: modalEditarOrden.orden.estado,
              fecha_programada: values.fecha_programada,
              fecha_inicio: modalEditarOrden.orden.fecha_inicio,
              fecha_fin: modalEditarOrden.orden.fecha_fin,
              cliente_id: values.cliente_id
            },
            materialesSeleccionados: materialesSeleccionados.map(m => ({
              id: m.material_id,
              cantidad_necesaria: m.cantidad_necesaria
            }))
          }
        });

        toast.success('Orden actualizada correctamente');
        setModalEditarOrden({ open: false, orden: null });
        setMaterialesSeleccionados([]);
        form.resetFields();
      } catch (error) {
        toast.error(error.message || 'Error al actualizar la orden');
      }
    }}
  >
    {/* Cliente y producto */}
    <Form.Item
      name="cliente_id"
      label="Cliente"
      rules={[{ required: true, message: 'Seleccione el cliente' }]}
    >
      <Select
        placeholder="Seleccione un cliente"
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {clientes?.map(c => (
          <Select.Option key={c.id} value={c.id}>{c.nombre}</Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name="tipo_cuaderno"
      label="Producto a fabricar"
      rules={[{ required: true, message: 'Ingrese el producto' }]}
    >
      <Input placeholder="Ej. Cuaderno rayado" />
    </Form.Item>

    {/* Fecha y Cantidad */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Form.Item
        name="fecha_programada"
        label="Fecha Programada"
        rules={[{ required: true, message: 'Seleccione una fecha' }]}
      >
        <DatePicker
          placeholder="Seleccionar fecha"
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
        />
      </Form.Item>

      <Form.Item
        name="cantidad_producir"
        label="Cantidad a producir"
        rules={[
          { required: true, message: 'Ingrese la cantidad' },
          { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
        ]}
      >
        <InputNumber
          min={1}
          placeholder="Ej. 100"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>

    {/* Selector de materiales */}
    <div className="mt-6">
      <label className="font-medium text-sm text-gray-700 mb-2 block">Materiales requeridos</label>

      <Select
        placeholder="➕ Agregar material..."
        value={null}
        onChange={(materialId) => {
          if (!materialId || materialesSeleccionados.some(m => m.material_id === materialId)) return;
          setMaterialesSeleccionados([...materialesSeleccionados, { material_id: materialId, cantidad_necesaria: 1 }]);
        }}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {(materiales || [])
          .filter(m => !materialesSeleccionados.some(sel => sel.material_id === m.id))
          .map(m => (
            <Select.Option key={m.id} value={m.id}>{m.nombre}</Select.Option>
          ))}
      </Select>

      {materialesSeleccionados.length === 0 ? (
        <div className="text-center py-4 text-gray-500 border border-dashed rounded-md">
          No hay materiales seleccionados
        </div>
      ) : (
        <div className="space-y-2">
          {materialesSeleccionados.map((mat, idx) => {
            const matInfo = materiales.find(m => m.id === mat.material_id);
            return (
              <div
                key={mat.material_id}
                className="flex items-center gap-3 p-3 bg-gray-50 border rounded-md"
              >
                <div className="flex-1">
                  <div className="font-medium">{matInfo?.nombre || `Material #${mat.material_id}`}</div>
                  <div className="text-xs text-gray-500">ID: {mat.material_id}</div>
                </div>
                <InputNumber
                  min={1}
                  value={mat.cantidad_necesaria}
                  onChange={val => {
                    const nuevaCantidad = val || 1;
                    const nuevos = [...materialesSeleccionados];
                    nuevos[idx].cantidad_necesaria = nuevaCantidad;
                    setMaterialesSeleccionados(nuevos);
                  }}
                  className="w-24"
                />
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => setMaterialesSeleccionados(materialesSeleccionados.filter((_, i) => i !== idx))}
                >
                  Quitar
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </Form>
</Modal>


      {/* Modal de historial */}
      <OrdenHistorialModal
        open={modalHistorial.open}
        orden={modalHistorial.orden}
        onClose={() => setModalHistorial({ open: false, orden: null })}
      />
    </div>
  );
} 