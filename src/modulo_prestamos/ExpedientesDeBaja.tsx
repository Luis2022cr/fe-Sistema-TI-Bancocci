import { Suspense, useState  } from "react";
import { PencilIcon, ClockIcon } from "lucide-react";
import Loading from "@/componentes/Loading";
import { ObtenerExpedienteDeBaja } from "@/api_conexion/servicios/expedientes"; 
import lista from "../assets/listaReport.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoArrowUndoOutline } from "react-icons/io5";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";
import { formatearFecha } from "@/modulo_ti/campos/FormateoFecha";
import Pagination from "@/modulo_ti/Pagination";
import FiltroExpedienteBaja from "./FiltroExpedienteBaja";

interface ExportData {
  Numero_Cliente: string;
  Nombre_Cliente: string;
  Estado_Id: number;
  Agencia_Id: number;
  Estante: number;
  Columna: number;
  Fila: number;
  Comentarios: string;
  Fecha_Entrada: string;
  Fecha_Salida: string;
  Usuario_Id: number;
  Responsable: string;
  Estado: string;
  Agencia: string;
  Usuario: string;
}

export default function PaginaExpediente() {
  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const navigate = useNavigate();
  
  const [{ data: expedienteData, loading: loadingExpediente }] = ObtenerExpedienteDeBaja();

  const [selectedAgencia] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loadingExpediente || loadingAgencias) return <Loading />;
  if (!expedienteData) return <div>Error al obtener los datos de expedientes</div>;
  if (!agenciaData) return <div>Error al obtener los datos de agencias</div>;

  // Filtrar los expedientes
  const filteredExpediente = expedienteData.filter((data) => {
    const matchesSearchTerm =
      data.numero_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.agencia?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgencia = selectedAgencia ? data.agencia === selectedAgencia : true;

    return matchesSearchTerm && matchesAgencia;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpediente.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpediente.length / itemsPerPage);

// Generar reporte Excel
const exportToExcel = async () => {
  const ExcelJS = (await import("exceljs")).default;

  // Agrupar datos por agencia
  const groupedData: Record<string, ExportData[]> = filteredExpediente.reduce((acc, curr) => {
    const key = `${curr.agencia}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      Numero_Cliente: curr.numero_cliente,
      Nombre_Cliente: curr.nombre_cliente,
      Estado_Id: curr.estado_id,
      Agencia_Id: curr.agencia_id,
      Estante: curr.estante,
      Columna: curr.columna,
      Fila: curr.fila,
      Comentarios: curr.comentarios || "",
      Fecha_Entrada: formatearFecha(curr.fecha_entrada), 
      Fecha_Salida: formatearFecha(curr.fecha_salida),  
      Usuario_Id: curr.usuario_id,
      Responsable: curr.responsable,
      Estado: curr.estado,
      Agencia: curr.agencia,
      Usuario: curr.usuario,
    });
    return acc;
  }, {} as Record<string, ExportData[]>);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Expedientes`);

  // Definir los encabezados
  worksheet.columns = [
    { header: "", key: "Numero_Cliente", width: 20 },
    { header: "", key: "Nombre_Cliente", width: 30 },
    { header: "", key: "Estado", width: 15 },
    { header: "", key: "Agencia", width: 20 },
    { header: "", key: "Estante", width: 10 },
    { header: "", key: "Columna", width: 10 },
    { header: "", key: "Fila", width: 10 },
    { header: "", key: "Comentarios", width: 25 },
    { header: "", key: "Fecha_Entrada", width: 20 },
    { header: "", key: "Fecha_Salida", width: 20 },
    { header: "", key: "Responsable", width: 20 },
  ];

  // Recorrer las agencias y sus datos agrupados
  for (const [agencia, items] of Object.entries(groupedData)) {
    // Imprimir el nombre de la agencia antes de los encabezados y los datos
    const agenciaRow = worksheet.addRow([agencia]);
    agenciaRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    agenciaRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "22C55E" },
    };
    

    // Expandir el nombre de la agencia para que ocupe varias columnas
    worksheet.mergeCells(agenciaRow.number, 1, agenciaRow.number, 11); 


    // Agregar los encabezados solo una vez después del nombre de la agencia
    worksheet.addRow([
      "Numero Cliente", "Nombre Cliente", "Estado", "Agencia", 
      "Estante", "Columna", "Fila", "Comentarios", 
      "Fecha Entrada", "Fecha Salida", "Responsable"
    ]);

    // Agregar las filas de datos para esta agencia
    items.forEach((item) => {
      const row = worksheet.addRow(item);
      row.getCell("Numero_Cliente").alignment = { horizontal: "left" };
      row.getCell("Nombre_Cliente").alignment = { horizontal: "left" };
      row.getCell("Estado").alignment = { horizontal: "left" };
      row.getCell("Agencia").alignment = { horizontal: "left" };
      row.getCell("Estante").alignment = { horizontal: "left" };
      row.getCell("Columna").alignment = { horizontal: "left" };
      row.getCell("Fila").alignment = { horizontal: "left" };
      row.getCell("Comentarios").alignment = { horizontal: "left" };
      row.getCell("Fecha_Entrada").alignment = { horizontal: "left" };
      row.getCell("Fecha_Salida").alignment = { horizontal: "left" };
      row.getCell("Responsable").alignment = { horizontal: "left" };
    });
  }

  // Escribir el archivo y crear el enlace de descarga
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const nombreAgencia = selectedAgencia ? selectedAgencia.replace(/\s+/g, "_") : "de baja";
  const nombreArchivo = `expedientes_${nombreAgencia}.xlsx`;

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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
      >
        <IoArrowUndoOutline />
        Regresar
      </button>

      <div className=" p-4 mx-auto -mt-10">
        <h1 className="mb-5 text-3xl font-bold text-center">Expedientes de Baja</h1>

        <div className="flex justify-end gap-6 -mt-5">
          
          <Suspense fallback={<Loading />}>
            <div className="flex justify-end mt-5 mb-5">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-2 py-2 text-blue-900 transition-colors duration-300
                         bg-blue-100 rounded-full hover:text-white hover:bg-blue-600"
              >
               <img src={lista} alt="plan" width={40} height={40} />
                Generar Reporte
              </button>
            </div>
          </Suspense>
        </div>

        <FiltroExpedienteBaja
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Table of expedientes */}
        <div className="overflow-x-auto">
          {currentItems.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-white bg-blue-900 text-xl">
                
                  <th className="p-2 text-center border-r-2 border-blue-300">Número Cliente</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Nombre Cliente</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Estado</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Agencia</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Comentarios</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Fecha Entrada</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Fecha Salida</th>
                  <th className="p-2 text-center border-r-2 border-blue-300">Responsable</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => (
                  <tr key={index} className="text-center bg-blue-50 hover:bg-gray-300 even:bg-blue-100 text-base">
                
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.numero_cliente}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.nombre_cliente}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.estado}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.agencia}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.comentarios}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{formatearFecha(data.fecha_entrada)}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{formatearFecha(data.fecha_salida)}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.responsable}</td>
                    <td className="p-2 border-t border-blue-300">
                      <div className="flex space-x-2">
                        <Link
                          to={`/prestamos/editar_expediente/${data.id}`}
                          className="p-1 text-white bg-orange-500 rounded-full"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/prestamos/historial/${data.id}`}
                          className="p-1 text-white bg-yellow-700 rounded-full"
                        >
                          <ClockIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron registros en los expedientes.</p>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          PaginaInicial={currentPage}
          TotalPaginas={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
