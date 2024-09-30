import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { Agencia, ObtenerAgencia } from '@/api conexion/servicios/agencias';
import { Departamento, ObtenerDepartamento } from '@/api conexion/servicios/departamentos';
import { CrearDirectorios, Post_Directorio } from '@/api conexion/servicios/directorio';
import Select from 'react-select';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';

// Definir tipos para las opciones
interface SelectOption {
    value: number;
    label: string;
}

const CrearDirectorio: React.FC = () => {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: departamentoData, loading: loadingDepartamentos }] = ObtenerDepartamento();

    const [agencias, setAgencias] = useState<SelectOption[]>([]);
    const [departamentos, setDepartamentos] = useState<SelectOption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // Estados para los campos del formulario
    const [extension, setExtension] = useState('');
    const [departamento_id, setDepartamento] = useState<SelectOption | null>(null);
    const [agencia_id, setAgencia] = useState<SelectOption | null>(null);
    const [empleado, setEmpleado] = useState('');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (agenciaData && !loadingAgencias) {
            setAgencias(
                agenciaData.map((agencia: Agencia) => ({
                    value: agencia.id,
                    label: agencia.nombre,
                }))
            );
        }
        if (departamentoData && !loadingDepartamentos) {
            setDepartamentos(
                departamentoData.map((departamento: Departamento) => ({
                    value: departamento.id,
                    label: departamento.nombre,
                }))
            );
        }

    }, [agenciaData, loadingAgencias, departamentoData, loadingDepartamentos]);

    //Logica crear el directorio
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!extension || !departamento_id || !agencia_id) {
            setError("Por favor, rellena todos los campos.");
            return;
        }

        // Crear el payload
        const nuevoDirectorio: Post_Directorio = {
            extension: parseInt(extension, 10),
            departamento_id: departamento_id.value,
            agencias_id: agencia_id.value,
            empleado,
        };

        try {
            setIsLoading(true);

            await CrearDirectorios(nuevoDirectorio);
            setSuccessMessage("Directorio agregado correctamente.");
            setError(null);
            // Limpiar formulario
            setExtension('');
            setDepartamento(null);
            setAgencia(null);
            setEmpleado('');
        } catch (error) {
            
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error
                setError(respuestaError || "Error al agregar el directorio.");
            } else {
                setError("Error al agregar el directorio.");
            }
        } finally {
            setIsLoading(false);
          } 
    };

    if (loadingAgencias || loadingDepartamentos) return <Loading />;

    return (
        <div className="max-w-md mx-auto p-8 -mt-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Agregar Directorio</h2>
            {successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}
            {error && (
                <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-gray-700 hidden">Número Extensión</label>

                    <input
                        type="text"
                        value={extension}
                        onChange={(e) => setExtension(e.target.value)}
                        className="w-full px-3 py-2 border rounded-full bg-gray-200"
                        placeholder="Número Extensión"
                    />
                </div>

                <div className="mb-4">
                    <label className="hidden text-gray-700">Usuario</label>
                    <input
                        type="text"
                        value={empleado}
                        onChange={(e) => setEmpleado(e.target.value)}
                        className="w-full px-3 py-2 border rounded-full bg-gray-200"
                        placeholder="Usuario"
                    />
                </div>
                <div className="mb-4">
                    <label className="hidden text-gray-700">Departamento</label>
                    <Select
                        value={departamento_id}
                        onChange={setDepartamento}
                        options={departamentos}
                        placeholder="Selecciona un Departamento"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="mb-4">
                    <Select
                        value={agencia_id}
                        onChange={setAgencia}
                        options={agencias}
                        placeholder="Selecciona una Agencia"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="flex justify-center items-center mt-11">
                    <button
                        className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FiLoader className="mr-2 animate-spin mx-20" />
                        ) : (
                            "Agregar"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearDirectorio;
