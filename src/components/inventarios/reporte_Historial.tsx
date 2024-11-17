import React from "react";
import ExcelJS from "exceljs";
import { ObtenerInventariosPorTipoConHistorial } from "@/api_conexion/servicios/inventarios";

interface Historial {
  cambio_realizado: string;
  fecha_cambio: string;
  usuario: string;
}

interface Equipo {
  codigo: string;
  serie: string;
  marca: string;
  modelo: string;
  agencia_origen: string;
  agencia_actual: string;
  estado: string;
  tipo_inventario: string;
  comentarios?: string;
  historial?: Historial[];
}

interface ExcelReportProps {
  tipo_inventario_id: number;
  selectedAgencia: string; 
  data : Equipo[] 
}

const tipoInventarioMap: { [key: number]: string } = {
  1: "Desktop",
  2: "Laptop",
  3: "Impresora",
  4: "Impresora Financiera",
  5: "Teléfono",
  6: "Planta",
  7: "Monitor",
  8: "Proyector",
  9: "Otros",
};

const ExcelReportInventario: React.FC<ExcelReportProps> = ({ tipo_inventario_id, selectedAgencia }) => {
  const [{ data: inventarioData }] = ObtenerInventariosPorTipoConHistorial(tipo_inventario_id);
 

  // Filtrar los equipos según la agencia seleccionada

  const filteredData = inventarioData?.filter((equipo) => {
    // Aplicar todos los filtros opcionalmente
    const matchesAgencia = selectedAgencia ? equipo.agencia_actual === selectedAgencia : true;
    
    // Retornar true solo si todos los filtros son válidos
    return matchesAgencia;
  });
  

  // Función para formatear la fecha en "10 noviembre 2024"
  const formatDate = (dateString: string): string => {
    if (!dateString) return ""; // Si no hay fecha, devolver vacío
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Verificar si la fecha es inválida
    const formatter = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(date);
  };

  const exportToExcelInventario = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventarios");

    // Recorrer los datos de los equipos filtrados y agregar filas
    filteredData?.forEach((equipo) => {
      // Título de "Información de Equipo" para cada equipo
      const infoTitleRow = worksheet.addRow(["Información de Equipo"]);
      worksheet.mergeCells(infoTitleRow.number, 1, infoTitleRow.number, 9);
      infoTitleRow.alignment = { horizontal: "center", vertical: "middle" };
      infoTitleRow.font = { bold: true };

      // Encabezado de la tabla "Información de Equipo"
      const infoHeaderRow = worksheet.addRow([
        "Nº Inventario",
        "Serie",
        "Marca",
        "Modelo",
        "Agencia Origen",
        "Agencia Actual",
        "Estado",
        "Tipo Inventario",
        "Comentarios",
      ]);

      // Aplicar estilo a los encabezados de "Información de Equipo"
      infoHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Texto en negrita y blanco
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4CAF50" } }; // Fondo verde
        cell.alignment = { horizontal: "center" }; // Centrado de texto
      });

      // Información del equipo
      const informacionGeneral = [
        equipo.codigo,
        equipo.serie,
        equipo.marca,
        equipo.modelo,
        equipo.agencia_origen,
        equipo.agencia_actual,
        equipo.estado,
        equipo.tipo_inventario,
        equipo.comentarios || "",
      ];

      worksheet.addRow(informacionGeneral);

      // Título de "Historial de cambios" para cada equipo
      worksheet.addRow([]); // Espacio en blanco
      const historialTitleRow = worksheet.addRow(["Historial de Cambios"]);
      worksheet.mergeCells(historialTitleRow.number, 1, historialTitleRow.number, 3);
      historialTitleRow.alignment = { horizontal: "center", vertical: "middle" };
      historialTitleRow.font = { bold: true };

      // Encabezado de la tabla "Historial de cambios"
      const historialHeaderRow = worksheet.addRow(["Cambio", "Fecha de Cambio", "Usuario"]);

      // Aplicar estilo a los encabezados de "Historial de cambios"
      historialHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Texto en negrita y blanco
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F97316" } }; // Fondo azul
        cell.alignment = { horizontal: "center" }; // Centrado de texto
      });

      // Si el equipo tiene historial, agregar cada cambio en filas separadas
      if (Array.isArray(equipo.historial) && equipo.historial.length > 0) {
        equipo.historial.forEach((hist) => {
          // Verificar si la fecha existe, y solo formatear si es válida
          const formattedDate = hist.fecha_cambio ? formatDate(hist.fecha_cambio) : "";
          worksheet.addRow([hist.cambio_realizado, formattedDate, hist.usuario]);
        });
      } else {
        // Si no hay historial, agregar "SIN HISTORIAL" en las tres columnas
        worksheet.addRow(["SIN HISTORIAL", "", ""]);
      }

      // Agregar espacio entre los equipos
      worksheet.addRow([]);
    });

    // Ajuste de ancho de columnas
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    // Obtener el nombre de la categoría basado en el tipo_inventario_id
    const tipoInventarioNombre = tipoInventarioMap[tipo_inventario_id] || "Inventario";
    const NombreAgencia = selectedAgencia|| "Todas las Agencias";
    

    // Descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reporte_Inventario_${tipoInventarioNombre}_${NombreAgencia}.xlsx`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exportToExcelInventario}>
      Reporte Inventario con Historial
    </button>
  );
};

export default ExcelReportInventario;
