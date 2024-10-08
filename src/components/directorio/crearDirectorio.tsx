import React, {  useState, useCallback, useMemo } from 'react';
import Loading from '../Loading';
import { CrearDirectorios, Post_Directorio } from '@/api conexion/servicios/directorio';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { Agencia, ObtenerAgencia } from '@/api conexion/servicios/agencias';
import { Departamento, ObtenerDepartamento } from '@/api conexion/servicios/departamentos';
import InputText from '../campos/InputForm';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm';

const CrearDirectorio: React.FC = () => {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: departamentoData, loading: loadingDepartamentos }] = ObtenerDepartamento();

    const [formState, setFormState] = useState({
        extension: '',
        departamento_id: null as SelectOption | null,
        agencia_id: null as SelectOption | null,
        empleado: ''
    });

    const [status, setStatus] = useState({ error: null as string | null, isLoading: false, successMessage: null as string | null });

    // Memoizar opciones de Select para evitar recalcular en cada render
    const agencias = useMemo(
        () => (agenciaData ? agenciaData.map((agencia: Agencia) => ({ value: agencia.id, label: agencia.nombre })) : []),
        [agenciaData]
    );

    const departamentos = useMemo(
        () => (departamentoData ? departamentoData.map((departamento: Departamento) => ({ value: departamento.id, label: departamento.nombre })) : []),
        [departamentoData]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        []
    );

    const handleSelectChange = useCallback(
        (field: string, option: SelectOption | null) => setFormState((prev) => ({ ...prev, [field]: option })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { extension, departamento_id, agencia_id, empleado } = formState;

        if (!extension || !departamento_id || !agencia_id) {
            setStatus({ ...status, error: "Por favor, rellena todos los campos." });
            return;
        }

        const nuevoDirectorio: Post_Directorio = {
            extension: parseInt(extension, 10),
            departamento_id: departamento_id!.value,
            agencias_id: agencia_id!.value,
            empleado
        };

        try {
            setStatus({ ...status, isLoading: true });

            await CrearDirectorios(nuevoDirectorio);

            setStatus({ error: null, isLoading: false, successMessage: "Directorio agregado correctamente." });
            setFormState({ extension: '', departamento_id: null, agencia_id: null, empleado: '' });
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
                <InputText
                    name="extension"
                    value={formState.extension}
                    placeholder="Número Extensión"
                    onChange={handleChange}
                />
                <InputText
                    name="empleado"
                    value={formState.empleado}
                    placeholder="Usuario"
                    onChange={handleChange}
                />
                <SelectOptions
                    value={formState.departamento_id}
                    options={departamentos}
                    placeholder="Selecciona un Departamento"
                    onChange={(option) => handleSelectChange('departamento_id', option)}
                />
                <SelectOptions
                    value={formState.agencia_id}
                    options={agencias}
                    placeholder="Selecciona una Agencia"
                    onChange={(option) => handleSelectChange('agencia_id', option)}
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
