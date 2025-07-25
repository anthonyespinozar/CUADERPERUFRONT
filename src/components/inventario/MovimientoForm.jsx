'use client';

import { useState } from 'react';
import { Form, Modal, Button, Select, InputNumber, Input, DatePicker } from 'antd';
import { useMateriales } from '@/hooks/useMateriales';
import { createMovimiento } from '@/services/movimientosService';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { Option } = Select;

export default function MovimientoForm({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const { data: materiales } = useMateriales();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await createMovimiento({
        ...values,
        fecha_movimiento: values.fecha_movimiento
          ? values.fecha_movimiento.toISOString()
          : new Date().toISOString(),
      });
      toast.success('Movimiento registrado');
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e.message || 'Error al registrar movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Registrar Movimiento"
      open={open}
      onCancel={onClose}
      onOk={form.submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ fecha_movimiento: dayjs() }}>
        <Form.Item
          name="tipo_movimiento"
          label="Tipo de Movimiento"
          rules={[{ required: true, message: 'Seleccione el tipo' }]}
        >
          <Select placeholder="Seleccione">
            <Option value="entrada">Entrada</Option>
            <Option value="salida">Salida</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="material_id"
          label="Material"
          rules={[{ required: true, message: 'Seleccione el material' }]}
        >
          <Select showSearch placeholder="Seleccione material">
            {materiales?.map((m) => (
              <Option key={m.id} value={m.id}>{m.nombre}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="cantidad"
          label="Cantidad"
          rules={[{ required: true, message: 'Ingrese la cantidad' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: 'Ingrese el motivo' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          name="fecha_movimiento"
          label="Fecha"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
