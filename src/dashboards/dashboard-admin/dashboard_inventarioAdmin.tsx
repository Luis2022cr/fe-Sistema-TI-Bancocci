import React, { useEffect } from "react";
import { IoIosLaptop, IoIosDesktop } from "react-icons/io";
import { BsProjector } from "react-icons/bs";
import { ImList2 } from "react-icons/im";
import { SlPrinter } from "react-icons/sl";
import { PiComputerTower } from "react-icons/pi";
import impresoraFI from "@/assets/impresoraFI.svg";
import telefono from "@/assets/telefono.svg";
import planta from "@/assets/planta.svg";
import { InventarioAdminRouteKeys, inventarioAdminRoutes } from "@/api_conexion/routesConfig";
import DashboardButton from "../DashboardButton";
import { Link, useLocation } from "react-router-dom";

const Dashboard_inventarioAdmin: React.FC = () => {
  useEffect(() => {
    document.title = "Administracion - Sistema TI Bancocci";
  }, []);
  const location = useLocation();
  const isDashboardEmpleados = location.pathname.includes('/empleado');
  const dashboardPath = isDashboardEmpleados ? '/empleado' : '/administracion';

  const getIconByTitle = (title: InventarioAdminRouteKeys) => {
    switch (title) {

      case "Desktop":
        return <PiComputerTower size={62} color="white" />;
      case "Laptop":
        return <IoIosLaptop size={62} color="white" />;
      case "Impresora":
        return <SlPrinter size={62} color="white" />;
      case "Impresora Financiera":
        return <img src={impresoraFI} alt="impresora financiera" width={62} height={62} />;
      case "Teléfono":
        return <img src={telefono} alt="telefono" width={62} height={62} />;
      case "Planta":
        return <img src={planta} alt="plan" width={62} height={62} />;
        return;
      case "Monitor":
        return <IoIosDesktop size={62} color="white" />;
      case "Proyector":
        return <BsProjector size={62} color="white" />;
      case "Otros":
        return <ImList2 size={32} color="white" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full  mx-6 ">

      <div className="flex justify-between items-center mt-6">
        <Link to={`${dashboardPath}/inventario/Subir_Excel`} className="text-blue-800 hover:text-blue-700 hover:underline">
          Ingresar Excel
        </Link>
        <Link to={`${dashboardPath}/inventario/obsoleto`} className="text-blue-800 hover:text-blue-700 hover:underline">
          Inventario obsoleto
        </Link>
      </div>
      <div className="flex-1 justify-between p-4 -mt-11">
        <h1 className="text-3xl font-bold mt-5 mb-5 text-blue-900 text-center">Inventario TI</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(inventarioAdminRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as InventarioAdminRouteKeys}
              icon={getIconByTitle(title as InventarioAdminRouteKeys)}
              route={inventarioAdminRoutes[title as InventarioAdminRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_inventarioAdmin;
