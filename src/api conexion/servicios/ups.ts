import { useAxios } from "../axiosInstance";

// Definimos la interfaz para los datos de la UPS
export interface UPS {
    id: number;
    nombre: string;
    modelo: string;
    direccion_ip: string;
    kva: number;
    fecha_instalacion: string;
    años_uso: number;
    proximo_cambio: string;
    modulos: number;
    baterias: number;
    observacion: string;
    agencia: string;
    estado_ups: string;
    tipo_tamano: string;
}

// Función para obtener la lista de UPS, con un filtro opcional por tipo de tamaño
export const ObtenerUPS = (tipoTamanoId?: number) => {
    const queryParams = tipoTamanoId ? `?tipo_tamano_id=${tipoTamanoId}` : '';
    const response = useAxios<UPS[]>({
        url: `/ups${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};
