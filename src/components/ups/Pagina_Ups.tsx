import { ObtenerUPS } from "@/api_conexion/servicios/ups";
import { PencilIcon, ClockIcon, BatteryIcon, CalendarIcon, ZapIcon, Search, X, Globe, CpuIcon, MapPin } from "lucide-react"
import Loading from '../Loading';
import { Link, useParams } from "react-router-dom";
import { formatearFecha } from "../campos/FormateoFecha";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import BotonRegresar from "../Regresar";

const tipoTamanoMap: { [key: number]: string } = {
  1: "Pequeño",
  2: "Grande"
};

export default function Pagina_Ups() {
  const { tipoTamanoId } = useParams<{ tipoTamanoId?: string }>();
  const Id = tipoTamanoId ? parseInt(tipoTamanoId, 10) : undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [{ data: upsData, loading: loadingUps }] = ObtenerUPS(Id);

  if (loadingUps) return <Loading />
  if (!upsData) return <div>error al obtener los datos</div>

  // Estado para el término de búsqueda
  // Filtrar los inventarios según el término de búsqueda
  const filtroUps = upsData.filter((data) =>
    (data.agencia?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (data.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (data.direccion_ip?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (data.modelo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Obtener el nombre del tipo de tamaño usando el Id
  const tamañoNombre = tipoTamanoMap[Id!];

  return (
    <>
      <BotonRegresar />
      <div className="container p-4 mx-auto -mt-16">
        <h1 className="mb-5 text-3xl font-bold text-center">Ups: {tamañoNombre}</h1>

        {/* Barra de búsqueda */}
        <div className="flex mb-6 space-x-4">
          <div className="relative flex-1">
            <div className="flex items-center w-4/6 border border-gray-300 rounded">
              <span className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-l">
                <Search />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, agencia, IP, modelo"
                className="block w-full p-2 rounded-r focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-red-500"
                >
                  <X />
                </button>
              )}
            </div>
          </div>
          <div className="flex-none">
            <Link
              to='/dashboard-admin/crear/ups'
              className="flex items-center gap-3 p-1 mt-1 text-center text-white bg-green-700 rounded-full w-28 hover:bg-green-600"
            >
              <FaPlusCircle />
              Agregar
            </Link>
          </div>
        </div>

        {/* Tarjeta de informacion */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtroUps.map((ups, index) => (
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
                <button className="p-2 text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600">
                  <PencilIcon className="w-5 h-5" />
                </button>
                {/* <button className="p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600">
                <TrashIcon className="w-5 h-5" />
              </button> */}
                <Link to={`/dashboard-admin/historial_ups/${ups.id}`} className="p-2 text-white transition-colors bg-yellow-700 rounded-full hover:bg-yellow-800">
                  <ClockIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
