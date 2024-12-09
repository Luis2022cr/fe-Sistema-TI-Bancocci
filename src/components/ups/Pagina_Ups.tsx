import { ObtenerUPS } from "@/api_conexion/servicios/ups";
import { PencilIcon, ClockIcon, CalendarIcon, ZapIcon, Globe, MapPin, BatteryIcon, CpuIcon } from "lucide-react";
import Loading from '../Loading';
import { Link, useParams } from "react-router-dom";
import { formatearFecha } from "../campos/FormateoFecha";
import { useState } from "react";
import BotonRegresar from "../Regresar";
import Pagination from "../Pagination";
import FiltroUps from "./filtroUps";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";
import Reporte_UPS from "./Reporte_UPS";
////////////////////////////


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

  
  const isAdminDashboard = window.location.pathname.includes('administracion');

  return (
    <>
      <BotonRegresar />
      <div className="container p-4 mx-auto -mt-8">
        <h1 className="mb-5 text-3xl font-bold text-center">UPS: {tamañoNombre}</h1>

        <Reporte_UPS/>

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
                  to={isAdminDashboard ? `/administracion/ups/editar-ups/${ups.id}` : `/empleado/ups/editar-ups/${ups.id}`}

                  className="p-2 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600">
                  <PencilIcon className="w-5 h-5" />
                </Link>
                {/* Condicionalmente cambia el enlace según la ruta actual */}
                <Link
                  to={isAdminDashboard ? `/administracion/historial_ups/${ups.id}` : `/empleado/historial_ups/${ups.id}`}
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
