import { X } from "lucide-react";
import React, { ReactNode } from "react";

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    // Manejador de cierre sin recargar la página
    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative z-[1000]">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={handleClose}
                >
                    <X className="w-6 h-6 hover:text-red-600" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
