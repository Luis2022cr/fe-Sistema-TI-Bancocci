import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import Loading from "@/componentes/Loading";
import { ObtenerControlEquipo, Reparacion } from "@/api_conexion/servicios/controlEquipo";
import { FaFilePdf } from "react-icons/fa";
import { formatearFecha } from "../campos/FormateoFecha";
import Pagination from "../Pagination";

export default function HistorialControlEquipo() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 10;
  const [{ data: controlData, loading: loadingControl }] = ObtenerControlEquipo();

  if (loadingControl) return <Loading />;
  if (!controlData) return <div>Error al obtener los datos</div>;

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getBooleanFields = (item: Reparacion) => {
    const fields = [
      { key: "equipo_reparacion", label: "Equipo Reparación" },
      { key: "equipo_prestado", label: "Equipo Prestado" },
      { key: "cambio_equipo", label: "Cambio de Equipo" },
      { key: "devolucion_equipo", label: "Devolución de Equipo" },
      { key: "entrega_equipo", label: "Entrega de Equipo" },
      { key: "equipo_reparado", label: "Equipo Reparado" },
      { key: "infraestructura", label: "Infraestructura" },
      { key: "soporte", label: "Soporte" },
    ];

    return fields.filter((field) => item[field.key] === 1).map((field) => field.label);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    return controlData.filter((item) => {
      const matchesSearch =
        item.agencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tecnico.toLowerCase().includes(searchTerm.toLowerCase());

      const logDate = new Date(item.fecha_creacion);
      logDate.setHours(logDate.getHours() - 6);

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) {
        start.setUTCHours(0, 0, 0, 0);
      }

      if (end) {
        end.setUTCHours(23, 59, 59, 999);
      }

      const isAfterStartDate = start ? logDate >= start : true;
      const isBeforeEndDate = end ? logDate <= end : true;

      return matchesSearch && isAfterStartDate && isBeforeEndDate;
    });
  };

  const filteredData = handleSearch();
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-700">
        Historial de Entrada y Salida de Equipo
      </h1>
      <div className="flex mb-6 space-x-4 justify-between">
        <div className="flex-1 relative">
          <div className="flex items-center border border-gray-300 rounded w-4/6">
            <span className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-l text-white">
              <Search />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por agencia, técnico"
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
        <div className="flex space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 rounded"
          />
          <span className="flex items-center">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="space-y-6">
        {paginatedData.map((item, index) => {
          const booleanFields = getBooleanFields(item);
          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden border-2 border-orange-700"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.agencia}</h2>
                  <p className="text-gray-600">{item.tecnico}</p>
                  {booleanFields.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-700">
                      {booleanFields.map((field, i) => (
                        <li key={i} className="inline-block mr-2 px-2 py-1 bg-green-100 text-green-800 rounded">
                          {field}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-green-700 font-medium">{formatearFecha(item.fecha_creacion)}</span>
                  {expandedItems.includes(index) ? <ChevronUp /> : <ChevronDown />}
                  <a
                    href={`/ti/historial-control-equipo/${item.reparacion_id}`}
                    className="ml-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-900 rounded shadow"
                  >
                    <FaFilePdf />
                  </a>
                </div>
              </div>

              {/* Details */}
              {expandedItems.includes(index) && (
                <div className="p-4 bg-gray-100">
                  {item.equipos.map((equipo, equipoIndex) => (
                    <div
                      key={equipoIndex}
                      className="bg-white p-4 rounded-md shadow border-2 border-orange-700 mb-4 last:mb-0"
                    >
                      <h3 className="font-bold text-lg mb-2">{equipo.descripcion_equipo}</h3>
                      <div className="grid grid-cols-5 whitespace-nowrap text-sm">
                        <p>
                          <span className="font-medium">N. Inventario:</span> {equipo.inventario}
                        </p>
                        <p>
                          <span className="font-medium">Modelo:</span> {equipo.modelo_tipo}
                        </p>
                        <p>
                          <span className="font-medium">Serie:</span> {equipo.serie}
                        </p>
                        <p>
                          <span className="font-medium">Pertenece a:</span> {equipo.pertenece}
                        </p>
                        <p>
                          <span className="font-medium">Destino:</span> {equipo.destino}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Pagination
        PaginaInicial={currentPage}
        TotalPaginas={Math.ceil(filteredData.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
