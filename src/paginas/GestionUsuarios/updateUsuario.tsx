import React, { useEffect, useState } from 'react';
import { ObtenerUsuariosById, UpdateUsuarios } from '@/api_conexion/servicios/usuarios';
import { ObtenerRoles, Rol } from '@/api_conexion/servicios/roles'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowUndoOutline } from "react-icons/io5";

interface Post_Usuario {
    nombre: string;
    correo: string;
    rol_id: number;
}

const UpdateUsuario: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const navigate = useNavigate();

    const [{ data: usuario, error }] = ObtenerUsuariosById(numericId!);
    
    const [rolesData, setRolesData] = useState<Rol[]>([]);
    const [formData, setFormData] = useState<Post_Usuario>({
        nombre: '',
        correo: '',
        rol_id: 0,
    });

    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roles = await ObtenerRoles(); 
                setRolesData(roles); 
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id || 0,
            });
        }
    }, [usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            await UpdateUsuarios(numericId!, formData);
            setMessage('Usuario actualizado exitosamente.');
            setTimeout(() => {
                navigate('/dashboard-admin/gestion-usuarios');
            }, 500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const respuestaError = error.response?.data?.error;
                setErrorMessage(respuestaError || "Error al actualizar el usuario.");
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

                <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Usuario</h2>

                {message && <div className="text-green-500 mb-4">{message}</div>}
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700">Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre} 
                            onChange={handleChange}
                            placeholder="nombre"
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Correo:</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-full bg-gray-200"
                            placeholder="Correo"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Rol:</label>
                        <select
                            name="rol_id"
                            value={formData.rol_id}
                            onChange={handleChange}
                            className="block w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar Rol</option>
                            {rolesData.map((rol: Rol) => (
                                <option key={rol.id} value={rol.id}>
                                    {rol.descripcion}
                                </option>
                            ))}
                        </select>
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
            </div>
        </>
    );
};

export default UpdateUsuario;
