import React, { useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import InputText from '../campos/InputForm';
import { CrearPuntoMapa, POST_Mapa } from '@/api_conexion/servicios/ups-mapa';
import { ObtenerUps_Select } from '@/api_conexion/servicios/ups';
import Loading from '../Loading';
import SelectOptions, { SelectOption } from '../campos/SelectOptionsForm';

const CrearPuntoMapaForm: React.FC = () => {
    const [{ data: upsData, loading: loadingUps }] = ObtenerUps_Select();

    // Estado para los campos del formulario
    const [formState, setFormState] = useState({
        ups_id: null as SelectOption | null,
        lat: '',
        lon: ''
    });

    // Estado para manejar el proceso de carga, mensajes de éxito y error
    const [status, setStatus] = useState({
        isLoading: false,
        successMessage: null as string | null,
        errorMessage: null as string | null
    });

    // Manejador de cambios en el campo de texto
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Manejador de cambios en el Select
    const handleSelectChange = (option: SelectOption | null) => {
        setFormState((prev) => ({
            ...prev,
            ups_id: option // Actualizar el estado con el objeto SelectOption
        }));
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { ups_id, lat, lon } = formState;

        // Validación básica de los campos
        if (!ups_id || !lat || !lon) {
            setStatus({
                ...status,
                errorMessage: 'Por favor, rellena todos los campos.',
                successMessage: null
            });
            return;
        }

        const nuevoPunto: POST_Mapa = {
            ups_id: ups_id.value, // Usar el valor del SelectOption
            lat: lat,
            lon: lon
        };

        try {
            setStatus({ ...status, isLoading: true });

            // Ejecutar la solicitud POST
            await CrearPuntoMapa(nuevoPunto);

            setStatus({
                isLoading: false,
                successMessage: 'Punto agregado correctamente.',
                errorMessage: null
            });

            // Limpiar formulario
            setFormState({
                ups_id: null,
                lat: '',
                lon: ''
            });
        } catch (error) {
            console.error('Error al agregar el punto:', error);
            setStatus({
                isLoading: false,
                errorMessage: 'Error al agregar el punto.',
                successMessage: null
            });
        }
    };

    if (loadingUps) return <Loading />;
    if (!upsData) return <div>Error al obtener los datos.</div>;

    // Convertir los datos de UPS a opciones para el Select
    const upsOptions = upsData.map((ups) => ({
        value: ups.id,
        label: ups.nombre // Asegúrate de que esto corresponde a la propiedad correcta
    }));

    return (
        <div className="max-w-md mx-auto p-8 -mt-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Agregar Punto en el Mapa</h2>

            {/* Mensajes de éxito y error */}
            {status.successMessage && <p className="text-green-500 text-center mb-4">{status.successMessage}</p>}
            {status.errorMessage && <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">{status.errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <SelectOptions
                    value={formState.ups_id}
                    options={upsOptions} // Usar las opciones generadas
                    placeholder="Selecciona un UPS"
                    onChange={handleSelectChange} // Manejar cambios en el Select
                />
                <InputText
                    type="text"
                    name="lat"
                    value={formState.lat}
                    placeholder="Latitud"
                    onChange={handleChange}
                />
                <InputText
                    type="text"
                    name="lon"
                    value={formState.lon}
                    placeholder="Longitud"
                    onChange={handleChange}
                />

                <div className="flex justify-center items-center mt-11">
                    <button
                        className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                        disabled={status.isLoading}
                    >
                        {status.isLoading ? <FiLoader className="mr-2 animate-spin mx-20" /> : 'Agregar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearPuntoMapaForm;
