import React, { useEffect } from "react";
import inventarios from "@/assets/inventarios.svg";
import ups from "@/assets/ups.svg";
import directorio from "@/assets/directorio.svg";
import reporte from "@/assets/reporte.svg";
import { EmpleadosRouteKeys, empleadosRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "@/components/DashboardButton";

const DashboardInicio: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: EmpleadosRouteKeys) => {
    switch (title) {
      
      case "Informe UPS":
        return <img src={ups} alt="ups" width={150} height={150} />;
        case "Directorio TI":
          return <img src={directorio} alt="directorio" width={150} height={150}  />;
          case "Inventario TI":
        return <img src={inventarios} alt="inventario" width={150} height={150}  />;
        case "Reporte E/S Equipo":
        return <img src={reporte} alt="inventario" width={150} height={150}  />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex mx-6 mt-11">
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Bienvenido</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {Object.keys(empleadosRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as EmpleadosRouteKeys}
              icon={getIconByTitle(title as EmpleadosRouteKeys)}
              route={empleadosRoutes[title as EmpleadosRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardInicio;
