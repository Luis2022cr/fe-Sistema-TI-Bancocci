import { ObtenerUPS, UPS } from "@/api_conexion/servicios/ups";
import Loading from "../Loading";
import { useParams } from "react-router-dom";
import { formatearFecha } from "../campos/FormateoFecha";
import { useState, Suspense } from "react";
import lista from "../../assets/listaReport.svg";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";

interface ExportData {
  nombre: string;
  agencia: string;
  direccion_ip: string;
  modelo: string;
  kva: number;
  fecha_instalacion: string;
  proximo_cambio: string;
}

// Mapeo de tipos de tamaño
const tipoTamanoMap: { [key: number]: string } = {
  1: "pequeño",
  2: "grande",
};

export default function Pagina_Ups() {
  const { tipoTamanoId } = useParams<{ tipoTamanoId?: string }>();
  const Id = tipoTamanoId ? parseInt(tipoTamanoId, 10) : undefined;

  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const [{ data: upsData, loading: loadingUps }] = ObtenerUPS(Id);

  const [selectedAgencia] = useState<string>("");

  if (loadingUps || loadingAgencias) return <Loading />;
  if (!upsData || !agenciaData) return <div>Error al obtener los datos</div>;

  // Filtrar datos según la agencia seleccionada
  const filteredUps = selectedAgencia
    ? upsData.filter(
        (ups: UPS) =>
          ups.agencia &&
          ups.agencia.toLowerCase() === selectedAgencia.toLowerCase()
      )
    : upsData;

  const exportToExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    const groupedData: { [key: string]: ExportData[] } = filteredUps.reduce(
      (acc: Record<string, ExportData[]>, curr: UPS) => {
        const key = `${curr.agencia}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          nombre: curr.nombre,
          agencia: curr.agencia,
          direccion_ip: curr.direccion_ip || "N/A",
          modelo: curr.modelo || "N/A",
          kva: curr.kva,
          fecha_instalacion: formatearFecha(curr.fecha_instalacion),
          proximo_cambio: formatearFecha(curr.proximo_cambio),
        });
        return acc;
      },
      {}
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("UPS Reporte");

    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Agencia", key: "agencia", width: 25 },
      { header: "Dirección IP", key: "direccion_ip", width: 25 },
      { header: "Modelo", key: "modelo", width: 20 },
      { header: "KVA", key: "kva", width: 10 },
      { header: "Fecha Instalación", key: "fecha_instalacion", width: 25 },
      { header: "Próximo Cambio", key: "proximo_cambio", width: 25 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2dc410" }, // Color verde
      };
      cell.font = { bold: true }; // Negrita
    });
    headerRow.commit();

    // Añadir filas con datos agrupados
    for (const [, upsList] of Object.entries(groupedData)) {
      upsList.forEach((ups) => {
        worksheet.addRow(ups);
      });
    }

    // Determinar el tamaño según el tipo de UPS en el filtro
    const tipoTamano = Id ? tipoTamanoMap[Id] || "desconocido" : "todos";

    // Exportar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    
    const nombreArchivo = `historial_ups_${tipoTamano}.xlsx`;

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
      <Suspense fallback={<Loading />}>
        <div className="flex justify-end mt-5 mb-5">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-2 py-2 text-blue-900 transition-colors duration-300 bg-blue-100 rounded-full hover:text-white hover:bg-blue-600"
          >
            <img src={lista} alt="plan" width={40} height={40} />
            Generar Reporte
          </button>
        </div>
      </Suspense>
    </>
  );
}
