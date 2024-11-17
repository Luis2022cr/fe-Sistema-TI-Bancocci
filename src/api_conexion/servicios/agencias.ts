import axiosInstance, { useAxios } from "../axiosInstance";

export interface Agencia {

    id: number;
    nombre: string;
    ubicacion: string;
    codigo: number;
    estado_agencias_id: number;
    
}

export interface Post_Agencia {

    nombre: string;
    ubicacion: string;
    codigo: number;
    
}

export const ObtenerAgencia = () => {
    const response = useAxios<Agencia[]>({
        url: `/agencias`,
    }, {
        useCache: false,
    });
    return response;
};

export const CrearAgencias = async (nuevaAgencia: Post_Agencia): Promise<Post_Agencia> => {
    const response = await axiosInstance.post('/crear_agencias', nuevaAgencia);
    return response.data;
};