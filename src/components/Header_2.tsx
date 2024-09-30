import useAuth from "@/api conexion/useAuth";
import logoBancocci from "@/assets/logoBancocci.png";
import { useState } from "react";
import { CiLogout, CiUser } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Header_2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función de logout para limpiar los datos de sesión
    navigate("/"); // Redirige a la página de login (o a la ruta que prefieras)
  };

  return (
    <>
      <header className=" px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-green-900 z-50 fixed w-full">
        <span
          className="flex items-center justify-center"
          
        >
          <img src={logoBancocci} alt="logo unah" className="w-10 h-10" />
          <span className="text-sm font-bold text-white ml-2">
            TI Bancocci
          </span>
        </span>
        <nav className="ml-auto hidden md:flex gap-4 text-white">
          <h2 className="text-sm">@{usuario}</h2>
        </nav>
        <button
          className="ml-auto md:hidden text-white focus:outline-none"
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <HiOutlineMenuAlt3 className="h-6 w-6" />
        </button>
      </header>
      {isMenuOpen && (
        <nav className="bg-blue-900 md:hidden">
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/perfil"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/perfil"
                : "/dashboard-voae/perfil"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <CiUser className="mr-1" /> Perfil
          </NavLink>
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/main"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/main"
                : "/dashboard-voae/main"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <LuLayoutDashboard className="mr-1" /> Dashboard
          </NavLink>
          <NavLink
            to={
              location.pathname.includes("dashboard-coordinador")
                ? "/dashboard-coordinador/calendario"
                : location.pathname.includes("dashboard-estudiante")
                ? "/dashboard-estudiante/calendario"
                : "/dashboard-voae/calendario"
            }
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <FaRegCalendarAlt className="mr-1" /> Calendario
          </NavLink>
          <span
            onClick={handleLogout} // Cambiado a handleLogout
            className="px-4 py-2 text-sm text-white hover:underline flex items-center"
          >
            <CiLogout className="mr-1" /> Cerrar Sesión
          </span>
        </nav>
      )}
    </>
  );
}
