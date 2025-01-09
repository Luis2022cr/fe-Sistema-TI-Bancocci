import axiosInstance, { useAxios } from "../axiosInstance";


export interface Expediente {
    numero_cliente: string;
    nombre_cliente: string;
    estado_id: number;
    agencia_id: number;
    estante: number;
    columna: number;
    fila: number;
    comentarios: string;
    fecha_entrada: string;
    fecha_salida: string;
    usuario_id: number;
    responsable: string;
    estado: string;
    agencia: string;
    usuario: string;
}


export interface ExpedienteId {
    numero_cliente: string;
    nombre_cliente: string;
    agencia_id: number;
    estante: number;
    columna: number;
    fila: number;
    comentarios: string;
    usuario_id: number;
    responsable: string;
    agencia: string;
    usuario: string;
}

export interface Post_Expediente {
    numero_cliente: string;
    nombre_cliente: string;
    estado_id: number;
    agencia_id: number;
    estante: string;
    columna: string;
    fila: string;
    comentarios?: string | null;
    responsable: string
}

export const ObtenerExpediente = () => {
    const response = useAxios<Expediente[]>({
        url: `/expedientes`,
    }, {
        useCache: false,
    });
    return response;
};

// export const ObtenerExpedienteById = (id: number) => {
//     const response = useAxios<ExpedienteId>({
//       url: `/expediente/${id}`,
//     },{
//       useCache: false,
//     });
//     return response;
//   };

export const ObtenerExpedienteByNumeroCliente = async (id: number): Promise<ExpedienteId> => {
    const response = await axiosInstance.get(`/expediente/${id}`); // Corregido: Usar backticks
    return response.data;
};


export const CrearExpediente = async (nuevoExpediente: Post_Expediente): Promise<Post_Expediente> => {
    const response = await axiosInstance.post('/agregar_expedientes', nuevoExpediente);
    return response.data;
};