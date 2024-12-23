import React, { useState, useCallback, useMemo } from 'react';
import Loading from '../Loading';
import { CrearInventario, Post_Inventario } from '@/api_conexion/servicios/inventarios';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { ObtenerAgencia, Agencia } from '@/api_conexion/servicios/agencias';
import { ObtenerTipoInventario, TipoInventario } from '@/api_conexion/servicios/tipoInventario';
import { Marca, ObtenerMarca } from '@/api_conexion/servicios/marca';
import { ObtenerModelo, Modelo } from '@/api_conexion/servicios/modelo';
import { ObtenerEstado, Estado } from '@/api_conexion/servicios/estado';
import InputText from '../campos/InputForm';
import { IoArrowUndoOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../Pruebas/SearchableSelect';
import { validarCampos } from './validarcampos';
import { Alert } from '../alertService';

const CrearInventarios: React.FC = () => {

  // Obtener agencias y tipos de inventario
  const navigate = useNavigate();
  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const [{ data: tipoInventarioData, loading: loadingTipoInventario }] = ObtenerTipoInventario();
  const [{ data: marcaData }] = ObtenerMarca();
  const [{ data: modeloData }] = ObtenerModelo();
  const [{ data: estadoData }] = ObtenerEstado();

  const [formState, setFormState] = useState({
    codigo: '',
    serie: '',
    marca_id: 0,
    modelo_id: 0,
    tipo_inventario_id: 0,
    agencias_id_origen: 0,
    agencias_id_actual: 0,
    estado_id: 0,
    comentarios: '',
    fecha_creacion: '',
  });

  const marcasSelect = useMemo(() => {
    return marcaData?.map((marca: Marca) => ({
      id: marca.id,
      label: marca.nombre,
    })) || [];
  }, [marcaData]);

  const tipoinventarioSelect = useMemo(() => {
    return tipoInventarioData?.map((tipoinventario: TipoInventario) => ({
      id: tipoinventario.id,
      label: tipoinventario.nombre,
    })) || [];
  }, [tipoInventarioData]);

  const modeloSelect = useMemo(() => {
    return modeloData?.map((modelo: Modelo) => ({
      id: modelo.id,
      label: modelo.nombre,
    })) || [];
  }, [modeloData]);

  const agencias_id_origenSelect = useMemo(() => {
    return agenciaData?.map((origen: Agencia) => ({
      id: origen.id,
      label: origen.nombre,
    })) || [];
  }, [agenciaData]);

  const agencias_id_actualSelect = useMemo(() => {
    return agenciaData?.map((actual: Agencia) => ({
      id: actual.id,
      label: actual.nombre,
    })) || [];
  }, [agenciaData]);

  const estado_idSelect = useMemo(() => {
    return estadoData?.map((estado: Estado) => ({
      id: estado.id,
      label: estado.nombre,
    })) || [];
  }, [estadoData]);


  const handleSelectChange2 = (field: 'marca_id' | 'tipo_inventario_id' | 'modelo_id' | 'estado_id' | 'agencias_id_actual' | 'agencias_id_origen', option: { id: number; label: string } | null) => {
    if (option) {
      setFormState((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
    } else {
      setFormState((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
    }
  };

  const [status, setStatus] = useState({
    error: null as string | null,
    isLoading: false,
    successMessage: null as string | null,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { codigo, serie, marca_id, modelo_id, tipo_inventario_id,
      agencias_id_origen, agencias_id_actual, estado_id, comentarios, fecha_creacion } = formState;
      
      const nombresAvalidar = {
        codigo: "código",
        serie: "serie",
        marca_id: "marca",
        modelo_id: "modelo",
        tipo_inventario_id: "tipo de inventario",
        agencias_id_origen: "agencia de origen",
        agencias_id_actual: "agencia actual",
        estado_id: "estado",
        fecha_creacion: "fecha de creación",
      };
      
      const error = validarCampos(formState, nombresAvalidar);
      
      if (error) {
        setStatus({ ...status, error });
        return;
      }

    const nuevoInventario: Post_Inventario = {
      codigo,
      serie,
      tipo_inventario_id,
      marca_id,
      modelo_id,
      agencias_id_origen,
      agencias_id_actual,
      estado_id,
      comentarios,
      fecha_creacion: new Date(fecha_creacion).toISOString().split('T')[0],
    };


    try {
      setStatus({ ...status, isLoading: true });

      await CrearInventario(nuevoInventario);

      setStatus({ error: null, isLoading: false, successMessage: 'Inventario agregado correctamente.' });

      setFormState({
        codigo: '', serie: '', marca_id: 0, modelo_id: 0,
        tipo_inventario_id: 0, agencias_id_origen: 0,
        agencias_id_actual: 0, estado_id: 0, comentarios: '', fecha_creacion: ''
      });
      Alert(
        'Éxito',
        `Se creo el inventario con exito: ${nuevoInventario.codigo}`,
        'success',
        'Ok!',
        () => {navigate(-1)}
      );

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al agregar el inventario.'
        : 'Error al agregar el inventario.';
      setStatus({ ...status, error: errorMessage, isLoading: false });
    }
  };

  if (loadingAgencias || loadingTipoInventario || !marcaData || !modeloData || !estadoData) return <Loading />;

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
      >
        <IoArrowUndoOutline />
        Regresar
      </button>
      <div className=" mx-auto p-6 -mt-14">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Agregar Inventario</h2>

        {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
        {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Código de Inventario</label>
            <InputText
              type='text'
              name="codigo"
              value={formState.codigo}
              placeholder="Código de Inventario"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Número de Serie</label>
            <InputText
              type='text'
              name="serie"
              value={formState.serie}
              placeholder="Número de Serie"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona un Tipo de Inventario</label>
            <SearchableSelect
              options={tipoinventarioSelect}
              onSelect={(option) => handleSelectChange2('tipo_inventario_id', option)}
              selected={tipoinventarioSelect.find(tipoinventario => tipoinventario.id === formState.tipo_inventario_id) || null}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona una Marca</label>

            <SearchableSelect
              options={marcasSelect}
              onSelect={(option) => handleSelectChange2('marca_id', option)}
              selected={marcasSelect.find(marca => marca.id === formState.marca_id) || null}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona un Modelo</label>
            <SearchableSelect
              options={modeloSelect}
              onSelect={(option) => handleSelectChange2('modelo_id', option)}
              selected={modeloSelect.find(modelo => modelo.id === formState.modelo_id) || null}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona la Agencia de Origen</label>
            <SearchableSelect
              options={agencias_id_origenSelect}
              onSelect={(option) => handleSelectChange2('agencias_id_origen', option)}
              selected={agencias_id_origenSelect.find(origen => origen.id === formState.agencias_id_origen) || null}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona la Agencia Actual</label>
            <SearchableSelect
              options={agencias_id_actualSelect}
              onSelect={(option) => handleSelectChange2('agencias_id_actual', option)}
              selected={agencias_id_actualSelect.find(actual => actual.id === formState.agencias_id_actual) || null}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona un Estado</label>
            <SearchableSelect
              options={estado_idSelect}
              onSelect={(option) => handleSelectChange2('estado_id', option)}
              selected={estado_idSelect.find(estado => estado.id === formState.estado_id) || null}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Comentarios</label>
            <InputText
              type='text'
              name="comentarios"
              value={formState.comentarios}
              placeholder="Comentarios"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Fecha Instalacion</label>
            <InputText
              type='date'
              name="fecha_creacion"
              value={formState.fecha_creacion}
              placeholder="Fecha Creacion"
              onChange={handleChange}
            />
          </div>
          <div className="flex -ml-40 mr-40  items-center mt-28 col-span-2">
            <button
              className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
              disabled={status.isLoading}
            >
              {status.isLoading ?
                <FiLoader className="mr-2 animate-spin mx-20" /> : 'Agregar'
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CrearInventarios;
