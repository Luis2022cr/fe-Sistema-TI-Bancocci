import { ZapIcon, ServerIcon, CalendarIcon, ClockIcon, CpuIcon, BatteryIcon, MapPinIcon } from "lucide-react";
import { IoArrowUndoOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const upsData = {
    nombre: "UPS Central",
    modelo: "APC Smart-UPS 3000",
    estado_ups: "En operación",
    kva: 3,
    direccion_ip: "192.168.1.100",
    fecha_instalacion: "15/03/2020",
    años_uso: 4,
    proximo_cambio: "15/03/2025",
    modulos: 5,
    baterias: 16,
    agencia: "Central",
    tipo_tamano: "Grande",
    observacion: "UPS funcionando correctamente, no se ha detectado ninguna anomalía."
};

const historicalChanges = [
    { id: 1, cambio: "Cambio de batería", fecha_instalacion: "15/03/2022", proximo_cambio: "15/03/2025" },
    { id: 2, cambio: "Revisión general", fecha_instalacion: "15/03/2021", proximo_cambio: "15/03/2023" }
];

const UpsCard = () => {
    const navigate = useNavigate();


    return (
        <>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
            >
                <IoArrowUndoOutline />
                Regresar
            </button>
            
            <div className="flex w-full p-6 space-x-8 bg-white">
                {/* Parte izquierda: Información del UPS */}
                <div className="w-1/2">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">{upsData.nombre}</h2>
                        <p className="text-gray-500">{upsData.modelo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <ZapIcon className="w-5 h-5 mr-2 text-yellow-500" />
                            <span>{upsData.kva} KVA</span>
                        </div>
                        <div className="flex items-center">
                            <ServerIcon className="w-5 h-5 mr-2 text-blue-500" />
                            <span>{upsData.direccion_ip}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span>Instalado: {upsData.fecha_instalacion}</span>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                            <span>Años de uso: {upsData.años_uso}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-red-500" />
                            <span>Próximo cambio: {upsData.proximo_cambio}</span>
                        </div>
                        <div className="flex items-center">
                            <CpuIcon className="w-5 h-5 mr-2 text-indigo-500" />
                            <span>Módulos: {upsData.modulos}</span>
                        </div>
                        <div className="flex items-center">
                            <BatteryIcon className="w-5 h-5 mr-2 text-orange-500" />
                            <span>Baterías: {upsData.baterias}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-pink-500" />
                            <span>Agencia: {upsData.agencia}</span>
                        </div>

                    </div>
                    <div className="mt-4">
                        <h4 className="mb-2 font-semibold">Observaciones:</h4>
                        <p className="text-sm text-gray-600">{upsData.observacion}</p>
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
                                    <th className="px-4 py-2 text-left">Próximo Cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalChanges.map((change) => (
                                    <tr key={change.id} className="border-b">
                                        <td className="px-4 py-2">{change.cambio}</td>
                                        <td className="px-4 py-2">{change.fecha_instalacion}</td>
                                        <td className="px-4 py-2">{change.proximo_cambio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpsCard;
