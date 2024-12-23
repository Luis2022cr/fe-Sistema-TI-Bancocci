import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '../campos/InputForm';
import { Post_Historial_Ups, CrearHistorialUps } from '@/api_conexion/servicios/ups';
import { Alert } from '../alertService';

const Crear_HistorialUps: React.FC<{ upsId?: string, upsNombre?: string }> = ({ upsId, upsNombre }) => {

    const [formState, setFormState] = useState({
        cambio: '',
        fecha_instalacion: '',
        proximo_cambio: ''
    });

    const [status, setStatus] = useState({ error: null as string | null, isLoading: false, successMessage: null as string | null });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { cambio, fecha_instalacion, proximo_cambio } = formState;

        // Validación de campos
        if (!upsId || !cambio || !fecha_instalacion || !proximo_cambio) {
            setStatus({ ...status, error: "Por favor, rellena todos los campos." });
            return;
        }

        // Crear el objeto con los valores del formulario, convirtiendo las fechas a Date
        const nuevoHistorial: Post_Historial_Ups = {
            ups_id: upsId ? parseInt(upsId, 10) : 0,
            cambio,
            fecha_instalacion: new Date(fecha_instalacion).toISOString().split('T')[0],  // Convertir fecha a 'YYYY-MM-DD'
            proximo_cambio: new Date(proximo_cambio).toISOString().split('T')[0]  // Convertir fecha a 'YYYY-MM-DD'
        };


        try {
            setStatus({ ...status, isLoading: true });

            // Llamada a la API
            await CrearHistorialUps(nuevoHistorial);

            setStatus({ error: null, isLoading: false, successMessage: "Historial agregado correctamente." });
            setFormState({ cambio: '', fecha_instalacion: '', proximo_cambio: '' });
            Alert(
                'Éxito',
                `Se realizo un cambio: "${formState.cambio}", al UPS: "${upsNombre}" `,
                'success',
                'Ok!',
                () => { window.location.reload() }
            );

        } catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error || "Error al agregar el historial." : "Error al agregar el historial.";
            setStatus({ ...status, error: errorMessage, isLoading: false });
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-8 -mt-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Agregar Cambio a {upsNombre}</h2>

                {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
                {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="block text-base font-medium text-gray-700" htmlFor="cambio">Cambio:</label>

                    <InputText
                        type="text"
                        name="cambio"
                        value={formState.cambio}
                        placeholder="Cambio"
                        onChange={handleChange}
                    />
                    <label className="block text-base font-medium text-gray-700" htmlFor="fecha_instalacion">Fecha instalacion:</label>

                    <InputText
                        type="date"
                        name="fecha_instalacion"
                        value={formState.fecha_instalacion}
                        placeholder="Fecha de Instalación"
                        onChange={handleChange}
                    />
                    <label className="block text-base font-medium text-gray-700" htmlFor="proximo_cambio">Proximo cambio:</label>

                    <InputText
                        type="date"
                        name="proximo_cambio"
                        value={formState.proximo_cambio}
                        placeholder="Próximo Cambio"
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

export default Crear_HistorialUps;
