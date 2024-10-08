import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { ObtenerDirectoriosById, UpdateDirectorios, Post_Directorio } from '@/api conexion/servicios/directorio';
import { useParams, useNavigate } from 'react-router-dom';
import { ObtenerAgencia } from '@/api conexion/servicios/agencias';
import { ObtenerDepartamento } from '@/api conexion/servicios/departamentos';
import axios from 'axios';
import { IoArrowUndoOutline } from "react-icons/io5";
import { FiLoader } from 'react-icons/fi';
import Alert from '../Alert';
import InputText from '../campos/InputForm';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm';

const UpdateDirectorio: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    // Obtener los datos de la API
    const [{ data: directorio, loading, error }] = ObtenerDirectoriosById(numericId!);
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: departamentoData, loading: loadingDepartamentos }] = ObtenerDepartamento();

    const [formData, setFormData] = useState<Post_Directorio>({
        extension: 0,
        departamento_id: 0,
        agencias_id: 0,
        empleado: '',
    });

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

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const manejarCambioSelect = (name: keyof Post_Directorio) => (option: SelectOption | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: option ? option.value : 0, // Asigna 0 si no hay opción seleccionada
        }));
    };

    const manejoDeEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            setIsLoading(true);

            await UpdateDirectorios(numericId!, formData);
            Alert({
                title: 'Éxito',
                text: `Se actualizó el directorio: '${formData.extension}' empleado asignado: ${formData.empleado} `,
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

    if (loading || loadingAgencias || loadingDepartamentos) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!directorio || !agenciaData || !departamentoData) return <div>No se encontraron datos del directorio</div>;

    // Convertir las opciones para react-select
    const agenciaOptions = agenciaData.map(agencia => ({ value: agencia.id, label: agencia.nombre }));
    const departamentoOptions = departamentoData.map(departamento => ({ value: departamento.id, label: departamento.nombre }));

    return (
        <>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 ml-2 text-blue-500 hover:underline mt-6 flex items-center text-xl"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Directorio</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                    <InputText
                        name="extension"
                        value={String(formData.extension)}
                        placeholder="Número Extensión"
                        onChange={manejarCambio}
                    />
                    <InputText
                        name="empleado"
                        value={formData.empleado}
                        placeholder="Usuario"
                        onChange={manejarCambio}
                    />
                    <SelectOptions
                        value={departamentoOptions.find(option => option.value === formData.departamento_id) || null}
                        options={departamentoOptions}
                        placeholder="Selecciona un Departamento"
                        onChange={manejarCambioSelect('departamento_id')}
                    />
                    <SelectOptions
                        value={agenciaOptions.find(option => option.value === formData.agencias_id) || null}
                        options={agenciaOptions}
                        placeholder="Selecciona una Agencia"
                        onChange={manejarCambioSelect('agencias_id')}
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

export default UpdateDirectorio;
