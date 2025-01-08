import React from "react";
import { Search, X } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FiltroExpedienteProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const FiltroExpediente: React.FC<FiltroExpedienteProps> = ({
    searchTerm,
    setSearchTerm,
}) => {



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
                            onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por Nº Cliente, Nombre Cliente"
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
                    <Link
                        to={`/prestamos/agregar_expediente`}
                        className="flex items-center gap-3 p-1 mt-1 text-center text-white bg-green-700 rounded-full w-28 hover:bg-green-600"
                    >
                        <FaPlusCircle />
                        Agregar
                    </Link>
                </div>
            </div>
        </>
    );
};

export default FiltroExpediente;
