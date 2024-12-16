import React, { useEffect } from "react";
import inventarios from "@/assets/inventarios.svg";
import ups from "@/assets/ups.svg";
import usuario from "@/assets/usuario.svg";
import directorio from "@/assets/directorio.svg";
import { AdminRouteKeys, adminRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "@/components/DashboardButton";
import reporte from "@/assets/reporte.svg";
import setting from "@/assets/settings_icon.svg";

const DashboardAdmin: React.FC = () => {
  useEffect(() => {
    document.title = "Administracion - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: AdminRouteKeys) => {
    switch (title) {

      case "Gestion Usuarios":
        return <img src={usuario} alt="usuario" width={150} height={150} />;
      case "Informe UPS":
        return <img src={ups} alt="ups" width={150} height={150} />;
      case "Directorio TI":
        return <img src={directorio} alt="directorio" width={150} height={150} />;
      case "Inventario TI":
        return <img src={inventarios} alt="inventario" width={150} height={150} />;
      case "Entrada y salida Equipo":
        return <img src={reporte} alt="inventario" width={150} height={150} />;
      case "Otros":
        return <img src={setting} alt="inventario" width={150} height={150} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex mx-6">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold  text-blue-900">Bienvenido</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {Object.keys(adminRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as AdminRouteKeys}
              icon={getIconByTitle(title as AdminRouteKeys)}
              route={adminRoutes[title as AdminRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
