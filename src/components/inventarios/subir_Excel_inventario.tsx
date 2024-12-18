import React, { useState } from 'react';
import axiosInstance from '@/api_conexion/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert';

const ExcelInventario: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

       await axiosInstance.post('/importar-inventario', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert({
        title: 'Éxito',
        text: `Se subio el inventario con exito`,
        icon: 'success',
        callback: () => navigate(-1)
    });
    } catch (error) {
        const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Error al agregar el inventario.'
        : 'Error al agregar el inventario.';
      setMessage('Hubo un error al procesar tu solicitud;' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 text-center">
          Subir Archivo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label
              htmlFor="file"
              className="cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              {file ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
            </label>
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-800 hover:bg-orange-700'
            }`}
          >
            {loading ? 'Subiendo...' : 'Subir Archivo'}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes('éxito')
                ? 'text-green-800'
                : 'text-orange-800'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExcelInventario;
