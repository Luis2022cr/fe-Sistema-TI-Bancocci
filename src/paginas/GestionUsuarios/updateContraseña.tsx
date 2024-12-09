import React, { useEffect, useState } from 'react';
import { ObtenerUsuariosById, Update_Contraseña, UpdateContraseña } from '@/api_conexion/servicios/usuarios';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowUndoOutline } from "react-icons/io5";

// Componente Modal
interface UsuarioCreadoModalProps {
    isOpen: boolean;
    onClose: () => void;
    contraseña: string;
}

const EditContraseñaModal: React.FC<UsuarioCreadoModalProps> = ({ isOpen, contraseña }) => {
    useEffect(() => {
        document.title = "Usuario - TI Bancocci";
      }, []);
    const navigate = useNavigate(); 
    if (!isOpen) return null;

    const handleClose = () => {
        navigate('/administracion/gestion-usuarios'); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Contraseña modificada con éxito</h2>
                <p><strong>Nueva Contraseña:</strong> {contraseña}</p>
                <button
                    onClick={handleClose}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

const UpdateUsuario: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    const [{ data: usuario, error }] = ObtenerUsuariosById(numericId!);
    
    const [formData, setFormData] = useState<Update_Contraseña>({
        nuevaContraseña: '',
        confirmarContraseña: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData({
                nuevaContraseña: '',
                confirmarContraseña: '',
            });
        }
    }, [usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrorMessage(null);

        try {
            await UpdateContraseña(numericId!, formData);
            setMessage('Contraseña actualizada exitosamente.');
            setIsModalOpen(true); // Abrir modal
           
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error;
                setErrorMessage(respuestaError || "Error al actualizar la contraseña.");
            }
        }
    };

    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 ml-2 text-blue-500 hover:underline mt-6 flex items-center text-xl"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
            <div className="max-w-md mx-auto p-8 -mt-14">
                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Contraseña</h2>

                {message && <div className="text-green-500 mb-4">{message}</div>}
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="text-gray-700">Nueva Contraseña:</label>
                        <input
                            type="password"
                            name="nuevaContraseña"
                            value={formData.nuevaContraseña}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                            placeholder="Nueva Contraseña"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            name="confirmarContraseña"
                            value={formData.confirmarContraseña}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                            placeholder="Confirmar Contraseña"
                        />
                    </div>

                    <div className="flex justify-center items-center mt-11">
                        <button
                            type="submit"
                            className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
                        >
                            Actualizar
                        </button>
                    </div>
                </form>

                <EditContraseñaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    contraseña={formData.nuevaContraseña} // Pasamos la nueva contraseña directamente desde el formulario
                />
            </div>
        </>
    );
};

export default UpdateUsuario;
