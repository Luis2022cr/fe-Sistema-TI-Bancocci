import React, { useState, useEffect } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt, FaBell } from "react-icons/fa"; // Importa FaBell
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/api conexion/useAuth";
import { ObtenerNotificacionesCheck } from "@/api conexion/servicios/notifcaciones";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [{ data, loading, error }] = ObtenerNotificacionesCheck();
  const [notificacionesVistas, setNotificacionesVistas] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (location.pathname.includes("notificaciones")) {
      setNotificacionesVistas(true); // Marca las notificaciones como vistas
    }
  }, [location.pathname]);

  if (loading) return <p>Cargando notificaciones...</p>;
  if (error) return <p>Error al cargar las notificaciones: {error.message}</p>;

  return (
    <aside className="bg-orange-500 text-white h-screen w-40 hidden md:flex text-sm fixed mt-14">
      <nav className="mt-5">
        <ul className="space-y-2">
          {location.pathname.includes("dashboard-empleados") && (
            <>
              <li>
                <NavLink
                  to="/dashboard-empleados/main"
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
                  to="/dashboard-empleados/notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Notificaciones
                  {!notificacionesVistas && data?.hayNotificaciones && (
                    <FaBell className="text-red-500 h-4 w-4 ml-2" /> // Icono de notificación
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-empleados/perfil"
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
                  to="/dashboard-empleados/calendario"
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
          {location.pathname.includes("dashboard-admin") && (
            <>
              <li>
                <NavLink
                  to="/dashboard-admin/main"
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
                  to="/dashboard-admin/notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Notificaciones
                  {!notificacionesVistas && data?.hayNotificaciones && (
                    <FaBell className="text-red-500 h-4 w-4 ml-2" /> // Icono de notificación
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard-admin/perfil"
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
                  to="/dashboard-admin/calendario"
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
