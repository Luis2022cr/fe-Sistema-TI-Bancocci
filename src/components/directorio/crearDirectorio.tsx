import React, { useState, useCallback } from 'react';
import Loading from '../Loading';
import { CrearDirectorios, Post_Directorio } from '@/api_conexion/servicios/directorio';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import { Departamento, ObtenerDepartamento } from '@/api_conexion/servicios/departamentos';
import InputText from '../campos/InputForm';
import SearchableSelect from '../Pruebas/SearchableSelect';

const CrearDirectorio: React.FC = () => {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: departamentoData, loading: loadingDepartamentos }] = ObtenerDepartamento();

    const [formState, setFormState] = useState({
        extension: '',
        departamento_id: 0,
        agencia_id: 0,
        empleado: ''
    });

    const [status, setStatus] = useState({ error: null as string | null, isLoading: false, successMessage: null as string | null });

    const agenciasSelect = agenciaData?.map((agencia: Agencia) => ({
        id: agencia.id,
        label: agencia.nombre + ' - ' + agencia.codigo,
    })) || [];

    const DepartamentosSelect = departamentoData?.map((departamento: Departamento) => ({
        id: departamento.id,
        label: departamento.nombre,
    })) || [];

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        []
    );

    const handleSelectChange = (field: 'departamento_id' | 'agencia_id', option: { id: number; label: string } | null) => {
        if (option) {
            setFormState((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
        } else {
            setFormState((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { extension, departamento_id, agencia_id, empleado } = formState;
        console.log(formState)
        if (!extension || !departamento_id || !agencia_id) {
            setStatus({ ...status, error: "Por favor, rellena todos los campos." });
            return;
        }

        const nuevoDirectorio: Post_Directorio = {
            extension: parseInt(extension, 10),
            departamento_id,
            agencias_id: agencia_id,
            empleado
        };

        try {
            setStatus({ ...status, isLoading: true });

            await CrearDirectorios(nuevoDirectorio);

            setStatus({ error: null, isLoading: false, successMessage: "Directorio agregado correctamente." });
            setFormState({ extension: '', departamento_id: 0, agencia_id: 0, empleado: '' });
            // window.location.reload();
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error || "Error al agregar el directorio." : "Error al agregar el directorio.";
            setStatus({ ...status, error: errorMessage, isLoading: false });
        }
    };

    if (loadingAgencias || loadingDepartamentos) return <Loading />;

    return (
        <div className="max-w-md mx-auto p-8 -mt-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Agregar Directorio</h2>

            {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
            {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="Extension" className='ml-3'>Extension</label>
                <InputText
                    type='text'
                    name="extension"
                    value={formState.extension}
                    placeholder="Número Extensión"
                    onChange={handleChange}
                />
                <label htmlFor="Usuario" className='ml-3'>Usuario</label>
                <InputText
                    type='text'
                    name="empleado"
                    value={formState.empleado}
                    placeholder="Usuario"
                    onChange={handleChange}
                /> 
                <label htmlFor="Departamento" className='ml-3'>Departamento</label>
                <SearchableSelect
                    options={DepartamentosSelect}
                    onSelect={(option) => handleSelectChange('departamento_id', option)}
                    selected={DepartamentosSelect.find(depto => depto.id === formState.departamento_id) || null}
                />

                <label htmlFor="Agencia" className='ml-3'>Agencia</label>
                <SearchableSelect
                    options={agenciasSelect}
                    onSelect={(option) => handleSelectChange('agencia_id', option)}
                    selected={agenciasSelect.find(agencia => agencia.id === formState.agencia_id) || null}
                />

                <div className="flex justify-center items-center mt-11">
                    <button
                        className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                        disabled={status.isLoading}
                    >
                        {status.isLoading ? (
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
