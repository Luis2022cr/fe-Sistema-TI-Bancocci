import { X } from "lucide-react";
import React, { ReactNode } from "react";

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    // Nueva función para manejar el cierre y recargar la página
    const handleClose = () => {
        onClose(); // Ejecutar la función de cierre proporcionada
        window.location.reload(); // Recargar la página
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative h-5/6">
            <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={handleClose} // Usamos la nueva función
                >
                    <X className="w-6 h-6 hover:text-red-600" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
