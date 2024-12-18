import React, { useEffect } from "react";
import {  ConfigEmpleadoRoutes, configEmpleadoRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "@/components/DashboardButton";
import { TfiAgenda } from "react-icons/tfi";
import { PiMapPinSimpleAreaThin } from "react-icons/pi";
import { Dice6 } from "lucide-react";

const Dashboard_ConfigEmpleado: React.FC = () => {
  useEffect(() => {
    document.title = "Empleado - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: ConfigEmpleadoRoutes) => {
    switch (title) {

      case "Agencias":
        return <TfiAgenda className="w-14 h-14 text-white" />

      case "Departamentos":
        return <PiMapPinSimpleAreaThin className="w-14 h-14 text-white"  />

        case "Marca":
        return <Dice6 className="w-14 h-14 text-white" />

        case "Modelo":
          return <Dice6 className="w-14 h-14 text-white" />
      
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex-1 p-6 mx-6">
        <h1 className="mb-8 text-3xl font-bold text-center text-blue-900">Configuraciones</h1>
        <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-3">
          {Object.keys(configEmpleadoRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as ConfigEmpleadoRoutes}
              icon={getIconByTitle(title as ConfigEmpleadoRoutes)}
              route={configEmpleadoRoutes[title as ConfigEmpleadoRoutes]}
            />
          ))}
        </div>
      </div>
    </div>

  );
};

export default Dashboard_ConfigEmpleado;
