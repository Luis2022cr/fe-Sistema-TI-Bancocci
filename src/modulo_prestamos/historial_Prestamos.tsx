import { MapPinIcon, CirclePower, Hash, CalendarDays } from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "@/componentes/Loading";
import { Suspense, useState } from "react";
import lista from "@/assets/listaReport.svg";
import { ObtenerExpedienteConHistorial } from "@/api_conexion/servicios/historialPrestamos";
import Pagination from "@/modulo_ti/Pagination";
import BotonRegresar from "@/modulo_ti/Regresar";

const HistorialPrestamos = () => {
    const { id } = useParams<{ id?: string }>();
    const numericId = id ? parseInt(id, 10) : undefined;
    const [{ data: expedienteData, loading: loadingExpediente }] = ObtenerExpedienteConHistorial(numericId);

    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 5;


    if (loadingExpediente) return <Loading />;
    if (!expedienteData) return <div>Error al obtener los datos.</div>;

    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const historialPaginaActual = expedienteData.historial.slice(inicio, fin);

    const totalPaginas = Math.ceil(expedienteData.historial.length / elementosPorPagina);

    const formatearFecha = (fecha: string) => {
        const opciones: Intl.DateTimeFormatOptions = {
            timeZone: "America/Mexico_City", // Cambia a tu zona horaria
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Para mostrar AM/PM
        };

        return new Date(fecha).toLocaleString("es-ES", opciones);
    };
    const exportToExcel = async () => {
        const ExcelJS = (await import("exceljs")).default;

        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();

        // Crear una hoja de trabajo para el Prestamo
        const worksheet = workbook.addWorksheet(`Cliente ${expedienteData.numero_cliente}`);

        // Agregar una fila con el título "Información de Equipo"
        const infoTitleRow = worksheet.addRow(["Información de Expediente"]);
        worksheet.mergeCells(infoTitleRow.number, 1, infoTitleRow.number, 3);
        infoTitleRow.alignment = { horizontal: "center", vertical: "middle" };
        infoTitleRow.font = { bold: true };

        infoTitleRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4CAF50' }  // El color verde
        };
        // Agregar información general del Prestamo en las primeras filas
        const informacionGeneral = [
            { campo: 'Nº Cliente', valor: expedienteData.numero_cliente },
            { campo: 'Cliente', valor: expedienteData.nombre_cliente },
            { campo: 'Responsable', valor: expedienteData.responsable },
            { campo: 'Fecha de entrada', valor: expedienteData.fecha_entrada ? formatearFecha(expedienteData.fecha_entrada) : 'Sin fecha' },
            { campo: 'Fecha de salida', valor: expedienteData.fecha_salida ? formatearFecha(expedienteData.fecha_salida) : 'Sin fecha' },
            { campo: 'Agencia', valor: expedienteData.agencia },
            { campo: 'Estado', valor: expedienteData.estado },
            { campo: 'Comentarios', valor: expedienteData.comentarios },
            { campo: 'Estante', valor: expedienteData.estante },
            { campo: 'Fila', valor: expedienteData.fila },
            { campo: 'Columna', valor: expedienteData.columna },
        ];

        informacionGeneral.forEach((data) => {
            const row = worksheet.addRow([data.campo, data.valor]);
            row.eachCell((cell) => {
                cell.font = { color: { argb: '000000' } }; // Aplica color negro a cada celda de la fila
            });
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
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } }; // Color de fondo
                row.alignment = { horizontal: "center" };
            } else {
                row.font = { color: { argb: '000000' } }; // Texto negro para el resto de las filas
            }
        });

        // Agregar una fila vacía para separar la información del Prestamo del historial
        worksheet.addRow({});

        // Agregar una fila con el título "Historial de cambios"
        const historialTitleRow = worksheet.addRow(["Historial de Entrada/Salida"]);
        worksheet.mergeCells(historialTitleRow.number, 1, historialTitleRow.number, 3);
        historialTitleRow.alignment = { horizontal: "center", vertical: "middle" };
        historialTitleRow.font = { bold: true };

        // Encabezado de la tabla "Historial de cambios"
        const historialHeaderRow = worksheet.addRow(["Evento", "Fecha", "Responsable", "Comentarios"]);

        // Aplicar estilo a los encabezados de "Historial de cambios"
        historialHeaderRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Texto en negrita y blanco
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F97316" } }; // Fondo azul
            cell.alignment = { horizontal: "center" }; // Centrado de texto
        });

        // Agregar las filas de historial de cambios
        expedienteData.historial.forEach((data) => {
            worksheet.addRow([
                data.tipo_evento,
                formatearFecha(data.fecha),
                data.responsable,
                data.comentarios,
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
        const nombreArchivo = `Expediente_Cliente_${expedienteData.numero_cliente.replace(/\s+/g, "_")}.xlsx`;

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

            </div>
            <div className="flex items-center w-full p-7 gap-4 -mt-10 bg-white">
                {/* Parte izquierda: Información del Expediente */}
                <div className="w-fit">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">{expedienteData.nombre_cliente}</h2>
                        <p className="text-gray-500">Número Cliente: {expedienteData.numero_cliente}</p>
                    </div>
                    <div className="flex flex-col gap-7">
                        <div className="flex items-center">
                            <Hash className="w-5 h-5 mr-2 text-orange-500" />
                            <span><strong>Estado:</strong> {expedienteData.estado}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span><strong>Agencia:</strong> {expedienteData.agencia}</span>
                        </div>
                        <div className="flex items-center whitespace-nowrap">
                            <CalendarDays className="w-5 h-5 mr-2 text-cyan-500" />
                            <span><strong>Fecha Entrada:</strong> {formatearFecha(expedienteData.fecha_entrada || "")}</span>
                        </div>
                        <div className="flex items-center whitespace-nowrap">
                            <CirclePower className="w-5 h-5 mr-2 text-red-500" />
                            <span><strong>Fecha Salida: </strong>{expedienteData.fecha_salida ? formatearFecha(expedienteData.fecha_salida) : "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span><strong>Ubicacion:</strong> Estante: {expedienteData.estante} = {expedienteData.fila},{expedienteData.columna}</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="mb-2 font-semibold">Comentarios:</h4>
                        <p className="text-sm text-gray-600">{expedienteData.comentarios}</p>
                    </div>
                </div>
                <div></div>

                {/* Parte derecha: Historial de cambios */}
                <div className="w-full">
                    <h4 className="mb-4 font-semibold">Historial de Cambios</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left">Tipo Evento</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2 text-left">Responsable</th>
                                    <th className="px-4 py-2 text-left">Comentarios</th>
                                    <th className="px-4 py-2 text-left">Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialPaginaActual.length > 0 ? (
                                    historialPaginaActual.map((data, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{data.tipo_evento}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{formatearFecha(data.fecha)}</td>
                                            <td className="px-4 py-2">{data.responsable}</td>
                                            <td className="px-4 py-2">{data.comentarios}</td>
                                            <td className="px-4 py-2">{data.usuario}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-2 text-center text-gray-600">
                                            No hay historial de cambios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Componente de paginación */}
                    <Pagination
                        PaginaInicial={paginaActual}
                        TotalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                </div>
            </div>

        </>
    );
};

export default HistorialPrestamos;
