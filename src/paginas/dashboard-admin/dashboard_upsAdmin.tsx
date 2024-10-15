import React, { useEffect } from "react";
import ups from "@/assets/ups.svg";
import mapa from "@/assets/mapa.svg";
import { UpsAdminRouteKeys, upsAdminRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "@/components/DashboardButton";

const Dashboard_UpsAdmin: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: UpsAdminRouteKeys) => {
    switch (title) {

      case "UPS Pequeño":
        return <img src={ups} alt="ups" width={150} height={150} />;
      case "UPS Grande":
        return <img src={ups} alt="ups" width={150} height={150} />;
        case "Mapa":
        return <img src={mapa} alt="mapa" width={150} height={150} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex-1 p-6 mx-6">
        <h1 className="mb-8 text-3xl font-bold text-center text-blue-900">Informe UPS</h1>
        <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-3">
          {Object.keys(upsAdminRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as UpsAdminRouteKeys}
              icon={getIconByTitle(title as UpsAdminRouteKeys)}
              route={upsAdminRoutes[title as UpsAdminRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>

  );
};

export default Dashboard_UpsAdmin;
