import React, { useEffect } from "react";
import { ControlRouteKeys, controlRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "@/components/DashboardButton";
import { FilePlus, History } from 'lucide-react';

const Dashboard_Control: React.FC = () => {
  useEffect(() => {
    document.title = "Control Equipo - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: ControlRouteKeys) => {
    switch (title) {

      case "Historial Entradas y Salidas de Equipo":
        return <History size={120} color="white"/>
      case "Crear nueva Entrada o Salida":
        return <FilePlus size={120} color="white" />
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex-1 p-6 mx-6">
        <h1 className="mb-8 text-3xl font-bold text-center text-blue-900">Control de Equipos</h1>
        <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          {Object.keys(controlRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as ControlRouteKeys}
              icon={getIconByTitle(title as ControlRouteKeys)}
              route={controlRoutes[title as ControlRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>

  );
};

export default Dashboard_Control;
