import { Phone, Building, User, Briefcase, Pencil, Trash } from "lucide-react";
import { Suspense, useState } from "react";
import Loading from "@/componentes/Loading";
import Pagination from "../Pagination";
import { BorrarDirectorios } from "@/api_conexion/servicios/directorio";
import { Link } from "react-router-dom";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";
import { ObtenerDirectorios, Directorio } from '../../api_conexion/servicios/directorio';
import formatExtension from "../campos/FormatoExtencion";
import lista from "../../assets/listaReport.svg";
import FiltroDirectorio from "./FiltroDirectorio";
import { Alert } from "../alertService";

interface ExportData {
    Extensión: string;
    Empleado: string;
    Departamento: string;
    Agencia: string;
    codigo: string;
}

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


    //Logica borrar directorio
    const handleDelete = async (id: number, extension: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
        if (confirmDelete) {
            try {
                await BorrarDirectorios(id);
                Alert(
                    'Éxito',
                    `Se borro el directorio: ${extension}`,
                    'success',
                    'Ok',
                    () => {window.location.reload()}
                );
            } catch (error) {
                Alert(
                    'Error',
                    `Hubo un problema al eliminar el directorio. ${extension}`,
                    'error',
                    'Ok',
                    () => { window.location.reload() }
                );
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

    // Generar reporte Excel
    const exportToExcel = async () => {
        // Cargar exceljs dinámicamente
        const ExcelJS = (await import('exceljs')).default;
    
        // Agrupar datos por agencia
        const groupedData: { [key: string]: ExportData[] } = filteredDirectorio.reduce((acc, curr) => {
            const key = `${curr.agencia} - ${curr.codigo}`;
            const extension = curr.extension;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                "Extensión": extension,
                "Departamento": curr.departamento,
                "Empleado": curr.empleado,
                "Agencia": key,
            });
            return acc;
        }, {});
    
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Directorio`);
    
        // Definir las columnas
        worksheet.columns = [
            { header: 'Extensión', key: 'Extensión', width: 25 },
            { header: 'Departamento', key: 'Departamento', width: 35 },
            { header: 'Usuario', key: 'Empleado', width: 35 },
        ];
    
        // Agregar datos
        for (const [agencia, empleados] of Object.entries(groupedData)) {
            const agenciaRow = worksheet.addRow([agencia, '', '']);
            agenciaRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            agenciaRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '22C55E' },
            };
            
    
            empleados.forEach((empleado: ExportData) => {
                const row = worksheet.addRow(empleado);
                row.getCell('Extensión').alignment = { horizontal: 'center' };
                row.getCell('Departamento').alignment = { horizontal: 'left' };
                row.getCell('Empleado').alignment = { horizontal: 'left' };
            });
        }
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
    
        // Crear un nombre dinámico para el archivo
        const nombreAgencia = selectedAgencia ? selectedAgencia.replace(/\s+/g, '_') : 'directorio'; // Reemplazar espacios por guiones bajos
        const nombreArchivo = selectedAgencia ? `directorio_${nombreAgencia}.xlsx` : 'directorio.xlsx';
    
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo; // Usar el nombre dinámico
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Otros, Loadings y errores
    if (loadingDirectorio || loadingAgencias) return <Loading />
    if (error) return <p>{error}</p>;

    return (
        <div className="container px-4 py-10 mx-auto">
            <h1 className="mb-5 text-3xl font-bold text-center">
                Directorio Telefónico Banco de Occidente
            </h1>

            {/* boton para reportes */}
            <Suspense fallback={<Loading />}>
                <div className="flex justify-end mt-5 mb-5">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-2 py-2 text-blue-900 transition-colors duration-300 bg-blue-100 rounded-full hover:text-white hover:bg-blue-600"
                    >
                        <img src={lista} alt="plan" width={40} height={40} />
                        Generar Reporte
                    </button>
                </div>
            </Suspense>


            {/* Componente de filtros */}
            <FiltroDirectorio
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedAgencia={selectedAgencia}
                setSelectedAgencia={setSelectedAgencia}
                agencias={agenciaData}
            />

            {/* Tarjetas de los directorios */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                {paginatedData.length > 0 ? (
                    paginatedData.map((data: Directorio) => (
                        <div
                            key={data.id}
                            className="relative p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                        >
                            {/* Botones de editar y borrar */}
                            <div className="absolute flex space-x-2 transition-opacity duration-300 opacity-75 top-3 right-3 hover:opacity-100">
                                <Link
                                    to={`/ti/directorio/${data.id}`}
                                    className="text-gray-400 transition-colors duration-300 hover:text-blue-500"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(data.id, data.extension)}
                                    className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Formateo de la extensión */}
                            <div className="flex items-center mb-4">
                                <Phone className="w-6 h-6 mr-2 text-blue-500" />
                                <span className="text-xl font-semibold">{formatExtension(data.extension)}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Building className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>{data.agencia} - {data.codigo}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>{data.empleado}</span>
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
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
