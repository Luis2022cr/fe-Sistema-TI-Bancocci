import React, { useEffect } from "react";
import { FiEdit} from "react-icons/fi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook} from '@fortawesome/free-solid-svg-icons';
import DashboardButton from "../components/DashboardButton";
import { empleadosRoutes, EmpleadosRouteKeys } from "../api conexion/routesConfig";

const DashboardInicio: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: EmpleadosRouteKeys) => {
    switch (title) {
      
      case "Informe UPS":
        return <FontAwesomeIcon icon= {faAddressBook} />;  
      case "Directorio TI":
        return <FontAwesomeIcon icon= {faAddressBook} color="white" />;
      case "Inventario TI":
        return <FiEdit size={32} color="white" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Bienvenido</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
