import useAuth from '@/api_conexion/useAuth';
import './ProfileCard.css';
import profile from "@/assets/usuario.png";
import Loading from './Loading';
import { ObtenerPerfil } from '@/api_conexion/servicios/perfil';
import { Link } from "react-router-dom";

export default function Perfil() {
    const { usuario } = useAuth();
    const [{ data: perfilData, loading: loadingPerfil }] = ObtenerPerfil();

    if (loadingPerfil) {
        return <Loading />;
    }

    const usuarioPerfil = perfilData;

    if (!usuario || !usuarioPerfil) {
        return <p>No se encontró información del usuario.</p>;
    }

    const obtenerFechaHoraActual = (): string => {
        const fecha = new Date();
        return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
    };

    const ultimaSesion = localStorage.getItem('ultimaSesion') || obtenerFechaHoraActual();
    localStorage.setItem('ultimaSesion', obtenerFechaHoraActual());

    const cambiarContraseñaRuta = usuarioPerfil.rol === "admin"
        ? "/dashboard-admin/perfil/cambiar-contraseña"
        : "/dashboard-empleados/perfil/cambiar-contraseña";

    return (
        <div className="profile-card">
            <div className="profile-card__info">
                <img
                    src={profile}
                    alt="Profile"
                    width={150}
                    height={150}
                    className="profile-card__avatar"
                />
                <h3 className="profile-card__name"> {usuarioPerfil.nombre} </h3>
            </div>
            
            <div className="profile-card__details">
                <h3 className='text-center text-orange-500'>Información Personal</h3>
                <div className="mt-2">
                    <span className='font-bold'>Usuario:</span>
                    <span> {usuarioPerfil.usuario}</span>
                </div>
                <div className="mt-2">
                    <span className='font-bold'>Correo:</span>
                    <span> {usuarioPerfil.correo}</span>
                </div>
                <div className="mt-2">
                    <span className='font-bold'>Rol:</span>
                    <span> {usuarioPerfil.rol}</span>
                </div>
                <div className="mt-2">
                    <span className='font-bold'>Última vez conectado:</span>
                    <span> {ultimaSesion}</span>
                </div>
             </div>
             <div className="mt-4 w-full flex justify-center">
                <Link
                    to={cambiarContraseñaRuta}
                    className="profile-card__button profile-card__button--logout text-white hover:text-black transition-colors duration-300 text-center w-full py-2"
                >
                    Cambiar Contraseña
                </Link>
            </div>
        </div>
    );
}