import React, { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";

// Tipos de datos
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

interface ExcelReportInventarioProps {
  tipo_inventario_id: number; // Definir el tipo correctamente
}

const ExcelReportInventario: React.FC<ExcelReportInventarioProps> = ({ tipo_inventario_id }) => {
  const [data, setData] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await axios.get<Equipo[]>(`/inventarios-historial`);
        console.log("Respuesta del backend:", response.data); 
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener inventarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventarios();
  }, [tipo_inventario_id]);

  const exportToExcelInventario = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventarios");

    worksheet.addRow([
      "Nº Inventario",
      "Serie",
      "Marca",
      "Modelo",
      "Agencia Origen",
      "Agencia Actual",
      "Estado",
      "Tipo Inventario",
      "Comentarios",
      "Cambio Realizado",
      "Fecha de Cambio",
      "Usuario",
    ]);

    if (Array.isArray(data)) {
      data.forEach((equipo) => {
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

        if (equipo.historial && Array.isArray(equipo.historial) && equipo.historial.length > 0) {
          equipo.historial.forEach((hist) => {
            worksheet.addRow([
              ...informacionGeneral,
              hist.cambio_realizado,
              new Date(hist.fecha_cambio).toLocaleString(),
              hist.usuario || "Desconocido",
            ]);
          });
        } else {
          worksheet.addRow([
            ...informacionGeneral,
            "SIN HISTORIAL QUE MOSTRAR",
            "",
            "",
          ]);
        }
      });
    } else {
      console.error("data no es un array", data);
    }

    worksheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Reporte_Inventarios.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p>Cargando inventarios...</p>;
  }

  return (
    <button onClick={exportToExcelInventario}>Exportar Reporte Excel</button>
  );
};

export default ExcelReportInventario;
