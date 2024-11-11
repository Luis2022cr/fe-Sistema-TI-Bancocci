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
import lista from "../../assets/listaReport.svg"; // Importar el icono de lista de reportes (si no tienes un icono, puedes usar uno de Lucide o FontAwesome)

const Historial_Ups = () => {
    const { id } = useParams<{ id?: string }>();
    const NumericId = id ? parseInt(id, 10) : undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [{ data: upsData, loading: loadingUps }] = ObtenerUPSConHistorial(NumericId);

    if (loadingUps) return <Loading />
    if (!upsData) return <div>error al obtener los datos</div>

    // Función para exportar el historial a Excel
    const exportToExcel = async () => {
        const ExcelJS = (await import("exceljs")).default;

        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();

        // Crear una hoja de trabajo para el historial de UPS
        const worksheet = workbook.addWorksheet(`Historial UPS ${upsData.nombre}`);

        // Agregar una fila con el título "Información de UPS"
        const infoUpsRow = worksheet.addRow(['', 'Información de UPS']);
        infoUpsRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        infoUpsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };

        // Agregar información general del UPS
        const informacionGeneral = [
            { campo: 'Nombre', valor: upsData.nombre },
            { campo: 'Modelo', valor: upsData.modelo },
            { campo: 'KVA', valor: upsData.kva },
            { campo: 'IP', valor: upsData.direccion_ip || 'N/A' },
            { campo: 'Fecha Instalación', valor: formatearFecha(upsData.fecha_instalacion) },
            { campo: 'Años de Uso', valor: upsData.años_uso },
            { campo: 'Próximo Cambio', valor: formatearFecha(upsData.fecha_instalacion) },
            { campo: 'Baterías', valor: upsData.baterias !== null ? upsData.baterias : 'N/A' },
            { campo: 'Módulos', valor: upsData.modulos !== null ? upsData.modulos : 'N/A' },
            { campo: 'Agencia', valor: upsData.agencia },
            { campo: 'Observaciones', valor: upsData.observacion }
        ];


        // Agregar filas de información general y alinearlas a la izquierda
        informacionGeneral.forEach((data) => {
            const row = worksheet.addRow([data.campo, data.valor]);

            // Alineación a la izquierda para ambas columnas
            row.getCell(1).alignment = { horizontal: 'left' };
            row.getCell(2).alignment = { horizontal: 'left' };
        });


        // Ajustar el tamaño de las columnas
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column?.eachCell?.({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

        // Agregar una fila vacía para separar la información del historial
        worksheet.addRow({});

        // Agregar una fila con el título "Historial de Cambios"
        const historialRow = worksheet.addRow(['', 'Historial de Cambios']);
        historialRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        historialRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } };

        // Agregar los encabezados de la tabla de historial de cambios
        const datos = worksheet.addRow(['Cambio', 'Fecha de Instalación', 'Próximo Cambio']);
        datos.font = { bold: true };

        datos.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };

        // Agregar las filas de historial de cambios
        upsData.historial.forEach((data) => {
            worksheet.addRow([
                data.cambio,
                formatearFecha(data.fecha_instalacion),
                formatearFecha(data.proximo_cambio),
            ]);
        });

        // Ajustar el tamaño de las columnas nuevamente
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column?.eachCell?.({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

        // Crear el archivo y descargarlo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        // Crear un nombre dinámico para el archivo
        const nombreArchivo = `historial_ups_${upsData.nombre.replace(/\s+/g, "_")}.xlsx`;

        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <BotonRegresar />

            {/* Botón para generar reporte */}
            <div className="flex justify-end space-x-4 -mt-6 mr-10">
                <div className="flex items-center">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 text-blue-900 transition-colors duration-300 bg-blue-100 rounded-full hover:text-white hover:bg-blue-600"
                    >
                        <img src={lista} alt="plan" width={40} height={40} />
                        Generar Reporte
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={openModal}
                        className="flex items-center gap-3 p-2 text-center text-white bg-green-700 rounded-full hover:bg-green-600 w-40"
                    >
                        <FaPlusCircle />
                        Agregar Cambio
                    </button>
                </div>
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
                            <span className="text-sm">Baterías: {upsData.baterias !== null ? upsData.baterias : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <CpuIcon className="w-5 h-5 mr-2 text-purple-500" />
                            <span className="text-sm">Módulos: {upsData.modulos !== null ? upsData.modulos : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-purple-500" />
                            <span className="text-sm">Agencia: {upsData.agencia}</span>
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
