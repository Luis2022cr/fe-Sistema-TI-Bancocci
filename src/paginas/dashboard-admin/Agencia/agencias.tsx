import { Building, Pencil, Hash, MapPin, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Agencia, ObtenerAgencia } from "@/api_conexion/servicios/agencias";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import FiltroAgencia from "@/components/FiltroAgencias";

export default function PaginaAgencias() {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
    
    const [error] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
    const [selectedAgencia] = useState<string>(''); // Estado para la agencia seleccionada

    const [paginaInicial, setPaginaInicial] = useState(1); // Estado para la paginación
    const itemsPerPage = 12; // Cambia este valor según tus necesidades

    //validacion otencion de datos
    if (!agenciaData) return <div>error al obtener los datos</div>

    // Filtrar las agencias según el término de búsqueda nombre, codigo, ubicacion
    const filteredDirectorio = agenciaData.filter((data: Agencia) => {

        const searchLower = searchTerm.toLowerCase();
        const agencyMatches = selectedAgencia === "" 

        return (
            agencyMatches &&
            (data.codigo.toString().includes(searchLower) ||
                data.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                data.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) 
                
            )
        );
    });


    // Paginación
    const totalPaginas = Math.ceil(filteredDirectorio.length / itemsPerPage);
    const paginatedData = filteredDirectorio.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);
    // Otros, Loadings y errores
    if ( loadingAgencias) return <Loading />
    if (error) return <p>{error}</p>;

    return (
        <div className="container px-4 py-10 mx-auto">
            <h1 className="mb-16 text-3xl font-bold text-center">
                Agencias Zona Occidental
            </h1>

            {/* Componente de filtros */}
            <FiltroAgencia
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Tarjetas de las agencias*/}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                {paginatedData.length > 0 ? (
                    paginatedData.map((data: Agencia) => (
                        <div
                            key={data.id}
                            className="relative p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                        >
                            {/* Botones de editar y borrar */}
                            <div className="absolute flex space-x-2 transition-opacity duration-300 opacity-75 top-3 right-3 hover:opacity-100">
                                <Link
                                    to={`/administracion/actualizar-agencia/${data.id}`}
                                    className="text-gray-400 transition-colors duration-300 hover:text-blue-500"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Formateo de la agencias */}
                            <div className="flex items-center mb-4">
                                <Hash className="w-6 h-6 mr-2 text-blue-500" />
                                <span className="text-xl font-semibold">{data.codigo}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Building className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>{data.nombre} - {data.codigo}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>{data.ubicacion}</span>
                                </div>
                                <div className="flex items-center">
                                    {data.estado_agencias === "Operativo" ? (
                                        <CircleCheck className="w-5 h-5 mr-2 text-green-500" /> // Ícono para "Operativo"
                                    ) : (
                                        <CircleX className="w-5 h-5 mr-2 text-red-500" /> // Ícono para "Inactivo"
                                    )}
                                    <span>{data.estado_agencias}</span>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron registros en las agencias.</p>
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
