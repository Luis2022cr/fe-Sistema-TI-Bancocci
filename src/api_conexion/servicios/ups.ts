import axiosInstance, { useAxios } from "../axiosInstance";

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

// Definimos la interfaz para los datos de la UPS
export interface UPSelect {
    id: number;
    nombre: string;
}

// Función para obtener la lista de UPS, con un filtro opcional por tipo de tamaño
export const ObtenerUps_Select = () => {
    const response = useAxios<UPSelect[]>({
        url: `/ups-select`,
    }, {
        useCache: false,
    });
    return response;
};

export interface HistorialCambioUPS {
    cambio: string;
    fecha_instalacion: string;
    proximo_cambio: string;
}

export interface UPSConHistorial {
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
    historial: HistorialCambioUPS[]; 
}

// Obtener datos ups con hisotrial por ID
export const ObtenerUPSConHistorial = (id?: number) => {
    const response = useAxios<UPSConHistorial>({
        url: `/ups/${id}`, 
    }, {
        useCache: false,
    });
    return response;
};

export interface Post_Historial_Ups {
    ups_id: number;
    cambio: string;
    fecha_instalacion: string;
    proximo_cambio: string;
}

export const CrearHistorialUps = async (nuevoHistorial: Post_Historial_Ups): Promise<[Post_Historial_Ups]> => {
    const response = await axiosInstance.post('/historial_cambio_ups', nuevoHistorial);
    return response.data;
};

// Definición de la interfaz para crear un nuevo UPS
export interface Post_Ups {
    agencias_id: number;      // ID de la agencia
    nombre: string;           // Nombre del UPS
    modelo: string;           // Modelo del UPS
    direccion_ip: string;     // Dirección IP del UPS
    kva: number;              // Capacidad en KVA
    fecha_instalacion: string; // Fecha de instalación (en formato ISO)
    años_uso: number;         // Años de uso
    proximo_cambio: string;   // Fecha del próximo cambio (en formato ISO)
    estado_ups_id: number;    // ID del estado del UPS
    modulos: number;          // Cantidad de módulos
    baterias: number;         // Cantidad de baterías
    tipo_tamano_id: number;   // ID del tipo/tamaño del UPS
    observacion: string;      // Observaciones
}

export const CrearUps = async (nuevoUps: Post_Ups): Promise<Post_Ups> => {
    const response = await axiosInstance.post('/ups', nuevoUps);
    return response.data;
};