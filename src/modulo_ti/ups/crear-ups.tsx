import React, { useState, useMemo } from 'react';
import { FiLoader } from 'react-icons/fi';
import { CrearUps, Post_Ups } from '@/api_conexion/servicios/ups';
import { useNavigate } from 'react-router-dom';
import InputText from '../campos/InputForm';
import { EstadoUps, ObtenerEstadoUps, ObtenerTipoTamaño, TipoTamaño } from '@/api_conexion/servicios/estados';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import Loading from "@/componentes/Loading";
import BotonRegresar from '../Regresar';
import axios from 'axios';
import SearchableSelect from '../Pruebas/SearchableSelect';
import { Alert } from '../alertService';

const CrearUpsForm: React.FC = () => {
    const navigate = useNavigate();
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: estadosUpsData, loading: loadingestadosUps }] = ObtenerEstadoUps();
    const [{ data: estadosTipoTamaño, loading: loadingeTipoTamaño }] = ObtenerTipoTamaño();

    // Estado para los campos del formulario
    const [formState, setFormState] = useState({
        agencias_id: 0,
        nombre: '',
        modelo: '',
        direccion_ip: '',
        kva: '',
        fecha_instalacion: '',
        años_uso: '',
        proximo_cambio: '',
        estado_ups_id: 0,
        modulos: '',
        baterias: '',
        tipo_tamano_id: 0,
        observacion: ''
    });

    // Estado para manejar el proceso de carga, mensajes de éxito y error
    const [status, setStatus] = useState({
        isLoading: false,
        successMessage: null as string | null,
        errorMessage: null as string | null
    });

    const agencias_idSelect = useMemo(() => {
        return agenciaData?.map((agencia: Agencia) => ({
            id: agencia.id,
            label: agencia.nombre,
        })) || [];
    }, [agenciaData]);

    const estado_ups_idSelect = useMemo(() => {
        return estadosUpsData?.map((estado: EstadoUps) => ({
            id: estado.id,
            label: estado.nombre,
        })) || [];
    }, [estadosUpsData]);

    const tipo_tamano_idSelect = useMemo(() => {
        return estadosTipoTamaño?.map((tipotamano: TipoTamaño) => ({
            id: tipotamano.id,
            label: tipotamano.nombre,
        })) || [];
    }, [estadosTipoTamaño]);

    const handleSelectChange2 = (field: 'agencias_id' | 'estado_ups_id' | 'tipo_tamano_id', option: { id: number; label: string } | null) => {
        if (option) {
            setFormState((prev) => ({ ...prev, [field]: option.id })); // Almacena la opción seleccionada
        } else {
            setFormState((prev) => ({ ...prev, [field]: 0 })); // Resetea si no se selecciona nada
        }
    };


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
            agencias_id: formState.agencias_id,
            nombre: formState.nombre,
            modelo: formState.modelo,
            direccion_ip: formState.direccion_ip,
            kva: parseInt(formState.kva, 10),
            fecha_instalacion: formState.fecha_instalacion,
            años_uso: parseInt(formState.años_uso, 10),
            proximo_cambio: formState.proximo_cambio,
            estado_ups_id: formState.estado_ups_id,
            modulos: parseInt(formState.modulos, 10),
            baterias: parseInt(formState.baterias, 10),
            tipo_tamano_id: formState.tipo_tamano_id,
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
            Alert(
                'Éxito',
                `Se creo el UPS: ${formState.nombre} `,
                'success',
                'Ok',
                () =>{ navigate(-1)}
            );

            // Limpiar formulario
            setFormState({
                agencias_id: 0,
                nombre: '',
                modelo: '',
                direccion_ip: '',
                kva: '',
                fecha_instalacion: '',
                años_uso: '',
                proximo_cambio: '',
                estado_ups_id: 0,
                modulos: '',
                baterias: '',
                tipo_tamano_id: 0,
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
                        <label className=" text-lg font-medium text-gray-700 flex" htmlFor="agencias_id">Agencia</label>
                        {/* <Asterisk className='text-red-600 h-3 w-3' /> */}
                        <SearchableSelect
                            options={agencias_idSelect}
                            onSelect={(option) => handleSelectChange2('agencias_id', option)}
                            selected={agencias_idSelect.find(agencia => agencia.id === formState.agencias_id) || null}
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
                        <label className="block text-lg font-medium text-gray-700" htmlFor="fecha_instalacion">Fecha Instalación</label>
                        <input
                            type="date"
                            name="fecha_instalacion"
                            value={formState.fecha_instalacion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"

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

                    <div className="col-span-1">
                        <label className="block text-lg font-medium text-gray-700" htmlFor="proximo_cambio">Próximo Cambio</label>
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
                        <label className="block text-lg font-medium text-gray-700" htmlFor="estado_ups_id">Estado UPS</label>
                        <SearchableSelect
                            options={estado_ups_idSelect}
                            onSelect={(option) => handleSelectChange2('estado_ups_id', option)}
                            selected={estado_ups_idSelect.find(estado => estado.id === formState.estado_ups_id) || null}
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
                        <SearchableSelect
                            options={tipo_tamano_idSelect}
                            onSelect={(option) => handleSelectChange2('tipo_tamano_id', option)}
                            selected={tipo_tamano_idSelect.find(tamano => tamano.id === formState.tipo_tamano_id) || null}
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
