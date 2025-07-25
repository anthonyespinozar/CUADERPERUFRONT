'use client';

import { Modal, Table, Tag } from 'antd';
import { useCompras } from '@/hooks/useCompras';

export default function MaterialComprasModal({ open, onClose, material }) {
  const { data: compras, isLoading } = useCompras();

  // Filtrar compras que contengan el material específico
  const comprasMaterial = compras?.filter(c => 
    c.materiales?.some(m => m.material_id === material?.id)
  ) || [];

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'yellow',
      ordenado: 'blue',
      en_transito: 'orange',
      recibido: 'green',
      cancelado: 'red',
    };
    return colors[estado] || 'default';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'compra_id',
      key: 'compra_id',
      render: (id) => `#${id}`
    },
    {
      title: 'Fecha de Compra',
      dataIndex: 'fecha_compra',
      key: 'fecha_compra',
      render: (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'N/A'
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor_nombre',
      key: 'proveedor',
      render: (nombre) => nombre || 'N/A'
    },
    {
      title: 'Material',
      key: 'material',
      render: (_, record) => {
        const materialEncontrado = record.materiales?.find(m => m.material_id === material?.id);
        return materialEncontrado ? (
          <div>
            <div className="font-medium">{materialEncontrado.material_nombre}</div>
            <div className="text-sm text-gray-600">
              {materialEncontrado.cantidad} {materialEncontrado.unidad_medida} - S/ {materialEncontrado.precio_unitario?.toFixed(2)}
            </div>
          </div>
        ) : 'N/A';
      }
    },
    {
      title: 'Total Material',
      key: 'total_material',
      render: (_, record) => {
        const materialEncontrado = record.materiales?.find(m => m.material_id === material?.id);
        return materialEncontrado ? `S/ ${(materialEncontrado.cantidad * materialEncontrado.precio_unitario)?.toFixed(2)}` : 'N/A';
      }
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={getEstadoColor(estado)}>
          {estado?.charAt(0).toUpperCase() + estado?.slice(1) || 'N/A'}
        </Tag>
      )
    }
  ];

  return (
    <Modal
      title={`Historial de Compras - ${material?.nombre || 'Material'}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="mb-4">
        <p className="text-gray-600">
          Total de compras: <strong>{comprasMaterial.length}</strong>
        </p>
        {material && (
          <p className="text-gray-600">
            Stock actual: <strong>{material.stock_actual} {material.unidad_medida}</strong>
          </p>
        )}
      </div>
      
      <Table
        columns={columns}
        dataSource={comprasMaterial}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} compras`
        }}
        scroll={{ x: 800 }}
      />
    </Modal>
  );
} 