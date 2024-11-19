import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Calendar, Edit, Search, X } from 'lucide-react';
import { ObtenerLogs } from '@/api_conexion/servicios/notifcaciones';
import Loading from '../Loading';

export default function LogViewer() {
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [{ data: logsData, loading: loadingLogs }] = ObtenerLogs();

  // Estados para filtro de fechas, búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logsPerPage] = useState<number>(15);

  // Filtrado de logs por búsqueda y fechas
  const filteredLogs = logsData
  ?.filter((log) => {
    const matchesSearch =
      log.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.cambio_realizado.toLowerCase().includes(searchTerm.toLowerCase());

    const logDate = new Date(log.fecha_cambio);

    // Restar 6 horas a la fecha del log para ajustar a la zona horaria correcta
    logDate.setHours(logDate.getHours() - 6);

    // Manejar filtro por fecha considerando el día completo con hora UTC
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Si existe fecha de inicio, fijamos la hora desde el inicio del día (00:00:00)
    if (start) {
      start.setUTCHours(0, 0, 0, 0);
    }

    // Si existe fecha de fin, fijamos la hora hasta el final del día (23:59:59)
    if (end) {
      end.setUTCHours(23, 59, 59, 999);
    }

    // Comparamos el logDate ajustado con el rango definido
    const isAfterStartDate = start ? logDate >= start : true;
    const isBeforeEndDate = end ? logDate <= end : true;

    return matchesSearch && isAfterStartDate && isBeforeEndDate;
  }) || [];



  // Paginación
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Manejador de búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reiniciar la página al buscar
  };

  // Manejador de cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejo de expansión de logs
  const toggleExpand = (id: number) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  if (loadingLogs) return <Loading />;
  if (!logsData) return <div>Error al obtener los datos</div>;

  return (
    <div className="container mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700">Registro de Actividades</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded w-4/6">
                        <span className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-l text-white">
                            <Search />
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Buscar por descripción o cambios..."
                            className="block w-full p-2 rounded-r focus:outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-red-500"
                            >
                                <X />
                            </button>
                        )}
                    </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        />
        <div className='items-center mt-2'>-</div>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Lista de logs */}
      <div className="space-y-4">
        {currentLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border-orange-700 border-2 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-orange-500/50"
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleExpand(log.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-black">
                  {log.descripcion}
                </span>
              </div>
              {expandedLog === log.id ? (
                <ChevronUp className="text-orange-400" />
              ) : (
                <ChevronDown className="text-orange-400" />
              )}
            </div>

            {/* Detalles del log expandido */}
            {expandedLog === log.id && (
              <div className="px-4 pb-4 text-gray-900 space-y-4 text-base">
                <div className="flex items-center space-x-2">
                  <Edit className="text-orange-400" size={30} />
                  <span className="font-semibold">Detalles de los cambios realizados:</span>
                </div>
                <ul className="list-disc list-inside pl-6">
                  {log.cambio_realizado
                    .split(',')
                    .map((cambio, index) => (
                      <li key={index} className="text-gray-800">
                        {cambio.trim()}
                      </li>
                    ))}
                </ul>

                <div className="flex items-center space-x-2">
                  <Calendar className="text-orange-400" size={30} />
                  <span>{new Date(log.fecha_cambio).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="text-orange-400" size={30} />
                  <span>Usuario: {log.usuario_nombre}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 rounded border border-orange-400 text-orange-500 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="font-semibold">{currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 rounded border border-orange-400 text-orange-500 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
