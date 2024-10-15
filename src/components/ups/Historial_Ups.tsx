import { ObtenerUPSConHistorial } from "@/api_conexion/servicios/ups";
import { ZapIcon, ServerIcon, CalendarIcon, ClockIcon, CpuIcon, BatteryIcon, MapPinIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import { formatearFecha } from '../campos/FormateoFecha';
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import Crear_HistorialUps from "./crear_historialUps";
import Modal from "../Modal";
import BotonRegresar from "../Regresar";

const Historial_Ups = () => {
    const { id } = useParams<{ id?: string }>();
    const NumericId = id ? parseInt(id, 10) : undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [{ data: upsData, loading: loadingUps }] = ObtenerUPSConHistorial(NumericId);

    if (loadingUps) return <Loading />
    if (!upsData) return <div>error al obtener los datos</div>


    return (
        <>
            <BotonRegresar />

            <div className="flex justify-end -mt-6 mr-10">
                <button
                    onClick={openModal}
                    className="flex items-center gap-3 p-1 mt-1 text-center text-white bg-green-700 rounded-full w-40 hover:bg-green-600"
                >
                    <FaPlusCircle />
                    Agregar Cambio
                </button>
            </div>
            <div className="flex items-center w-full p-11 gap-2 bg-white">
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
                            <span>IP: {upsData.direccion_ip !== null ? upsData.direccion_ip : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span>Instalado: {formatearFecha(upsData.fecha_instalacion)}</span>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                            <span>Años de uso: {upsData.años_uso}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-red-500" />
                            <span>Próximo cambio: {formatearFecha(upsData.fecha_instalacion)}</span>
                        </div>
                        <div className="flex items-center">
                            <BatteryIcon className="w-5 h-5 mr-2 text-purple-500" />
                            {/* Mostrar N/A si baterías es null */}
                            <span className="text-sm">Baterías: {upsData.baterias !== null ? upsData.baterias : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <CpuIcon className="w-5 h-5 mr-2 text-purple-500" />
                            {/* Mostrar N/A si modulos es null */}
                            <span className="text-sm">Módulos: {upsData.modulos !== null ? upsData.modulos : 'N/A'}</span>
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
                                {upsData.historial.length > 0 ? (
                                    upsData.historial.map((data, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{data.cambio}</td>
                                            <td className="px-4 py-2">{formatearFecha(data.fecha_instalacion)}</td>
                                            <td className="px-4 py-2">{formatearFecha(data.proximo_cambio)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-2 text-center text-gray-600">
                                            No hay historial de cambios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <Crear_HistorialUps upsId={id} upsNombre={upsData.nombre} />
                </Modal>
            )}
        </>
    );
};

export default Historial_Ups;
