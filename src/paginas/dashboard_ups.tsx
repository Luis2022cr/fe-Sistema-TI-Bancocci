import React, { useEffect } from "react";
import DashboardButton from "../components/DashboardButton";
import {  UpsRouteKeys, upsRoutes } from "../api conexion/routesConfig";
import ups from "../assets/ups.svg";

const Dashboard_Ups: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: UpsRouteKeys) => {
    switch (title) {
      
      case "UPS Pequeño":
        return <img src={ups} alt="ups" width={150} height={150}/>;  
      case "UPS Grande":
        return <img src={ups} alt="ups" width={150} height={150}/>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-20 flex justify-center items-center">
  <div className="flex-1 p-6 mx-6">
    <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">Informe UPS</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-40">
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
