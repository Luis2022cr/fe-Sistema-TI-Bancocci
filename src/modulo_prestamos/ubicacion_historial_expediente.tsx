import { ExpedienteId, ObtenerExpedienteByNumeroCliente } from '@/api_conexion/servicios/expedientes';
import Estante from './estante';
import Loading from '@/componentes/Loading';
import { useState } from 'react';

export default function UbicacionExpediente() {
  const [expediente, setExpediente] = useState('');
  const [expedienteData, setExpedienteData] = useState<ExpedienteId | null>(null);
  const [loadingExpediente, setLoadingExpediente] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darDeBaja, setDarDeBaja] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [movimiento, setMovimiento] = useState<'entrada' | 'salida' | null>(null);
  const [entregadoA, setEntregadoA] = useState('');

  const buscarExpediente = async () => {
    if (!expediente) return;
    setLoadingExpediente(true);
    setError(null);
    setExpedienteData(null);

    try {
      const expedienteData = await ObtenerExpedienteByNumeroCliente(Number(expediente));
      setExpedienteData(expedienteData);

    } catch (err) {
      setError('Error al obtener los datos del expediente');
      console.error(err); // Log error to console for debugging
    } finally {
      setLoadingExpediente(false);
    }
  };

  const registrarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (darDeBaja && !confirmarBaja) {
      setConfirmarBaja(true);
      return;
    }
    if (darDeBaja) {
      console.log(`Expediente ${expediente} dado de baja`);
    } else if (movimiento) {
      console.log(
        `Expediente ${expediente} ${movimiento === 'salida' ? 'entregado a' : 'recibido de'} ${entregadoA}`
      );
    }
    setExpediente('');
    setDarDeBaja(false);
    setConfirmarBaja(false);
    setMovimiento(null);
    setEntregadoA('');
  };

  return (
    <div className="mx-5 mt-5">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Buscar Expediente</h2>
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="expediente" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Cliente
            </label>
            <input
              id="expediente"
              type="text"
              value={expediente}
              onChange={(e) => setExpediente(e.target.value)}
              placeholder="Ingrese el numero de cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={buscarExpediente}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Buscar
          </button>
        </div>
      </div>

      {loadingExpediente && <Loading />}
      {error && <div className="text-red-500">{error}</div>}

      {expedienteData && (
        <div className="bg-white items-center shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Información del Expediente</h2>
            <div className="flex flex-col gap-y-1 mb-6">
              <p><strong>Número de Cliente:</strong> {expedienteData.numero_cliente}</p>
              <p><strong>Nombre de Cliente:</strong> {expedienteData.nombre_cliente}</p>
              <p><strong>Responsable:</strong> {expedienteData.responsable}</p>
              <p><strong>Agencia:</strong> {expedienteData.agencia}</p>
              <p><strong>Comentarios:</strong> {expedienteData.comentarios}</p>
            </div>
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <div className="flex flex-col gap-y-1 mb-6">
              <p><strong>Estante:</strong> {expedienteData.estante}</p>
              <p><strong>Columna:</strong> {expedienteData.columna}</p>
              <p><strong>Fila:</strong> {expedienteData.fila}</p>
            </div>
          </div>
          <div className="md:w-full">
            <Estante
              estante={expedienteData.estante}
              columna={expedienteData.columna}
              fila={expedienteData.fila}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Registrar Movimiento de Expediente</h2>
        <form onSubmit={registrarMovimiento}>
          <div className="mb-4">
            <label htmlFor="entregadoA" className="block text-sm font-medium text-gray-700 mb-1">
              Entregado a / Recibido de
            </label>
            <input
              id="entregadoA"
              type="text"
              value={entregadoA}
              onChange={(e) => setEntregadoA(e.target.value)}
              placeholder="Nombre de la persona"
              required={!darDeBaja}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4 space-y-2">
            <p className="block text-sm font-medium text-gray-700">Tipo de Movimiento (Obligatorio)</p>
            <label className="flex items-center">
              <input
                type="radio"
                checked={movimiento === 'entrada'}
                onChange={() => setMovimiento('entrada')}
                required
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Entrada de Expediente</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={movimiento === 'salida'}
                onChange={() => setMovimiento('salida')}
                required
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Salida de Expediente</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={darDeBaja}
                onChange={(e) => {
                  setDarDeBaja(e.target.checked);
                  if (e.target.checked) {
                    setMovimiento(null);
                  }
                  setConfirmarBaja(false);
                }}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Dar de baja el expediente</span>
            </label>
          </div>
          {darDeBaja && confirmarBaja && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
              <p className="text-yellow-700">¿Está seguro de que desea dar de baja este expediente?</p>
            </div>
          )}
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${darDeBaja ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            disabled={!movimiento && !darDeBaja}
          >
            {darDeBaja ? 'Dar de Baja' : 'Registrar Movimiento'}
          </button>
        </form>
      </div>
    </div>
  );
}
