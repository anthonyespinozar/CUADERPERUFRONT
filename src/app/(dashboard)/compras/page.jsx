'use client';

import { useState, useEffect } from 'react';
import { makeGetRequest, makePostRequest } from '@/utils/api';
import { toast } from 'sonner';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [formData, setFormData] = useState({
    proveedor_id: '',
    fecha_compra: '',
    estado: 'pendiente',
    detalles: [],
  });

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const data = await makeGetRequest('/compras');
      setCompras(data);
    } catch (error) {
      toast.error('Error al cargar las compras');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProveedores = async () => {
    try {
      const data = await makeGetRequest('/proveedores');
      setProveedores(data);
    } catch (error) {
      toast.error('Error al cargar los proveedores');
      console.error(error);
    }
  };

  const fetchMateriales = async () => {
    try {
      const data = await makeGetRequest('/materiales');
      setMateriales(data);
    } catch (error) {
      toast.error('Error al cargar los materiales');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchMateriales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCompra) {
        await makePostRequest(`/compras/${selectedCompra.id}`, formData);
        toast.success('Compra actualizada correctamente');
      } else {
        await makePostRequest('/compras', formData);
        toast.success('Compra creada correctamente');
      }
      setShowModal(false);
      fetchCompras();
    } catch (error) {
      toast.error('Error al guardar la compra');
      console.error(error);
    }
  };

  const handleEdit = (compra) => {
    setSelectedCompra(compra);
    setFormData({
      proveedor_id: compra.proveedor_id,
      fecha_compra: compra.fecha_compra,
      estado: compra.estado,
      detalles: compra.detalles,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta compra?')) {
      try {
        await makePostRequest(`/compras/${id}/delete`);
        toast.success('Compra eliminada correctamente');
        fetchCompras();
      } catch (error) {
        toast.error('Error al eliminar la compra');
        console.error(error);
      }
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await makePostRequest(`/compras/${id}/estado`, { estado: nuevoEstado });
      toast.success('Estado actualizado correctamente');
      fetchCompras();
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  };

  const addDetalle = () => {
    setFormData({
      ...formData,
      detalles: [
        ...formData.detalles,
        { material_id: '', cantidad: 0, precio_unitario: 0 },
      ],
    });
  };

  const removeDetalle = (index) => {
    const newDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: newDetalles });
  };

  const updateDetalle = (index, field, value) => {
    const newDetalles = [...formData.detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    setFormData({ ...formData, detalles: newDetalles });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Compras</h1>
        <button
          onClick={() => {
            setSelectedCompra(null);
            setFormData({
              proveedor_id: '',
              fecha_compra: '',
              estado: 'pendiente',
              detalles: [],
            });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Compra
        </button>
      </div>

      {/* Tabla de compras */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <ArrowPathIcon className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                compras.map((compra) => (
                  <tr key={compra.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proveedores.find((p) => p.id === compra.proveedor_id)?.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(compra.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          compra.estado === 'recibido'
                            ? 'bg-green-100 text-green-800'
                            : compra.estado === 'en_camino'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {compra.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      S/. {compra.detalles.reduce((acc, det) => acc + det.cantidad * det.precio_unitario, 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(compra)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(compra.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {compra.estado === 'pendiente' && (
                        <button
                          onClick={() => handleEstadoChange(compra.id, 'en_camino')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {compra.estado === 'en_camino' && (
                        <button
                          onClick={() => handleEstadoChange(compra.id, 'recibido')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedCompra ? 'Editar Compra' : 'Nueva Compra'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                <select
                  value={formData.proveedor_id}
                  onChange={(e) => setFormData({ ...formData, proveedor_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Compra</label>
                <input
                  type="date"
                  value={formData.fecha_compra}
                  onChange={(e) => setFormData({ ...formData, fecha_compra: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Detalles de la compra */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Detalles de la Compra</label>
                  <button
                    type="button"
                    onClick={addDetalle}
                    className="text-sm text-blue-600 hover:text-blue-900"
                  >
                    Agregar Material
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.detalles.map((detalle, index) => (
                    <div key={index} className="flex items-end space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Material</label>
                        <select
                          value={detalle.material_id}
                          onChange={(e) => updateDetalle(index, 'material_id', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccione un material</option>
                          {materiales.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                          type="number"
                          value={detalle.cantidad}
                          onChange={(e) => updateDetalle(index, 'cantidad', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700">Precio Unit.</label>
                        <input
                          type="number"
                          step="0.01"
                          value={detalle.precio_unitario}
                          onChange={(e) => updateDetalle(index, 'precio_unitario', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDetalle(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {selectedCompra ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 