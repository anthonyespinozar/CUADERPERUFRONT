import { Modal, Timeline, Tag, Descriptions } from "antd";
import { ClockCircleOutlined, EditOutlined, PlayCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function OrdenHistorialModal({ open, onClose, orden }) {
  if (!orden) return null;

  // Simular historial de cambios (en un caso real vendría del backend)
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
    ...(orden.fecha_fin ? [{
      fecha: orden.fecha_fin,
      accion: 'Producción finalizada',
      descripcion: 'La orden ha sido completada',
      icon: <CheckCircleOutlined />,
      color: 'red'
    }] : [])
  ];

  return (
    <Modal
      title={`Historial de Orden #${orden.codigo}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
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

        {/* Timeline de eventos */}
        <div>
          <h4 className="font-semibold mb-3">Historial de eventos</h4>
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
        </div>

        {/* Notas adicionales */}
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">
            <strong>Nota:</strong> Este historial muestra los eventos principales de la orden. 
            Para más detalles sobre las producciones registradas, consulta el modal de detalle.
          </div>
        </div>
      </div>
    </Modal>
  );
} 