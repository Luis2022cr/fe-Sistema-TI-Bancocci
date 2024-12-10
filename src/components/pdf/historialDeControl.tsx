import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Loading from "../Loading";
import { ObtenerControlEquipo } from "@/api_conexion/servicios/controlEquipo";

export default function HistorialControlEquipo() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [{ data: controlData, loading: loadingControl }] = ObtenerControlEquipo();

  if (loadingControl) return <Loading />;
  if (!controlData) return <div>Error al obtener los datos</div>;

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-700">
        Historial de Entrada y Salida de Equipo
      </h1>
      <div className="space-y-6">
        {controlData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div>
                <h2 className="text-xl font-semibold">{item.agencia}</h2>
                <p className="text-gray-600">{item.tecnico}</p>
              </div>
              <div className="flex items-center">
              <span className="mr-2 text-green-700 font-medium">{item.fecha}</span>
              {expandedItems.includes(index) ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Details */}
            {expandedItems.includes(index) && (
              <div className="p-4 bg-gray-100">
                {item.equipos.map((equipo, equipoIndex) => (
                  <div
                    key={equipoIndex}
                    className="bg-white p-4 rounded-md shadow mb-4 last:mb-0"
                  >
                    <h3 className="font-bold text-lg mb-2">
                      {equipo.descripcion_equipo}
                    </h3>
                    <div className="grid grid-cols-5 whitespace-nowrap text-sm">
                      <p>
                        <span className="font-medium">N. Inventario:</span>{" "}
                        {equipo.inventario}
                      </p>
                      <p>
                        <span className="font-medium">Modelo:</span>{" "}
                        {equipo.modelo_tipo}
                      </p>
                      <p>
                        <span className="font-medium">Serie:</span>{" "}
                        {equipo.serie}
                      </p>
                      <p>
                        <span className="font-medium">Pertenece a:</span>{" "}
                        {equipo.pertenece}
                      </p>
                      <p >
                        <span className="font-medium">Destino:</span>{" "}
                        {equipo.destino}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

