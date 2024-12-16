import React, { useState, useEffect } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt, FaCircle } from "react-icons/fa"; // Importa FaBell
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/api_conexion/useAuth";
import { ObtenerNotificacionesCheck } from "@/api_conexion/servicios/notifcaciones";
import { IoIosNotificationsOutline } from "react-icons/io";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [{ data, loading, error }] = ObtenerNotificacionesCheck();
  const [notificacionesVistas, setNotificacionesVistas] = useState(
    () => JSON.parse(sessionStorage.getItem("notificacionesVistas") || "false")
  );
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    // Si el usuario está en la página de notificaciones, marcarlas como vistas
    if (location.pathname.includes("notificaciones")) {
      setNotificacionesVistas(true);
      sessionStorage.setItem("notificacionesVistas", "true"); // Guardar en localStorage
    }
  }, [location.pathname]);

  if (loading) return <p>Cargando notificaciones...</p>;
  if (error) return <p>Error al cargar las notificaciones: {error.message}</p>;

  return (
    <aside className="bg-orange-500 text-white h-screen w-40 hidden md:flex text-sm fixed mt-14">
      <nav className="mt-5">
        <ul className="space-y-2">
          {location.pathname.includes("empleado") && (
            <>
              <li>
                <NavLink
                  to="/empleado/main"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <LuLayoutDashboard className="h-6 w-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleado/notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6  hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <IoIosNotificationsOutline className="h-6 w-6 -ml-4" />
                  Notificaciones
                  {!notificacionesVistas && data?.hayNotificaciones && (
                    <FaCircle className="text-red-800 h-3 w-3 animate-pulse ml-1 " /> 
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleado/perfil"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <CiUser className="h-6 w-6 mr-2" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleado/calendario"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Calendario
                </NavLink>
              </li>
              
            </>
          )}

          {/* DASHBOARD DE ADMINITRADOR */}

          {location.pathname.includes("administracion") && (
            <>
              <li>
                <NavLink
                  to="/administracion/main"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <LuLayoutDashboard className="h-6 w-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/administracion/notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                   <IoIosNotificationsOutline className="h-6 w-6 -ml-4" />
                  Notificaciones
                  {!notificacionesVistas && data?.hayNotificaciones && (
                    <FaCircle className="text-red-800 h-3 w-3 animate-pulse ml-1 " /> 
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/administracion/perfil"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <CiUser className="h-6 w-6 mr-2" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/administracion/calendario"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-6 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Calendario
                </NavLink>
              </li>
             
            </>
          )}
          <hr className="my-4 border-t border-gray-300" />
          <li>
            <button
              onClick={handleLogout}
              className={`flex items-center py-3 px-6 hover:bg-red-700`}
            >
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
