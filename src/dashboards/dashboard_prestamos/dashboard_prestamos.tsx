import React, { useEffect } from "react";
import expediente from "@/assets/Expediente.png";
import Bexpediente from "@/assets/Bexpediente.png";
import { PrestamosRouteKeys, prestamosRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "../DashboardButton";

const DashboardPrestamos: React.FC = () => {
  useEffect(() => {
    document.title = "Prestamos - Sistema Bancocci";
  }, []);

  const getIconByTitle = (title: PrestamosRouteKeys) => {
    switch (title) {

      case "Expedientes Prestamos":
        return <img src={expediente} alt="ups" width={150} height={150} />;
      case "Ubicación Expediente":
        return <img src={Bexpediente} alt="directorio" width={150} height={150} />;

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex mx-6 mt-24">
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Bienvenido</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          {Object.keys(prestamosRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as PrestamosRouteKeys}
              icon={getIconByTitle(title as PrestamosRouteKeys)}
              route={prestamosRoutes[title as PrestamosRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPrestamos;
