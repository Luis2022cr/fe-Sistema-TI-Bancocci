import { ObtenerInventarioConHistorial } from "@/api_conexion/servicios/inventarios"; // Asegúrate de que esta función esté correctamente implementada
import { ServerIcon, MapPinIcon, CirclePower, CpuIcon, Hash, ServerCrash } from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import { formatearFecha } from '../campos/FormateoFecha';
import { FaPlusCircle } from "react-icons/fa";
import { Suspense, useState } from "react";
import Modal from "../Modal";
import BotonRegresar from "../Regresar";
import Crear_HistorialInventario from "./crear_historialInventario";
import lista from "../../assets/listaReport.svg";



const Historial_Inventario = () => {
    const { id } = useParams<{ id?: string }>();
    const NumericId = id ? parseInt(id, 10) : undefined;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [{ data: inventarioData, loading: loadingInventario }] = ObtenerInventarioConHistorial(NumericId);

    if (loadingInventario) return <Loading />;
    if (!inventarioData) return <div>Error al obtener los datos.</div>;

    const exportToExcel = async () => {
        const ExcelJS = (await import("exceljs")).default;
    
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
    
        // Crear una hoja de trabajo para el inventario
        const worksheet = workbook.addWorksheet(`Inventario ${inventarioData.codigo}`);
    
       
    
        // Agregar una fila con el título "Información de Equipo"
        const infoEquipoRow = worksheet.addRow(['', 'Información de Equipo']);
        infoEquipoRow.font = { bold: true };
        infoEquipoRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } };
    
        // Agregar información general del inventario en las primeras filas
        const informacionGeneral = [
            { campo: 'Nº Inventario', valor: inventarioData.codigo },
            { campo: 'Serie', valor: inventarioData.serie },
            { campo: 'Marca', valor: inventarioData.marca },
            { campo: 'Modelo', valor: inventarioData.modelo },
            { campo: 'Agencia Origen', valor: inventarioData.agencia_origen },
            { campo: 'Agencia Actual', valor: inventarioData.agencia_actual },
            { campo: 'Estado', valor: inventarioData.estado },
            { campo: 'Tipo Inventario', valor: inventarioData.tipo_inventario },
        ];
    
        informacionGeneral.forEach((data) => {
            worksheet.addRow([data.campo, data.valor]);
        });
    
        // Ajustar el tamaño de las columnas después de agregar todas las filas
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column?.eachCell?.({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });
    
        // Aplicar estilo a las filas de información general (encabezado)
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.font = { bold: true, color: { argb: 'FFFFFF' } }; // Encabezado con fondo blanco y texto en negrita
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } }; // Color de fondo
            } else {
                row.font = { color: { argb: '000000' } }; // Texto negro para el resto de las filas
            }
        });
    
        // Agregar una fila vacía para separar la información del inventario del historial
        worksheet.addRow({});
    
        // Agregar una fila con el título "Historial de cambios"
        const historialRow = worksheet.addRow(['', 'Historial de cambios']);
        historialRow.font = { bold: true };
        historialRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } };
    
        // Agregar los encabezados de la tabla de historial de cambios
        worksheet.addRow(['Cambio', 'Fecha de Cambio', 'Usuario']);
        
        // Agregar las filas de historial de cambios
        inventarioData.historial.forEach((data) => {
            worksheet.addRow([
                data.cambio_realizado,
                formatearFecha(data.fecha_cambio),
                data.usuario,
            ]);
        });
    
        // Ajustar el tamaño de las columnas nuevamente después de agregar el historial
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
        const nombreArchivo = `inventario_${inventarioData.codigo.replace(/\s+/g, "_")}.xlsx`;
    
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

                    {/* boton para reportes */}
                    <div className="flex justify-end space-x-4 -mt-6 mr-10">
    <Suspense fallback={<Loading />}>
        <div className="flex items-center">
            <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 text-blue-900 transition-colors duration-300 bg-blue-100 rounded-full hover:text-white hover:bg-blue-600"
            >
                <img src={lista} alt="plan" width={40} height={40} />
                Generar Reporte
            </button>
        </div>
    </Suspense>
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
