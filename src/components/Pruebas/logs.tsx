import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Calendar, Edit } from 'lucide-react';
import { ObtenerLogs } from '@/api_conexion/servicios/notifcaciones';
import Loading from '../Loading';

export default function LogViewer() {
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  // Obtener los logs usando el hook
  const [{ data: logsData, loading: loadingLogs }] = ObtenerLogs();

  if (loadingLogs) return <Loading />;
  if (!logsData) return <div>Error al obtener los datos</div>;

  // Función para manejar la expansión y contracción de los logs
  const toggleExpand = (id: number) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  // Renderizar el componente
  return (
    <div className="container mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700">Registro de Actividades</h1>

      {/* Lista de logs */}
      <div className="space-y-4">
        {logsData.map((log) => (
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
                {/* Detalles de los cambios realizados como lista */}
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
    </div>
  );
}
