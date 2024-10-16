import React, { useState, useMemo, useCallback } from 'react';
import { FiLoader } from 'react-icons/fi';
import { CrearUps, Post_Ups } from '@/api_conexion/servicios/ups';
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert';
import InputText from '../campos/InputForm';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm'; // Importar SelectOptions
import { EstadoUps, ObtenerEstadoUps, ObtenerTipoTamaño, TipoTamaño } from '@/api_conexion/servicios/estados';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import Loading from '../Loading';
import BotonRegresar from '../Regresar';
import axios from 'axios';

const CrearUpsForm: React.FC = () => {
    const navigate = useNavigate();
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: estadosUpsData, loading: loadingestadosUps }] = ObtenerEstadoUps();
    const [{ data: estadosTipoTamaño, loading: loadingeTipoTamaño }] = ObtenerTipoTamaño();

    // Estado para los campos del formulario
    const [formState, setFormState] = useState({
        agencias_id: null as SelectOption | null,
        nombre: '',
        modelo: '',
        direccion_ip: '',
        kva: '',
        fecha_instalacion: '',
        años_uso: '',
        proximo_cambio: '',
        estado_ups_id: null as SelectOption | null,
        modulos: '',
        baterias: '',
        tipo_tamano_id: null as SelectOption | null,
        observacion: ''
    });

    // Estado para manejar el proceso de carga, mensajes de éxito y error
    const [status, setStatus] = useState({
        isLoading: false,
        successMessage: null as string | null,
        errorMessage: null as string | null
    });

    // Memoizar opciones para los select
    const agenciasOptions = useMemo(
        () => (agenciaData ? agenciaData.map((agencia: Agencia) => ({ value: agencia.id, label: agencia.nombre })) : []),
        [agenciaData]
    );

    const estadosUpsOptions = useMemo(
        () => (estadosUpsData ? estadosUpsData.map((estado: EstadoUps) => ({ value: estado.id, label: estado.nombre })) : []),
        [estadosUpsData]
    );

    const tipoTamañoOptions = useMemo(
        () => (estadosTipoTamaño ? estadosTipoTamaño.map((tipo: TipoTamaño) => ({ value: tipo.id, label: tipo.nombre })) : []),
        [estadosTipoTamaño]
    );

    // Manejador de cambios para los campos de selección
    const handleSelectChange = useCallback(
        (field: string, option: SelectOption | null) => setFormState((prev) => ({ ...prev, [field]: option })),
        []
    );

    // Manejador de cambios en los campos de texto
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

         // Validación de los campos
         if (
            !formState.agencias_id ||
            !formState.nombre ||
            !formState.modelo ||
            !formState.kva ||
            !formState.fecha_instalacion ||
            !formState.años_uso ||
            !formState.proximo_cambio ||
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

        const nuevoUps: Post_Ups = {
            agencias_id: formState.agencias_id!.value,
            nombre: formState.nombre,
            modelo: formState.modelo,
            direccion_ip: formState.direccion_ip,
            kva: parseInt(formState.kva, 10),
            fecha_instalacion: formState.fecha_instalacion,
            años_uso: parseInt(formState.años_uso, 10),
            proximo_cambio: formState.proximo_cambio,
            estado_ups_id: formState.estado_ups_id!.value,
            modulos: parseInt(formState.modulos, 10),
            baterias: parseInt(formState.baterias, 10),
            tipo_tamano_id: formState.tipo_tamano_id!.value,
            observacion: formState.observacion
        };

        try {
            setStatus({ ...status, isLoading: true });

            // Ejecutar la solicitud POST
            await CrearUps(nuevoUps);

            setStatus({
                isLoading: false,
                successMessage: 'UPS agregado correctamente.',
                errorMessage: null
            });
            Alert({
                title: 'Éxito',
                text: `Se creo el UPS: ${formState.nombre} `,
                icon: 'success',
                callback: () => navigate(-1)
            });

            // Limpiar formulario
            setFormState({
                agencias_id: null,
                nombre: '',
                modelo: '',
                direccion_ip: '',
                kva: '',
                fecha_instalacion: '',
                años_uso: '',
                proximo_cambio: '',
                estado_ups_id: null,
                modulos: '',
                baterias: '',
                tipo_tamano_id: null,
                observacion: ''
            });

        } catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error
                || "Error al agregar el directorio." : "Error al agregar el directorio.";
            setStatus({ ...status, errorMessage: errorMessage, isLoading: false });
        }
    };

    if (loadingestadosUps || loadingAgencias || loadingeTipoTamaño) return <Loading />;
    if (!agenciaData || !estadosUpsData || !estadosTipoTamaño) return <p>Error al obtener los datos</p>;


    return (
        <>
            <BotonRegresar />
            <div className=" mx-auto p-6 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Agregar UPS</h2>

                {/* Mensajes de éxito y error */}
                {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
                {status.errorMessage && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.errorMessage}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Grupo de datos generales */}
                    {/* Select para Agencia */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="agencias_id">Agencia</label>
                        <SelectOptions
                            value={formState.agencias_id}
                            options={agenciasOptions}
                            placeholder="Selecciona una Agencia"
                            onChange={(option) => handleSelectChange('agencias_id', option)}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Nombre</label>
                        <InputText
                            type="text"
                            name="nombre"
                            value={formState.nombre}
                            placeholder="Nombre"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="modelo">Modelo</label>
                        <InputText
                            type="text"
                            name="modelo"
                            value={formState.modelo}
                            placeholder="Modelo"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="direccion_ip">Dirección IP</label>
                        <InputText
                            type="text"
                            name="direccion_ip"
                            value={formState.direccion_ip}
                            placeholder="Dirección IP"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="kva">KVA</label>
                        <InputText
                            type="text"
                            name="kva"
                            value={formState.kva}
                            placeholder="KVA"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="fecha_instalacion">Fecha Instalación</label>
                        <input
                            type="date"
                            name="fecha_instalacion"
                            value={formState.fecha_instalacion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="años_uso">Años de Uso</label>
                        <InputText
                            type="number"
                            name="años_uso"
                            value={formState.años_uso}
                            placeholder="Años de Uso"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="proximo_cambio">Próximo Cambio</label>
                        <input
                            type="date"
                            name="proximo_cambio"
                            value={formState.proximo_cambio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"

                        />
                    </div>

                    {/* Select para Estado UPS */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="estado_ups_id">Estado UPS</label>
                        <SelectOptions
                            value={formState.estado_ups_id}
                            options={estadosUpsOptions}
                            placeholder="Selecciona un Estado UPS"
                            onChange={(option) => handleSelectChange('estado_ups_id', option)}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="modulos">Módulos</label>
                        <InputText
                            type="number"
                            name="modulos"
                            value={formState.modulos}
                            placeholder="Módulos"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="baterias">Baterías</label>
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
                        <label className="block text-sm font-medium text-gray-700" htmlFor="tipo_tamano_id">Tipo y Tamaño</label>
                        <SelectOptions
                            value={formState.tipo_tamano_id}
                            options={tipoTamañoOptions}
                            placeholder="Selecciona un Tipo y Tamaño"
                            onChange={(option) => handleSelectChange('tipo_tamano_id', option)}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="observacion">Observación</label>
                        <InputText
                            type="text"
                            name="observacion"
                            value={formState.observacion}
                            placeholder="Observación"
                            onChange={handleChange}

                        />
                    </div>

                    <div className="flex justify-center items-center mt-20 col-span-2">
                        <button
                            className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                            disabled={status.isLoading}
                        >
                            {status.isLoading ? <FiLoader className="mr-2 animate-spin mx-20" /> : 'Agregar'}
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default CrearUpsForm;
