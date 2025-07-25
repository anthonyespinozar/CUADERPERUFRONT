'use client';

import { Card, Row, Col, Statistic } from 'antd';
import { useCompras } from '@/hooks/useCompras';
import { 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DollarOutlined 
} from '@ant-design/icons';

export default function ComprasStats() {
  const { data: compras, isLoading } = useCompras();

  if (isLoading) {
    return (
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card loading={true} />
        </Col>
        <Col span={6}>
          <Card loading={true} />
        </Col>
        <Col span={6}>
          <Card loading={true} />
        </Col>
        <Col span={6}>
          <Card loading={true} />
        </Col>
      </Row>
    );
  }

  const totalCompras = compras?.length || 0;
  const comprasRecibidas = compras?.filter(c => c.estado === 'recibido').length || 0;
  const comprasPendientes = compras?.filter(c => ['pendiente', 'ordenado', 'en_transito'].includes(c.estado)).length || 0;
  const totalInvertido = compras?.reduce((sum, compra) => {
    const compraTotal = compra.materiales?.reduce((materialSum, material) => 
      materialSum + (material.cantidad * material.precio_unitario), 0
    ) || 0;
    return sum + compraTotal;
  }, 0) || 0;

  return (
    <Row gutter={16} className="mb-6">
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total de Compras"
            value={totalCompras}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Compras Recibidas"
            value={comprasRecibidas}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Compras Pendientes"
            value={comprasPendientes}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Invertido"
            value={totalInvertido}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="S/"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
    </Row>
  );
} 