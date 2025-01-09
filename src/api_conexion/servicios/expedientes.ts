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
    estante: number;
    columna: number;
    fila: number;
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

export const ObtenerAgenciaById = (id: number) => {
    const response = useAxios<ExpedienteId>({
      url: `/expediente/${id}`,
    },{
      useCache: false,
    });
    return response;
  };

  export const CrearExpediente = async (nuevoExpediente: Post_Expediente): Promise<Post_Expediente> => {
    const response = await axiosInstance.post('/agregar_expedientes', nuevoExpediente);
    return response.data;
};