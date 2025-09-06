'use client';

import { useState, useEffect } from 'react';
import { Form, Modal, Button, Select, InputNumber, Input, DatePicker } from 'antd';
import { useMateriales } from '@/hooks/useMateriales';
import { useCreateMovimiento, useEditMovimiento } from '@/hooks/useMovimientos';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { Option } = Select;

export default function MovimientoForm({ open, onClose, onSuccess, editingMovimiento = null }) {
  const [form] = Form.useForm();
  const { data: materiales } = useMateriales();
  
  // Hooks de mutación
  const createMovimientoMutation = useCreateMovimiento();
  const editMovimientoMutation = useEditMovimiento();

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if (editingMovimiento) {
        // Si estamos editando, llenar el formulario con los datos existentes
        form.setFieldsValue({
          ...editingMovimiento,
          fecha_movimiento: editingMovimiento.fecha_movimiento ? dayjs(editingMovimiento.fecha_movimiento) : dayjs(),
        });
      } else {
        // Si estamos creando, resetear el formulario
        form.resetFields();
        form.setFieldsValue({ fecha_movimiento: dayjs() });
      }
    }
  }, [open, editingMovimiento, form]);

  const handleFinish = async (values) => {
    try {
      const movimientoData = {
        ...values,
        fecha_movimiento: values.fecha_movimiento
          ? values.fecha_movimiento.toISOString()
          : new Date().toISOString(),
      };

      if (editingMovimiento) {
        // Editar movimiento existente
        await editMovimientoMutation.mutateAsync({
          id: editingMovimiento.id,
          data: movimientoData
        });
        toast.success('Movimiento actualizado');
      } else {
        // Crear nuevo movimiento
        await createMovimientoMutation.mutateAsync(movimientoData);
        toast.success('Movimiento registrado');
      }

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e.message || `Error al ${editingMovimiento ? 'actualizar' : 'registrar'} movimiento`);
    }
  };

  const isEditing = !!editingMovimiento;
  const isLoading = createMovimientoMutation.isLoading || editMovimientoMutation.isLoading;

  return (
    <Modal
      title={isEditing ? "Editar Movimiento" : "Registrar Movimiento"}
      open={open}
      onCancel={onClose}
      onOk={form.submit}
      confirmLoading={isLoading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2"
      >
        {/* Tipo de Movimiento */}
        <Form.Item
          name="tipo_movimiento"
          label="Tipo de Movimiento"
          rules={[{ required: true, message: 'Seleccione el tipo de movimiento' }]}
        >
          <Select placeholder="Ej. Entrada o Salida">
            <Option value="entrada">Entrada</Option>
            <Option value="salida">Salida</Option>
          </Select>
        </Form.Item>

        {/* Material */}
        <Form.Item
          name="material_id"
          label="Material"
          rules={[{ required: true, message: 'Seleccione el material' }]}
        >
          <Select
            showSearch
            placeholder="Buscar y seleccionar material"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {materiales?.map((m) => (
              <Option key={m.id} value={m.id}>{m.nombre}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Cantidad y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="cantidad"
            label="Cantidad"
            rules={[{ required: true, message: 'Ingrese la cantidad' }]}
          >
            <InputNumber
              min={1}
              placeholder="Ej. 10"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="fecha_movimiento"
            label="Fecha"
          >
            <DatePicker
              placeholder="Seleccionar fecha"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </div>

        {/* Descripción */}
        <Form.Item
          name="descripcion"
          label="Descripción / Motivo"
          rules={[{ required: true, message: 'Ingrese una descripción o motivo' }]}
        >
          <Input.TextArea
            rows={2}
            placeholder="Ej. Recepción de materiales, salida para producción..."
          />
        </Form.Item>
      </Form>

    </Modal>
  );
}
