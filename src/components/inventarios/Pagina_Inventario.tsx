import { useState } from "react";
import { PencilIcon, ClockIcon, Search, X } from "lucide-react";
import Loading from "../Loading";
import { useParams } from "react-router-dom";
import { ObtenerInventarios } from "@/api conexion/servicios/inventarios";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoArrowUndoOutline } from "react-icons/io5";
import Pagination from "../Pagination";

const tipoInventarioMap: { [key: number]: string } = {
  1: "Desktop",
  2: "Laptop",
  3: "Impresora",
  4: "Impresora Financiera",
  5: "Teléfono",
  6: "Planta",
  7: "Monitor",
  8: "Proyector",
  9: "Otros"
};

export default function Pagina_Inventario() {
  const { tipoInventarioId } = useParams<{ tipoInventarioId?: string }>();
  const Id = tipoInventarioId ? parseInt(tipoInventarioId, 10) : undefined;
  const navigate = useNavigate();
  const [{ data: inventarioData, loading: loadingInventario }] = ObtenerInventarios(Id);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (loadingInventario) return <Loading />;
  if (!inventarioData) return <div>Error al obtener los datos</div>;

  // Filtrar los inventarios según el término de búsqueda
  const filteredInventario = inventarioData.filter((data) =>
    (data.codigo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (data.serie?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

  // Obtener el nombre del tipo de inventario usando el Id
  const inventarioNombre = tipoInventarioMap[Id!];

  
  return (
    <>
    <button
      onClick={() => navigate(-1)}
      className="flex items-center mt-6 mb-4 ml-2 text-xl text-blue-500 hover:underline"
    >
    <IoArrowUndoOutline />
    Regresar
    </button>      

    <div className="container p-4 mx-auto mt-10">
      <h1 className="mb-5 text-3xl font-bold text-center">Inventarios: {inventarioNombre}</h1>
     
      {/* Barra de búsqueda */}
      <div className="flex mb-6 space-x-4">
        <div className="relative flex-1">
          <div className="flex items-center w-4/6 border border-gray-300 rounded">
            <span className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-l">
              <Search />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, serie, modelo"
              className="block w-full p-2 rounded-r focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-red-500"
              >
                <X />
              </button>
            )}
          </div>
        </div>
        <div className="flex-none">
        <Link
            to='/dashboard-empleados/agregar-inventario'
            className="flex items-center gap-3 p-1 mt-1 text-center text-white bg-green-700 rounded-full w-28 hover:bg-green-600"
          >
            <FaPlusCircle />
            Agregar
          </Link>
        </div>
      </div>

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
                        to={`/dashboard-empleados/actualizar_inventario/${data.id}`}
                       className="p-1 text-white bg-orange-500 rounded-full">
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/dashboard-empleados/historial_inventario/${data.id}`}
                        className="p-1 text-white bg-yellow-700 rounded-full">
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
