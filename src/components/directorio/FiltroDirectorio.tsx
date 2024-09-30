import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";
import Modal from "../Modal";
import CrearDirectorio from "./crearDirectorio";

interface FiltroDirectorioProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedAgencia: string;
    setSelectedAgencia: (agencia: string) => void;
    agencias: { id: number; nombre: string }[];
}

const FiltroDirectorio: React.FC<FiltroDirectorioProps> = ({
    searchTerm,
    setSearchTerm,
    selectedAgencia,
    setSelectedAgencia,
    agencias,
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="flex mb-6 space-x-4 justify-between">
                <div className="flex-1 relative">
                    <div className="flex items-center border border-gray-300 rounded w-4/6">
                        <span className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-l text-white">
                            <Search />
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por extensión, agencia, empleado o departamento"
                            className="block w-full p-2 rounded-r focus:outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-red-500"
                            >
                                <X />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-none">
                    <button
                        onClick={openModal}
                        className="mt-1 rounded-full w-28 bg-green-700 p-1 flex gap-3 hover:bg-green-600 text-white text-center items-center"
                    >
                        <FaPlusCircle />
                        Agregar
                    </button>
                </div>
                <div className="flex-none w-1/5">
                    <select
                        value={selectedAgencia}
                        onChange={(e) => {
                            setSelectedAgencia(e.target.value);
                        }}
                        className="block w-full p-2 border border-gray-300 rounded-xl bg-gray-300"
                    >
                        <option value="">Todas las Agencias</option>
                        {agencias.map((agencia) => (
                            <option key={agencia.id} value={agencia.nombre}>
                                {agencia.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <CrearDirectorio />
                </Modal>
            )}
        </>
    );
};

export default FiltroDirectorio;
