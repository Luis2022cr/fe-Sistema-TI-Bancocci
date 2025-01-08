import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import InputText from '@/modulo_ti/campos/InputForm';
import Loading from '@/modulo_ti/Loading';
import SearchableSelect from '@/modulo_ti/Pruebas/SearchableSelect';
import BotonRegresar from '@/modulo_ti/Regresar';
import { ActualizarModelo, ObtenerModeloById } from '@/api_conexion/servicios/modelo';
import { Marca, ObtenerMarca } from '@/api_conexion/servicios/marca';
import { Alert } from '@/modulo_ti/alertService';

const UpdateModelo: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    // Obtener los datos de la API
    const [{ data: modelo, loading, error }] = ObtenerModeloById(numericId!);
    const [{ data: marca }] = ObtenerMarca();

    const [formData, setFormData] = useState<ActualizarModelo>({
        nombre: '',
        marca_id: 0
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Opciones del Select
    const MarcaSelect = marca?.map((marca: Marca) => ({
        id: marca.id,
        label: marca.nombre,
    })) || [];

    // Manejo del Select
    const handleSelectChange = (field: 'marca_id', option: { id: number; label: string } | null) => {
        setFormData((prev) => ({ ...prev, [field]: option ? option.id : 0 }));
    };

    // Prellenar el formulario con datos del modelo
    useEffect(() => {
        if (modelo) {
            setFormData({
                nombre: modelo.nombre,
                marca_id: modelo.marca_id,
            });
        }
    }, [modelo]);

    // Manejo del cambio de inputs
    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Enviar datos al servidor
    const manejoDeEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.nombre.trim()) {
            setErrorMessage('El nombre del modelo no puede estar vacío.');
            return;
        }

        try {
            setIsLoading(true);
            await ActualizarModelo(numericId!, formData);
            Alert(
                'Éxito',
                `Se actualizó el modelo: '${formData.nombre}' `,
                'success',
                'Ok',
                () =>{navigate(-1)}
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error;
                setErrorMessage(respuestaError || "Error al actualizar el modelo.");
            } else {
                console.error("Error desconocido:", error);
                setErrorMessage("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    if (!modelo) return <div>No se encontraron datos del modelo</div>;

    return (
        <>
            <BotonRegresar />
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Modelo</h2>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={manejoDeEnvio}>
                    <label htmlFor="modelo" className="ml-3">Nombre Modelo</label>
                    <InputText
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        placeholder="Nombre Modelo"
                        onChange={manejarCambio}
                        />

                    <label htmlFor="Marca" className="ml-3">Marca</label>
                    <SearchableSelect
                        options={MarcaSelect}
                        onSelect={(option) => handleSelectChange('marca_id', option)}
                        selected={MarcaSelect.find(marca => marca.id === formData.marca_id) || null}
                        />

                    <div className="flex justify-center items-center mt-5">
                        <button
                            className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                            disabled={isLoading}
                            >
                            {isLoading ? (
                                <FiLoader className="mr-2 animate-spin mx-20" />
                            ) : (
                                "Actualizar"
                            )}
                        </button>
                        
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateModelo;
