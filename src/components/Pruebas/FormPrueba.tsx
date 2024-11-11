import React, { useState } from 'react';
import { Agencia, ObtenerAgencia } from '@/api_conexion/servicios/agencias';
import SearchableSelect from './SearchableSelect'; // Asegúrate de que la ruta sea correcta

const FormPrueba: React.FC = () => {
    const [{ data: agenciaData, loading: loadingAgencias }] = ObtenerAgencia();

    // Estado para almacenar el ID seleccionado
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Manejar el caso de carga
    if (loadingAgencias) {
        return <div>Cargando agencias...</div>;
    }

    // Convertir agenciaData al formato correcto
    const options = agenciaData?.map((agencia: Agencia) => ({
        id: agencia.id, // Asegúrate de que 'id' existe en el objeto agencia
        label: agencia.nombre, // Asegúrate de que 'nombre' o el campo correcto existe
    })) || []; // Default a un array vacío si agenciaData es undefined

    // Manejar la selección de opciones
    const handleSelect = (option: { id: number; label: string } | null) => {
        if (option) {
            setSelectedId(option.id); // Guardar el ID seleccionado
            console.log('ID seleccionado:', option.id); // Mostrar solo el ID en el log
        } else {
            setSelectedId(null); // Limpiar el ID si no hay opción seleccionada
        }
    };

    // Función para manejar el clic del botón
    const handleButtonClick = () => {
        if (selectedId !== null) {
            alert(`ID seleccionado: ${selectedId}`); // Mostrar el ID en un mensaje
        } else {
            alert('No has seleccionado ninguna opción.'); // Mensaje de advertencia si no hay selección
        }
    };

    return (
        <form className="p-4">
            <h1 className="text-2xl mb-4">Formulario de Selección</h1>
            <SearchableSelect
                options={options}
                onSelect={handleSelect}
                selected={options.find(agencia => agencia.id === selectedId) || null}
            />
            {/* Botón para mostrar el ID seleccionado */}
            <button
                type="button"
                onClick={handleButtonClick}
                className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Mostrar ID Seleccionado
            </button>
        </form>
    );
};

export default FormPrueba;
