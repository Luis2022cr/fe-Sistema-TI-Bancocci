import React, { useEffect, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DiseñCalendario.css';
import { NavLink } from 'react-router-dom';
import {  isSameDay } from 'date-fns';
import Loading from '../Loading';
import { CalendarioUps, ObtenerDatosUpsCalendario } from '@/api_conexion/servicios/estados'; // Asegúrate de que esta ruta sea correcta
import { X } from 'lucide-react';
import {  formatearFecha2 } from '../campos/FormateoFecha';

const Calendario: React.FC = () => {
  useEffect(() => {
    document.title = "Calendario - TI Bancocci";
  }, []);

  const [{ data, loading, error }] = ObtenerDatosUpsCalendario();
  const [date, setDate] = useState<Date | null>(null);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [selectedActivities, setSelectedActivities] = useState<CalendarioUps[]>([]); // Almacenar actividades del día seleccionado

  const manejarCambioDeFecha: CalendarProps['onChange'] = (value) => {
    const selectedDate = value as Date;
    setDate(selectedDate);
    const dayActivities = data?.filter(actividad => 
      isSameDay(new Date(actividad.proximo_cambio), selectedDate) // Comparar fechas
    ) || []; // Usa un valor por defecto si `data` es undefined

    setSelectedActivities(dayActivities);
    setShowPanel(dayActivities.length > 0); // Mostrar el panel si hay actividades
  };

  const tileContent: CalendarProps['tileContent'] = ({ date }) => {
    const dayActivities = data?.some(actividad => 
      isSameDay(new Date(actividad.proximo_cambio), date) // Comparar fechas
    );

    return dayActivities ? <span className="dot"></span> : null;
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar los datos: {error.message}</p>;
  if (!data) return <p>No hay datos disponibles.</p>; // Manejo de caso donde no hay datos

  return (
    <div className="flex justify-center items-center h-full relative">
      <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg w-full relative z-10">
        <Calendar
          onChange={manejarCambioDeFecha}
          tileContent={tileContent}
          className="react-calendar"
        />
      </div>
      {showPanel && date && (
        <div className="activity-panel absolute top-0 left-0 right-0 mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg w-20 md:w-96 z-20">
          <button
            className="absolute top-1 right-2 text-gray-500 font-bold underline hover:text-gray-700"
            onClick={handleClosePanel}
          >
            <X />
          </button>
          <h2 className="text-sm md:text-lg font-bold mb-2">{formatearFecha2(date)}</h2>
          <ul>
            {selectedActivities.map(activity => (
              <li key={activity.id} className="mb-2">
                <div className="block md:flex justify-between items-center border-4 border-green-500 p-2">
                  <div>
                    <p className="font-medium">UPS: <span className='font-normal'>{activity.ups}</span></p>
                    <p className="font-medium">Modelo: <span className='font-normal'>{activity.modelo}</span></p>
                    <p className="text-sm text-gray-600">{activity.agencia}</p>
                  </div>
                  <NavLink
                    to={`/administracion/historial_ups/${activity.id}`} // Cambia la ruta según tu necesidad
                    className="px-4 py-2 text-sm text-orange-500 hover:underline flex items-center"
                  >
                    Ver detalles
                  </NavLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendario;
