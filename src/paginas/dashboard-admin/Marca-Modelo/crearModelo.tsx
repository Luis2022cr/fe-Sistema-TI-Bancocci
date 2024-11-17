import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/components/campos/InputForm';
import {  ObtenerMarca } from '@/api_conexion/servicios/marca';
import Loading from '@/components/Loading';
import { CrearModelos, Post_Modelo } from '@/api_conexion/servicios/modelo';
import Select from 'react-select';

interface SelectOption {
  value: number;
  label: string;
}

interface Marca {
  id: number;
  nombre: string;
}

const CrearModelo: React.FC = () => {
  const [formState, setFormState] = useState({
    nombre: '',
    marca_id: 0, 
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marca_id, setMarcaId] = useState<SelectOption | null>(null); 
  const [marca, setMarcas] = useState<SelectOption[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [status, setStatus] = useState({
    error: null as string | null,
    isLoading: false,
    successMessage: null as string | null,
  });

  // Obtener las marcas al montar el componente
  useEffect(() => {
    const obtenerMarca = async () => {
      try {
        const response = await ObtenerMarca(); // Suponiendo que es un array de marcas
        setMarcas(
          response.map((marca: Marca) => ({
            value: marca.id,
            label: marca.nombre,
          }))
        );
      } catch (error) {
        setError('Error al cargar las marcas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerMarca();
  }, []);

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
      setMarcaId(null); // Reset select value
      window.location.reload();
      
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al agregar el Modelo.'
        : 'Error al agregar el Modelo';
      setStatus({ ...status, error: errorMessage, isLoading: false });
    }
  };

  if (loading) {
    return <Loading />;
  }

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
          <Select
            value={marca_id}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setMarcaId(selectedOption);
                setFormState((prev) => ({
                  ...prev,
                  marca_id: selectedOption.value,
                }));
              }
            }}
            options={marca}
            placeholder="Selecciona una marca"
            classNamePrefix="react-select"
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
