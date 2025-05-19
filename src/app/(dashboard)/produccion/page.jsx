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

export default function Produccion() {
  const [ordenes, setOrdenes] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    tipo_cuaderno: '',
    cantidad_producir: 0,
    fecha_programada: '',
    cliente_id: '',
    materiales: [],
  });

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const data = await makeGetRequest('/ordenes-produccion');
      setOrdenes(data);
    } catch (error) {
      toast.error('Error al cargar las órdenes de producción');
      console.error(error);
    } finally {
      setLoading(false);
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
    fetchOrdenes();
    fetchMateriales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedOrden) {
        await makePostRequest(`/ordenes-produccion/${selectedOrden.id}`, formData);
        toast.success('Orden actualizada correctamente');
      } else {
        await makePostRequest('/ordenes-produccion', formData);
        toast.success('Orden creada correctamente');
      }
      setShowModal(false);
      fetchOrdenes();
    } catch (error) {
      toast.error('Error al guardar la orden');
      console.error(error);
    }
  };

  const handleEdit = (orden) => {
    setSelectedOrden(orden);
    setFormData({
      codigo: orden.codigo,
      tipo_cuaderno: orden.tipo_cuaderno,
      cantidad_producir: orden.cantidad_producir,
      fecha_programada: orden.fecha_programada,
      cliente_id: orden.cliente_id,
      materiales: orden.materiales,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta orden?')) {
      try {
        await makePostRequest(`/ordenes-produccion/${id}/delete`);
        toast.success('Orden eliminada correctamente');
        fetchOrdenes();
      } catch (error) {
        toast.error('Error al eliminar la orden');
        console.error(error);
      }
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await makePostRequest(`/ordenes-produccion/${id}/estado`, { estado: nuevoEstado });
      toast.success('Estado actualizado correctamente');
      fetchOrdenes();
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Producción</h1>
        <button
          onClick={() => {
            setSelectedOrden(null);
            setFormData({
              codigo: '',
              tipo_cuaderno: '',
              cantidad_producir: 0,
              fecha_programada: '',
              cliente_id: '',
              materiales: [],
            });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Orden
        </button>
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Programada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <ArrowPathIcon className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {orden.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {orden.tipo_cuaderno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {orden.cantidad_producir}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(orden.fecha_programada).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          orden.estado === 'completado'
                            ? 'bg-green-100 text-green-800'
                            : orden.estado === 'en_proceso'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(orden)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(orden.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {orden.estado === 'pendiente' && (
                        <button
                          onClick={() => handleEstadoChange(orden.id, 'en_proceso')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {orden.estado === 'en_proceso' && (
                        <button
                          onClick={() => handleEstadoChange(orden.id, 'completado')}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedOrden ? 'Editar Orden' : 'Nueva Orden'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Cuaderno</label>
                <select
                  value={formData.tipo_cuaderno}
                  onChange={(e) => setFormData({ ...formData, tipo_cuaderno: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="A4">Cuaderno A4</option>
                  <option value="A5">Cuaderno A5</option>
                  <option value="Oficio">Cuaderno Oficio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad a Producir</label>
                <input
                  type="number"
                  value={formData.cantidad_producir}
                  onChange={(e) => setFormData({ ...formData, cantidad_producir: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Programada</label>
                <input
                  type="date"
                  value={formData.fecha_programada}
                  onChange={(e) => setFormData({ ...formData, fecha_programada: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Materiales Necesarios</label>
                <div className="mt-2 space-y-2">
                  {materiales.map((material) => (
                    <div key={material.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`material-${material.id}`}
                        checked={formData.materiales.some((m) => m.id === material.id)}
                        onChange={(e) => {
                          const newMateriales = e.target.checked
                            ? [...formData.materiales, material]
                            : formData.materiales.filter((m) => m.id !== material.id);
                          setFormData({ ...formData, materiales: newMateriales });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`material-${material.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        {material.nombre}
                      </label>
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
                  {selectedOrden ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 