import { Building, Pencil  } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { Marca, ObtenerMarca } from "@/api_conexion/servicios/marca";
import FiltroMarca from "@/components/FiltroMarca";

export default function PaginaMarcas() {
    const [{ data: MarcaData, loading: loadingMarca }] = ObtenerMarca();
    
    const [error] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
    const [selectedAgencia] = useState<string>(''); // Estado para la agencia seleccionada

    const [paginaInicial, setPaginaInicial] = useState(1); // Estado para la paginación
    const itemsPerPage = 12; // Cambia este valor según tus necesidades

    //validacion otencion de datos
    if (!MarcaData) return <div>error al obtener los datos</div>

    // Filtrar las agencias según el término de búsqueda nombre, codigo, ubicacion
    const filteredDirectorio = MarcaData.filter((data: Marca) => {

        //const searchLower = searchTerm.toLowerCase();
        const agencyMatches = selectedAgencia === "" 

        return (
            agencyMatches &&
            (
                data.nombre.toLowerCase().includes(searchTerm.toLowerCase()) 
                
            )
        );
    });


    // Paginación
    const totalPaginas = Math.ceil(filteredDirectorio.length / itemsPerPage);
    const paginatedData = filteredDirectorio.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);
    // Otros, Loadings y errores
    if ( loadingMarca) return <Loading />
    if (error) return <p>{error}</p>;

    return (
        <div className="container px-4 py-10 mx-auto">
            <h1 className="mb-16 text-3xl font-bold text-center">
               Marcas de Equipos Zona Occidental
            </h1>

            {/* Componente de filtros */}
            <FiltroMarca
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Tarjetas de las agencias*/}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                {paginatedData.length > 0 ? (
                    paginatedData.map((data: Marca) => (
                        <div
                            key={data.id}
                            className="relative p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                        >
                            {/* Botones de editar y borrar */}
                            <div className="absolute flex space-x-2 transition-opacity duration-300 opacity-75 top-3 right-3 hover:opacity-100">
                                <Link
                                    to={`/dashboard-admin/actualizar-marca/${data.id}`}
                                    className="text-gray-400 transition-colors duration-300 hover:text-blue-500"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Formateo de la agencias */}
                            <div className="flex items-center mb-4">
                                <Building className="w-6 h-6 mr-2 text-blue-500" />
                                <span className="text-xl font-semibold">{(data.nombre)}</span>
                            </div>
                           
                        </div>
                    ))
                ) : (
                    <p>No se encontraron registros en las marcas.</p>
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
