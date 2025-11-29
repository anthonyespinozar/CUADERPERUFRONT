import { useState, useMemo, useCallback } from "react";
import { useProducciones, useEditarProduccion, useEliminarProduccion } from "@/hooks/useProducciones";
import { useOrdenesProduccion } from "@/hooks/useOrdenesProduccion";
import { useProductos } from "@/hooks/useProductos";
import { useMovimientosProductos } from "@/hooks/useMovimientosProductosService";
import { Button, Tag, DatePicker, Input, Select, Modal, Form, InputNumber, Space } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, BarChartOutlined } from "@ant-design/icons";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { DataTable } from "@/components/tables/DataTable";
import { toast } from "sonner";
import dayjs from 'dayjs';
import {
  ChartBarIcon,
  CalendarIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  CogIcon
} from '@heroicons/react/24/outline';
const { RangePicker } = DatePicker;

export default function ProduccionesRealizadasList() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduccion, setEditingProduccion] = useState(null);
  const [filtros, setFiltros] = useState({});
  
  const { data: producciones, isLoading } = useProducciones();
  const { data: ordenesRaw } = useOrdenesProduccion();
  const { data: productos } = useProductos();
  const { data: movimientosRecientes } = useMovimientosProductos();
  
  // Hooks de mutación
  const editarMutation = useEditarProduccion();
  const eliminarMutation = useEliminarProduccion();

  // Mapea ordenes para lookup rápido
  const ordenes = useMemo(() => {
    return (ordenesRaw || []).map(item => ({ ...item.ordenData, _obj: item }));
  }, [ordenesRaw]);

  // Estadísticas reactivas
  const estadisticas = useMemo(() => {
    const totalProducciones = producciones?.length || 0;
    const produccionesDelMes = producciones?.filter(p => {
      const fecha = new Date(p.fecha_registro);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    }).length || 0;

    const cantidadTotalProducida = producciones?.reduce((total, p) => total + (p.cantidad_producida || 0), 0) || 0;

    const productosActivos = productos?.filter(p => p.estado === true).length || 0;

    const ordenesIniciadas = producciones?.filter(p => p.estado_orden === 'iniciado').length || 0;
    const ordenesFinalizadas = producciones?.filter(p => p.estado_orden === 'finalizado').length || 0;

    return {
      totalProducciones,
      produccionesDelMes,
      cantidadTotalProducida,
      productosActivos,
      ordenesIniciadas,
      ordenesFinalizadas
    };
  }, [producciones, productos]);

  // Filtros locales
  const filteredData = useCallback(() => {
    if (!producciones) return [];
    
    return producciones.filter(produccion => {
      // Filtro por orden
      if (filtros.orden_id) {
        if (produccion.orden_id !== parseInt(filtros.orden_id)) {
          return false;
        }
      }
      
      // Filtro por producto
      if (filtros.producto_nombre && produccion.producto_nombre !== filtros.producto_nombre) {
        return false;
      }
      
      // Filtro por estado de orden
      if (filtros.estado_orden && produccion.estado_orden !== filtros.estado_orden) {
        return false;
      }
      
      // Filtro por fecha desde
      if (filtros.desde) {
        const fechaProduccion = new Date(produccion.fecha_registro);
        const fechaDesde = new Date(filtros.desde);
        if (fechaProduccion < fechaDesde) {
          return false;
        }
      }
      
      // Filtro por fecha hasta
      if (filtros.hasta) {
        const fechaProduccion = new Date(produccion.fecha_registro);
        const fechaHasta = new Date(filtros.hasta);
        if (fechaProduccion > fechaHasta) {
          return false;
        }
      }
      
      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const matchCodigo = produccion.codigo_orden && produccion.codigo_orden.toLowerCase().includes(busqueda);
        const matchProducto = produccion.producto_nombre && produccion.producto_nombre.toLowerCase().includes(busqueda);
        const matchDescripcion = produccion.producto_descripcion && produccion.producto_descripcion.toLowerCase().includes(busqueda);
        
        if (!matchCodigo && !matchProducto && !matchDescripcion) {
          return false;
        }
      }
      
      return true;
    });
  }, [producciones, filtros]);

  // Chips activos para mostrar filtros aplicados
  const activeChips = useMemo(() => {
    const chips = [];
    
    if (filtros.orden_id) {
      const orden = producciones?.find(p => p.orden_id === parseInt(filtros.orden_id));
      chips.push({
        key: 'orden_id',
        label: 'Orden',
        value: orden?.codigo_orden || `ID: ${filtros.orden_id}`
      });
    }
    
    if (filtros.producto_nombre) {
      chips.push({
        key: 'producto_nombre',
        label: 'Producto',
        value: filtros.producto_nombre
      });
    }
    
    if (filtros.estado_orden) {
      const estadoLabels = {
        'pendiente': 'Pendiente',
        'iniciado': 'En proceso',
        'finalizado': 'Finalizada'
      };
      chips.push({
        key: 'estado_orden',
        label: 'Estado',
        value: estadoLabels[filtros.estado_orden] || filtros.estado_orden
      });
    }
    
    if (filtros.desde) {
      chips.push({
        key: 'desde',
        label: 'Desde',
        value: new Date(filtros.desde).toLocaleDateString('es-PE')
      });
    }
    
    if (filtros.hasta) {
      chips.push({
        key: 'hasta',
        label: 'Hasta',
        value: new Date(filtros.hasta).toLocaleDateString('es-PE')
      });
    }
    
    if (filtros.busqueda) {
      chips.push({
        key: 'busqueda',
        label: 'Búsqueda',
        value: filtros.busqueda
      });
    }
    
    return chips;
  }, [filtros, producciones]);

  const handleEdit = (produccion) => {
    // Verificar si es una producción que no se puede editar
    if (produccion.estado_orden === 'finalizado') {
      toast.error('No se puede editar una producción de orden finalizada');
      return;
    }
    if (produccion.estado_orden === 'pendiente') {
      toast.error('No se puede editar una producción de orden pendiente');
      return;
    }

    setEditingProduccion(produccion);
    setModalVisible(true);
    // Inicializar el formulario después de que el modal se abra
    setTimeout(() => {
      form.setFieldsValue({
        cantidad_producida: produccion.cantidad_producida
      });
    }, 100);
  };

  const handleView = (produccion) => {
    setEditingProduccion({ ...produccion, view: true });
    setModalVisible(true);
  };

  const handleDelete = (produccion) => {
    // Verificar si es una producción que no se puede eliminar
    if (produccion.estado_orden === 'finalizado') {
      toast.error('No se puede eliminar una producción de orden finalizada');
      return;
    }
    if (produccion.estado_orden === 'pendiente') {
      toast.error('No se puede eliminar una producción de orden pendiente');
      return;
    }

    ConfirmationModal.confirm({
      title: 'Eliminar Producción',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-medium text-blue-800">Detalles de la producción:</p>
            <p className="text-sm text-blue-700">
              <strong>Orden:</strong> {produccion.codigo_orden}<br />
              <strong>Producto:</strong> {produccion.producto_nombre}<br />
              <strong>Cantidad:</strong> {produccion.cantidad_producida} {produccion.unidad_medida}<br />
              <strong>Stock actual:</strong> {produccion.stock_producto} {produccion.unidad_medida}
            </p>
          </div>
          <p className="text-gray-700">
            ¿Está seguro que desea eliminar este registro de producción?
          </p>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">⚠️ Importante:</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• El stock se revertirá automáticamente</li>
              <li>• Esta acción no se puede deshacer</li>
              <li>• Se eliminará el movimiento asociado</li>
            </ul>
          </div>
        </div>
      ),
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      async onOk() {
        try {
          await eliminarMutation.mutateAsync(produccion.id);
          toast.success('✅ Producción eliminada correctamente');
        } catch (error) {
          if (error.response?.status === 400) {
            const errorMessage = error.response.data.error;
            if (errorMessage.includes('No se puede eliminar')) {
              toast.error('No se puede eliminar esta producción');
            } else {
              toast.error(errorMessage || 'Error al eliminar producción');
            }
          } else {
            toast.error(error.message || 'Error al eliminar producción');
          }
        }
      }
    });
  };

  const handleModalOk = async (values) => {
    try {
      await editarMutation.mutateAsync({
        produccionId: editingProduccion.id,
        produccionData: { cantidad_producida: values.cantidad_producida }
      });
      toast.success('✅ Producción actualizada correctamente');
      handleModalCancel();
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('No se puede editar porque la orden ya está finalizada')) {
          toast.error('No se puede editar porque la orden ya está finalizada');
        } else if (errorMessage.includes('Stock insuficiente')) {
          toast.error('Stock insuficiente para realizar esta operación');
        } else {
          toast.error(errorMessage || 'Error al editar producción');
        }
      } else {
        toast.error(error.message || 'Error al editar producción');
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingProduccion(null);
    // Resetear el formulario después de que el modal se cierre
    setTimeout(() => {
      form.resetFields();
    }, 100);
  };

  const columns = [
    {
      key: 'fecha_registro',
      header: 'Fecha',
      render: (row) => row.fecha_registro ? new Date(row.fecha_registro).toLocaleString('es-PE') : '-'
    },
    {
      key: 'orden',
      header: 'Orden',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.codigo_orden}</div>
          <div className="text-xs text-gray-500">ID: {row.orden_id}</div>
        </div>
      )
    },
    {
      key: 'producto',
      header: 'Producto',
      render: (row) => (
        <div>
          <div className="font-medium">{row.producto_nombre}</div>
          <div className="text-xs text-gray-500">{row.producto_descripcion}</div>
        </div>
      )
    },
    {
      key: 'estado_orden',
      header: 'Estado Orden',
      render: (row) => {
        const getEstadoConfig = (estado) => {
          switch (estado) {
            case 'pendiente':
              return { color: 'gold', label: 'Pendiente' };
            case 'iniciado':
              return { color: 'blue', label: 'En proceso' };
            case 'finalizado':
              return { color: 'green', label: 'Finalizada' };
            default:
              return { color: 'default', label: estado };
          }
        };

        const config = getEstadoConfig(row.estado_orden);
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      key: 'cantidad_producida',
      header: 'Cantidad Producida',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-lg">{row.cantidad_producida}</div>
          <div className="text-xs text-gray-500">{row.unidad_medida}</div>
        </div>
      )
    },
    {
      key: 'stock_producto',
      header: 'Stock Actual',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-lg">{row.stock_producto}</div>
          <div className="text-xs text-gray-500">{row.unidad_medida}</div>
        </div>
      )
    }
  ];

  // Función para renderizar las acciones
  const renderActions = (row) => {
    const puedeEditar = row.estado_orden === 'iniciado';
    const puedeEliminar = row.estado_orden === 'iniciado';

    return (
      <div className="flex flex-wrap gap-2">
        {/* Botón Ver - siempre disponible */}
        <Button
          icon={<EyeOutlined />}
          type="default"
          onClick={() => handleView(row)}
        >
          Ver
        </Button>

        {/* Botón Editar - solo si la orden está iniciada */}
        {puedeEditar && (
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(row)}
          >
            Editar
          </Button>
        )}

        {/* Botón Eliminar - solo si la orden está iniciada */}
        {puedeEliminar && (
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() => handleDelete(row)}
          >
            Eliminar
          </Button>
        )}

        {/* Indicador para órdenes finalizadas */}
        {row.estado_orden === 'finalizado' && (
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Orden finalizada
          </span>
        )}

        {/* Indicador para órdenes pendientes */}
        {row.estado_orden === 'pendiente' && (
          <span className="text-xs text-yellow-600 px-2 py-1 bg-yellow-100 rounded">
            Orden pendiente
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Producciones Realizadas</h1>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Producciones</h3>
        
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Producciones */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Producciones</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalProducciones}</p>
                <p className="text-xs text-gray-500">registros totales</p>
              </div>
              <div className="text-blue-500">
                <ChartBarIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Este Mes */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.produccionesDelMes}</p>
                <p className="text-xs text-gray-500">producciones recientes</p>
              </div>
              <div className="text-green-500">
                <CalendarIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Cantidad Total */}
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cantidad Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.cantidadTotalProducida}</p>
                <p className="text-xs text-gray-500">unidades producidas</p>
              </div>
              <div className="text-orange-500">
                <CubeIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Productos Activos */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.productosActivos}</p>
                <p className="text-xs text-gray-500">disponibles para producción</p>
              </div>
              <div className="text-purple-500">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Órdenes Iniciadas */}
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.ordenesIniciadas}</p>
                <p className="text-xs text-gray-500">órdenes iniciadas</p>
              </div>
              <div className="text-indigo-500">
                <CogIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Órdenes Finalizadas */}
          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.ordenesFinalizadas}</p>
                <p className="text-xs text-gray-500">órdenes completadas</p>
              </div>
              <div className="text-emerald-500">
                <HandRaisedIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {estadisticas.produccionesDelMes === 0 && (
          <div className="mt-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    No hay producciones este mes
                  </p>
                  <p className="text-xs text-yellow-700">
                    Considera iniciar nuevas órdenes de producción
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {estadisticas.cantidadTotalProducida > 0 && (
          <div className="mt-2">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Producción activa
                  </p>
                  <p className="text-xs text-green-700">
                    {estadisticas.cantidadTotalProducida} unidades producidas en total
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm flex-wrap gap-2">
        <div className="flex gap-2">
          <Select
            placeholder="Orden"
            style={{ width: 200 }}
            allowClear
            value={filtros.orden_id}
            onChange={(value) => setFiltros(f => ({ ...f, orden_id: value }))}
          >
            {[...new Set(producciones?.map(p => p.codigo_orden))].map(codigo => {
              const orden = producciones.find(p => p.codigo_orden === codigo);
              return (
                <Select.Option key={orden?.orden_id} value={orden?.orden_id}>
                  {codigo}
                </Select.Option>
              );
            })}
          </Select>
          <Select
            placeholder="Producto"
            style={{ width: 200 }}
            allowClear
            value={filtros.producto_nombre}
            onChange={(value) => setFiltros(f => ({ ...f, producto_nombre: value }))}
          >
            {[...new Set(producciones?.map(p => p.producto_nombre))].map(nombre => (
              <Select.Option key={nombre} value={nombre}>
                {nombre}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Estado"
            style={{ width: 150 }}
            allowClear
            value={filtros.estado_orden}
            onChange={(value) => setFiltros(f => ({ ...f, estado_orden: value }))}
          >
            <Select.Option value="pendiente">Pendiente</Select.Option>
            <Select.Option value="iniciado">En proceso</Select.Option>
            <Select.Option value="finalizado">Finalizada</Select.Option>
          </Select>
          <DatePicker
            placeholder="Desde"
            value={filtros.desde ? dayjs(filtros.desde) : null}
            onChange={(date) => setFiltros(f => ({ ...f, desde: date?.toISOString() }))}
          />
          <DatePicker
            placeholder="Hasta"
            value={filtros.hasta ? dayjs(filtros.hasta) : null}
            onChange={(date) => setFiltros(f => ({ ...f, hasta: date?.toISOString() }))}
          />
          <Input.Search
            placeholder="Buscar orden, producto o descripción"
            style={{ width: 300 }}
            value={filtros.busqueda}
            onChange={(e) => setFiltros(f => ({ ...f, busqueda: e.target.value }))}
            allowClear
          />
        </div>
        <Button
          onClick={() => setFiltros({})}
          disabled={activeChips.length === 0}
        >
          Limpiar filtros
        </Button>
        {activeChips.map(chip => (
          <Tag
            key={chip.key}
            closable
            onClose={() => setFiltros(f => ({ ...f, [chip.key]: undefined }))}
            color="blue"
            style={{ marginLeft: 4 }}
          >
            {chip.label}: {chip.value}
          </Tag>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredData()}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />

      {/* Modal para editar/ver producción */}
      <Modal
        title={editingProduccion?.view ? 'Detalle de Producción' : 'Editar Producción'}
        open={modalVisible}
        onCancel={handleModalCancel}
        onOk={editingProduccion?.view ? undefined : () => form.submit()}
        confirmLoading={editarMutation.isPending}
        destroyOnHidden
        width={500}
        footer={editingProduccion?.view ? null : undefined}
      >
        {/* Información adicional para edición */}
        {editingProduccion && !editingProduccion.view && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Editando producción:</strong> {editingProduccion.codigo_orden}<br/>
              <strong>Producto:</strong> {editingProduccion.producto_nombre}<br/>
              <strong>Stock actual:</strong> {editingProduccion.stock_producto} {editingProduccion.unidad_medida}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ Al modificar la cantidad, el stock se recalculará automáticamente
            </p>
          </div>
        )}

        {editingProduccion?.view ? (
          <div className="space-y-3 text-sm text-gray-800">
            <div><strong>Orden:</strong> {editingProduccion.codigo_orden}</div>
            <div><strong>Producto:</strong> {editingProduccion.producto_nombre}</div>
            <div><strong>Descripción:</strong> {editingProduccion.producto_descripcion}</div>
            <div><strong>Estado:</strong> {editingProduccion.estado_orden}</div>
            <div><strong>Fecha:</strong> {editingProduccion.fecha_registro ? new Date(editingProduccion.fecha_registro).toLocaleString('es-PE') : '-'}</div>
            <div><strong>Cantidad producida:</strong> {editingProduccion.cantidad_producida} {editingProduccion.unidad_medida}</div>
            <div><strong>Stock actual:</strong> {editingProduccion.stock_producto} {editingProduccion.unidad_medida}</div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleModalOk}
            initialValues={{
              cantidad_producida: editingProduccion?.cantidad_producida
            }}
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
        )}
      </Modal>
    </div>
  );
} 