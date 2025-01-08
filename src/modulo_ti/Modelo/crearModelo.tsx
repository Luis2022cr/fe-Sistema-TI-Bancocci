import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/modulo_ti/campos/InputForm';
import { CrearModelos, Post_Modelo } from '@/api_conexion/servicios/modelo';
import { Marca, ObtenerMarca } from '@/api_conexion/servicios/marca';
import SearchableSelect from '@/modulo_ti/Pruebas/SearchableSelect';


const CrearModelo: React.FC = () => {
  const [{ data: marcaData }] = ObtenerMarca();

  const [formState, setFormState] = useState({
    nombre: '',
    marca_id: 0, 
  });

  const marcasSelect = useMemo(() => {
    return marcaData?.map((marca: Marca) => ({
      id: marca.id,
      label: marca.nombre,
    })) || [];
  }, [marcaData]);
  
  const handleSelectChange2 = (field: 'marca_id', option: { id: number; label: string } | null) => {
    if (option) {
      setFormState((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
    } else {
      setFormState((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
    }
  };

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [status, setStatus] = useState({
    error: null as string | null,
    isLoading: false,
    successMessage: null as string | null,
  });

  // Obtener las marcas al montar el componente
  

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, marca_id } = formState;
    if (!nombre || !marca_id) {
      setStatus({ ...status, error: 'Por favor, rellena los campos.' });
      return;
    }

    const nuevoModelo: Post_Modelo = {
      nombre,
      marca_id,
    };

    try {
      setStatus({ ...status, isLoading: true });
      await CrearModelos(nuevoModelo);
      setSuccessMessage('Modelo agregado correctamente.');
      setError(null);
      setFormState({ nombre: '', marca_id: 0 });
      window.location.reload();
      
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al agregar el Modelo.'
        : 'Error al agregar el Modelo';
      setStatus({ ...status, error: errorMessage, isLoading: false });
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 -mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Modelo</h2>

      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {error && (
        <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre" className="ml-3">
          Nombre Modelo
        </label>
        <InputText
          type="text"
          name="nombre"
          value={formState.nombre}
          placeholder="Nombre Modelo"
          onChange={handleChange}
        />

        <label htmlFor="marca_id" className="ml-3 mt-4">
          Marca
        </label>
        <div className="mb-4">
          <label className="text-gray-700 hidden">Marca</label>
          <SearchableSelect
              options={marcasSelect}
              onSelect={(option) => handleSelectChange2('marca_id', option)}
              selected={marcasSelect.find(marca => marca.id === formState.marca_id) || null}
            />
        </div>

        <div className="flex justify-center items-center mt-11">
          <button
            className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
            disabled={status.isLoading}
          >
            {status.isLoading ? (
              <FiLoader className="mr-2 animate-spin mx-20" />
            ) : (
              'Agregar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearModelo;
