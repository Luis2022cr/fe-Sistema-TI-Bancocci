import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { ObtenerDirectoriosById, UpdateDirectorios, Post_Directorio } from '@/api_conexion/servicios/directorio';
import { useParams, useNavigate } from 'react-router-dom';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import { Departamento, ObtenerDepartamento } from '@/api_conexion/servicios/departamentos';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import Alert from '../Alert';
import InputText from '../campos/InputForm';
import SearchableSelect from '../Pruebas/SearchableSelect';

import BotonRegresar from '../Regresar';

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
    
    const agenciasSelect = agenciaData?.map((agencia: Agencia) => ({
        id: agencia.id,
        label: agencia.nombre + ' - ' + agencia.codigo,
    })) || [];

    const DepartamentosSelect = departamentoData?.map((departamento: Departamento) => ({
        id: departamento.id,
        label: departamento.nombre,
    })) || [];

    
    const handleSelectChange = (field: 'departamento_id' | 'agencia_id', option: { id: number; label: string } | null) => {
        if (option) {
            setFormData((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
        } else {
            setFormData((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
        }
    };
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


    return (
        <>
            <BotonRegresar />
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Directorio</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                    <label htmlFor="extension" className='ml-3'>Extension</label>

                    <InputText
                        type='text'
                        name="extension"
                        value={String(formData.extension)}
                        placeholder="Número Extensión"
                        onChange={manejarCambio}
                    />
                    <label htmlFor="empleado" className='ml-3'>Empleado</label>

                    <InputText
                        type='text'
                        name="empleado"
                        value={formData.empleado}
                        placeholder="Usuario"
                        onChange={manejarCambio}
                    />
                     <label htmlFor="Departamento" className='ml-3'>Departamento</label>
                <SearchableSelect
                    options={DepartamentosSelect}
                    onSelect={(option) => handleSelectChange('departamento_id', option)}
                    selected={DepartamentosSelect.find(depto => depto.id === formData.departamento_id) || null}
                />

                <label htmlFor="Agencia" className='ml-3'>Agencia</label>
                <SearchableSelect
                    options={agenciasSelect}
                    onSelect={(option) => handleSelectChange('agencia_id', option)}
                    selected={agenciasSelect.find(agencia => agencia.id === formData.agencias_id) || null}
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
