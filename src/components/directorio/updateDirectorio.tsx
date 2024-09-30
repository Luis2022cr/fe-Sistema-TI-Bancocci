import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { ObtenerDirectoriosById, Post_Directorio } from '@/api conexion/servicios/directorio';
import { useParams, useNavigate } from 'react-router-dom';
import { ObtenerAgencia } from '@/api conexion/servicios/agencias';
import { ObtenerDepartamento } from '@/api conexion/servicios/departamentos';
import { UpdateDirectorios } from '@/api conexion/servicios/directorio'; 
import axios from 'axios';
import { IoArrowUndoOutline } from "react-icons/io5";
import { FiLoader } from 'react-icons/fi';
import Alert from '../Alert';

const UpdateDirectorio: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate(); // Initialize useNavigate
    
    // Obtener los datos de la API usando useAxios
    const [{ data: directorio, loading, error }] = ObtenerDirectoriosById(numericId!);
    const [{ data: agenciaData, loading: loadingAgencias}] = ObtenerAgencia();
    const [{ data: departamentoData, loading: loadingDepartamentos }] = ObtenerDepartamento();
    
    // State for form inputs
    const [formData, setFormData] = useState<Post_Directorio>({
        extension: 0,
        departamento_id: 0,
        agencias_id: 0,
        empleado: '',
    });

    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (directorio) {
            setFormData({
                extension: directorio.extension,
                departamento_id: directorio.departamento_id,
                agencias_id: directorio.agenciaId,
                empleado: directorio.empleado,
            });
        }
    }, [directorio]);

    // traer datos de los input(yaque se actualiza, hay datos ya creados y esos los trae por defecto si es que no que cambiaron)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Enviar datos al Endpoint
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMessage(null);
        try {
            setIsLoading(true);

            await UpdateDirectorios(numericId!, formData);
            Alert({
                title: 'Éxito',
                text: `Se actualizo el directorio ${formData.extension}`,
                icon: 'success',
                callback: () => navigate(-1)
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error
                setErrorMessage(respuestaError || "Error al agregar el directorio.");
            }
        }
        finally {
            setIsLoading(false);
          } 
    };
    
    // Verificar si se está cargando
    if (loading || loadingAgencias || loadingDepartamentos) return <Loading />;
    // Manejar error
    if (error) return <div>Error: {error.message}</div>;
    // Verificar si hay datos
    if (!directorio || !agenciaData || !departamentoData) return <div>No se encontraron datos del directorio</div>;
    
    return (
        <>
            <button
                onClick={() => navigate(-1)} // Go back to the previous page
                className="mb-4 ml-2 text-blue-500 hover:underline mt-6 flex items-center text-xl"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
            <div className="max-w-md mx-auto p-8 -mt-14">

                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Directorio</h2>

                {/* Display success or error message */}
                {message && <div className="text-green-500 mb-4">{message}</div>}
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700">Número Extensión:</label>
                        <input
                            type="text"
                            name="extension"
                            value={formData.extension} // Use state value instead of defaultValue
                            onChange={handleChange} // Handle input change
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                            placeholder="Número Extensión"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Usuario:</label>
                        <input
                            type="text"
                            name="empleado"
                            value={formData.empleado} // Use state value
                            onChange={handleChange} // Handle input change
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                            placeholder="Usuario"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Departamento:</label>
                        <select
                            name="departamento_id" // Set the name for the select
                            value={formData.departamento_id} // Use state value
                            onChange={handleChange} // Handle input change
                            className="block w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Todas las departamentos</option>
                            {departamentoData.map((departamentos) => (
                                <option key={departamentos.id} value={departamentos.id}>
                                    {departamentos.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Agencia:</label>
                        <select
                            name="agencias_id" // Set the name for the select
                            value={formData.agencias_id} // Use state value
                            onChange={handleChange} // Handle input change
                            className="block w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Todas las Agencias</option>
                            {agenciaData.map((agencia) => (
                                <option key={agencia.id} value={agencia.id}>
                                    {agencia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                    <button
                        className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FiLoader className="mr-2 animate-spin mx-20" />
                        ) : (
                            "Actualizar"
                        )}
                    </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateDirectorio;
