import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import Loading from '../Loading';
import { ObtenerInventariosById, UpdateInventario } from '@/api conexion/servicios/inventarios';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import { ObtenerAgencia, Agencia } from '@/api conexion/servicios/agencias';
import { ObtenerTipoInventario, TipoInventario } from '@/api conexion/servicios/tipoInventario';
import { ObtenerMarca, Marca } from '@/api conexion/servicios/marca';
import { ObtenerModelo, Modelo } from '@/api conexion/servicios/modelo';
import { ObtenerEstado, Estado } from '@/api conexion/servicios/estado';
import InputText from '../campos/InputForm';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm';
import { AuthContext } from '@/api conexion/AuthContext'; 
import { IoArrowUndoOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { Actualizar_Inventario } from '@/api conexion/servicios/inventarios'; 

const EditarInventario: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [{ data: inventario, loading: loadingInventario }] = ObtenerInventariosById(numericId!);
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: tipoInventarioData, loading: loadingTipoInventario }] = ObtenerTipoInventario();
    const [{ data: marcaData }] = ObtenerMarca();
    const [{ data: modeloData }] = ObtenerModelo();
    const [{ data: estadoData }] = ObtenerEstado();
  
    const [formState, setFormState] = useState({
        codigo: '',
        serie: '',
        marca_id: null as SelectOption | null,
        modelo_id: null as SelectOption | null,
        tipo_inventario_id: null as SelectOption | null,
        agencias_id_origen: null as SelectOption | null,
        agencias_id_actual: null as SelectOption | null,
        estado_id: null as SelectOption | null,
        comentarios: '',
    });

    const [status, setStatus] = useState({
        error: null as string | null,
        isLoading: false,
        successMessage: null as string | null,
    });

    useEffect(() => {
        if (inventario) {
            setFormState({
                codigo: inventario.codigo,
                serie: inventario.serie,
                marca_id: { value: inventario.marca_id, label: inventario.marca }, 
                modelo_id: { value: inventario.modelo_id, label: inventario.modelo }, 
                tipo_inventario_id: { value: inventario.tipo_inventario_id, label: inventario.tipo_inventario }, 
                agencias_id_origen: { value: inventario.agencias_id_origen, label: inventario.agencia_origen }, 
                agencias_id_actual: { value: inventario.agencias_id_actual, label: inventario.agencia_actual }, 
                estado_id: { value: inventario.estado_id, label: inventario.estado }, 
                comentarios: inventario.comentarios || '',
            });
        }
    }, [inventario]);

    const agencias = useMemo(
        () => agenciaData ? agenciaData.map((agencia: Agencia) => ({ value: agencia.id, label: agencia.nombre })) : [],
        [agenciaData]
    );

    const tiposInventario = useMemo(
        () => tipoInventarioData ? tipoInventarioData.map((tipo: TipoInventario) => ({ value: tipo.id, label: tipo.nombre })) : [],
        [tipoInventarioData]
    );

    const marcas = useMemo(
        () => marcaData ? marcaData.map((marca: Marca) => ({ value: marca.id, label: marca.nombre })) : [],
        [marcaData]
    );

    const modelos = useMemo(
        () => modeloData ? modeloData.map((modelo: Modelo) => ({ value: modelo.id, label: modelo.nombre })) : [],
        [modeloData]
    );

    const estados = useMemo(
        () => estadoData ? estadoData.map((estado: Estado) => ({ value: estado.id, label: estado.nombre })) : [],
        [estadoData]
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

        const { codigo, serie, marca_id, modelo_id, tipo_inventario_id, 
            agencias_id_origen, agencias_id_actual, estado_id, comentarios } = formState;

        if (!codigo || !serie || !marca_id || !modelo_id || !tipo_inventario_id || !agencias_id_origen || !agencias_id_actual || !estado_id) {
            setStatus({ ...status, error: 'Por favor, rellena todos los campos.' });
            return;
        }

        const usuarioId = authContext?.usuario ? Number(authContext.usuario) : 0; 

        const inventarioActualizado: Actualizar_Inventario = {
            codigo,
            serie,
            tipo_inventario_id: tipo_inventario_id!.value,
            marca_id: marca_id!.value,
            modelo_id: modelo_id!.value,
            agencias_id_origen: agencias_id_origen!.value,
            agencias_id_actual: agencias_id_actual!.value,
            estado_id: estado_id!.value,
            usuario_id: usuarioId,
            comentarios: comentarios || '',
            fecha_modificacion: new Date().toISOString(),
        };

        try {
            setStatus((prevStatus) => ({ ...prevStatus, isLoading: true }));

            await UpdateInventario(Number(id), inventarioActualizado);

            setStatus({ error: null, isLoading: false, successMessage: 'Inventario actualizado correctamente.' });
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || 'Error al actualizar el inventario.'
                : 'Error al actualizar el inventario.';
            setStatus((prevStatus) => ({ ...prevStatus, error: errorMessage, isLoading: false }));
        }
    };

    if (loadingInventario || loadingAgencias || loadingTipoInventario || !marcaData || !modeloData || !estadoData || status.isLoading) return <Loading />;

    return (
        <>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
            <div className="max-w-md mx-auto p-8 -mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Editar Inventario</h2>

                {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
                {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

                <form onSubmit={handleSubmit}>
                    <InputText
                    type='text'
                        name="codigo"
                        value={formState.codigo}
                        placeholder="Código de Inventario"
                        onChange={handleChange}
                    />
                    <InputText
                    type='text'
                        name="serie"
                        value={formState.serie}
                        placeholder="Número de Serie"
                        onChange={handleChange}
                    />
                    <SelectOptions
                        value={formState.tipo_inventario_id}
                        options={tiposInventario}
                        placeholder="Selecciona un Tipo de Inventario"
                        onChange={(option) => handleSelectChange('tipo_inventario_id', option)}
                    />
                    <SelectOptions
                        value={formState.marca_id}
                        options={marcas}
                        placeholder="Selecciona una Marca"
                        onChange={(option) => handleSelectChange('marca_id', option)}
                    />
                    <SelectOptions
                        value={formState.modelo_id}
                        options={modelos}
                        placeholder="Selecciona un Modelo"
                        onChange={(option) => handleSelectChange('modelo_id', option)}
                    />
                    <SelectOptions
                        value={formState.agencias_id_origen}
                        options={agencias}
                        placeholder="Selecciona la Agencia de Origen"
                        onChange={(option) => handleSelectChange('agencias_id_origen', option)}
                    />
                    <SelectOptions
                        value={formState.agencias_id_actual}
                        options={agencias}
                        placeholder="Selecciona la Agencia Actual"
                        onChange={(option) => handleSelectChange('agencias_id_actual', option)}
                    />
                    <SelectOptions
                        value={formState.estado_id}
                        options={estados}
                        placeholder="Selecciona un Estado"
                        onChange={(option) => handleSelectChange('estado_id', option)}
                    />
                    <InputText
                    type='text'
                        name="comentarios"
                        value={formState.comentarios}
                        placeholder="Comentarios"
                        onChange={handleChange}
                    />
                    <div className="flex justify-center items-center mt-11">
                        <button
                            className="w-1/2 h-12 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                            disabled={status.isLoading}
                        >
                            {status.isLoading ? (
                                <FiLoader className="mr-2 animate-spin mx-20" />
                            ) : (
                                'Actualizar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditarInventario;
