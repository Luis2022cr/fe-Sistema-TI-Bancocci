import  { useEffect, useState } from "react";
import logoBancocci from "@/assets/logoBancocci.png";
import { useNavigate } from "react-router-dom";

export default function Header_Prestamos() {
  const navigate = useNavigate(); // Para redirigir tras el cierre de sesión
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú desplegable
  const [username, setUsername] = useState("Usuario"); // Estado para el nombre de usuario

  useEffect(() => {
    // Obtener el nombre de usuario del sessionStorage y quitar comillas si existen
    const storedUsername = sessionStorage.getItem("usuario");
    if (storedUsername) {
      setUsername(storedUsername.replace(/^"|"$/g, "")); // Eliminar comillas al inicio y al final
    }
  }, []);
 
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirigir al inicio
  };

  
  const handleProfile = () => {
    setMenuOpen(false); // Cerrar el menú
    navigate("/prestamos/perfil"); // Redirigir a la página de perfil
  };

  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-green-900 z-50 fixed w-full">
        <span className="flex items-center justify-center">
          <img src={logoBancocci} alt="logo banco" className="w-10 h-10" />
          <span className="text-sm font-bold text-white ml-2">
            Expediente Prestamos Bancocci Zona Occidente
          </span>
        </span>

        <div className="ml-auto relative">
          <button
            className="flex items-center py-2 px-4 rounded hover:bg-green-700 text-white"
            id="user-menu-button"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((prev) => !prev)} // Alternar el estado del menú
          >
            <span className="mr-2">{username}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {menuOpen && ( // Mostrar el menú si `menuOpen` es true
            <ul
              className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md py-1 text-sm z-10"
              aria-labelledby="user-menu-button"
            >
              <li>
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                  onClick={handleProfile} // Redirigir al perfil
                >
                  Perfil
                </button>
              </li>
              <li>
                <button
                  className="block px-4 py-2 text-gray-900 hover:bg-red-600 hover:text-white w-full text-left"
                  onClick={handleLogout} // Cerrar sesión
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
