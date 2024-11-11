import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type Option = {
    id: number;
    label: string;
};

type SelectProps = {
    options: Option[];
    onSelect: (option: Option | null) => void; // Permitir la selección de null
    selected: Option | null; // Agrega esta línea
};

const SearchableSelect: React.FC<SelectProps> = ({ options, onSelect, selected }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Al cargar el componente o cambiar la opción seleccionada, actualiza el searchTerm
    useEffect(() => {
        if (selected) {
            setSearchTerm(selected.label); // Muestra la etiqueta de la opción seleccionada
        } else {
            setSearchTerm(''); // Limpia el término de búsqueda si no hay opción seleccionada
        }
    }, [selected]);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option: Option) => {
        onSelect(option); // Enviando el objeto completo, que incluye el ID
        setIsOpen(false);
    };

    const handleClearSelection = () => {
        setSearchTerm(''); // Limpiar el término de búsqueda
        onSelect(null); // Llamar a onSelect con un valor vacío
    };

    return (
        <div className="relative w-full mb-4">
            {/* Input para búsqueda y selección */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-full cursor-pointer"
            >
                <input
                    type="text"
                    placeholder="Selecciona una opción"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none w-full bg-gray-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    readOnly={!isOpen} // Solo permite escribir si el menú está abierto
                />
                {/* Botón para limpiar la selección */}
                {selected && (
                    <button
                        type="button"
                        onClick={handleClearSelection}
                        className="ml-2 text-gray-500 hover:text-red-500 mr-3"
                        title="Eliminar selección"
                    >
                        <X />
                    </button>
                )}
                {/* Flecha para abrir o cerrar */}
                <span className="text-gray-500 pointer-events-none">
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>

            {/* Opciones desplegables */}
            {isOpen && (
                <ul className="absolute z-10 w-full py-1 mt-1 bg-gray-200 border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-2 hover:bg-white cursor-pointer bg-gray-200"
                        >
                            {option.label}
                        </li>
                    ))}
                    {filteredOptions.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No se encontraron resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
