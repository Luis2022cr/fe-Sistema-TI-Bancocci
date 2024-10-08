import Swal from 'sweetalert2';

// Definir la interfaz para las propiedades que recibirá el componente
interface AlertProps {
    title: string;
    text: string;
    icon: 'success' | 'error' | 'warning' | 'info' | 'question'; // Los posibles valores de icono que permite SweetAlert2
    confirmButtonText?: string; // El texto del botón de confirmación (opcional)
    callback?: () => void; // Función opcional que se ejecuta después de cerrar la alerta
}

const Alert: React.FC<AlertProps> = ({ title, text, icon, confirmButtonText = 'OK', callback }) => {
    const showAlert = () => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
        }).then(() => {
            if (callback) {
                callback(); // Ejecuta la función callback si está definida
            }
        });
    };

    return <>{showAlert()}</>; // Llamamos a showAlert al renderizar el componente
};

export default Alert;
