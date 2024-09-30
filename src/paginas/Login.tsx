import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "@/assets/logoBancocci.png";
import { FiLoader } from "react-icons/fi";
import axiosInstance from "@/api conexion/axiosInstance";
import useAuth from "@/api conexion/useAuth";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.title = "Login - TI Bancocci";
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        usuario,
        contraseña,
      });

      const { token, usuario: loggedInUsuario, rol_id } = response.data;

      // Guardar el token y el rol en el estado de autenticación
      login(token, rol_id, loggedInUsuario);

      // Redirigir al usuario en función de su rol
      if (rol_id === 1) {
        navigate("/dashboard-empleados/main");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="ml-5 mr-5 h-full bg-white overflow-hidden flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full h-full mb-10 items-center justify-center gap-36">
          <div className="">
            <img
              src={logo1}
              alt="Logo 1"
              className="w-80 h-80"
            />
          </div>
          
          <div className="bg-orange-400 w-full sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 shadow-2xl rounded-lg p-11">
            <form className="p-1" onSubmit={handleLogin}>
              <h1 className="text-white text-center text-3xl font-bold mb-6">Bienvenido</h1>
              <span className=" text-white font-bold ">Usuario</span>
              <div className="flex items-center text-lg mb-6 md:mb-8 ">
                <svg
                  className="absolute ml-3 z-0"
                  width="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z" />
                </svg>
                <input
                  type="text"
                  id="email"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="bg-gray-200 pl-12 py-2 md:py-4 text-sm focus:outline-none w-full rounded-md shadow-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="correo institucional"
                />
              </div>
              <span className=" text-white font-bold">Contraseña</span>
              <div className="flex items-center text-lg mb-6 md:mb-8 ">
                <svg className="absolute ml-3" viewBox="0 0 24 24" width="24">
                  <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z" />
                </svg>
                <input
                  type="password"
                  id="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md shadow-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Contraseña"
                />
              </div>
              {error && (
                <div className="text-red-600 mb-4 text-center">{error}</div>
              )}
              <button
                className="bg-gradient-to-b from-blue-900 to-blue-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded-md shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FiLoader className="mr-2 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
