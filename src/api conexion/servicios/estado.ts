import { useAxios } from "../axiosInstance";


// Definimos la interfaz para los datos del inventario
export interface Estado{
    id: number;
    nombre: string;
}

// Función para obtener la lista de inventarios, con un filtro opcional por tipo de inventario
export const ObtenerEstado = (estadoId?: number) => {
    const queryParams = estadoId ? `?estado_id=${estadoId}` : '';
    const response = useAxios<Estado[]>({
        url: `/estados_inventarios${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};
