import { Phone, Building, User, Briefcase, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "../Loading";
import Pagination from "../Pagination"; // Asegúrate de que la ruta sea correcta
import { Agencia, ObtenerAgencias } from "@/api conexion/servicios/agencias";
import { BorrarDirectorios, Directorio, ObtenerDirectorios } from "@/api conexion/servicios/directorio";
import { Link } from "react-router-dom";
import FiltroDirectorio from "./FiltroDirectorio";

export default function PaginaDirectorio() {
    const [directorio, setDirectorio] = useState<Directorio[]>([]);
    const [agencias, setAgencias] = useState<Agencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
    const [selectedAgencia, setSelectedAgencia] = useState<string>(''); // Estado para la agencia seleccionada

    const [paginaInicial, setPaginaInicial] = useState(1); // Estado para la paginación
    const itemsPerPage = 12; // Cambia este valor según tus necesidades

    // Obtener los datos del Back-End
    useEffect(() => {
        const obtenerDirectorio = async () => {
            try {
                const response = await ObtenerDirectorios();
                setDirectorio(response);
            } catch (error) {
                setError("Error al cargar la información del directorio.");
            } finally {
                setLoading(false);
            }
        };

        const obtenerAgencias = async () => {
            try {
                const response = await ObtenerAgencias();
                setAgencias(response);
            } catch (error) {
                setError("Error al cargar la información del directorio.");
            }
        };

        obtenerDirectorio();
        obtenerAgencias();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
        if (confirmDelete) {
            try {
                setLoading(true); // Muestra un loading mientras se realiza la acción
                await BorrarDirectorios(id); // Llamar a la función para borrar el directorio
                setDirectorio((prevDirectorio) => prevDirectorio.filter((item) => item.id !== id));
                console.log(`Registro con id ${id} eliminado`);
            } catch (error) {
                setError("Error al eliminar el directorio."); // Manejo de errores
            } finally {
                setLoading(false); // Finaliza el loading
            }
        }
    };

    function formatExtension(extension: number): string {
        // Asegurarte de que la extensión sea un número válido
        if (typeof extension === 'number') {
            const extensionString = extension.toString();
            // Verifica la longitud y retorna el formato adecuado
            if (extensionString.length === 6) {
                const part1 = extensionString.slice(0, 3);
                const part2 = extensionString.slice(3, 6);
                return `${part1}-${part2}`;
            } else {
                // Si la longitud no es 9, simplemente retorna la extensión como string
                return extensionString;
            }
        }
        return ''; // Retorna vacío si no es un número válido
    }


    // Filtrar los directorios según el término de búsqueda y la agencia seleccionada
    const filteredDirectorio = directorio.filter(data => {
        const searchLower = searchTerm.toLowerCase();
        const agencyMatches = selectedAgencia === "" || data.agencia.toLowerCase() === selectedAgencia.toLowerCase();

        return (
            agencyMatches &&
            (data.agencia.toLowerCase().includes(searchLower) ||
                data.empleado.toLowerCase().includes(searchLower) ||
                data.departamento.toLowerCase().includes(searchLower) ||
                data.extension.toString().includes(searchLower) ||
                (formatExtension(data.extension).includes(searchLower))
            )
        );
    });


    // Paginación
    const totalPaginas = Math.ceil(filteredDirectorio.length / itemsPerPage);
    const paginatedData = filteredDirectorio.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);


    // Otros, carga antes de los datos, y mostras errores
    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-5">
                Directorio Telefónico Banco de Occidente
            </h1>

            {/* Componente de filtros */}
            <FiltroDirectorio
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedAgencia={selectedAgencia}
                setSelectedAgencia={setSelectedAgencia}
                agencias={agencias}
            />
            
            {/* Tarjetas de los directorios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedData.length > 0 ? (
                    paginatedData.map((data) => (
                        <div
                            key={data.id}
                            className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Botones de editar y borrar */}
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-75 hover:opacity-100 transition-opacity duration-300">
                                <Link
                                    to={`/dashboard-empleados/directorio/${data.id}`}
                                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(data.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Formateo de la extensión */}
                            <div className="flex items-center mb-4">
                                <Phone className="w-6 h-6 text-blue-500 mr-2" />
                                <span className="text-xl font-semibold">{formatExtension(data.extension)}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Building className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{data.agencia}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{data.empleado}</span>
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>{data.departamento}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron registros en el directorio.</p>
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
