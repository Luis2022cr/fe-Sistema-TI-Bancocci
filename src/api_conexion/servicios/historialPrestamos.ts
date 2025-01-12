import axiosInstance, { useAxios } from "../axiosInstance";

export interface Post_Historial_Expediente {
    expediente_id: number,
    tipo_evento: string,
    comentarios: string,
    responsable: string,
}

export const CrearHistorialExpediente = async (nuevohistorial: Post_Historial_Expediente): Promise<Post_Historial_Expediente> => {
    const response = await axiosInstance.post('/historial_prestamos', nuevohistorial);
    return response.data;
};

export interface Historial {
    id: number;
    fecha: string; // ISO 8601 format (e.g., "2025-01-08T11:44:24.000Z")
    tipo_evento: string; // Can be further restricted to 'entrada' | 'salida'
    comentarios: string;
    usuario: string;
    responsable: string;
}

export interface ExpedienteHistorial {
    id: number;
    numero_cliente: string;
    nombre_cliente: string;
    estado: string;
    agencia: string;
    estante: number;
    columna: number;
    fila: number;
    comentarios: string;
    fecha_entrada: string | null; // ISO 8601 format or null
    fecha_salida: string | null;  // ISO 8601 format or null
    usuario: string;
    responsable: string;
    historial: Historial[];
}

export const ObtenerExpedienteConHistorial = (id?: number) => {
    const response = useAxios<ExpedienteHistorial>({
        url: `/historial_prestamos/${id}`,
    }, {
        useCache: false,
    });
    return response;
};

export interface Cambiar_Estado {
    id_expediente: number,
    nuevo_estado: number,
    comentario: string,
    entregadoA: string,
}

export const actualizarEstadoExpediente = async (nuevoestado: Cambiar_Estado): Promise<Cambiar_Estado> => {
    const response = await axiosInstance.put('/cambio_estado_comentario', nuevoestado);
    return response.data;
};