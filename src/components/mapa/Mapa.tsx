import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { BorrarPuntoMapa, ObtenerMapaUps, UPS_MAPA } from '@/api_conexion/servicios/ups-mapa';
import Loading from '../Loading';
import Alert from '../Alert';
import { useEffect, useState } from 'react';
import Modal from '../Modal';
import CrearPuntoMapaForm from './creacionPuntoMapa';
import { IoArrowUndoOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import onlineIconSvg from '@/assets/pingtrue.svg';
import offlineIconSvg from '@/assets/pingFalse.svg';
import Pagination from '../Pagination';

const onlineIcon = L.icon({
  iconUrl: onlineIconSvg,
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const offlineIcon = L.icon({
  iconUrl: offlineIconSvg,
  iconSize: [40, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapaCopan: React.FC = () => {
  const [{ data: ubicacion, loading: loadingMapa }] = ObtenerMapaUps();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Recarga automática cada 5 minutos
  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(intervalId);
  }, []);

  if (loadingMapa) return <Loading />;
  if (!ubicacion || !Array.isArray(ubicacion)) return <div>Error al obtener los datos</div>;

  // Lógica de paginación
  const indiceInicial = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicial + elementosPorPagina;
  const datosPaginados = ubicacion.slice(indiceInicial, indiceFinal);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este punto del mapa?');
    if (confirmDelete) {
      try {
        await BorrarPuntoMapa(id);
        Alert({
          title: 'Éxito',
          text: `Se borró el punto del mapa`,
          icon: 'success',
          callback: () => window.location.reload(),
        });
      } catch (error) {
        Alert({
          title: 'Error',
          text: `Hubo un problema al eliminar el punto del mapa`,
          icon: 'error',
          callback: () => window.location.reload(),
        });
      }
    }
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

      <div className="flex justify-end -mt-6 mr-10">
        <button
          onClick={openModal}
          className="flex items-center gap-3 p-1 mt-1 text-center text-white bg-green-700 rounded-full w-44 hover:bg-green-600"
        >
          <FaPlusCircle />
          Agregar Marcador
        </button>
      </div>
      <h1 className="mb-4 text-2xl font-bold text-center -mt-9">Mapa UPS Zona Occidente, Honduras</h1>
      <div className="flex">
        <div className="mx-auto p-4">
          <table className="min-w-full border border-gray-300 shadow-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Agencia</th>
                <th className="border border-gray-300 px-4 py-2 text-left">IP</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados
                .sort((a) => (a.estado === 'offline' ? -1 : 1)) // Ordena por estado
                .map((ubicacion: UPS_MAPA, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-orange-100`} // Resalta la fila con hover
                  >

                    <td className="border border-gray-300 px-4 py-2 whitespace-nowrap text-xs">
                      {ubicacion.agencia} - {ubicacion.codigo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">{ubicacion.direccion_ip}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 text-xs font-semibold ${ubicacion.estado === 'online' ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {ubicacion.estado}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Agregar la paginación */}
          <Pagination
            PaginaInicial={paginaActual}
            TotalPaginas={Math.ceil(ubicacion.length / elementosPorPagina)}
            onPageChange={setPaginaActual}
          />
        </div>
        <div className="container p-4">
          <MapContainer
            center={[14.7667, -88.7794]} // Coordenadas para centrar el mapa en Santa Rosa de Copán
            zoom={8.5}
            style={{ height: '550px', width: '100%' }} // Tamaño del mapa
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {ubicacion.map((ubicacion: UPS_MAPA) => (
              <Marker
                key={ubicacion.id}
                position={[parseFloat(ubicacion.lat), parseFloat(ubicacion.lon)]} // Convertimos a número
                icon={ubicacion.estado === 'online' ? onlineIcon : offlineIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{ubicacion.nombre_ups}</h3>
                    <p>
                      {ubicacion.agencia} {ubicacion.codigo}{' '}
                    </p>
                    <p>IP: {ubicacion.direccion_ip}</p>
                    <p>
                      Status:{' '}
                      <strong
                        className={ubicacion.estado === 'online' ? 'text-green-600' : 'text-red-600'}
                      >
                        {ubicacion.estado}
                      </strong>
                    </p>
                    <button
                      onClick={() => handleDelete(ubicacion.id)}
                      className="mt-2 text-red-500 flex items-center justify-center gap-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <CrearPuntoMapaForm />
        </Modal>
      )}
    </>
  );
};

export default MapaCopan;
