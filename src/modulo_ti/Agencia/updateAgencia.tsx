import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActualizarAgencias, ObtenerAgenciaById, UpdateAgencia } from '@/api_conexion/servicios/agencias';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/modulo_ti/campos/InputForm';
import Loading from "@/componentes/Loading";
import SearchableSelect from '@/modulo_ti/Pruebas/SearchableSelect';
import BotonRegresar from '@/modulo_ti/Regresar';
import { Estado, ObtenerEstadoAgencia } from '@/api_conexion/servicios/estadoAgencia';
import { Alert } from '@/modulo_ti/alertService';


const UpdateAgencias: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    // Obtener los datos de la API
    const [{ data: agencia, loading, error }] = ObtenerAgenciaById(numericId!);
    const [{ data: estadoAgencia}] = ObtenerEstadoAgencia();
  

    const [formData, setFormData] = useState<UpdateAgencia>({
        nombre: '',
        ubicacion: '',
        codigo: 0,
        estado_agencias_id: 0,
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
        const EstadoAgenciaSelect = estadoAgencia?.map((estadoAgencia: Estado) => ({
            id: estadoAgencia.id,
            label: estadoAgencia.nombre,
        })) || [];

    
    const handleSelectChange = (field: 'estado_agencias_id' , option: { id: number; label: string } | null) => {
        if (option) {
            setFormData((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
        } else {
            setFormData((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
        }
    };

    useEffect(() => {
        if (agencia) {
            setFormData({
                nombre: agencia.nombre,
                ubicacion: agencia.ubicacion,
                codigo: agencia.codigo,
                estado_agencias_id: agencia.estado_agencias_id,
            });
        }
    }, [agencia]);

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

            await ActualizarAgencias(numericId!, formData);
            Alert(
                'Éxito',
                `Se actualizó la agencia: '${formData.nombre}' en la ubicación: ${formData.ubicacion} `,
                'success',
                'Ok!',
                () =>{ navigate(-1)}
            );
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
    if (!agencia) return <div>No se encontraron datos de la agencia</div>;


    return (
        <>
            <BotonRegresar />
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Agencia</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                    <label htmlFor="agencia" className='ml-3'>Nombre Agencia</label>

                    <InputText
                        type='text'
                        name="nombre"
                        value={formData.nombre}
                        placeholder="Nombre Agencia"
                        onChange={manejarCambio}
                    />
                    <label htmlFor="ubicacion" className='ml-3'>Ubicación</label>

                    <InputText
                        type='text'
                        name="ubicacion"
                        value={formData.ubicacion}
                        placeholder="Ubicación"
                        onChange={manejarCambio}
                    />

                    <label htmlFor="codigo" className='ml-3'>Código Agencia</label>

                    <InputText
                        type='text'
                        name="codigo"
                        value={String(formData.codigo)}
                        placeholder="Código Agencia"
                        onChange={manejarCambio}
                    />

                     <label htmlFor="Estado" className='ml-3'>Estado Agencia</label>
                <SearchableSelect
                    options={EstadoAgenciaSelect}
                    onSelect={(option) => handleSelectChange('estado_agencias_id', option)}
                    selected={EstadoAgenciaSelect.find(estadoAgencia => estadoAgencia.id === formData.estado_agencias_id) || null}
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

export default UpdateAgencias;
