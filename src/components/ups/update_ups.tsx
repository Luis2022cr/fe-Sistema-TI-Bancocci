
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import { EstadoUps, ObtenerEstadoUps, ObtenerTipoTamaño, TipoTamaño } from '@/api_conexion/servicios/estados';
import { ObtenerUpsById, ActualizarUps } from '@/api_conexion/servicios/ups';
import { Asterisk } from 'lucide-react';
import { FiLoader } from 'react-icons/fi';
import Alert from '../Alert';
import InputText from '../campos/InputForm';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm';
import Loading from '../Loading';
import BotonRegresar from '../Regresar';

const UdpateUps = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;

    // Obtener datos necesarios para los select
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: estadosUpsData, loading: loadingEstadosUps }] = ObtenerEstadoUps();
    const [{ data: estadosTipoTamaño, loading: loadingTipoTamaño }] = ObtenerTipoTamaño();
    const [{ data: upsData, loading: loadingUps }] = ObtenerUpsById(numericId!);

    // Estado para los campos del formulario
    const [formState, setFormState] = useState({
        agencias_id: null as SelectOption | null,
        nombre: '',
        modelo: '',
        direccion_ip: '',
        kva: '',
        años_uso: '',
        estado_ups_id: null as SelectOption | null,
        modulos: '',
        baterias: '',
        tipo_tamano_id: null as SelectOption | null,
        observacion: ''
    });

    // Cargar datos de UPS al estado del formulario
    useEffect(() => {
        if (upsData) {
            setFormState({
                agencias_id: { value: upsData.agencia_id, label: upsData.agencia_nombre },
                nombre: upsData.nombre || '',
                modelo: upsData.modelo || '',
                direccion_ip: upsData.direccion_ip || '',
                kva: upsData.kva ? upsData.kva.toString() : '',
                años_uso: upsData.años_uso ? upsData.años_uso.toString() : '',
                estado_ups_id: { value: upsData.estado_ups_id, label: upsData.estado_ups_nombre },
                modulos: upsData.modulos ? upsData.modulos.toString() : '',
                baterias: upsData.baterias ? upsData.baterias.toString() : '',
                tipo_tamano_id: { value: upsData.tipo_tamano_id, label: upsData.tipo_tamano_nombre },
                observacion: upsData.observacion || ''
            });
        }
    }, [upsData]);

    // Estado para manejar mensajes de éxito y error
    const [status, setStatus] = useState({
        isLoading: false,
        successMessage: null as string | null,
        errorMessage: null as string | null
    });

    // Opciones de los selects
    const agenciasOptions = useMemo(
        () => agenciaData ? agenciaData.map((agencia: Agencia) => ({ value: agencia.id, label: agencia.nombre })) : [],
        [agenciaData]
    );

    const estadosUpsOptions = useMemo(
        () => estadosUpsData ? estadosUpsData.map((estado: EstadoUps) => ({ value: estado.id, label: estado.nombre })) : [],
        [estadosUpsData]
    );

    const tipoTamañoOptions = useMemo(
        () => estadosTipoTamaño ? estadosTipoTamaño.map((tipo: TipoTamaño) => ({ value: tipo.id, label: tipo.nombre })) : [],
        [estadosTipoTamaño]
    );

    // Manejadores de cambios en el formulario
    const handleSelectChange = useCallback(
        (field: string, option: SelectOption | null) => setFormState((prev) => ({ ...prev, [field]: option })),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formState.agencias_id ||
            !formState.nombre ||
            !formState.modelo ||
            !formState.kva ||
            !formState.años_uso ||
            !formState.estado_ups_id ||
            !formState.tipo_tamano_id
        ) {
            setStatus({
                ...status,
                errorMessage: 'Por favor, rellena todos los campos.',
                successMessage: null
            });
            return;
        }

        const nuevoUps = {
            agencias_id: formState.agencias_id.value,
            nombre: formState.nombre,
            modelo: formState.modelo,
            direccion_ip: formState.direccion_ip,
            kva: parseInt(formState.kva, 10),
            años_uso: parseInt(formState.años_uso, 10),
            estado_ups_id: formState.estado_ups_id.value,
            modulos: parseInt(formState.modulos, 10),
            baterias: parseInt(formState.baterias, 10),
            tipo_tamano_id: formState.tipo_tamano_id.value,
            observacion: formState.observacion
        };

        try {
            setStatus({ ...status, isLoading: true });
            await ActualizarUps(nuevoUps, numericId!);

            setStatus({
                isLoading: false,
                successMessage: 'UPS actualizada correctamente.',
                errorMessage: null
            });

            Alert({
                title: 'Éxito',
                text: `UPS ${formState.nombre} actualizada.`,
                icon: 'success',
                callback: () => navigate(-1)
            });
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || "Error al actualizar la UPS."
                : "Error al actualizar la UPS.";
            setStatus({ ...status, errorMessage, isLoading: false });
        }
    };

    if (loadingEstadosUps || loadingAgencias || loadingTipoTamaño || loadingUps) return <Loading />;
    if (!agenciaData || !estadosUpsData || !estadosTipoTamaño || !upsData) return <p>Error al obtener los datos</p>;



    return (
        <>
            <BotonRegresar />
            <div className="mx-auto p-6 -mt-14 max-w-5xl">
    <h2 className="text-2xl font-bold mb-6 text-center">Actualizar UPS</h2>

    {/* Mensajes de éxito y error */}
    {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
    {status.errorMessage && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.errorMessage}</div>}

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Grupo de datos generales */}
        {/* Select para Agencia */}
        <div className="col-span-1">
            <label className="text-lg font-medium text-gray-700 flex" htmlFor="agencias_id">
                Agencia
                <Asterisk className="text-red-600 h-3 w-3" />
            </label>
            <SelectOptions
                value={formState.agencias_id}
                options={agenciasOptions}
                placeholder="Selecciona una Agencia"
                onChange={(option) => handleSelectChange('agencias_id', option)}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="nombre">Nombre</label>
            <InputText
                type="text"
                name="nombre"
                value={formState.nombre}
                placeholder="Nombre"
                onChange={handleChange}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="modelo">Modelo</label>
            <InputText
                type="text"
                name="modelo"
                value={formState.modelo}
                placeholder="Modelo"
                onChange={handleChange}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="direccion_ip">Dirección IP</label>
            <InputText
                type="text"
                name="direccion_ip"
                value={formState.direccion_ip}
                placeholder="Dirección IP"
                onChange={handleChange}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="kva">KVA</label>
            <InputText
                type="text"
                name="kva"
                value={formState.kva}
                placeholder="KVA"
                onChange={handleChange}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="años_uso">Años de Uso</label>
            <InputText
                type="number"
                name="años_uso"
                value={formState.años_uso}
                placeholder="Años de Uso"
                onChange={handleChange}
            />
        </div>

        {/* Select para Estado UPS */}
        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="estado_ups_id">Estado UPS</label>
            <SelectOptions
                value={formState.estado_ups_id}
                options={estadosUpsOptions}
                placeholder="Selecciona un Estado UPS"
                onChange={(option) => handleSelectChange('estado_ups_id', option)}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="modulos">Módulos</label>
            <InputText
                type="number"
                name="modulos"
                value={formState.modulos}
                placeholder="Módulos"
                onChange={handleChange}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="baterias">Baterías</label>
            <InputText
                type="number"
                name="baterias"
                value={formState.baterias}
                placeholder="Baterías"
                onChange={handleChange}
            />
        </div>

        {/* Select para Tipo y Tamaño */}
        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="tipo_tamano_id">Tipo y Tamaño</label>
            <SelectOptions
                value={formState.tipo_tamano_id}
                options={tipoTamañoOptions}
                placeholder="Selecciona un Tipo y Tamaño"
                onChange={(option) => handleSelectChange('tipo_tamano_id', option)}
            />
        </div>

        <div className="col-span-1">
            <label className="block text-lg font-medium text-gray-700" htmlFor="observacion">Observación</label>
            <InputText
                type="text"
                name="observacion"
                value={formState.observacion}
                placeholder="Observación"
                onChange={handleChange}
            />
        </div>

        {/* Botón centrado */}
        <div className="col-span-4 flex justify-center mt-10">
            <button
                className="w-1/3 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full flex items-center justify-center"
                disabled={status.isLoading}
            >
                {status.isLoading ? <FiLoader className="animate-spin" /> : 'Actualizar'}
            </button>
        </div>
    </form>
</div>

        </>
    );
};

export default UdpateUps;