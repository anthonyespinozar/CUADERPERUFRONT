"use client";

import { useState, useCallback } from "react";
import { useOrdenesProduccion } from "@/hooks/useOrdenesProduccion";
import { useRouter } from "next/navigation";
import { Button, Tag, Progress, Modal } from "antd";
import { EyeOutlined, PlayCircleOutlined, CheckCircleOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/tables/DataTable";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { finalizarProduccion } from "@/services/produccionesService";
import { deleteOrdenProduccion } from "@/services/ordenesProduccionService";
import { BaseForm } from "@/components/forms/BaseForm";
import { createOrdenProduccion } from "@/services/ordenesProduccionService";
import { registrarProduccion } from "@/services/produccionesService";
import { useClientes } from "@/hooks/useClientes";
import OrdenDetalleModal from "@/components/produccion/OrdenDetalleModal";
import { useMateriales } from "@/hooks/useMateriales";
import { iniciarProduccion } from "@/services/produccionesService";

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
  const { data, isLoading, refetch } = useOrdenesProduccion();
  // Mapea la data para la tabla
  const ordenes = (data || []).map(item => ({ ...item.ordenData, _obj: item }));
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [modalNuevaOrden, setModalNuevaOrden] = useState(false);
  const [modalRegistrar, setModalRegistrar] = useState({ open: false, orden: null });
  const [modalDetalle, setModalDetalle] = useState({ open: false, ordenId: null });
  const { data: clientes } = useClientes();
  const { data: materiales } = useMateriales();
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);

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
  const handleRegistrarProduccion = (ordenId) => {
    const ordenPlano = (ordenes || []).find(o => o.id === ordenId);
    setModalRegistrar({ open: true, orden: ordenPlano });
  };
  const handleFinalizar = (orden) => {
    ConfirmationModal.confirm({
      title: 'Finalizar Orden',
      content: `¿Está seguro que desea finalizar la orden "${orden.codigo}"? Esta acción no se puede deshacer.`,
      async onOk() {
        try {
          await finalizarProduccion(orden.id);
          toast.success('Orden finalizada correctamente');
          refetch();
        } catch (error) {
          toast.error(error.message || 'Error al finalizar la orden');
        }
      }
    });
  };
  // Eliminar (solo si no tiene producciones, lógica pendiente de backend)
  const handleDelete = (orden) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Orden',
      content: `¿Está seguro que desea eliminar la orden "${orden.codigo}"? Solo es posible si no tiene producciones registradas.`,
      async onOk() {
        try {
          await deleteOrdenProduccion(orden.id);
          toast.success('Orden eliminada correctamente');
          refetch();
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
        const total = row.cantidad_producir || 0;
        const producido = row.total_producido || 0;
        const percent = total > 0 ? Math.round((producido / total) * 100) : 0;
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
    // Si está finalizado, solo ver
    if (row.estado === 'finalizado') {
      return (
        <Button icon={<EyeOutlined />} onClick={() => handleVerDetalle(row.id)}>
          Ver
        </Button>
      );
    }
    // Si está pendiente y no tiene producciones, permitir iniciar y eliminar
    const puedeEliminar = row.estado === 'pendiente' && (row.total_producido === 0 || !row.total_producido);
    return (
      <div className="space-x-2">
        <Button icon={<EyeOutlined />} onClick={() => handleVerDetalle(row.id)}>
          Ver
        </Button>
        {row.estado === 'pendiente' && (
          <Button icon={<PlayCircleOutlined />} type="primary" onClick={() => handleIniciar(row)}>
            Iniciar
          </Button>
        )}
        {row.estado === 'iniciado' && (
          <Button icon={<CheckCircleOutlined />} type="primary" onClick={() => handleRegistrarProduccion(row.id)}>
            Registrar producción
          </Button>
        )}
        {row.estado === 'iniciado' && (
          <Button icon={<CheckCircleOutlined />} danger onClick={() => handleFinalizar(row)}>
            Finalizar
          </Button>
        )}
        {puedeEliminar && (
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(row)}>
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
          await iniciarProduccion(orden.id);
          toast.success('Producción iniciada correctamente');
          refetch();
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
        <h1 className="text-2xl font-semibold">Órdenes de Producción</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNuevaOrden}>
          Nueva Orden
        </Button>
      </div>
      {/* Filtros rápidos y badges de estado */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded-lg shadow-sm">
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
        onRegistrarProduccion={handleRegistrarProduccion}
      />
      <Modal
        title="Nueva Orden de Producción"
        open={modalNuevaOrden}
        onCancel={() => {
          setModalNuevaOrden(false);
          setMaterialesSeleccionados([]);
        }}
        footer={null}
        destroyOnHidden
      >
        <BaseForm
          onSubmit={async (values) => {
            try {
              // Generar código automático (puedes mejorarlo según tu lógica)
              const codigo = `ORD-${Math.floor(Math.random() * 10000)}`;
              const payload = {
                ordenData: {
                  codigo,
                  tipo_cuaderno: values.tipo_cuaderno,
                  cantidad_producir: values.cantidad_producir,
                  estado: "pendiente",
                  fecha_programada: values.fecha_programada,
                  fecha_inicio: null,
                  fecha_fin: null,
                  cliente_id: values.cliente_id
                },
                materialesSeleccionados: materialesSeleccionados.map(m => ({ id: m.material_id, cantidad_necesaria: m.cantidad_necesaria }))
              };
              await createOrdenProduccion(payload);
              toast.success('Orden creada correctamente');
              setModalNuevaOrden(false);
              setMaterialesSeleccionados([]);
              refetch();
            } catch (error) {
              toast.error(error.message || 'Error al crear la orden');
            }
          }}
          fields={[
            { name: 'fecha_programada', label: 'Fecha de Orden', type: 'date', validation: { required: 'La fecha es obligatoria' } },
            { name: 'cliente_id', label: 'Cliente', type: 'select', options: (clientes || []).map(c => ({ value: c.id, label: c.nombre })), validation: {} },
            { name: 'tipo_cuaderno', label: 'Producto a fabricar', type: 'text', validation: { required: 'El producto es obligatorio' } },
            { name: 'cantidad_producir', label: 'Cantidad a producir', type: 'number', validation: { required: 'La cantidad es obligatoria', min: { value: 1, message: 'Debe ser mayor a 0' } } },
          ]}
          submitText="Crear orden"
          onCancel={() => {
            setModalNuevaOrden(false);
            setMaterialesSeleccionados([]);
          }}
        />
        {/* Selector de materiales */}
        <div className="mt-6">
          <div className="font-semibold mb-2">Materiales requeridos</div>
          <div className="flex gap-2 mb-2">
            <select
              className="border rounded px-2 py-1"
              id="material-select"
              defaultValue=""
              onChange={e => {
                const materialId = parseInt(e.target.value);
                if (!materialId || materialesSeleccionados.some(m => m.material_id === materialId)) return;
                setMaterialesSeleccionados([...materialesSeleccionados, { material_id: materialId, cantidad_necesaria: 1 }]);
              }}
            >
              <option value="">Agregar material...</option>
              {(materiales || []).filter(m => !materialesSeleccionados.some(sel => sel.material_id === m.id)).map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Material</th>
                <th className="p-2">Cantidad necesaria</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {materialesSeleccionados.map((mat, idx) => {
                const matInfo = (materiales || []).find(m => m.id === mat.material_id);
                return (
                  <tr key={mat.material_id}>
                    <td className="p-2">{matInfo?.nombre || mat.material_id}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        className="border rounded px-2 py-1 w-24"
                        value={mat.cantidad_necesaria}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setMaterialesSeleccionados(materialesSeleccionados.map((m, i) => i === idx ? { ...m, cantidad_necesaria: val } : m));
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Button danger size="small" onClick={() => setMaterialesSeleccionados(materialesSeleccionados.filter((_, i) => i !== idx))}>Quitar</Button>
                    </td>
                  </tr>
                );
              })}
              {materialesSeleccionados.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-2">Agrega al menos un material</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
      <Modal
        title={`Registrar Producción - Orden #${modalRegistrar.orden?.codigo || ''}`}
        open={modalRegistrar.open}
        onCancel={() => setModalRegistrar({ open: false, orden: null })}
        footer={null}
        destroyOnHidden
      >
        <BaseForm
          onSubmit={async (values) => {
            try {
              await registrarProduccion(modalRegistrar.orden.id, { cantidad_producida: values.cantidad_producida });
              toast.success('Producción registrada correctamente');
              setModalRegistrar({ open: false, orden: null });
              refetch();
            } catch (error) {
              toast.error(error.message || 'Error al registrar producción');
            }
          }}
          fields={[
            { name: 'cantidad_producida', label: 'Cantidad producida', type: 'number', validation: { required: 'La cantidad es obligatoria', min: { value: 1, message: 'Debe ser mayor a 0' }, max: { value: modalRegistrar.orden ? (modalRegistrar.orden.cantidad_producir - (modalRegistrar.orden.total_producido || 0)) : 999999, message: 'No puede superar la cantidad restante' } } },
          ]}
          submitText="Registrar producción"
          onCancel={() => setModalRegistrar({ open: false, orden: null })}
        />
      </Modal>
    </div>
  );
} 