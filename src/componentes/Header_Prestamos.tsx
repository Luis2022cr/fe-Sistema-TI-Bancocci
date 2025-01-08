import logoBancocci from "@/assets/logoBancocci.png";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function Header_Prestamos() {
  const navigate = useNavigate(); // Para redirigir tras el cierre de sesión

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirigir al inicio
  };
  return (
    <>
      <header className=" px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-green-900 z-50 fixed w-full">
        <span className="flex items-center justify-center">
          <img src={logoBancocci} alt="logo unah" className="w-10 h-10" />
          <span className="text-sm font-bold text-white ml-2">
            Expediente Prestamos Bancocci Zona Occidente
          </span>
        </span>

        <button onClick={handleLogout} className="flex items-center py-3 px-6 hover:bg-red-700">
          <CiLogout className="h-6 w-6 mr-2" />
          Cerrar Sesión
        </button>
      </header>

    </>
  );
}
