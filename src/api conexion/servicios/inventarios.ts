import { useAxios } from "../axiosInstance";

// Definimos la interfaz para los datos del inventario
export interface Inventario {
    id: number;
    codigo: string;
    serie: string;
    modelo: string;
    comentarios: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    tipo_inventario: string;
    marca: string;
    agencia_origen: string;
    agencia_actual: string;
    estado: string;
    usuario: string;
}

// Función para obtener la lista de inventarios, con un filtro opcional por tipo de inventario
export const ObtenerInventarios = (tipoInventarioId?: number) => {
    const queryParams = tipoInventarioId ? `?tipo_inventario_id=${tipoInventarioId}` : '';
    const response = useAxios<Inventario[]>({
        url: `/inventarios${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};
