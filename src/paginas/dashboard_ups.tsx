import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook} from '@fortawesome/free-solid-svg-icons';
import DashboardButton from "../components/DashboardButton";
import {  UpsRouteKeys, upsRoutes } from "../api conexion/routesConfig";

const Dashboard_Ups: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: UpsRouteKeys) => {
    switch (title) {
      
      case "UPS Pequeño":
        return <FontAwesomeIcon icon= {faAddressBook} />;  
      case "UPS Grande":
        return <FontAwesomeIcon icon= {faAddressBook} color="white" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">Informe UPS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(upsRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as UpsRouteKeys}
              icon={getIconByTitle(title as UpsRouteKeys)}
              route={upsRoutes[title as UpsRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_Ups;
