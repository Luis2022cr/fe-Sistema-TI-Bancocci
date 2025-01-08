
import { useState } from 'react';
import Estante from './estante';

export default function UbicacionExpediente() {
  const [expediente, setExpediente] = useState('');
  const [ubicacion, setUbicacion] = useState<{
    estante: number;
    columna: number;
    fila: number;
    numeroCliente: string;
    nombreCliente: string;
  } | null>(null);
  const [entregadoA, setEntregadoA] = useState('');
  const [movimiento, setMovimiento] = useState<'entrada' | 'salida' | null>(null);
  const [darDeBaja, setDarDeBaja] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);

  const buscarUbicacion = () => {
    // Aquí iría la lógica para buscar la ubicación real del expediente
    // Por ahora, generamos datos aleatorios
    setUbicacion({
      estante: Math.floor(Math.random() * 10) + 1,
      columna: Math.floor(Math.random() * 3) + 1,
      fila: Math.floor(Math.random() * 5) + 1,
      numeroCliente: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      nombreCliente: 'Cliente Ejemplo',
    });
  };

  const registrarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (darDeBaja && !confirmarBaja) {
      setConfirmarBaja(true);
      return;
    }
    // Aquí iría la lógica para registrar el movimiento o dar de baja
    if (darDeBaja) {
      console.log(`Expediente ${expediente} dado de baja`);
    } else if (movimiento) {
      console.log(`Expediente ${expediente} ${movimiento === 'salida' ? 'entregado a' : 'recibido de'} ${entregadoA}`);
    }
    // Reiniciar el formulario
    setExpediente('');
    setUbicacion(null);
    setEntregadoA('');
    setMovimiento(null);
    setDarDeBaja(false);
    setConfirmarBaja(false);
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
              placeholder="Ej: 1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={buscarUbicacion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            Buscar
          </button>
        </div>
      </div>

      {ubicacion && (
        <div className="bg-white items-center shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row">
          {/* Contenedor izquierdo para la información del cliente */}
          <div className="md:w-1/2 mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-4">Información del Expediente</h2>
            <div className="flex flex-col gap-y-1 mb-6">
              <p><strong>Número de Cliente:</strong> {ubicacion.numeroCliente}</p>
              <p><strong>Nombre de Cliente:</strong> {ubicacion.nombreCliente}</p>
            </div>
              <h2 className="text-xl font-semibold mb-4">Ubicacion</h2>
            <div className="flex flex-col gap-y-1 mb-6">
              <p><strong>Estante:</strong> {ubicacion.estante}</p>
              <p><strong>Columna:</strong> {ubicacion.columna}</p>
              <p><strong>Fila:</strong> {ubicacion.fila}</p> 
            </div>
          </div>

          {/* Contenedor derecho para el estante */}
          <div className="md:w-full">
            <Estante estante={ubicacion.estante} columna={ubicacion.columna} fila={ubicacion.fila} />
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

