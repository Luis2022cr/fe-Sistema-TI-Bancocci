import { ObtenerInventarioConHistorial } from "@/api_conexion/servicios/inventarios"; // Asegúrate de que esta función esté correctamente implementada
import { ServerIcon, MapPinIcon, CirclePower, CpuIcon, Hash, ServerCrash } from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import { formatearFecha } from '../campos/FormateoFecha';
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import Modal from "../Modal";
import BotonRegresar from "../Regresar";
import Crear_HistorialInventario from "./crear_historialInventario";

const Historial_Inventario = () => {
    const { id } = useParams<{ id?: string }>();
    const NumericId = id ? parseInt(id, 10) : undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [{ data: inventarioData, loading: loadingInventario }] = ObtenerInventarioConHistorial(NumericId);

    if (loadingInventario) return <Loading />;
    if (!inventarioData) return <div>Error al obtener los datos.</div>;

    console.log(inventarioData)
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
                {/* Parte izquierda: Información del Inventario */}
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
                            <span>Inventario: {inventarioData.codigo}</span>
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
                                    <th className="px-4 py-2 text-left">Fecha de Cambio</th>
                                    <th className="px-4 py-2 text-left">Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventarioData.historial && inventarioData.historial.length > 0 ? (
                                    inventarioData.historial.map((data, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{data.cambio_realizado}</td>
                                            <td className="px-4 py-2">{formatearFecha(data.fecha_cambio)}</td>
                                            <td className="px-4 py-2">{data.usuario}</td>
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
            {/* Modal para agregar nuevo cambio */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <Crear_HistorialInventario inventarioId={id} inventarioNombre={inventarioData.codigo} />
                </Modal>
            )}
        </>
    );
};

export default Historial_Inventario;
