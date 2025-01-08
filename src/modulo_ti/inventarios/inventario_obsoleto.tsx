import { Suspense, useState } from "react";
import { PencilIcon, ClockIcon } from "lucide-react";
import Loading from "@/componentes/Loading";
import { ObtenerInventariosObsoletos } from "@/api_conexion/servicios/inventarios";
import lista from "../../assets/listaReport.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoArrowUndoOutline } from "react-icons/io5";
import Pagination from "../Pagination";
import FiltroInventario from "./FiltroInventario";
import { ObtenerAgencia } from "@/api_conexion/servicios/agencias";

interface ExportData {
  Nº_Inventario: string;
  Serie: string;
  Marca: string;
  Modelo: string;
  Agencia_Origen: string;
  Agencia_Actual: string;
  Estado: string;
  Tipo_Inventario: string;
  Comentarios: string;
}

export default function Inventario_Obsoleto() {
  const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();
  const navigate = useNavigate();
  const [{ data: inventarioData, loading: loadingInventario }] = ObtenerInventariosObsoletos();
  const [selectedAgencia, setSelectedAgencia] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (loadingInventario || loadingAgencias) return <Loading />;
  if (!inventarioData) return <div>Error al obtener los datos</div>;
  if (!agenciaData) return <div>Error al obtener los datos de agencias</div>;

  // Filtrar los inventarios
  const filteredInventario = inventarioData.filter((data) => {
    const matchesSearchTerm =
      data.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.modelo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgencia = selectedAgencia ? data.agencia_actual === selectedAgencia : true;

    return matchesSearchTerm && matchesAgencia;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);


  // Generar reporte Excel
  const exportToExcel = async () => {
    // Cargar exceljs dinámicamente
    const ExcelJS = (await import("exceljs")).default;

    // Agrupar datos por agencia actual
    const groupedData: Record<string, ExportData[]> = filteredInventario.reduce((acc, curr) => {
      const key = `${curr.agencia_actual}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        Nº_Inventario: curr.codigo,
        Serie: curr.serie,
        Marca: curr.marca,
        Modelo: curr.modelo,
        Agencia_Origen: curr.agencia_origen,
        Agencia_Actual: curr.agencia_actual,
        Estado: curr.estado,
        Tipo_Inventario: curr.tipo_inventario,
        Comentarios: curr.comentarios,
      });
      return acc;
    }, {} as Record<string, ExportData[]>); // Añadir tipo explícito para groupedData

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Inventario`);

    // Definir las columnas
    worksheet.columns = [
      { header: "Nº Inventario", key: "Nº_Inventario", width: 20 },
      { header: "Serie", key: "Serie", width: 20 },
      { header: "Marca", key: "Marca", width: 25 },
      { header: "Modelo", key: "Modelo", width: 25 },
      { header: "Agencia Origen", key: "Agencia_Origen", width: 28 },
      { header: "Agencia Actual", key: "Agencia_Actual", width: 15 },
      { header: "Estado", key: "Estado", width: 15 },
      { header: "Tipo Inventario", key: "Tipo_Inventario", width: 20 },
      { header: "Comentarios", key: "Comentarios", width: 25 },
    ];

    // Agregar datos agrupados por agencia
    for (const [agencia, items] of Object.entries(groupedData)) {
      const agenciaRow = worksheet.addRow([agencia]);
      agenciaRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      agenciaRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "22C55E" },
      };

      items.forEach((item) => {
        const row = worksheet.addRow(item);
        row.getCell("Nº_Inventario").alignment = { horizontal: "left" };
        row.getCell("Serie").alignment = { horizontal: "left" };
        row.getCell("Marca").alignment = { horizontal: "left" };
        row.getCell("Modelo").alignment = { horizontal: "left" };
        row.getCell("Agencia_Origen").alignment = { horizontal: "left" };
        row.getCell("Agencia_Actual").alignment = { horizontal: "left" };
        row.getCell("Estado").alignment = { horizontal: "left" };
        row.getCell("Tipo_Inventario").alignment = { horizontal: "left" };
        row.getCell("Comentarios").alignment = { horizontal: "left" };
      });
    }

    // Crear el archivo y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Crear un nombre dinámico para el archivo
    const nombreAgencia = selectedAgencia ? selectedAgencia.replace(/\s+/g, "_") : "inventario";
    const nombreArchivo = selectedAgencia ? `inventario_Obsoleto_${nombreAgencia}.xlsx` : "inventario_obsoleto.xlsx";

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo; // Usar el nombre dinámico
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

      <div className="container p-4 mx-auto -mt-10">
        <h1 className="mb-5 text-3xl font-bold text-center underline">Inventario Obsoleto </h1>

        {/* boton para reportes */}
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

        <FiltroInventario
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedAgencia={selectedAgencia}
          setSelectedAgencia={setSelectedAgencia}
          agencias={agenciaData}
        />

        {/* Tabla de inventarios */}
        <div className="overflow-x-auto">
          {currentItems.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-white bg-blue-900">
                  <th className="p-2 text-left border-r-2 border-blue-300">Nº Inventario</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Serie</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Marca</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Modelo</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Agencia Origen</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Agencia Actual</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Estado</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Tipo Inventario</th>
                  <th className="p-2 text-left border-r-2 border-blue-300">Comentarios</th>
                  <th className="p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => (
                  <tr key={index} className="text-center bg-blue-50 hover:bg-gray-300 even:bg-blue-100">
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.codigo}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.serie}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.marca}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.modelo}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.agencia_origen}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.agencia_actual}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.estado}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.tipo_inventario}</td>
                    <td className="p-2 border-t border-r-2 border-blue-300">{data.comentarios}</td>
                    <td className="p-2 border-t border-blue-300">
                      <div className="flex space-x-2">
                        <Link
                          to={`/ti/actualizar_inventario/${data.id}`}
                          className="p-1 text-white bg-orange-500 rounded-full"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/ti/historial_inventario/${data.id}`}
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
            <p>No se encontraron registros en el inventario.</p>
          )}
        </div>

        {/* Paginación */}
        <Pagination
          PaginaInicial={currentPage}
          TotalPaginas={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}