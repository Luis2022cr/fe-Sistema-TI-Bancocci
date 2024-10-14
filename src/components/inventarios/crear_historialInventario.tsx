import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '../campos/InputForm';
import { Post_Historial_Inventario, CrearHistorialInventario } from '@/api conexion/servicios/inventarios'; 
import Alert from '../Alert';
import usuario from '@/assets/usuario.svg';

const Crear_HistorialInventario: React.FC<{ 
    inventarioId?: string, inventarioNombre?: string }> = ({ inventarioId, inventarioNombre }) => {
    
    
    
    const [formState, setFormState] = useState({
        cambio_realizado: '',
        fecha_cambio: '',
        usuario_id: usuario,

    });

    const [status, setStatus] = useState({ error: null as string | null, isLoading: false, successMessage: null as string | null });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { cambio_realizado, fecha_cambio } = formState;

        if (!inventarioId || !cambio_realizado || !fecha_cambio) {
            setStatus({ ...status, error: "Por favor, rellena todos los campos." });
            return;
        }


        const nuevoHistorial: Post_Historial_Inventario = {
            inventario_id: inventarioId ? parseInt(inventarioId, 10) : 0,
            cambio_realizado,
            fecha_cambio: new Date(fecha_cambio).toISOString().split('T')[0],  
        };

        try {
            setStatus({ ...status, isLoading: true });

            await CrearHistorialInventario(nuevoHistorial);

            setStatus({ error: null, isLoading: false, successMessage: "Historial agregado correctamente." });
            setFormState({ cambio_realizado: '', fecha_cambio: '' , usuario_id: `` });
            Alert({
                title: 'Éxito',
                text: `Se realizó: "${formState.cambio_realizado}", al inventario: "${inventarioNombre}" `,
                icon: 'success',
                callback: () => window.location.reload()
            });
           
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error || "Error al agregar el historial." : "Error al agregar el historial.";
            setStatus({ ...status, error: errorMessage, isLoading: false });
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-8 -mt-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Agregar Cambio a {inventarioNombre}</h2>

                {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
                {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

                <form onSubmit={handleSubmit}>
                    <InputText
                        type="text"
                        name="cambio_realizado"
                        value={formState.cambio_realizado}
                        placeholder="Cambio Realizado"
                        onChange={handleChange}
                    />
                    <InputText
                        type="date"
                        name="fecha_cambio"
                        value={formState.fecha_cambio}
                        placeholder="Fecha de Cambio"
                        onChange={handleChange}
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
        </>
    );
};

export default Crear_HistorialInventario;
