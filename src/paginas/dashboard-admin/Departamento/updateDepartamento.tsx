import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  ObtenerDepartamentoById, Post_Departamento, UpdateDepartamento } from '@/api_conexion/servicios/departamentos';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import Alert from '@/components/Alert';
import InputText from '@/components/campos/InputForm';
import Loading from '@/components/Loading';
import BotonRegresar from '@/components/Regresar';

const UpdateDepartamentos: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    // Obtener los datos de la API
    const [{ data: departamento, loading, error }] = ObtenerDepartamentoById(numericId!);
   
    const [formData, setFormData] = useState<Post_Departamento>({
       nombre: '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {
        if (departamento) {
            setFormData({
                nombre: departamento.nombre
            });
        }
    }, [departamento]);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const manejoDeEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            setIsLoading(true);

            await UpdateDepartamento(numericId!, formData);
            Alert({
                title: 'Éxito',
                text: `Se actualizó el departamento: '${formData.nombre}'`,
                icon: 'success',
                callback: () => navigate(-1)
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error;
                setErrorMessage(respuestaError || "Error al actualizar el directorio.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (loading ) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!departamento) return <div>No se encontraron datos del departamento</div>;


    return (
        <>
            <BotonRegresar />
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Departamento</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                   
                 <label htmlFor="Departamento" className='ml-3'>Nombre Departamento</label>

                    <InputText
                        type='text'
                        name="nombre"
                        value={formData.nombre}
                        placeholder="Departamento"
                        onChange={manejarCambio}
                    />

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

export default UpdateDepartamentos;
