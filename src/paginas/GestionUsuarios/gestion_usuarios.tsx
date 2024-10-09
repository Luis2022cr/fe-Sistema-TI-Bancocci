import { User, Mail, Pencil, KeyRound, UserRoundCog, CircleUserRound} from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination"; 
import { Rol , ObtenerRoles } from "@/api conexion/servicios/roles";
import {  Usuario, ObtenerUsuarios } from "@/api conexion/servicios/usuarios"; 
import { Link } from "react-router-dom";
import FiltroUsuarios from "../GestionUsuarios/FiltroUsuario";

export default function PaginaGestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);// Almacenar los roles disponibles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
    const [selectedRol, setSelectedRol] = useState<string>(''); // Estado para el rol seleccionado

    const [paginaInicial, setPaginaInicial] = useState(1); // Estado para la paginación
    const itemsPerPage = 12; // Cambia este valor según tus necesidades

    // Obtener los datos del Back-End
    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                const response = await ObtenerUsuarios();
                setUsuarios(response);
            } catch (error) {
                setError("Error al cargar la información de los usuarios.");
            } finally {
                setLoading(false);
            }
        };

        const obtenerRoles = async () => {
            try {
                const response = await ObtenerRoles();
                setRoles(response);
            } catch (error) {
                setError("Error al cargar la información de los roles.");
            }
        };

        obtenerUsuarios();
        obtenerRoles();
    }, []);


   // Filtrar los usuarios según el término de búsqueda y el rol seleccionado
        const filteredUsuarios = usuarios.filter((usuario) => {
        const searchLower = searchTerm.toLowerCase();
        const roleMatches = selectedRol === "" || usuario.rol.toLowerCase() === selectedRol.toLowerCase();

            return (
                roleMatches &&
                (usuario.nombre.toLowerCase().includes(searchLower) ||
                    usuario.correo.toLowerCase().includes(searchLower) ||
                    usuario.usuario.toLowerCase().includes(searchLower))
            );
        });


    // Paginación
    const totalPaginas = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const paginatedData = filteredUsuarios.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);

    // Otros, carga antes de los datos, y mostrar errores
    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-5">
                Gestión de Usuarios
            </h1>

            {/* Componente de filtros */}
            
            <FiltroUsuarios
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRol={selectedRol}
                setSelectedRol={setSelectedRol}
                roles={roles}
            />

            {/* Tarjetas de los usuarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedData.length > 0 ? (
                    paginatedData.map((usuario) => (
                        <div
                            key={usuario.id}
                            className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Botones de editar y borrar */}
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-75 hover:opacity-100 transition-opacity duration-300">
                                <Link
                                    to={`/dashboard-admin/gestion-usuarios/editar-usuario/${usuario.id}`}
                                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                                <Link
                                    
                                    to={`/dashboard-admin/gestion-usuarios/password/${usuario.id}`}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                                >
                                    <KeyRound className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Información del usuario */}
                            <div className="space-y-2">
                                <div className="flex items-center mb-4">
                                    <CircleUserRound className="w-6 h-6 text-blue-500 mr-2" />
                                    <span className="text-xl font-semibold">{usuario.nombre}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{usuario.correo}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{usuario.usuario}</span>
                                </div>
                                <div className="flex items-center">
                                    <UserRoundCog className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{usuario.rol}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron usuarios.</p>
                )}
            </div>

            {/* Componente de paginación */}
            {paginatedData.length > 0 && (
                <Pagination
                    PaginaInicial={paginaInicial}
                    TotalPaginas={totalPaginas}
                    onPageChange={setPaginaInicial}
                />
            )}
        </div>
    );
}
