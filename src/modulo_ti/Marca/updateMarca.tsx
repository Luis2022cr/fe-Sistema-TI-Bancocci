import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/modulo_ti/campos/InputForm';
import Loading from '@/modulo_ti/Loading';
import BotonRegresar from '@/modulo_ti/Regresar';
import { ActualizarMarca, ObtenerMarcaById, Post_Marca } from '@/api_conexion/servicios/marca';
import { Alert } from '@/modulo_ti/alertService';


const UpdateMarca: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    // Obtener los datos de la API
    const [{ data: marca, loading, error }] = ObtenerMarcaById(numericId!);
   

    const [formData, setFormData] = useState<Post_Marca>({
       nombre: '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {
        if (marca) {
            setFormData({
                nombre: marca.nombre
            });
        }
    }, [marca]);

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

            await ActualizarMarca(numericId!, formData);
            Alert(
                'Éxito',
                `Se actualizó la marca: '${formData.nombre}'`,
                'success',
                'Ok!',
                () => {navigate(-1)}
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error;
                setErrorMessage(respuestaError || "Error al actualizar la marca.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (loading ) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!marca) return <div>No se encontraron datos de la marca</div>;


    return (
        <>
            <BotonRegresar />
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Marca</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                   
                 <label htmlFor="Marca" className='ml-3'>Nombre Marca</label>

                    <InputText
                        type='text'
                        name="nombre"
                        value={formData.nombre}
                        placeholder="Nombre Marca"
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

export default UpdateMarca;
