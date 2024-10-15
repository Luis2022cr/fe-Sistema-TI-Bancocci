import { useAxios } from "../axiosInstance";

// Definimos la interfaz para los datos del inventario
export interface TipoInventario {
    id: number;
    nombre: string;
}

// Función para obtener la lista de inventarios, con un filtro opcional por tipo de inventario
export const ObtenerTipoInventario = (tipoInventarioId?: number) => {
    const queryParams = tipoInventarioId ? `?tipo_inventario_id=${tipoInventarioId}` : '';
    const response = useAxios<TipoInventario[]>({
        url: `/tipo_inventarios${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};
