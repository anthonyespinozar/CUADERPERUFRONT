import { Modal, Table, Tag, Progress, Button } from "antd";
import { useEffect, useState } from "react";
import { useOrdenProduccionById, useMaterialesPorOrden } from "@/hooks/useOrdenesProduccion";
import { useProducciones } from "@/hooks/useProducciones";
import { CheckCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { finalizarProduccion, eliminarProduccion } from "@/services/produccionesService";

export default function OrdenDetalleModal({ open, onClose, ordenObj, onRegistrarProduccion }) {
  const orden = ordenObj?.ordenData;
  const materiales = ordenObj?.materialesSeleccionados || [];
  const { data: producciones, isLoading: loadingProd, refetch: refetchProd } = useProducciones();
  const [modalEditProduccion, setModalEditProduccion] = useState(null);

  // Filtrar producciones de esta orden
  const produccionesOrden = orden ? (producciones || []).filter(p => p.orden_id === orden.id) : [];
  const totalProducido = produccionesOrden.reduce((sum, p) => sum + (p.cantidad_producida || 0), 0);
  const progreso = orden?.cantidad_producir ? Math.round((totalProducido / orden.cantidad_producir) * 100) : 0;

  // Acciones
  const handleFinalizar = () => {
    ConfirmationModal.confirm({
      title: 'Finalizar Orden',
      content: `¿Está seguro que desea finalizar la orden "${orden.codigo}"? Esta acción no se puede deshacer.`,
      async onOk() {
        try {
          await finalizarProduccion(orden.id);
          toast.success('Orden finalizada correctamente');
        } catch (error) {
          toast.error(error.message || 'Error al finalizar la orden');
        }
      }
    });
  };
  const handleEliminarProduccion = (produccion) => {
    ConfirmationModal.confirm({
      title: 'Eliminar Producción',
      content: `¿Está seguro que desea eliminar este registro de producción?`,
      async onOk() {
        try {
          await eliminarProduccion(produccion.id);
          toast.success('Producción eliminada correctamente');
          refetchProd();
        } catch (error) {
          toast.error(error.message || 'Error al eliminar producción');
        }
      }
    });
  };

  // Columnas materiales
  const matColumns = [
    { title: 'ID Material', dataIndex: 'id', key: 'id', render: (v) => v || '-' },
    { title: 'Cantidad necesaria', dataIndex: 'cantidad_necesaria', key: 'cantidad_necesaria', render: v => v ?? '-' },
  ];
  // Columnas producciones
  const prodColumns = [
    { title: 'Fecha', dataIndex: 'fecha_registro', key: 'fecha_registro', render: (f) => f ? new Date(f).toLocaleString('es-PE') : '-' },
    { title: 'Cantidad producida', dataIndex: 'cantidad_producida', key: 'cantidad_producida', render: v => v ?? '-' },
    { title: 'Acciones', key: 'acciones', render: (_, row) => (
      <div className="space-x-2">
        <Button icon={<EditOutlined />} size="small" onClick={() => setModalEditProduccion(row)}>
          Editar
        </Button>
        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleEliminarProduccion(row)}>
          Eliminar
        </Button>
      </div>
    ) },
  ];

  return (
    <Modal
      title={`Detalle de Orden #${orden?.codigo || ''}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnHidden
    >
      {!orden ? (
        <div className="py-10 text-center text-gray-500">No hay datos de la orden.</div>
      ) : (
        <div className="space-y-4">
          {/* Info principal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-lg">{orden?.tipo_cuaderno || '-'}</div>
              <div className="text-gray-600">Código: <b>{orden?.codigo || '-'}</b></div>
              <div className="text-gray-600">Cantidad a producir: <b>{orden?.cantidad_producir ?? '-'}</b></div>
              <div className="text-gray-600">Cliente: {orden?.cliente_nombre || '-'}</div>
              <div className="text-gray-600">Estado: <Tag color={orden?.estado === 'finalizado' ? 'green' : orden?.estado === 'iniciado' ? 'blue' : 'gold'}>{orden?.estado || '-'}</Tag></div>
              <div className="text-gray-600">Fecha programada: {orden?.fecha_programada ? new Date(orden.fecha_programada).toLocaleDateString('es-PE') : '-'}</div>
              <div className="text-gray-600">Fecha inicio: {orden?.fecha_inicio ? new Date(orden.fecha_inicio).toLocaleDateString('es-PE') : '-'}</div>
              <div className="text-gray-600">Fecha fin: {orden?.fecha_fin ? new Date(orden.fecha_fin).toLocaleDateString('es-PE') : '-'}</div>
            </div>
            <div>
              <div className="mb-2">Progreso de producción:</div>
              <Progress percent={progreso} status={progreso === 100 ? 'success' : 'active'} />
              <div className="text-xs text-gray-500">{totalProducido} / {orden?.cantidad_producir}</div>
            </div>
          </div>
          {/* Materiales requeridos */}
          <div>
            <div className="font-semibold mb-2">Materiales requeridos</div>
            <Table
              columns={matColumns}
              dataSource={materiales}
              loading={false}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </div>
          {/* Producciones realizadas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Producciones realizadas</div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => onRegistrarProduccion(orden?.id)}>
                Registrar producción
              </Button>
            </div>
            <Table
              columns={prodColumns}
              dataSource={produccionesOrden}
              loading={loadingProd}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </div>
          {/* Acciones finales */}
          <div className="flex gap-2 justify-end">
            {orden?.estado !== 'finalizado' && (
              <Button icon={<CheckCircleOutlined />} type="primary" onClick={handleFinalizar}>
                Finalizar orden
              </Button>
            )}
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      )}
      {/* Modal de edición de producción (pendiente de implementar) */}
    </Modal>
  );
} 