import { Phone, Building, User, Briefcase, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Loading from "../Loading";
import Pagination from "../Pagination";
import { BorrarDirectorios } from "@/api conexion/servicios/directorio";
import { Link } from "react-router-dom";
import FiltroDirectorio from "./FiltroDirectorio";
import { ObtenerAgencia } from "@/api conexion/servicios/agencias";
import { ObtenerDirectorios, Directorio } from '../../api conexion/servicios/directorio';
import Alert from "../Alert";

export default function PaginaDirectorio() {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    const [{ data: directorioData, loading: loadingDirectorio }] = ObtenerDirectorios();
    const directorio = Array.isArray(directorioData) ? directorioData : [];

    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
    const [selectedAgencia, setSelectedAgencia] = useState<string>(''); // Estado para la agencia seleccionada

    const [paginaInicial, setPaginaInicial] = useState(1); // Estado para la paginación
    const itemsPerPage = 12; // Cambia este valor según tus necesidades

    //validacion otencion de datos
    if (!directorio || !agenciaData) return <div>error al obtener los datos</div>

    //formato para la extension
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

     //Logica borrar directorio
     const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
        if (confirmDelete) {
            try {
                 await BorrarDirectorios(id);
                Alert({
                    title: 'Éxito',
                    text: `Se borro el directorio ${id}`,
                    icon: 'success',
                    callback: () => window.location.reload()
                });
            } catch (error) {
                <Alert
                        title="Error"
                        text="Hubo un problema al eliminar el directorio."
                        icon="error"
                    />;
                setError("Error al eliminar el directorio."); 
            } 
        }
    };

    // Filtrar los directorios según el término de búsqueda agencia, extension, departamento ingresados
    const filteredDirectorio = directorio.filter((data: Directorio) => {

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


    // Otros, Loadings y errores
    if (loadingDirectorio || loadingAgencias) {
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
                agencias={agenciaData
            />
            
            {/* Tarjetas de los directorios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedData.length > 0 ? (
                    paginatedData.map((data: Directorio) => (
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
