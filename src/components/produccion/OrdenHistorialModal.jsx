import { Modal, Timeline, Tag, Descriptions } from "antd";
import { ClockCircleOutlined, EditOutlined, PlayCircleOutlined, CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useProducciones } from "@/hooks/useProducciones";

export default function OrdenHistorialModal({ open, onClose, orden }) {
  const { data: producciones } = useProducciones();
  
  if (!orden) return null;

  // Filtrar producciones de esta orden
  const produccionesOrden = (producciones || []).filter(p => p.orden_id === orden.id);

  // Crear historial real basado en eventos y producciones
  const historial = [
    {
      fecha: orden.fecha_programada,
      accion: 'Orden creada',
      descripcion: `Orden ${orden.codigo} creada para ${orden.tipo_cuaderno}`,
      icon: <ClockCircleOutlined />,
      color: 'blue'
    },
    ...(orden.fecha_inicio ? [{
      fecha: orden.fecha_inicio,
      accion: 'Producción iniciada',
      descripcion: 'Se inició la producción y se descontó el stock de materiales',
      icon: <PlayCircleOutlined />,
      color: 'green'
    }] : []),
    // Agregar producciones registradas
    ...produccionesOrden.map(prod => ({
      fecha: prod.fecha_registro || prod.fecha_produccion,
      accion: 'Producción registrada',
      descripcion: `${prod.cantidad_producida} unidades producidas${prod.observaciones ? ` - ${prod.observaciones}` : ''}`,
      icon: <PlusOutlined />,
      color: 'orange',
      esProduccion: true
    })),
    ...(orden.fecha_fin ? [{
      fecha: orden.fecha_fin,
      accion: 'Producción finalizada',
      descripcion: 'La orden ha sido completada',
      icon: <CheckCircleOutlined />,
      color: 'red'
    }] : [])
  ];

  // Ordenar por fecha
  historial.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <Modal
      title={`Historial de Orden #${orden.codigo}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="space-y-4">
        {/* Información básica */}
        <Descriptions title="Información de la Orden" bordered size="small">
          <Descriptions.Item label="Código">{orden.codigo}</Descriptions.Item>
          <Descriptions.Item label="Producto">{orden.tipo_cuaderno}</Descriptions.Item>
          <Descriptions.Item label="Cantidad">{orden.cantidad_producir}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Tag color={orden.estado === 'finalizado' ? 'green' : orden.estado === 'iniciado' ? 'blue' : 'gold'}>
              {orden.estado}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Cliente">{orden.cliente_nombre}</Descriptions.Item>
          <Descriptions.Item label="Fecha programada">
            {orden.fecha_programada ? new Date(orden.fecha_programada).toLocaleDateString('es-PE') : '-'}
          </Descriptions.Item>
        </Descriptions>

        {/* Resumen de producciones */}
        {produccionesOrden.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Resumen de Producciones</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Total producido:</span> 
                <span className="ml-2 font-bold">
                  {produccionesOrden.reduce((sum, p) => sum + (p.cantidad_producida || 0), 0)} unidades
                </span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Registros de producción:</span> 
                <span className="ml-2 font-bold">{produccionesOrden.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline de eventos */}
        <div>
          <h4 className="font-semibold mb-3">Historial de eventos</h4>
          {historial.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay eventos registrados para esta orden
            </div>
          ) : (
            <Timeline
              items={historial.map((evento, index) => ({
                key: index,
                dot: evento.icon,
                color: evento.color,
                children: (
                  <div className="mb-2">
                    <div className="font-medium">{evento.accion}</div>
                    <div className="text-sm text-gray-600">{evento.descripcion}</div>
                    <div className="text-xs text-gray-500">
                      {evento.fecha ? new Date(evento.fecha).toLocaleString('es-PE') : '-'}
                    </div>
                  </div>
                )
              }))}
            />
          )}
        </div>

        {/* Notas adicionales */}
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">
            <strong>Nota:</strong> Este historial muestra todos los eventos de la orden, incluyendo las producciones registradas. 
            Para más detalles sobre las producciones, consulta el modal de detalle.
          </div>
        </div>
      </div>
    </Modal>
  );
} 