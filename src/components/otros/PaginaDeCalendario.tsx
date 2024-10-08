import React, { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DiseñCalendario.css';

const Calendario: React.FC = () => {
  useEffect(() => {
    document.title = "Calendario - TI Bancocci";
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full relative z-10">
        <Calendar className="react-calendar" />
      </div>
    </div>
  );
};

export default Calendario;
