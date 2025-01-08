import React, { useState, useEffect } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt, FaCircle } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ObtenerNotificacionesCheck } from "@/api_conexion/servicios/notifcaciones";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Settings } from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import Loading from "@/modulo_ti/Loading";

// Tipos para los elementos del menú
type MenuItem = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  showBadge?: boolean;
};

type MenuItems = {
  [key: number]: MenuItem[];
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir tras el cierre de sesión
  const [{ data, loading, error }] = ObtenerNotificacionesCheck();
  const [notificacionesVistas, setNotificacionesVistas] = useState(
    () => JSON.parse(sessionStorage.getItem("notificacionesVistas") || "false")
  );

  // Obtener el rol del usuario desde sessionStorage
  const userRole = Number(sessionStorage.getItem("userRole"));

  useEffect(() => {
    if (location.pathname.includes("notificaciones")) {
      setNotificacionesVistas(true);
      sessionStorage.setItem("notificacionesVistas", "true");
    }
  }, [location.pathname]);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar las notificaciones: {error.message}</p>;

  // Configurar los elementos del menú para cada rol
  const menuItems: MenuItems = {
    2: [
      { to: "/ti/main", icon: LuLayoutDashboard, label: "Dashboard" },
      { to: "/ti/notificaciones", icon: IoIosNotificationsOutline, label: "Notificaciones",
        showBadge: Boolean(data?.hayNotificaciones && !notificacionesVistas),
      },
      { to: "/ti/perfil", icon: CiUser, label: "Perfil" },
      { to: "/ti/calendario", icon: FaRegCalendarAlt, label: "Calendario" },
      { to: "/ti/configuraciones", icon: Settings, label: "Otros" },
    ],

    1: [
      { to: "/admin/main", icon: LuLayoutDashboard, label: "Dashboard" },
      { to: "/ti/notificaciones", icon: IoIosNotificationsOutline, label: "Notificaciones",
        showBadge: Boolean(data?.hayNotificaciones && !notificacionesVistas),
      },
      { to: "/ti/perfil", icon: CiUser, label: "Perfil" },
      { to: "/ti/calendario", icon: FaRegCalendarAlt, label: "Calendario" },
    ],
  };
  
  const currentMenu = menuItems[userRole] || []; // Usar el menú correspondiente al rol o un arreglo vacío si el rol no es válido

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirigir al inicio
  };

  return (
    <aside className="bg-orange-500 text-white h-screen w-fit hidden md:flex text-sm fixed mt-14">
      <nav className="mt-5">
        <ul className="space-y-2">
          {currentMenu.map(({ to, icon: Icon, label, showBadge }: MenuItem) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center py-3 px-6 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                }
              >
                <Icon className="h-6 w-6 mr-2" />
                {label}
                {showBadge && <FaCircle className="text-red-800 h-3 w-3 animate-pulse ml-1" />}
              </NavLink>
            </li>
          ))}
          <hr className="my-4 border-t border-gray-300" />
          <li>
            <button onClick={handleLogout} className="flex items-center py-3 px-6 hover:bg-red-700">
              <CiLogout className="h-6 w-6 mr-2" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
