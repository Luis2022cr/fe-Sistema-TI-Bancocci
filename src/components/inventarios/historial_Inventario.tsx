import { ServerCrash, ServerIcon, CirclePower, CpuIcon, Hash, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { IoArrowUndoOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const HistorialInventario: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);
  const navigate = useNavigate();

  const inventarioData = {
    n_inventario: "10164892",
    serie: "4757XJ878F",
    marca: "DELL",
    modelo: "E2016H",
    agencia_origen: "Principal",
    agencia_actual: "El Way",
    estado: "Reparada",
    tipo_inventario: "Desktop",
    comentarios: "Equipo funcionando correctamente",
};

  const historicalChanges = [
    { id: 1, cambio: "Cambio de placa", fecha_instalacion: "15/03/2022", realizo: "Allan Flores" },
    { id: 2, cambio: "Revisión general", fecha_instalacion: "15/03/2021", realizo: "Nicky Ramos" }
];
  
  return (

    <>
    <button 
        onClick={() => navigate(-1)}
        className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
    >
    <IoArrowUndoOutline />
        Regresar
    </button>

    <div className="h-full flex mx-6">
        
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mt-4 text-blue-900">Historial de Mantenimiento</h1>
        <div className="flex w-full p-6 space-x-8 bg-white">
            {/* Parte izquierda: Información del UPS */}
            <div className="w-1/2">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">{inventarioData.marca}</h2>
                        <p className="text-gray-500">{inventarioData.modelo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                            <CpuIcon className="w-5 h-5 mr-2 text-indigo-500" />
                            <span>Tipo Inventario: {inventarioData.tipo_inventario}</span>
                        </div>
                        <div className="flex items-center">
                            <Hash className="w-5 h-5 mr-2 text-orange-500" />
                            <span>Inventario: {inventarioData.n_inventario}</span>
                        </div>
                        <div className="flex items-center">
                            <ServerCrash className="w-5 h-5 mr-2 text-yellow-500" />
                            <span>Serie: {inventarioData.serie}</span>
                        </div>
                        <div className="flex items-center">
                            <ServerIcon className="w-5 h-5 mr-2 text-blue-500" />
                            <span>Modelo: {inventarioData.modelo}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span>Agencia Origen: {inventarioData.agencia_origen}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-purple-500" />
                            <span>Agencia Actual: {inventarioData.agencia_actual}</span>
                        </div>
                        <div className="flex items-center">
                            <CirclePower className="w-5 h-5 mr-2 text-red-500" />
                            <span>Estado: {inventarioData.estado}</span>
                        </div>
                        
                        

                    </div>
                    <div className="mt-4">
                        <h4 className="mb-2 font-semibold">Observaciones:</h4>
                        <p className="text-sm text-gray-600">{inventarioData.comentarios}</p>
                    </div>
                </div>
            {/* Parte derecha: Historial de cambios */}
            <div className="w-1/2">
                    <h4 className="mb-4 font-semibold">Historial de Cambios</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left">Cambio</th>
                                    <th className="px-4 py-2 text-left">Fecha de Instalación</th>
                                    <th className="px-4 py-2 text-left">Realizo Cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalChanges.map((change) => (
                                    <tr key={change.id} className="border-b">
                                        <td className="px-4 py-2">{change.cambio}</td>
                                        <td className="px-4 py-2">{change.fecha_instalacion}</td>
                                        <td className="px-4 py-2">{change.realizo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </>
  );
};

export default HistorialInventario;
