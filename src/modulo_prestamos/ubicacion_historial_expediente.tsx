import { ExpedienteId, ObtenerExpedienteByNumeroCliente } from '@/api_conexion/servicios/expedientes';
import Estante from './estante';
import Loading from '@/componentes/Loading';
import { useState } from 'react';
import { Post_Historial_Expediente, CrearHistorialExpediente, actualizarEstadoExpediente } from '@/api_conexion/servicios/historialPrestamos';
import BotonRegresar from '@/modulo_ti/Regresar';
import { Alert } from '@/modulo_ti/alertService';
import { useNavigate } from 'react-router-dom';

export default function UbicacionExpediente() {
  const [expediente, setExpediente] = useState('');
  const [expedienteData, setExpedienteData] = useState<ExpedienteId | null>(null);
  const [loadingExpediente, setLoadingExpediente] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darDeBaja, setDarDeBaja] = useState(false);
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [darDeAlta, setDarDeAlta] = useState(false);
  const [movimiento, setMovimiento] = useState<'entrada' | 'salida' | null>(null);
  const [entregadoA, setEntregadoA] = useState('');
  const [loadingMovimiento, setLoadingMovimiento] = useState(false);
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();

  const buscarExpediente = async () => {
    if (!expediente) return;
    setLoadingExpediente(true);
    setError(null);
    setExpedienteData(null);

    try {
      const numeroCliente = parseInt(expediente.trim(), 10); // Convierte a número
      const expedienteData = await ObtenerExpedienteByNumeroCliente(Number(numeroCliente));
      setExpedienteData(expedienteData);
    } catch (err) {
      setError(`No se pudo encontrar el expediente del cliente = ${expediente}`);
      console.clear();
    } finally {
      setLoadingExpediente(false);
    }
  };

  const registrarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expedienteData) {
      setError('Debe buscar un expediente antes de registrar un movimiento.');
      return;
    }

    if (darDeBaja && !confirmarBaja) {
      setConfirmarBaja(true);
      return;
    }

    setLoadingMovimiento(true);
    setError(null);

    try {
      if (darDeBaja || darDeAlta) {
        if (!comentario || !entregadoA) {
          setError('todos los campos son obligatorios para este tipo de acción.');
          return;
        }

        const nuevoEstado = darDeBaja ? 2 : 1; // 2: De baja, 1: Activo
        
        await actualizarEstadoExpediente({
          id_expediente: expedienteData.id,
          nuevo_estado: nuevoEstado,
          comentario,
          entregadoA,
        });
      } else if (movimiento) {
        const nuevoHistorial: Post_Historial_Expediente = {
          expediente_id: expedienteData.id,
          tipo_evento: movimiento,
          comentarios: `Expediente ${movimiento === 'salida' ? 'entregado a' : 'recibido de'} ${entregadoA}`,
          responsable: entregadoA,
        };
        await CrearHistorialExpediente(nuevoHistorial);
        console.log('Movimiento registrado:', nuevoHistorial);
      }
      Alert(
        'Éxito',
        `Se modifico con exito el expdiente con # cliente: ${expediente}`,
        'success',
        'Ok!',
        () => { navigate(-1) }
      );

      setExpediente('');
      setDarDeBaja(false);
      setDarDeAlta(false);
      setConfirmarBaja(false);
      setMovimiento(null);
      setEntregadoA('');
      setExpedienteData(null);
    } catch (err) {
      setError('Error al registrar el movimiento.');
      console.error(err);
    } finally {
      setLoadingMovimiento(false);
    }
  };

  return (
    <>
      <BotonRegresar />
      <div className="mx-5 mt-5">
        <div className="bg-white shadow-md border-2 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Buscar Expediente</h2>
          <div className="flex items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="expediente" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Cliente
              </label>
              <input
                id="expediente"
                type="number"
                value={expediente}
                onChange={(e) => setExpediente(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Previene que el formulario haga un submit por defecto
                    buscarExpediente();
                  }
                }}
                placeholder="Ingrese el número de cliente"
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
        {error && <div className="text-red-500 mb-10">{error}</div>}

        {expedienteData && (
          <div className="bg-white items-center shadow-md border-2 rounded-lg p-6 mb-8 flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-4">Información del Expediente</h2>
              <div className="flex flex-col gap-y-1 mb-6">
                <p><strong>Número de Cliente:</strong> {expedienteData.numero_cliente}</p>
                <p><strong>Estado:</strong> {expedienteData.estado_nombre}</p>
                <p><strong>Nombre de Cliente:</strong> {expedienteData.nombre_cliente}</p>
                <p><strong>Responsable:</strong> {expedienteData.responsable}</p>
                <p><strong>Agencia:</strong> {expedienteData.agencia}</p>
                <p><strong>Comentarios:</strong> {expedienteData.comentarios}</p>
              </div>
              <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
              <div className="flex flex-col gap-y-1 mb-6">
                {expedienteData.estado_nombre === "De baja" ? (
                  <>
                    <p className="text-red-600 font-bold text-lg">El expediente está dado de baja</p>
                    <p className="text-gray-700">
                      <strong>Última Ubicación:</strong>
                      {` Estante ${expedienteData.estante}, Columna ${expedienteData.columna}, Fila ${expedienteData.fila}`}
                    </p>
                  </>
                ) : (
                  <>
                    <p><strong>Estante:</strong> {expedienteData.estante}</p>
                    <p><strong>Columna:</strong> {expedienteData.columna}</p>
                    <p><strong>Fila:</strong> {expedienteData.fila}</p>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-full">
              {expedienteData.estado_nombre === "De baja" ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-red-600 font-bold text-2xl">El expediente está dado de baja</p>
                </div>
              ) : (
                <Estante
                  estante={expedienteData.estante}
                  columna={expedienteData.columna}
                  fila={expedienteData.fila}
                />
              )}
            </div>
          </div>
        )}


        <div className="bg-white shadow-md border-2 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Movimiento de Expediente</h2>
          <p className='text-sm mb-5'><span className='text-red-500 text-base'>*</span> Estos campos son obligatorios</p>
          <form onSubmit={registrarMovimiento}>
            <div className="mb-4">
              <label htmlFor="entregadoA" className="block text-base font-medium text-gray-700 mb-1">
                Entregado a <span className='text-red-500'>*</span>
              </label>
              <input
                id="entregadoA"
                type="text"
                value={entregadoA}
                onChange={(e) => setEntregadoA(e.target.value)}
                placeholder="Nombre del reponsable"
                required={!darDeBaja}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4 space-y-2">
              <p className="block text-base font-medium text-gray-700">Tipo de Movimiento <span className='text-red-500'>*</span></p>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={movimiento === 'entrada'}
                  onChange={() => setMovimiento('entrada')}
                  required
                  className="mr-2"
                />
                <span className="text-base font-medium text-gray-700">Entrada de Expediente</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={movimiento === 'salida'}
                  onChange={() => setMovimiento('salida')}
                  required
                  className="mr-2"
                />
                <span className="text-base font-medium text-gray-700">Salida de Expediente</span>
              </label>
            </div>
            <div className="mb-4">
              <p className="block text-base font-medium text-gray-700">Activar/Dar de baja al expdiente</p>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={darDeBaja}
                  onChange={(e) => {
                    setDarDeBaja(e.target.checked);
                    if (e.target.checked) {
                      setDarDeAlta(false); // Desmarcar Dar de Alta
                      setMovimiento(null);
                    }
                    setConfirmarBaja(false);
                  }}
                  className="mr-2"
                />
                <span className="text-base font-medium text-gray-700">Dar de baja el expediente</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={darDeAlta}
                  onChange={(e) => {
                    setDarDeAlta(e.target.checked);
                    if (e.target.checked) {
                      setDarDeBaja(false); // Desmarcar Dar de Baja
                      setMovimiento(null);
                    }
                    setConfirmarBaja(false);
                  }}
                  className="mr-2"
                />
                <span className="text-base font-medium text-gray-700">Dar de alta el expediente</span>
              </label>
            </div>
            {(darDeBaja || darDeAlta) && (
              <div className="mb-4">
                <label htmlFor="comentario" className="block text-base font-medium text-gray-700 mb-1">
                  Comentario <span className='text-red-500'>*</span>
                </label>
                <input
                  id="comentario"
                  type="text"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Ingrese un comentario"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
             {darDeBaja && confirmarBaja && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
              <p className="text-yellow-700">¿Está seguro de que desea dar de baja este expediente?</p>
            </div>
          )}
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${darDeBaja || darDeAlta
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
              disabled={
                (darDeBaja || darDeAlta) ? !comentario || !entregadoA : !movimiento
              }
            >
              {loadingMovimiento
                ? 'Procesando...'
                : darDeBaja
                  ? 'Dar de Baja'
                  : darDeAlta
                    ? 'Dar de Alta'
                    : 'Registrar Movimiento'}
            </button>


          </form>
        </div>
      </div>
    </>
  );
}
