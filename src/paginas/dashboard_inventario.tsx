import React, { useEffect } from "react";
import { IoIosLaptop, IoIosDesktop } from "react-icons/io";
import { BsProjector } from "react-icons/bs";
import { ImList2 } from "react-icons/im";
import { SlPrinter } from "react-icons/sl";
import { PiComputerTower } from "react-icons/pi";
import DashboardButton from "../components/DashboardButton";
import {  InventarioRouteKeys, inventarioRoutes} from "../api conexion/routesConfig";

const Dashboard_inventario: React.FC = () => {
  useEffect(() => {
    document.title = "Dashboard - Sistema TI Bancocci";
  }, []);

  const getIconByTitle = (title: InventarioRouteKeys) => {
    switch (title) {
      
      case "Desktop":
        return <PiComputerTower size={62} color="white"/>;  
      case "Laptop":
        return <IoIosLaptop size={62} color="white"/>;
      case "Impresora":
        return <SlPrinter size={62} color="white"/> ;  
      case "Impresora Financiera":
        return ;
        case "Teléfono":
        return ;  
      case "Planta":
        return ;
        case "Monitor":
        return <IoIosDesktop size={62} color="white"/>;  
      case "Proyector":
        return <BsProjector size={62} color="white"/>;
        case "Otros":
        return <ImList2 size={32} color="white"/>; 
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">Inventario TI</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(inventarioRoutes).map((title) => (
            <DashboardButton
              key={title}
              title={title as InventarioRouteKeys}
              icon={getIconByTitle(title as InventarioRouteKeys)}
              route={inventarioRoutes[title as InventarioRouteKeys]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_inventario;
