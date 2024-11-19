import { ObtenerUPS } from "@/api_conexion/servicios/ups";
import { PencilIcon, ClockIcon,  CalendarIcon, ZapIcon,  Globe,  MapPin, BatteryIcon, CpuIcon } from "lucide-react";
import Loading from '../Loading';
import { Link, useParams } from "react-router-dom";
import { formatearFecha } from "../campos/FormateoFecha";
import { useState, Suspense } from "react";
import BotonRegresar from "../Regresar";
import Pagination from "../Pagination";
import lista from "../../assets/listaReport.svg";
import FiltroUps from "./filtroUps";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";

interface ExportData {
    nombre: string;
    agencia: string;
    direccion_ip: string;
    modelo: string;
    kva: number;
    fecha_instalacion: string;
    proximo_cambio: string;
}

const tipoTamanoMap: { [key: number]: string } = {
    1: "Pequeño",
    2: "Grande"
};

export default function Pagina_Ups() {
  
    const { tipoTamanoId } = useParams<{ tipoTamanoId?: string }>();
    const Id = tipoTamanoId ? parseInt(tipoTamanoId, 10) : undefined;
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAgencia, setSelectedAgencia] = useState<string>("");
    const [paginaInicial, setPaginaInicial] = useState(1);
    const itemsPerPage = 9;

    const [{ data: upsData, loading: loadingUps }] = ObtenerUPS(Id);

    if (loadingUps || loadingAgencias) return <Loading />;
    if (!upsData || !agenciaData) return <div>Error al obtener los datos</div>;

    const filtroUps = upsData.filter((data) => {
        const searchLower = searchTerm.toLowerCase();
        const agencyMatches = selectedAgencia === "" || data.agencia.toLowerCase() === selectedAgencia.toLowerCase();

        return (
            agencyMatches &&
            (data.agencia?.toLowerCase().includes(searchLower) ||
            data.nombre?.toLowerCase().includes(searchLower) ||
            data.direccion_ip?.toLowerCase().includes(searchLower) ||
            data.modelo?.toLowerCase().includes(searchLower))
        );
    });

    const tamañoNombre = tipoTamanoMap[Id!];
    const totalPaginas = Math.ceil(filtroUps.length / itemsPerPage);
    const paginatedData = filtroUps.slice((paginaInicial - 1) * itemsPerPage, paginaInicial * itemsPerPage);

    const exportToExcel = async () => {
        const ExcelJS = (await import('exceljs')).default;
        const groupedData: { [key: string]: ExportData[] } = filtroUps.reduce((acc: Record<string, ExportData[]>, curr) => {
          const key = `${curr.agencia}`;
          if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                nombre: curr.nombre,
                agencia: curr.agencia,
                direccion_ip: curr.direccion_ip || 'N/A',
                modelo: curr.modelo || 'N/A',
                kva: curr.kva,
                fecha_instalacion: formatearFecha(curr.fecha_instalacion),
                proximo_cambio: formatearFecha(curr.proximo_cambio),
            });
            return acc;
        }, {});

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("UPS Reporte");

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre', width: 25 },
            { header: 'Agencia', key: 'agencia', width: 25 },
            { header: 'Dirección IP', key: 'direccion_ip', width: 20 },
            { header: 'Modelo', key: 'modelo', width: 20 },
            { header: 'KVA', key: 'kva', width: 10 },
            { header: 'Fecha Instalación', key: 'fecha_instalacion', width: 20 },
            { header: 'Próximo Cambio', key: 'proximo_cambio', width: 20 },
        ];

        for (const [agencia, upsList] of Object.entries(groupedData)) {
            const agenciaRow = worksheet.addRow([agencia, '', '', '', '', '', '']);
            agenciaRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            agenciaRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '22C55E' },
            };

            upsList.forEach((ups) => {
                worksheet.addRow(ups);
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const nombreAgencia = selectedAgencia ? selectedAgencia.replace(/\s+/g, '_') : 'ups';
        const nombreArchivo = `reporte_ups_${nombreAgencia}.xlsx`;

        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const isAdminDashboard = window.location.pathname.includes('dashboard-admin');

    return (
        <>
            <BotonRegresar />
            <div className="container p-4 mx-auto -mt-8">
                <h1 className="mb-5 text-3xl font-bold text-center">UPS: {tamañoNombre}</h1>

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

                <FiltroUps
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedAgencia={selectedAgencia}
                    setSelectedAgencia={setSelectedAgencia}
                    agencias={agenciaData}

                />

                {/* Tarjeta de informacion */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((ups, index) => (
          <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="p-4 text-white bg-blue-900">
              <h3 className="text-xl font-semibold">{ups.nombre}</h3>
              <div className="flex items-center mt-2">
                <ZapIcon className="w-5 h-5 mr-2" />
                <span>{ups.kva} KVa</span>
              </div>
              <div className="flex items-center mt-2">
                <Globe className="w-5 h-5 mr-2" />
                <span className="font-bold">{ups.direccion_ip !== null ? ups.direccion_ip : 'N/A'}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {/* Formateo de la fecha de instalación */}
                  <span className="text-sm">Instalado: {formatearFecha(ups.fecha_instalacion)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-cyan-500" />
                  <span className="text-sm">Agencia: {ups.agencia}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                  {/* Formateo de la fecha del próximo cambio */}
                  <span className="text-sm">Próximo cambio: {formatearFecha(ups.proximo_cambio)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="text-sm">Años de uso: {ups.años_uso}</span>
                </div>
                <div className="flex items-center">
                  <BatteryIcon className="w-5 h-5 mr-2 text-purple-500" />
                  {/* Mostrar N/A si baterías es null */}
                  <span className="text-sm">Baterías: {ups.baterias !== null ? ups.baterias : 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <CpuIcon className="w-5 h-5 mr-2 text-purple-500" />
                  {/* Mostrar N/A si modulos es null */}
                  <span className="text-sm">Módulos: {ups.modulos !== null ? ups.modulos : 'N/A'}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-2 font-semibold">Observaciones:</h4>
                <p className="text-sm text-gray-600">{ups.observacion}</p>
              </div>
            </div>
            <div className="flex justify-end p-4 space-x-2 bg-gray-100">
              <Link 
                      to={isAdminDashboard ? `/dashboard-admin/ups/editar-ups/${ups.id}` : `/dashboard-empleados/ups/editar-ups/${ups.id}`}

              className="p-2 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600">
                <PencilIcon className="w-5 h-5" />
              </Link>
             {/* Condicionalmente cambia el enlace según la ruta actual */}
      <Link
        to={isAdminDashboard ? `/dashboard-admin/historial_ups/${ups.id}` : `/dashboard-empleados/historial_ups/${ups.id}`}
        className="p-2 text-white transition-colors bg-yellow-700 rounded-full hover:bg-yellow-800"
      >
        <ClockIcon className="w-5 h-5" />
      </Link>
              
            </div>
          </div>
        ))}
      </div>

                {paginatedData.length > 0 && (
                    <Pagination
                        PaginaInicial={paginaInicial}
                        TotalPaginas={totalPaginas}
                        onPageChange={setPaginaInicial}
                    />
                )}
            </div>
        </>
    );
}
