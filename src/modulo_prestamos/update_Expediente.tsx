import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Loading from "@/componentes/Loading";
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { ObtenerAgencia, Agencia } from '@/api_conexion/servicios/agencias';
import { IoArrowUndoOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@/modulo_ti/alertService';
import InputText from '@/modulo_ti/campos/InputForm';
import { validarCampos } from '@/modulo_ti/inventarios/validarcampos';
import SearchableSelect from '@/modulo_ti/Pruebas/SearchableSelect';
import { Actualizar_Expediente, ObtenerExpedienteById, UpdateExpediente } from '@/api_conexion/servicios/expedientes';
import { EstadoPrestamos, ObtenerEstadoPrestamos } from '@/api_conexion/servicios/estadosPrestamos';


const EditarExpediente: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const numericId = id ? parseInt(id, 10) : undefined;
  //const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [{ data: expediente, loading: loadingExpediente }] = ObtenerExpedienteById(numericId!);
  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const [{ data: estadoData }] = ObtenerEstadoPrestamos();

  const [formState, setFormState] = useState({
  numero_cliente: '',
  nombre_cliente: '',
  estado_id: 0,
  agencia_id: 0,
  estante: 0,
  columna: 0,
  fila: 0,
  comentarios: '',
  responsable: '',
  });
 

  const [status, setStatus] = useState({
    error: null as string | null,
    isLoading: false,
    successMessage: null as string | null,
  });

  useEffect(() => {
    if (expediente) {
      setFormState({
        numero_cliente: expediente.numero_cliente,
        nombre_cliente: expediente.nombre_cliente,
        estado_id: expediente.estado_id,
        agencia_id: expediente.agencia_id,
        estante: expediente.estante,
        columna: expediente.columna,
        fila: expediente.fila,
        comentarios: expediente.comentarios || '',
        responsable: expediente.responsable 
      });
    }
  }, [expediente]);

   const agencias_id_origenSelect = useMemo(() => {
      return agenciaData?.map((origen: Agencia) => ({
        id: origen.id,
        label: origen.nombre,
      })) || [];
    }, [agenciaData]);
  

  const estado_idSelect = useMemo(() => {
    return estadoData?.map((estado: EstadoPrestamos) => ({
      id: estado.id,
      label: estado.nombre,
    })) || [];
  }, [estadoData]);

  const handleSelectChange2 = (field: 'estado_id' | 'agencia_id' , option: { id: number; label: string } | null) => {
    if (option) {
      setFormState((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
    } else {
      setFormState((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {numero_cliente, nombre_cliente, estado_id,
      agencia_id, estante , columna , fila ,
      comentarios, responsable } = formState;

    const nombresAvalidar = {
      numero_cliente: "número cliente",
        nombre_cliente: "nombre cliente",
        estado_id: "estado",
        agencia_id: "agencia",
        estante: "estante",
        columna: "columna",
        fila: "fila",
        responsable: "responsable",
    };

    const error = validarCampos(formState, nombresAvalidar);

    if (error) {
      setStatus({ ...status, error });
      return;
    }

    //const usuarioId = authContext?.usuario ? Number(authContext.usuario) : 0;

    const expedienteActualizado: Actualizar_Expediente = {
      numero_cliente,
      nombre_cliente,
      estado_id,
      agencia_id,
      estante,
      columna,
      fila,
      comentarios,
      responsable,
    };

    try {
      setStatus((prevStatus) => ({ ...prevStatus, isLoading: true }));

      await UpdateExpediente(Number(id), expedienteActualizado);

      setStatus({ error: null, isLoading: false, successMessage: 'Expediente actualizado correctamente.' });
      Alert(
        'Éxito',
        `Se actualizó el expediente con éxito: ${expedienteActualizado.numero_cliente}`,
        'success',
        'Ok!',
        () => { navigate(-1) }
      );

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al actualizar el expediente.'
        : 'Error al actualizar el expediente.';
      setStatus((prevStatus) => ({ ...prevStatus, error: errorMessage, isLoading: false }));
    }
  };


  if (loadingExpediente || loadingAgencias ||!estadoData || status.isLoading) return <Loading />;

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
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Editar Expediente</h2>

        {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
        {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Número Cliente</label>
            <InputText
              type='text'
              name="nombre_cliente"
              value={formState.numero_cliente}
              placeholder="Número de Cliente"
              onChange={handleChange}
              
            />
             
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Nombre Cliente</label>
            <InputText
              type='text'
              name="nombre_cliente"
              value={formState.nombre_cliente}
              placeholder="Nombre de Cliente"
              onChange={handleChange}
              
            />
          </div>
         
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona la Agencia de Origen</label>
            <SearchableSelect
              options={agencias_id_origenSelect}
              onSelect={(option) => handleSelectChange2('agencia_id', option)}
              selected={agencias_id_origenSelect.find(origen => origen.id === formState.agencia_id) || null}
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="fecha_creacion">Estante</label>
            <InputText
              type="number"
              name="estante"
              value={formState.estante}
              placeholder="Estante"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fecha_creacion">Columna</label>
            <InputText
              type="number"
              name="columna"
              value={formState.columna}
              placeholder="Columna"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fecha_creacion">Fila</label>
            <InputText
              type="number"
              name="fila"
              value={formState.fila}
              placeholder="Fila"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fecha_creacion">Responsable</label>
            <InputText
              type="text"
              name="responsable"
              value={formState.responsable}
              placeholder="Responsable"
              onChange={handleChange}
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
        

          <div className="flex ml-56 mr-40  items-center mt-28 col-span-2">
            <button
              className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
              disabled={status.isLoading}
            >
              {status.isLoading ?
                <FiLoader className="mr-2 animate-spin mx-20" /> : 'Actualizar'
              }
              
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarExpediente;
