import React from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "@/api conexion/useAuth";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función de logout para limpiar los datos de sesión
    navigate("/"); // Redirige a la página de login (o a la ruta que prefieras)
  };
  return (
    <aside className="bg-orange-500 text-white h-screen w-40 hidden md:flex text-sm fixed mt-14">
      {" "}
      {/* Ajustar top */}
      {/* Opciones de navegación */}
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
                  to="/dashboard-empleados/Notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Notificaciones
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
                  to="/dashboard-admin/Notificaciones"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  <FaRegCalendarAlt className="h-6 w-6 mr-2" />
                  Notificaciones
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
