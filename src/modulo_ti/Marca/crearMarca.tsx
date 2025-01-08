import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/modulo_ti/campos/InputForm';
import { CrearMarcas, Post_Marca } from '@/api_conexion/servicios/marca';


const CrearMarca: React.FC = () => {
   
    const [formState, setFormState] = useState({
        nombre: '',
       
    });

    const [status, setStatus] = useState({ error: null as string | null, isLoading: false, successMessage: null as string | null });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { nombre} = formState;
        console.log(formState)
        if (!nombre) {
            setStatus({ ...status, error: "Por favor, rellena el campo." });
            return;
        }

        const nuevaMarca: Post_Marca= {
            
            nombre
           
        };

        try {
            setStatus({ ...status, isLoading: true });

            await CrearMarcas (nuevaMarca);

            setStatus({ error: null, isLoading: false, successMessage: "Marca agregada correctamente." });
            setFormState({ nombre: ''});
            // window.location.reload();
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error || "Error al agregar la Marca." : "Error al agregar la Marca";
            setStatus({ ...status, error: errorMessage, isLoading: false });
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 -mt-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Agregar Marca</h2>

            {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
            {status.error && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.error}</div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="nombre" className='ml-3'></label>
                <InputText
                    type='text'
                    name="nombre"
                    value={formState.nombre}
                    placeholder="Nombre Marca"
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
    );
};

export default CrearMarca;
