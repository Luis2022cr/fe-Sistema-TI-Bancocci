import React, { useEffect, useState } from 'react';
import Loading from "@/componentes/Loading";
import Select from 'react-select';
import axios from 'axios';
import { Rol, ObtenerRoles } from '@/api_conexion/servicios/roles';
import { CrearUsuarios, Post_Usuario } from '@/api_conexion/servicios/usuarios';
import { Copy } from 'lucide-react';

// Definir tipos para las opciones
interface SelectOption {
  value: number;
  label: string;
}

// Componente Modal
interface UsuarioCreadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nombre: string;
  contraseña: string;
}

const CrearUsuario: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [rol_id, setRolId] = useState<SelectOption | null>(null);
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoUsuarioData, setNuevoUsuarioData] = useState<{ nombre: string, contraseña: string }>({
    nombre: '',
    contraseña: ''
  });
  useEffect(() => {
    document.title = "Usuario - TI Bancocci";
  }, []);
  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const response = await ObtenerRoles();
        setRoles(response.map((rol: Rol) => ({
          value: rol.id,
          label: rol.descripcion,
        })));
      } catch (error) {
        setError("Error al cargar los roles.");
      }
    };

    setLoading(true);
    Promise.all([obtenerRoles()])
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !correo || !rol_id) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    const nuevoUsuario: Post_Usuario = {
      nombre,
      correo,
      rol_id: rol_id?.value,
    };

    try {
      setLoading(true);
      const resultado = await CrearUsuarios(nuevoUsuario);
      setNuevoUsuarioData({
        nombre: resultado.usuario ?? '',
        contraseña: resultado.contraseña ?? ''
      });

      setSuccessMessage("Usuario agregado correctamente.");
      setError(null);
      setIsModalOpen(true); // Abre el modal

      // Limpia los campos del formulario
      setNombre('');
      setCorreo('');
      setRolId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const respuestaError = error.response?.data?.error;
        setError(respuestaError || "Error al agregar el usuario.");
      } else {
        setError("Error al agregar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const UsuarioCreadoModal: React.FC<UsuarioCreadoModalProps> = ({ isOpen, onClose, nombre, contraseña }) => {
    if (!isOpen) return null;

    // Función para copiar los datos al portapapeles
    const copiarAlPortapapeles = () => {
      const texto = `Usuario: ${nombre.toLowerCase().replace(/\s+/g, '')}\nContraseña: ${contraseña}`;
      navigator.clipboard.writeText(texto).then(() => {
        alert('Datos copiados al portapapeles');
      }).catch((err) => {
        console.error('Error al copiar al portapapeles', err);
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          id="usuario-modal"
          className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative"
        >
          {/* Botón de copiar al portapapeles en la esquina superior derecha */}
          <button
            onClick={copiarAlPortapapeles}
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all"
            title="Copiar al portapapeles"
          >
            <Copy className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-xl font-bold mb-4">Usuario creado con éxito</h2>
          <p><strong>Usuario:</strong> {nombre.toLowerCase().replace(/\s+/g, '')}</p>
          <p><strong>Contraseña:</strong> {contraseña}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-8 -mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Usuario</h2>
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {error && (
        <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-gray-700 hidden">Usuario</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-full bg-gray-200"
            placeholder="Nombre Usuario"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 hidden">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-3 py-2 border rounded-full bg-gray-200"
            placeholder="Correo"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 hidden">Rol</label>
          <Select
            value={rol_id}
            onChange={setRolId}
            options={roles}
            placeholder="Selecciona un Rol"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex justify-center items-center mt-11">
          <button
            type="submit"
            className="w-1/2 h-14 hover:bg-green-500 bg-green-700 text-xl text-white py-2 rounded-full"
          >
            Agregar
          </button>
        </div>
      </form>

      <UsuarioCreadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nombre={nuevoUsuarioData.nombre} // Pasamos el nombre del usuario
        contraseña={nuevoUsuarioData.contraseña} // Pasamos la contraseña generada
      />
    </div>
  );
};

export default CrearUsuario;
