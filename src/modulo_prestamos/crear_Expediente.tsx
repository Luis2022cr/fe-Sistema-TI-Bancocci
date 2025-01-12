import React, { useState, useCallback, useMemo } from 'react';
import Loading from "@/componentes/Loading";
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { ObtenerAgencia, Agencia } from '@/api_conexion/servicios/agencias';
import { IoArrowUndoOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/modulo_ti/alertService';
import InputText from '@/modulo_ti/campos/InputForm';
import { validarCampos } from '@/modulo_ti/inventarios/validarcampos';
import SearchableSelect from '@/modulo_ti/Pruebas/SearchableSelect';
import { EstadoPrestamos, ObtenerEstadoPrestamos } from '@/api_conexion/servicios/estadosPrestamos';
import { CrearExpediente, Post_Expediente } from '@/api_conexion/servicios/expedientes';


const VistaCrearExpediente: React.FC = () => {

  // Obtener agencias y tipos de estados
  const navigate = useNavigate();
  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const [{ data: estadoExpedienteData }] = ObtenerEstadoPrestamos();

  const [formState, setFormState] = useState({
    numero_cliente: '',
    nombre_cliente: '',
    estado_id: 0,
    agencia_id: 0,
    estante: '',
    columna: '',
    fila: '',
    comentarios: '',
    responsable: '',

  });

  const agencias_id_origenSelect = useMemo(() => {
    return agenciaData?.map((origen: Agencia) => ({
      id: origen.id,
      label: origen.nombre,
    })) || [];
  }, [agenciaData]);

  const estado_idSelect = useMemo(() => {
    return estadoExpedienteData?.map((estado: EstadoPrestamos) => ({
      id: estado.id,
      label: estado.nombre,
    })) || [];
  }, [estadoExpedienteData]);


  const handleSelectChange2 = (field:   'estado_id' |  'agencia_id', option: { id: number; label: string } | null) => {
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      // Reseteamos el error antes de aplicar nuevas validaciones
      setStatus((prev) => ({ ...prev, error: null }));
  
       // Verificamos si el valor ingresado es 0 para estante, columna, fila, y numero_cliente
    const camposAValidar = ["estante", "columna", "fila", "numero_cliente"];
    if (camposAValidar.includes(name) && value === '0') {
      setStatus((prev) => ({ ...prev, error: `${name.charAt(0).toUpperCase() + name.slice(1)} no puede ser 0` }));
      return; // No actualiza el valor si es 0
    }
      // Validar que 'columna' no sea mayor que 3
      if (name === "columna" && parseInt(value) > 3) {
        setStatus((prev) => ({ ...prev, error: "La columna no puede ser mayor a 3" }));
        return; // No actualiza el valor si es mayor a 3
      }
  
      // Validar que 'fila' no sea mayor que 6
      if (name === "fila" && parseInt(value) > 6) {
        setStatus((prev) => ({ ...prev, error: "La fila no puede ser mayor a 6" }));
        return; // No actualiza el valor si es mayor a 6
      }
  
      // Si todo es válido, actualizamos el estado
      setFormState((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      numero_cliente, nombre_cliente, estado_id,
      agencia_id, estante , columna , fila ,
      comentarios, responsable
    } = formState;

     
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

    const nuevoExpediente: Post_Expediente = {
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
      setStatus({ ...status, isLoading: true });
      
      
      await CrearExpediente(nuevoExpediente);

      setStatus({ error: null, isLoading: false, successMessage: 'Expediente agregado correctamente.' });

      setFormState({
        numero_cliente: '',
        nombre_cliente: '',
        estado_id: 0,
        agencia_id: 0,
        estante: '', 
        columna: '',
        fila: '',
        comentarios: '',
        responsable: '',
      });
      Alert(
        'Éxito',
        `Se creo el expediente con exito: ${nuevoExpediente.numero_cliente}`,
        'success',
        'Ok!',
        () => {navigate(-1)}
      );

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al agregar el expediente.'
        : 'Error al agregar el expediente.';
      setStatus({ ...status, error: errorMessage, isLoading: false });
    }
  };

  if (loadingAgencias || !estadoExpedienteData) return <Loading />;

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
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Agregar Expediente</h2>

        {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
        {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">

            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Número Cliente</label>
            <InputText
              type='text'
              name="numero_cliente"
              value={formState.numero_cliente}
              placeholder="Número Cliente"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Nombre Cliente</label>
            <InputText
              type='text'
              name="nombre_cliente"
              value={formState.nombre_cliente}
              placeholder="Nombre Cliente"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Selecciona la Agencia</label>
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

          <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Estante</label>
          <InputText
            type='number'
            name="estante"
            value={formState.estante}
            placeholder="Estante"
            onChange={handleChange}
          />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Columna</label>
            <InputText
              type='number'
              name="columna"
              value={formState.columna}
              placeholder="Columna"
              onChange={handleChange}
            />
            {status.error && status.error.includes("columna") && (
              <p className="text-red-500 text-xs">{status.error}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Fila</label>
            <InputText
              type='number'
              name="fila"
              value={formState.fila}
              placeholder="Fila"
              onChange={handleChange}
            />
            {status.error && status.error.includes("fila") && (
              <p className="text-red-500 text-xs">{status.error}</p>
            )}
          </div>

          <div className="col-span-1">

          <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Responsable</label>
          <InputText
            type='text'
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
          
          <div className="flex ml-56 mr-40 w-96 items-center mt-28 col-span-2">
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

export default VistaCrearExpediente;
